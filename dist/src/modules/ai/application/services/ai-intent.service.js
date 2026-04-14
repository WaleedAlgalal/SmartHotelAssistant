"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AIIntentService = void 0;
const common_1 = require("@nestjs/common");
const cancel_reservation_command_1 = require("../../../reservation/application/commands/cancel-reservation.command");
const cancel_reservation_handler_1 = require("../../../reservation/application/commands/cancel-reservation.handler");
const confirm_reservation_command_1 = require("../../../reservation/application/commands/confirm-reservation.command");
const confirm_reservation_handler_1 = require("../../../reservation/application/commands/confirm-reservation.handler");
const create_reservation_command_1 = require("../../../reservation/application/commands/create-reservation.command");
const create_reservation_handler_1 = require("../../../reservation/application/commands/create-reservation.handler");
const extend_reservation_command_1 = require("../../../reservation/application/commands/extend-reservation.command");
const extend_reservation_handler_1 = require("../../../reservation/application/commands/extend-reservation.handler");
const ai_command_entity_1 = require("../../domain/entities/ai-command.entity");
const llm_service_1 = require("../../infrastructure/llm/llm.service");
let AIIntentService = class AIIntentService {
    llmService;
    createReservationHandler;
    confirmReservationHandler;
    cancelReservationHandler;
    extendReservationHandler;
    constructor(llmService, createReservationHandler, confirmReservationHandler, cancelReservationHandler, extendReservationHandler) {
        this.llmService = llmService;
        this.createReservationHandler = createReservationHandler;
        this.confirmReservationHandler = confirmReservationHandler;
        this.cancelReservationHandler = cancelReservationHandler;
        this.extendReservationHandler = extendReservationHandler;
    }
    async executeFromText(text) {
        const aiCommand = await this.resolveAICommand(text);
        return this.executeAICommand(aiCommand);
    }
    async resolveAICommand(text) {
        const normalized = text.trim();
        if (!normalized) {
            throw new Error("Input text is required.");
        }
        try {
            const llmOutput = await this.llmService.inferIntent(normalized);
            return this.mapLLMOutputToAICommand(llmOutput, normalized);
        }
        catch {
            return this.detectIntentWithRules(normalized);
        }
    }
    async executeAICommand(aiCommand) {
        if (aiCommand.intent === "CreateReservationCommand") {
            const payload = aiCommand.payload;
            const result = await this.createReservationHandler.execute(new create_reservation_command_1.CreateReservationCommand(payload.reservationId, payload.guestId, payload.roomId, payload.checkIn, payload.checkOut));
            return {
                intent: aiCommand.intent,
                confidence: aiCommand.confidence,
                result: this.mapReservationResult(result),
            };
        }
        if (aiCommand.intent === "ConfirmReservationCommand") {
            const payload = aiCommand.payload;
            const result = await this.confirmReservationHandler.execute(new confirm_reservation_command_1.ConfirmReservationCommand(payload.reservationId));
            return {
                intent: aiCommand.intent,
                confidence: aiCommand.confidence,
                result: this.mapReservationResult(result),
            };
        }
        if (aiCommand.intent === "CancelReservationCommand") {
            const payload = aiCommand.payload;
            const result = await this.cancelReservationHandler.execute(new cancel_reservation_command_1.CancelReservationCommand(payload.reservationId));
            return {
                intent: aiCommand.intent,
                confidence: aiCommand.confidence,
                result: this.mapReservationResult(result),
            };
        }
        if (aiCommand.intent === "ExtendReservationCommand") {
            const payload = aiCommand.payload;
            const result = await this.extendReservationHandler.execute(new extend_reservation_command_1.ExtendReservationCommand(payload.reservationId, payload.newCheckOut));
            return {
                intent: aiCommand.intent,
                confidence: aiCommand.confidence,
                result: this.mapReservationResult(result),
            };
        }
        throw new Error("Unsupported intent.");
    }
    mapLLMOutputToAICommand(output, rawInput) {
        if (output.intent === "CreateReservationCommand") {
            const checkIn = output.entities.checkIn ?? this.defaultCheckIn();
            const checkOut = output.entities.checkOut ?? this.defaultCheckOut(checkIn);
            return new ai_command_entity_1.AICommand(output.intent, output.confidence, {
                reservationId: output.entities.reservationId ?? `res-${Date.now()}`,
                guestId: output.entities.guestId ?? "guest-default",
                roomId: output.entities.roomId ?? "room-default",
                checkIn,
                checkOut,
            }, rawInput);
        }
        if (output.intent === "ConfirmReservationCommand" ||
            output.intent === "CancelReservationCommand") {
            const reservationId = output.entities.reservationId;
            if (!reservationId) {
                throw new Error("LLM did not provide reservationId.");
            }
            return new ai_command_entity_1.AICommand(output.intent, output.confidence, { reservationId }, rawInput);
        }
        if (output.intent === "ExtendReservationCommand") {
            const reservationId = output.entities.reservationId;
            const newCheckOut = output.entities.checkOut;
            if (!reservationId || !newCheckOut) {
                throw new Error("LLM did not provide required extend entities.");
            }
            return new ai_command_entity_1.AICommand(output.intent, output.confidence, { reservationId, newCheckOut }, rawInput);
        }
        throw new Error("Unsupported LLM intent.");
    }
    detectIntentWithRules(rawInput) {
        const text = rawInput.toLowerCase();
        if (text.includes("book")) {
            const checkIn = this.defaultCheckIn();
            return new ai_command_entity_1.AICommand("CreateReservationCommand", 0.6, {
                reservationId: `res-${Date.now()}`,
                guestId: this.extractValue(rawInput, "guest") ?? "guest-default",
                roomId: this.extractValue(rawInput, "room") ?? "room-default",
                checkIn,
                checkOut: this.defaultCheckOut(checkIn),
            }, rawInput);
        }
        if (text.includes("confirm")) {
            return new ai_command_entity_1.AICommand("ConfirmReservationCommand", 0.6, { reservationId: this.extractReservationId(rawInput) }, rawInput);
        }
        if (text.includes("cancel")) {
            return new ai_command_entity_1.AICommand("CancelReservationCommand", 0.6, { reservationId: this.extractReservationId(rawInput) }, rawInput);
        }
        if (text.includes("extend")) {
            return new ai_command_entity_1.AICommand("ExtendReservationCommand", 0.6, {
                reservationId: this.extractReservationId(rawInput),
                newCheckOut: this.extractDate(rawInput),
            }, rawInput);
        }
        throw new Error("Unable to infer supported command intent.");
    }
    extractReservationId(rawInput) {
        const match = rawInput.match(/(?:reservation(?:\s+id)?|id)\s*[:=]?\s*([a-zA-Z0-9_-]+)/i);
        if (!match?.[1]) {
            throw new Error("Reservation id is required for this action.");
        }
        return match[1];
    }
    extractValue(rawInput, key) {
        const match = rawInput.match(new RegExp(`${key}\\s*(?:id)?\\s*[:=]?\\s*([a-zA-Z0-9_-]+)`, "i"));
        return match?.[1] ?? null;
    }
    extractDate(rawInput) {
        const isoDate = rawInput.match(/(\d{4}-\d{2}-\d{2})/)?.[1];
        if (isoDate) {
            return new Date(isoDate).toISOString();
        }
        const nextDay = new Date();
        nextDay.setDate(nextDay.getDate() + 1);
        return nextDay.toISOString();
    }
    defaultCheckIn() {
        const date = new Date();
        date.setDate(date.getDate() + 1);
        return date.toISOString();
    }
    defaultCheckOut(checkInIso) {
        const checkIn = new Date(checkInIso);
        if (Number.isNaN(checkIn.getTime())) {
            const fallback = new Date();
            fallback.setDate(fallback.getDate() + 2);
            return fallback.toISOString();
        }
        checkIn.setDate(checkIn.getDate() + 1);
        return checkIn.toISOString();
    }
    mapReservationResult(result) {
        return {
            reservation: {
                id: result.reservation.id,
                guestId: result.reservation.guestId,
                roomId: result.reservation.roomId,
                status: result.reservation.status,
                checkIn: result.reservation.stayPeriod.checkIn.toISOString(),
                checkOut: result.reservation.stayPeriod.checkOut.toISOString(),
                createdAt: result.reservation.createdAt.toISOString(),
                updatedAt: result.reservation.updatedAt.toISOString(),
            },
            domainEvents: result.domainEvents,
        };
    }
};
exports.AIIntentService = AIIntentService;
exports.AIIntentService = AIIntentService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [llm_service_1.LLMService,
        create_reservation_handler_1.CreateReservationHandler,
        confirm_reservation_handler_1.ConfirmReservationHandler,
        cancel_reservation_handler_1.CancelReservationHandler,
        extend_reservation_handler_1.ExtendReservationHandler])
], AIIntentService);
//# sourceMappingURL=ai-intent.service.js.map
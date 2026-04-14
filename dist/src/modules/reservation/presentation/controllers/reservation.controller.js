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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReservationController = void 0;
const common_1 = require("@nestjs/common");
const cancel_reservation_command_1 = require("../../application/commands/cancel-reservation.command");
const cancel_reservation_handler_1 = require("../../application/commands/cancel-reservation.handler");
const confirm_reservation_command_1 = require("../../application/commands/confirm-reservation.command");
const confirm_reservation_handler_1 = require("../../application/commands/confirm-reservation.handler");
const create_reservation_command_1 = require("../../application/commands/create-reservation.command");
const create_reservation_handler_1 = require("../../application/commands/create-reservation.handler");
const extend_reservation_command_1 = require("../../application/commands/extend-reservation.command");
const extend_reservation_handler_1 = require("../../application/commands/extend-reservation.handler");
const reservation_tokens_1 = require("../../reservation.tokens");
const create_reservation_request_dto_1 = require("../dto/create-reservation.request.dto");
const extend_reservation_request_dto_1 = require("../dto/extend-reservation.request.dto");
const reservation_response_dto_1 = require("../dto/reservation.response.dto");
let ReservationController = class ReservationController {
    createReservationHandler;
    confirmReservationHandler;
    cancelReservationHandler;
    extendReservationHandler;
    reservationRepository;
    constructor(createReservationHandler, confirmReservationHandler, cancelReservationHandler, extendReservationHandler, reservationRepository) {
        this.createReservationHandler = createReservationHandler;
        this.confirmReservationHandler = confirmReservationHandler;
        this.cancelReservationHandler = cancelReservationHandler;
        this.extendReservationHandler = extendReservationHandler;
        this.reservationRepository = reservationRepository;
    }
    async create(body) {
        const command = new create_reservation_command_1.CreateReservationCommand(body.reservationId, body.guestId, body.roomId, body.checkIn, body.checkOut);
        const result = await this.createReservationHandler.execute(command);
        return reservation_response_dto_1.ReservationResponseDto.from(result.reservation, result.domainEvents);
    }
    async confirm(id) {
        const command = new confirm_reservation_command_1.ConfirmReservationCommand(id);
        const result = await this.confirmReservationHandler.execute(command);
        return reservation_response_dto_1.ReservationResponseDto.from(result.reservation, result.domainEvents);
    }
    async cancel(id) {
        const command = new cancel_reservation_command_1.CancelReservationCommand(id);
        const result = await this.cancelReservationHandler.execute(command);
        return reservation_response_dto_1.ReservationResponseDto.from(result.reservation, result.domainEvents);
    }
    async extend(id, body) {
        const command = new extend_reservation_command_1.ExtendReservationCommand(id, body.newCheckOut);
        const result = await this.extendReservationHandler.execute(command);
        return reservation_response_dto_1.ReservationResponseDto.from(result.reservation, result.domainEvents);
    }
    async getById(id) {
        const reservation = await this.reservationRepository.findById(id);
        if (!reservation) {
            throw new common_1.NotFoundException("Reservation not found.");
        }
        return reservation_response_dto_1.ReservationResponseDto.from(reservation, []);
    }
};
exports.ReservationController = ReservationController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_reservation_request_dto_1.CreateReservationRequestDto]),
    __metadata("design:returntype", Promise)
], ReservationController.prototype, "create", null);
__decorate([
    (0, common_1.Post)(":id/confirm"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ReservationController.prototype, "confirm", null);
__decorate([
    (0, common_1.Post)(":id/cancel"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ReservationController.prototype, "cancel", null);
__decorate([
    (0, common_1.Post)(":id/extend"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, extend_reservation_request_dto_1.ExtendReservationRequestDto]),
    __metadata("design:returntype", Promise)
], ReservationController.prototype, "extend", null);
__decorate([
    (0, common_1.Get)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ReservationController.prototype, "getById", null);
exports.ReservationController = ReservationController = __decorate([
    (0, common_1.Controller)("reservations"),
    __param(4, (0, common_1.Inject)(reservation_tokens_1.RESERVATION_REPOSITORY)),
    __metadata("design:paramtypes", [create_reservation_handler_1.CreateReservationHandler,
        confirm_reservation_handler_1.ConfirmReservationHandler,
        cancel_reservation_handler_1.CancelReservationHandler,
        extend_reservation_handler_1.ExtendReservationHandler, Object])
], ReservationController);
//# sourceMappingURL=reservation.controller.js.map
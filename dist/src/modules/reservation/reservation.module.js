"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReservationModule = void 0;
const common_1 = require("@nestjs/common");
const cancel_reservation_handler_1 = require("./application/commands/cancel-reservation.handler");
const confirm_reservation_handler_1 = require("./application/commands/confirm-reservation.handler");
const create_reservation_handler_1 = require("./application/commands/create-reservation.handler");
const extend_reservation_handler_1 = require("./application/commands/extend-reservation.handler");
const prisma_reservation_repository_1 = require("./infrastructure/prisma/prisma-reservation.repository");
const reservation_controller_1 = require("./presentation/controllers/reservation.controller");
const reservation_tokens_1 = require("./reservation.tokens");
const prisma_client_provider_1 = require("../../shared/infrastructure/prisma/prisma-client.provider");
let ReservationModule = class ReservationModule {
};
exports.ReservationModule = ReservationModule;
exports.ReservationModule = ReservationModule = __decorate([
    (0, common_1.Module)({
        controllers: [reservation_controller_1.ReservationController],
        providers: [
            prisma_client_provider_1.prismaClientProvider,
            {
                provide: reservation_tokens_1.RESERVATION_REPOSITORY,
                useFactory: (prismaClient) => new prisma_reservation_repository_1.PrismaReservationRepository(prismaClient),
                inject: [prisma_client_provider_1.PRISMA_CLIENT],
            },
            {
                provide: create_reservation_handler_1.CreateReservationHandler,
                useFactory: (repository) => new create_reservation_handler_1.CreateReservationHandler(repository),
                inject: [reservation_tokens_1.RESERVATION_REPOSITORY],
            },
            {
                provide: confirm_reservation_handler_1.ConfirmReservationHandler,
                useFactory: (repository) => new confirm_reservation_handler_1.ConfirmReservationHandler(repository),
                inject: [reservation_tokens_1.RESERVATION_REPOSITORY],
            },
            {
                provide: cancel_reservation_handler_1.CancelReservationHandler,
                useFactory: (repository) => new cancel_reservation_handler_1.CancelReservationHandler(repository),
                inject: [reservation_tokens_1.RESERVATION_REPOSITORY],
            },
            {
                provide: extend_reservation_handler_1.ExtendReservationHandler,
                useFactory: (repository) => new extend_reservation_handler_1.ExtendReservationHandler(repository),
                inject: [reservation_tokens_1.RESERVATION_REPOSITORY],
            },
        ],
    })
], ReservationModule);
//# sourceMappingURL=reservation.module.js.map
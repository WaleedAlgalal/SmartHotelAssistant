"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateReservationHandler = void 0;
const reservation_aggregate_1 = require("../../domain/aggregates/reservation/reservation.aggregate");
class CreateReservationHandler {
    reservationRepository;
    constructor(reservationRepository) {
        this.reservationRepository = reservationRepository;
    }
    async execute(command) {
        const reservation = reservation_aggregate_1.Reservation.create({
            id: command.reservationId,
            guestId: command.guestId,
            roomId: command.roomId,
            checkIn: command.checkIn,
            checkOut: command.checkOut,
        });
        await this.reservationRepository.save(reservation);
        const domainEvents = reservation.pullDomainEvents();
        return {
            reservation,
            domainEvents,
        };
    }
}
exports.CreateReservationHandler = CreateReservationHandler;
//# sourceMappingURL=create-reservation.handler.js.map
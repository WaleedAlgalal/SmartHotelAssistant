"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExtendReservationHandler = void 0;
class ExtendReservationHandler {
    reservationRepository;
    constructor(reservationRepository) {
        this.reservationRepository = reservationRepository;
    }
    async execute(command) {
        const reservation = await this.reservationRepository.findById(command.reservationId);
        if (!reservation) {
            throw new Error("Reservation not found.");
        }
        reservation.extendStay(command.newCheckOut);
        await this.reservationRepository.save(reservation);
        const domainEvents = reservation.pullDomainEvents();
        return {
            reservation,
            domainEvents,
        };
    }
}
exports.ExtendReservationHandler = ExtendReservationHandler;
//# sourceMappingURL=extend-reservation.handler.js.map
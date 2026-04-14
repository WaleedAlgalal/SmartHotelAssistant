"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CancelReservationHandler = void 0;
class CancelReservationHandler {
    reservationRepository;
    constructor(reservationRepository) {
        this.reservationRepository = reservationRepository;
    }
    async execute(command) {
        const reservation = await this.reservationRepository.findById(command.reservationId);
        if (!reservation) {
            throw new Error("Reservation not found.");
        }
        reservation.cancel();
        await this.reservationRepository.save(reservation);
        const domainEvents = reservation.pullDomainEvents();
        return {
            reservation,
            domainEvents,
        };
    }
}
exports.CancelReservationHandler = CancelReservationHandler;
//# sourceMappingURL=cancel-reservation.handler.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfirmReservationHandler = void 0;
class ConfirmReservationHandler {
    reservationRepository;
    constructor(reservationRepository) {
        this.reservationRepository = reservationRepository;
    }
    async execute(command) {
        const reservation = await this.reservationRepository.findById(command.reservationId);
        if (!reservation) {
            throw new Error("Reservation not found.");
        }
        reservation.confirm();
        await this.reservationRepository.save(reservation);
        const domainEvents = reservation.pullDomainEvents();
        return {
            reservation,
            domainEvents,
        };
    }
}
exports.ConfirmReservationHandler = ConfirmReservationHandler;
//# sourceMappingURL=confirm-reservation.handler.js.map
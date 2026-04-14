"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReservationConfirmedEvent = void 0;
class ReservationConfirmedEvent {
    reservationId;
    eventName = "ReservationConfirmedEvent";
    occurredAt;
    constructor(reservationId) {
        this.reservationId = reservationId;
        this.occurredAt = new Date();
    }
}
exports.ReservationConfirmedEvent = ReservationConfirmedEvent;
//# sourceMappingURL=reservation-confirmed.event.js.map
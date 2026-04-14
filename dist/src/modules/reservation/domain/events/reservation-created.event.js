"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReservationCreatedEvent = void 0;
class ReservationCreatedEvent {
    reservationId;
    guestId;
    roomId;
    eventName = "ReservationCreatedEvent";
    occurredAt;
    constructor(reservationId, guestId, roomId) {
        this.reservationId = reservationId;
        this.guestId = guestId;
        this.roomId = roomId;
        this.occurredAt = new Date();
    }
}
exports.ReservationCreatedEvent = ReservationCreatedEvent;
//# sourceMappingURL=reservation-created.event.js.map
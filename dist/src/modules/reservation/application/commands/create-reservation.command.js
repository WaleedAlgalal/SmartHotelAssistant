"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateReservationCommand = void 0;
class CreateReservationCommand {
    reservationId;
    guestId;
    roomId;
    checkIn;
    checkOut;
    constructor(reservationId, guestId, roomId, checkIn, checkOut) {
        this.reservationId = reservationId;
        this.guestId = guestId;
        this.roomId = roomId;
        this.checkIn = checkIn;
        this.checkOut = checkOut;
    }
}
exports.CreateReservationCommand = CreateReservationCommand;
//# sourceMappingURL=create-reservation.command.js.map
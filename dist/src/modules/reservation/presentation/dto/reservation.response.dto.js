"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReservationResponseDto = void 0;
class ReservationResponseDto {
    id;
    guestId;
    roomId;
    status;
    checkIn;
    checkOut;
    createdAt;
    updatedAt;
    domainEvents;
    static from(reservation, domainEvents = []) {
        const dto = new ReservationResponseDto();
        dto.id = reservation.id;
        dto.guestId = reservation.guestId;
        dto.roomId = reservation.roomId;
        dto.status = reservation.status;
        dto.checkIn = reservation.stayPeriod.checkIn.toISOString();
        dto.checkOut = reservation.stayPeriod.checkOut.toISOString();
        dto.createdAt = reservation.createdAt.toISOString();
        dto.updatedAt = reservation.updatedAt.toISOString();
        dto.domainEvents = domainEvents.map((event) => {
            const eventRecord = event;
            return {
                name: eventRecord.eventName ?? "UnknownDomainEvent",
                occurredAt: eventRecord.occurredAt?.toISOString(),
            };
        });
        return dto;
    }
}
exports.ReservationResponseDto = ReservationResponseDto;
//# sourceMappingURL=reservation.response.dto.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReservationPrismaMapper = void 0;
const reservation_aggregate_1 = require("../../domain/aggregates/reservation/reservation.aggregate");
class ReservationPrismaMapper {
    static toDomain(record) {
        return reservation_aggregate_1.Reservation.rehydrate({
            id: record.id,
            guestId: record.guestId,
            roomId: record.roomId,
            checkIn: record.checkIn,
            checkOut: record.checkOut,
            status: record.status,
            createdAt: record.createdAt,
            updatedAt: record.updatedAt,
        });
    }
    static toPersistence(reservation) {
        return {
            id: reservation.id,
            guestId: reservation.guestId,
            roomId: reservation.roomId,
            checkIn: reservation.stayPeriod.checkIn,
            checkOut: reservation.stayPeriod.checkOut,
            status: reservation.status,
            createdAt: reservation.createdAt,
            updatedAt: reservation.updatedAt,
        };
    }
}
exports.ReservationPrismaMapper = ReservationPrismaMapper;
//# sourceMappingURL=reservation-prisma.mapper.js.map
import { Reservation } from "../../domain/aggregates/reservation/reservation.aggregate";

type PersistenceStatus = "PENDING" | "CONFIRMED" | "CANCELLED";

export type PrismaReservationRecord = {
  id: string;
  guestId: string;
  roomId: string;
  checkIn: Date;
  checkOut: Date;
  status: PersistenceStatus;
  createdAt: Date;
  updatedAt: Date;
};

export class ReservationPrismaMapper {
  static toDomain(record: PrismaReservationRecord): Reservation {
    return Reservation.rehydrate({
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

  static toPersistence(reservation: Reservation): PrismaReservationRecord {
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

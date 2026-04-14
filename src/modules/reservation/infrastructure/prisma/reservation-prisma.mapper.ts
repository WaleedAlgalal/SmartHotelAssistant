import { Reservation } from "../../../domain/aggregates/reservation/reservation.aggregate";

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

type MutableReservationState = {
  _status: PersistenceStatus;
  _createdAt: Date;
  _updatedAt: Date;
};

export class ReservationPrismaMapper {
  static toDomain(record: PrismaReservationRecord): Reservation {
    const reservation = Reservation.create({
      id: record.id,
      guestId: record.guestId,
      roomId: record.roomId,
      checkIn: record.checkIn,
      checkOut: record.checkOut,
    });

    // Rehydrate aggregate state from persistence without adding business logic here.
    const mutable = reservation as unknown as MutableReservationState;
    mutable._status = record.status;
    mutable._createdAt = new Date(record.createdAt.getTime());
    mutable._updatedAt = new Date(record.updatedAt.getTime());

    // Clear events raised during create() used for rehydration.
    reservation.pullDomainEvents();
    return reservation;
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

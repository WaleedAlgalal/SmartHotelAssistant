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
export declare class ReservationPrismaMapper {
    static toDomain(record: PrismaReservationRecord): Reservation;
    static toPersistence(reservation: Reservation): PrismaReservationRecord;
}
export {};

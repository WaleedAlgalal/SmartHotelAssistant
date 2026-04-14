import { PrismaClient } from "@prisma/client";
import { IReservationRepository } from "../../application/ports/i-reservation-repository.port";
import { Reservation } from "../../domain/aggregates/reservation/reservation.aggregate";
export declare class PrismaReservationRepository implements IReservationRepository {
    private readonly prisma;
    constructor(prisma: PrismaClient);
    findById(id: string): Promise<Reservation | null>;
    save(reservation: Reservation): Promise<void>;
    private get reservationDelegate();
}

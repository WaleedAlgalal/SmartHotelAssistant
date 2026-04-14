import { ExtendReservationCommand } from "./extend-reservation.command";
import { IReservationRepository } from "../ports/i-reservation-repository.port";
import { Reservation } from "../../domain/aggregates/reservation/reservation.aggregate";
export declare class ExtendReservationHandler {
    private readonly reservationRepository;
    constructor(reservationRepository: IReservationRepository);
    execute(command: ExtendReservationCommand): Promise<{
        reservation: Reservation;
        domainEvents: unknown[];
    }>;
}

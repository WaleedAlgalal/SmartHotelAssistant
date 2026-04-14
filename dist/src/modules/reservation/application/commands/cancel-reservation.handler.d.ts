import { CancelReservationCommand } from "./cancel-reservation.command";
import { IReservationRepository } from "../ports/i-reservation-repository.port";
import { Reservation } from "../../domain/aggregates/reservation/reservation.aggregate";
export declare class CancelReservationHandler {
    private readonly reservationRepository;
    constructor(reservationRepository: IReservationRepository);
    execute(command: CancelReservationCommand): Promise<{
        reservation: Reservation;
        domainEvents: unknown[];
    }>;
}

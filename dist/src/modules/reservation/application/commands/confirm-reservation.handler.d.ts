import { ConfirmReservationCommand } from "./confirm-reservation.command";
import { IReservationRepository } from "../ports/i-reservation-repository.port";
import { Reservation } from "../../domain/aggregates/reservation/reservation.aggregate";
export declare class ConfirmReservationHandler {
    private readonly reservationRepository;
    constructor(reservationRepository: IReservationRepository);
    execute(command: ConfirmReservationCommand): Promise<{
        reservation: Reservation;
        domainEvents: unknown[];
    }>;
}

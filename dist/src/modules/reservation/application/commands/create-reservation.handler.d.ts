import { Reservation } from "../../domain/aggregates/reservation/reservation.aggregate";
import { CreateReservationCommand } from "./create-reservation.command";
import { IReservationRepository } from "../ports/i-reservation-repository.port";
export declare class CreateReservationHandler {
    private readonly reservationRepository;
    constructor(reservationRepository: IReservationRepository);
    execute(command: CreateReservationCommand): Promise<{
        reservation: Reservation;
        domainEvents: unknown[];
    }>;
}

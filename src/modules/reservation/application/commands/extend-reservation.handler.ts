import { ExtendReservationCommand } from "./extend-reservation.command";
import { IReservationRepository } from "../ports/i-reservation-repository.port";
import { Reservation } from "../../domain/aggregates/reservation/reservation.aggregate";

export class ExtendReservationHandler {
  constructor(private readonly reservationRepository: IReservationRepository) {}

  async execute(command: ExtendReservationCommand): Promise<{
    reservation: Reservation;
    domainEvents: unknown[];
  }> {
    const reservation = await this.reservationRepository.findById(
      command.reservationId,
    );

    if (!reservation) {
      throw new Error("Reservation not found.");
    }

    reservation.extendStay(command.newCheckOut);
    await this.reservationRepository.save(reservation);
    const domainEvents = reservation.pullDomainEvents();

    return {
      reservation,
      domainEvents,
    };
  }
}

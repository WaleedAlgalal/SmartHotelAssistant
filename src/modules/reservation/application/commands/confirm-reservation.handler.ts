import { ConfirmReservationCommand } from "./confirm-reservation.command";
import { IReservationRepository } from "../ports/i-reservation-repository.port";
import { Reservation } from "../../domain/aggregates/reservation/reservation.aggregate";

export class ConfirmReservationHandler {
  constructor(private readonly reservationRepository: IReservationRepository) {}

  async execute(command: ConfirmReservationCommand): Promise<{
    reservation: Reservation;
    domainEvents: unknown[];
  }> {
    const reservation = await this.reservationRepository.findById(
      command.reservationId,
    );

    if (!reservation) {
      throw new Error("Reservation not found.");
    }

    reservation.confirm();
    await this.reservationRepository.save(reservation);
    const domainEvents = reservation.pullDomainEvents();

    return {
      reservation,
      domainEvents,
    };
  }
}

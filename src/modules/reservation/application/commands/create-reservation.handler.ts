import { Reservation } from "../../domain/aggregates/reservation/reservation.aggregate";
import { CreateReservationCommand } from "./create-reservation.command";
import { IReservationRepository } from "../ports/i-reservation-repository.port";

export class CreateReservationHandler {
  constructor(private readonly reservationRepository: IReservationRepository) {}

  async execute(command: CreateReservationCommand): Promise<{
    reservation: Reservation;
    domainEvents: unknown[];
  }> {
    const reservation = Reservation.create({
      id: command.reservationId,
      guestId: command.guestId,
      roomId: command.roomId,
      checkIn: command.checkIn,
      checkOut: command.checkOut,
    });

    await this.reservationRepository.save(reservation);
    const domainEvents = reservation.pullDomainEvents();

    return {
      reservation,
      domainEvents,
    };
  }
}

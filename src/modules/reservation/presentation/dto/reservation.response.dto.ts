import { Reservation } from "../../domain/aggregates/reservation/reservation.aggregate";

type ReservationEventDto = {
  name: string;
  occurredAt?: string;
};

export class ReservationResponseDto {
  id!: string;
  guestId!: string;
  roomId!: string;
  status!: string;
  checkIn!: string;
  checkOut!: string;
  createdAt!: string;
  updatedAt!: string;
  domainEvents!: ReservationEventDto[];

  static from(reservation: Reservation, domainEvents: unknown[] = []): ReservationResponseDto {
    const dto = new ReservationResponseDto();
    dto.id = reservation.id;
    dto.guestId = reservation.guestId;
    dto.roomId = reservation.roomId;
    dto.status = reservation.status;
    dto.checkIn = reservation.stayPeriod.checkIn.toISOString();
    dto.checkOut = reservation.stayPeriod.checkOut.toISOString();
    dto.createdAt = reservation.createdAt.toISOString();
    dto.updatedAt = reservation.updatedAt.toISOString();
    dto.domainEvents = domainEvents.map((event) => {
      const eventRecord = event as { eventName?: string; occurredAt?: Date };
      return {
        name: eventRecord.eventName ?? "UnknownDomainEvent",
        occurredAt: eventRecord.occurredAt?.toISOString(),
      };
    });
    return dto;
  }
}

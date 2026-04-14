export class ReservationCreatedEvent {
  readonly eventName = "ReservationCreatedEvent";
  readonly occurredAt: Date;

  constructor(
    public readonly reservationId: string,
    public readonly guestId: string,
    public readonly roomId: string,
  ) {
    this.occurredAt = new Date();
  }
}

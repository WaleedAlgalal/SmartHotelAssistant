export class ReservationConfirmedEvent {
  readonly eventName = "ReservationConfirmedEvent";
  readonly occurredAt: Date;

  constructor(public readonly reservationId: string) {
    this.occurredAt = new Date();
  }
}

export class ExtendReservationCommand {
  constructor(
    public readonly reservationId: string,
    public readonly newCheckOut: Date | string,
  ) {}
}

export class CreateReservationCommand {
  constructor(
    public readonly reservationId: string,
    public readonly guestId: string,
    public readonly roomId: string,
    public readonly checkIn: Date | string,
    public readonly checkOut: Date | string,
  ) {}
}

export class StayPeriod {
  private readonly _checkIn: Date;
  private readonly _checkOut: Date;

  private constructor(checkIn: Date, checkOut: Date) {
    this._checkIn = checkIn;
    this._checkOut = checkOut;
  }

  static create(checkInInput: Date | string, checkOutInput: Date | string): StayPeriod {
    const checkIn = new Date(checkInInput);
    const checkOut = new Date(checkOutInput);

    if (Number.isNaN(checkIn.getTime()) || Number.isNaN(checkOut.getTime())) {
      throw new Error("StayPeriod dates must be valid.");
    }

    if (checkOut.getTime() <= checkIn.getTime()) {
      throw new Error("Check-out must be after check-in.");
    }

    return new StayPeriod(new Date(checkIn.getTime()), new Date(checkOut.getTime()));
  }

  get checkIn(): Date {
    return new Date(this._checkIn.getTime());
  }

  get checkOut(): Date {
    return new Date(this._checkOut.getTime());
  }

  extendTo(newCheckOutInput: Date | string): StayPeriod {
    return StayPeriod.create(this._checkIn, newCheckOutInput);
  }

  equals(other: StayPeriod): boolean {
    return (
      this._checkIn.getTime() === other._checkIn.getTime() &&
      this._checkOut.getTime() === other._checkOut.getTime()
    );
  }
}

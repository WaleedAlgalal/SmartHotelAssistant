import { ReservationConfirmedEvent } from "../../events/reservation-confirmed.event";
import { ReservationCreatedEvent } from "../../events/reservation-created.event";
import { StayPeriod } from "../../value-objects/stay-period.value-object";

type ReservationStatus = "PENDING" | "CONFIRMED" | "CANCELLED";
type ReservationDomainEvent = ReservationCreatedEvent | ReservationConfirmedEvent;

type CreateReservationProps = {
  id: string;
  guestId: string;
  roomId: string;
  checkIn: Date | string;
  checkOut: Date | string;
};

type RehydrateReservationProps = {
  id: string;
  guestId: string;
  roomId: string;
  checkIn: Date | string;
  checkOut: Date | string;
  status: ReservationStatus;
  createdAt: Date | string;
  updatedAt: Date | string;
};

export class Reservation {
  private readonly _id: string;
  private readonly _guestId: string;
  private readonly _roomId: string;
  private _stayPeriod: StayPeriod;
  private _status: ReservationStatus;
  private readonly _createdAt: Date;
  private _updatedAt: Date;
  private readonly _domainEvents: ReservationDomainEvent[] = [];

  private constructor(
    id: string,
    guestId: string,
    roomId: string,
    stayPeriod: StayPeriod,
    status: ReservationStatus,
    createdAt: Date,
    updatedAt: Date,
  ) {
    this._id = id;
    this._guestId = guestId;
    this._roomId = roomId;
    this._stayPeriod = stayPeriod;
    this._status = status;
    this._createdAt = createdAt;
    this._updatedAt = updatedAt;
  }

  static create(props: CreateReservationProps): Reservation {
    if (!props.id || !props.guestId || !props.roomId) {
      throw new Error("Reservation id, guestId, and roomId are required.");
    }

    const stayPeriod = StayPeriod.create(props.checkIn, props.checkOut);
    const reservation = new Reservation(
      props.id,
      props.guestId,
      props.roomId,
      stayPeriod,
      "PENDING",
      new Date(),
      new Date(),
    );

    reservation.recordEvent(
      new ReservationCreatedEvent(props.id, props.guestId, props.roomId),
    );

    return reservation;
  }

  static rehydrate(props: RehydrateReservationProps): Reservation {
    if (!props.id || !props.guestId || !props.roomId) {
      throw new Error("Reservation id, guestId, and roomId are required.");
    }

    const createdAt = new Date(props.createdAt);
    const updatedAt = new Date(props.updatedAt);

    if (Number.isNaN(createdAt.getTime()) || Number.isNaN(updatedAt.getTime())) {
      throw new Error("Reservation timestamps must be valid.");
    }

    const stayPeriod = StayPeriod.create(props.checkIn, props.checkOut);
    return new Reservation(
      props.id,
      props.guestId,
      props.roomId,
      stayPeriod,
      props.status,
      createdAt,
      updatedAt,
    );
  }

  confirm(): void {
    if (this._status === "CONFIRMED") {
      throw new Error("Reservation is already confirmed.");
    }

    if (this._status === "CANCELLED") {
      throw new Error("Cancelled reservations cannot be confirmed.");
    }

    this._status = "CONFIRMED";
    this.touch();
    this.recordEvent(new ReservationConfirmedEvent(this._id));
  }

  cancel(): void {
    if (this._status === "CONFIRMED") {
      throw new Error("Confirmed reservations cannot be cancelled.");
    }

    if (this._status === "CANCELLED") {
      throw new Error("Reservation is already cancelled.");
    }

    this._status = "CANCELLED";
    this.touch();
  }

  extendStay(newCheckOut: Date | string): void {
    if (this._status === "CANCELLED") {
      throw new Error("Cancelled reservations cannot be extended.");
    }

    this._stayPeriod = this._stayPeriod.extendTo(newCheckOut);
    this.touch();
  }

  pullDomainEvents(): ReservationDomainEvent[] {
    const events = [...this._domainEvents];
    this._domainEvents.length = 0;
    return events;
  }

  get id(): string {
    return this._id;
  }

  get guestId(): string {
    return this._guestId;
  }

  get roomId(): string {
    return this._roomId;
  }

  get stayPeriod(): StayPeriod {
    return this._stayPeriod;
  }

  get status(): ReservationStatus {
    return this._status;
  }

  get createdAt(): Date {
    return new Date(this._createdAt.getTime());
  }

  get updatedAt(): Date {
    return new Date(this._updatedAt.getTime());
  }

  private recordEvent(event: ReservationDomainEvent): void {
    this._domainEvents.push(event);
  }

  private touch(): void {
    this._updatedAt = new Date();
  }
}

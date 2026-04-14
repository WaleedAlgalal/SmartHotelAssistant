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
export declare class Reservation {
    private readonly _id;
    private readonly _guestId;
    private readonly _roomId;
    private _stayPeriod;
    private _status;
    private readonly _createdAt;
    private _updatedAt;
    private readonly _domainEvents;
    private constructor();
    static create(props: CreateReservationProps): Reservation;
    static rehydrate(props: RehydrateReservationProps): Reservation;
    confirm(): void;
    cancel(): void;
    extendStay(newCheckOut: Date | string): void;
    pullDomainEvents(): ReservationDomainEvent[];
    get id(): string;
    get guestId(): string;
    get roomId(): string;
    get stayPeriod(): StayPeriod;
    get status(): ReservationStatus;
    get createdAt(): Date;
    get updatedAt(): Date;
    private recordEvent;
    private touch;
}
export {};

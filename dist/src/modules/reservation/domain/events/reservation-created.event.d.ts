export declare class ReservationCreatedEvent {
    readonly reservationId: string;
    readonly guestId: string;
    readonly roomId: string;
    readonly eventName = "ReservationCreatedEvent";
    readonly occurredAt: Date;
    constructor(reservationId: string, guestId: string, roomId: string);
}

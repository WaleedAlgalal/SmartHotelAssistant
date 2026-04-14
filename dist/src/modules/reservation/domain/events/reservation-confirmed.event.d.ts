export declare class ReservationConfirmedEvent {
    readonly reservationId: string;
    readonly eventName = "ReservationConfirmedEvent";
    readonly occurredAt: Date;
    constructor(reservationId: string);
}

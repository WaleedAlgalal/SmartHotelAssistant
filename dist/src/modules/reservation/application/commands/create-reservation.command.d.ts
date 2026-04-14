export declare class CreateReservationCommand {
    readonly reservationId: string;
    readonly guestId: string;
    readonly roomId: string;
    readonly checkIn: Date | string;
    readonly checkOut: Date | string;
    constructor(reservationId: string, guestId: string, roomId: string, checkIn: Date | string, checkOut: Date | string);
}

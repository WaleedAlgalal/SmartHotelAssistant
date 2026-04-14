import { Reservation } from "../../domain/aggregates/reservation/reservation.aggregate";
type ReservationEventDto = {
    name: string;
    occurredAt?: string;
};
export declare class ReservationResponseDto {
    id: string;
    guestId: string;
    roomId: string;
    status: string;
    checkIn: string;
    checkOut: string;
    createdAt: string;
    updatedAt: string;
    domainEvents: ReservationEventDto[];
    static from(reservation: Reservation, domainEvents?: unknown[]): ReservationResponseDto;
}
export {};

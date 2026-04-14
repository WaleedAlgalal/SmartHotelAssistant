import { CancelReservationHandler } from "../../application/commands/cancel-reservation.handler";
import { ConfirmReservationHandler } from "../../application/commands/confirm-reservation.handler";
import { CreateReservationHandler } from "../../application/commands/create-reservation.handler";
import { ExtendReservationHandler } from "../../application/commands/extend-reservation.handler";
import type { IReservationRepository } from "../../application/ports/i-reservation-repository.port";
import { CreateReservationRequestDto } from "../dto/create-reservation.request.dto";
import { ExtendReservationRequestDto } from "../dto/extend-reservation.request.dto";
import { ReservationResponseDto } from "../dto/reservation.response.dto";
export declare class ReservationController {
    private readonly createReservationHandler;
    private readonly confirmReservationHandler;
    private readonly cancelReservationHandler;
    private readonly extendReservationHandler;
    private readonly reservationRepository;
    constructor(createReservationHandler: CreateReservationHandler, confirmReservationHandler: ConfirmReservationHandler, cancelReservationHandler: CancelReservationHandler, extendReservationHandler: ExtendReservationHandler, reservationRepository: IReservationRepository);
    create(body: CreateReservationRequestDto): Promise<ReservationResponseDto>;
    confirm(id: string): Promise<ReservationResponseDto>;
    cancel(id: string): Promise<ReservationResponseDto>;
    extend(id: string, body: ExtendReservationRequestDto): Promise<ReservationResponseDto>;
    getById(id: string): Promise<ReservationResponseDto>;
}

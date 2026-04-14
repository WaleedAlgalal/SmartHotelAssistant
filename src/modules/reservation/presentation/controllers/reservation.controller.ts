import {
  Body,
  Controller,
  Get,
  Inject,
  NotFoundException,
  Param,
  Post,
} from "@nestjs/common";
import { CancelReservationCommand } from "../../application/commands/cancel-reservation.command";
import { CancelReservationHandler } from "../../application/commands/cancel-reservation.handler";
import { ConfirmReservationCommand } from "../../application/commands/confirm-reservation.command";
import { ConfirmReservationHandler } from "../../application/commands/confirm-reservation.handler";
import { CreateReservationCommand } from "../../application/commands/create-reservation.command";
import { CreateReservationHandler } from "../../application/commands/create-reservation.handler";
import { ExtendReservationCommand } from "../../application/commands/extend-reservation.command";
import { ExtendReservationHandler } from "../../application/commands/extend-reservation.handler";
import type { IReservationRepository } from "../../application/ports/i-reservation-repository.port";
import { RESERVATION_REPOSITORY } from "../../reservation.tokens";
import { CreateReservationRequestDto } from "../dto/create-reservation.request.dto";
import { ExtendReservationRequestDto } from "../dto/extend-reservation.request.dto";
import { ReservationResponseDto } from "../dto/reservation.response.dto";

@Controller("reservations")
export class ReservationController {
  constructor(
    private readonly createReservationHandler: CreateReservationHandler,
    private readonly confirmReservationHandler: ConfirmReservationHandler,
    private readonly cancelReservationHandler: CancelReservationHandler,
    private readonly extendReservationHandler: ExtendReservationHandler,
    @Inject(RESERVATION_REPOSITORY)
    private readonly reservationRepository: IReservationRepository,
  ) {}

  @Post()
  async create(
    @Body() body: CreateReservationRequestDto,
  ): Promise<ReservationResponseDto> {
    const command = new CreateReservationCommand(
      body.reservationId,
      body.guestId,
      body.roomId,
      body.checkIn,
      body.checkOut,
    );

    const result = await this.createReservationHandler.execute(command);
    return ReservationResponseDto.from(result.reservation, result.domainEvents);
  }

  @Post(":id/confirm")
  async confirm(@Param("id") id: string): Promise<ReservationResponseDto> {
    const command = new ConfirmReservationCommand(id);
    const result = await this.confirmReservationHandler.execute(command);
    return ReservationResponseDto.from(result.reservation, result.domainEvents);
  }

  @Post(":id/cancel")
  async cancel(@Param("id") id: string): Promise<ReservationResponseDto> {
    const command = new CancelReservationCommand(id);
    const result = await this.cancelReservationHandler.execute(command);
    return ReservationResponseDto.from(result.reservation, result.domainEvents);
  }

  @Post(":id/extend")
  async extend(
    @Param("id") id: string,
    @Body() body: ExtendReservationRequestDto,
  ): Promise<ReservationResponseDto> {
    const command = new ExtendReservationCommand(id, body.newCheckOut);
    const result = await this.extendReservationHandler.execute(command);
    return ReservationResponseDto.from(result.reservation, result.domainEvents);
  }

  @Get(":id")
  async getById(@Param("id") id: string): Promise<ReservationResponseDto> {
    const reservation = await this.reservationRepository.findById(id);
    if (!reservation) {
      throw new NotFoundException("Reservation not found.");
    }

    return ReservationResponseDto.from(reservation, []);
  }
}

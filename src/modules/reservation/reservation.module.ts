import { Module } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";
import { CancelReservationHandler } from "./application/commands/cancel-reservation.handler";
import { ConfirmReservationHandler } from "./application/commands/confirm-reservation.handler";
import { CreateReservationHandler } from "./application/commands/create-reservation.handler";
import { ExtendReservationHandler } from "./application/commands/extend-reservation.handler";
import { IReservationRepository } from "./application/ports/i-reservation-repository.port";
import { PrismaReservationRepository } from "./infrastructure/prisma/prisma-reservation.repository";
import { ReservationController } from "./presentation/controllers/reservation.controller";
import { RESERVATION_REPOSITORY } from "./reservation.tokens";
import {
  PRISMA_CLIENT,
  prismaClientProvider,
} from "../../shared/infrastructure/prisma/prisma-client.provider";

@Module({
  controllers: [ReservationController],
  providers: [
    prismaClientProvider,
    {
      provide: RESERVATION_REPOSITORY,
      useFactory: (prismaClient: PrismaClient): IReservationRepository =>
        new PrismaReservationRepository(prismaClient),
      inject: [PRISMA_CLIENT],
    },
    {
      provide: CreateReservationHandler,
      useFactory: (repository: IReservationRepository) =>
        new CreateReservationHandler(repository),
      inject: [RESERVATION_REPOSITORY],
    },
    {
      provide: ConfirmReservationHandler,
      useFactory: (repository: IReservationRepository) =>
        new ConfirmReservationHandler(repository),
      inject: [RESERVATION_REPOSITORY],
    },
    {
      provide: CancelReservationHandler,
      useFactory: (repository: IReservationRepository) =>
        new CancelReservationHandler(repository),
      inject: [RESERVATION_REPOSITORY],
    },
    {
      provide: ExtendReservationHandler,
      useFactory: (repository: IReservationRepository) =>
        new ExtendReservationHandler(repository),
      inject: [RESERVATION_REPOSITORY],
    },
  ],
  exports: [
    CreateReservationHandler,
    ConfirmReservationHandler,
    CancelReservationHandler,
    ExtendReservationHandler,
  ],
})
export class ReservationModule {}

import { PrismaClient } from "@prisma/client";
import { IReservationRepository } from "../../application/ports/i-reservation-repository.port";
import { Reservation } from "../../domain/aggregates/reservation/reservation.aggregate";
import {
  PrismaReservationRecord,
  ReservationPrismaMapper,
} from "./reservation-prisma.mapper";

type ReservationDelegate = {
  findUnique(args: {
    where: { id: string };
  }): Promise<PrismaReservationRecord | null>;
  create(args: {
    data: PrismaReservationRecord;
  }): Promise<PrismaReservationRecord>;
  update(args: {
    where: { id: string };
    data: Omit<PrismaReservationRecord, "id" | "createdAt"> & {
      updatedAt: Date;
    };
  }): Promise<PrismaReservationRecord>;
};

type UpdateReservationData = {
  guestId: string;
  roomId: string;
  checkIn: Date;
  checkOut: Date;
  status: PrismaReservationRecord["status"];
  updatedAt: Date;
};

export class PrismaReservationRepository implements IReservationRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findById(id: string): Promise<Reservation | null> {
    const record = await this.reservationDelegate.findUnique({
      where: { id },
    });

    if (!record) {
      return null;
    }

    return ReservationPrismaMapper.toDomain(record);
  }

  async save(reservation: Reservation): Promise<void> {
    const record = ReservationPrismaMapper.toPersistence(reservation);
    const existingRecord = await this.reservationDelegate.findUnique({
      where: { id: record.id },
    });

    if (!existingRecord) {
      await this.reservationDelegate.create({
        data: record,
      });
      return;
    }

    const updateData: UpdateReservationData = {
      guestId: record.guestId,
      roomId: record.roomId,
      checkIn: record.checkIn,
      checkOut: record.checkOut,
      status: record.status,
      updatedAt: record.updatedAt,
    };

    await this.reservationDelegate.update({
      where: { id: record.id },
      data: updateData,
    });
  }

  private get reservationDelegate(): ReservationDelegate {
    // Infrastructure boundary: this is the only place aware of Prisma delegate access.
    return (this.prisma as unknown as { reservation: ReservationDelegate })
      .reservation;
  }
}

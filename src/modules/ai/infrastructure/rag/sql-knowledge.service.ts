import { Inject, Injectable } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";
import { PRISMA_CLIENT } from "../../../../shared/infrastructure/prisma/prisma-client.provider";
import {
  AIKnowledgeContext,
  GuestKnowledge,
  KnowledgeRepository,
  ReservationKnowledge,
  RoomKnowledge,
} from "./knowledge-repository.interface";

type CachedItem = {
  expiresAt: number;
  value: AIKnowledgeContext;
};

@Injectable()
export class SqlKnowledgeService implements KnowledgeRepository {
  private readonly cache = new Map<string, CachedItem>();
  private readonly ttlMs = 30_000;

  constructor(@Inject(PRISMA_CLIENT) private readonly prisma: PrismaClient) {}

  async retrieveRelevantContext(rawInput: string): Promise<AIKnowledgeContext> {
    const cacheKey = rawInput.trim().toLowerCase();
    const cached = this.cache.get(cacheKey);
    if (cached && cached.expiresAt > Date.now()) {
      return cached.value;
    }

    const roomHint = this.extractHint(rawInput, "room");
    const guestHint = this.extractHint(rawInput, "guest");
    const reservationHint = this.extractHint(rawInput, "reservation");
    const activeOnly = /(current|today|active|now)/i.test(rawInput);

    const [rooms, guests, reservations] = await Promise.all([
      this.fetchRooms(roomHint),
      this.fetchGuests(guestHint),
      this.fetchReservations(reservationHint, activeOnly),
    ]);

    const value: AIKnowledgeContext = { rooms, guests, reservations };
    this.cache.set(cacheKey, {
      expiresAt: Date.now() + this.ttlMs,
      value,
    });

    return value;
  }

  private async fetchRooms(roomHint: string | null): Promise<RoomKnowledge[]> {
    const rows = await this.prisma.room.findMany({
      where: roomHint
        ? {
            OR: [
              { id: { contains: roomHint } },
              { number: { contains: roomHint } },
              { type: { contains: roomHint } },
            ],
          }
        : undefined,
      orderBy: { number: "asc" },
      take: 10,
    });

    return rows.map((room) => ({
      id: room.id,
      number: room.number,
      type: room.type,
      status: room.status,
    }));
  }

  private async fetchGuests(guestHint: string | null): Promise<GuestKnowledge[]> {
    const rows = await this.prisma.guest.findMany({
      where: guestHint
        ? {
            OR: [
              { id: { contains: guestHint } },
              { name: { contains: guestHint } },
              { phone: { contains: guestHint } },
            ],
          }
        : undefined,
      orderBy: { name: "asc" },
      take: 10,
    });

    return rows.map((guest) => ({
      id: guest.id,
      name: guest.name,
      phone: guest.phone,
    }));
  }

  private async fetchReservations(
    reservationHint: string | null,
    activeOnly: boolean,
  ): Promise<ReservationKnowledge[]> {
    const rows = await this.prisma.reservation.findMany({
      where: {
        ...(reservationHint
          ? {
              OR: [
                { id: { contains: reservationHint } },
                { guestId: { contains: reservationHint } },
                { roomId: { contains: reservationHint } },
              ],
            }
          : {}),
        ...(activeOnly ? { checkOut: { gte: new Date() } } : {}),
      },
      orderBy: { createdAt: "desc" },
      take: 10,
    });

    return rows.map((reservation) => ({
      id: reservation.id,
      guestId: reservation.guestId,
      roomId: reservation.roomId,
      status: reservation.status,
      checkIn: reservation.checkIn.toISOString(),
      checkOut: reservation.checkOut.toISOString(),
    }));
  }

  private extractHint(
    rawInput: string,
    key: "room" | "guest" | "reservation",
  ): string | null {
    const match = rawInput.match(
      new RegExp(`${key}\\s*(?:id|name|number|phone)?\\s*[:=]?\\s*([a-zA-Z0-9_-]+)`, "i"),
    );
    return match?.[1] ?? null;
  }
}

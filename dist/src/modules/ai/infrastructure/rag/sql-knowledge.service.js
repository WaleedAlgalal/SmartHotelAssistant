"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SqlKnowledgeService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const prisma_client_provider_1 = require("../../../../shared/infrastructure/prisma/prisma-client.provider");
let SqlKnowledgeService = class SqlKnowledgeService {
    prisma;
    cache = new Map();
    ttlMs = 30_000;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async retrieveRelevantContext(rawInput) {
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
        const value = { rooms, guests, reservations };
        this.cache.set(cacheKey, {
            expiresAt: Date.now() + this.ttlMs,
            value,
        });
        return value;
    }
    async fetchRooms(roomHint) {
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
    async fetchGuests(guestHint) {
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
    async fetchReservations(reservationHint, activeOnly) {
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
    extractHint(rawInput, key) {
        const match = rawInput.match(new RegExp(`${key}\\s*(?:id|name|number|phone)?\\s*[:=]?\\s*([a-zA-Z0-9_-]+)`, "i"));
        return match?.[1] ?? null;
    }
};
exports.SqlKnowledgeService = SqlKnowledgeService;
exports.SqlKnowledgeService = SqlKnowledgeService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(prisma_client_provider_1.PRISMA_CLIENT)),
    __metadata("design:paramtypes", [client_1.PrismaClient])
], SqlKnowledgeService);
//# sourceMappingURL=sql-knowledge.service.js.map
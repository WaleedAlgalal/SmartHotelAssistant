"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaReservationRepository = void 0;
const reservation_prisma_mapper_1 = require("./reservation-prisma.mapper");
class PrismaReservationRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findById(id) {
        const record = await this.reservationDelegate.findUnique({
            where: { id },
        });
        if (!record) {
            return null;
        }
        return reservation_prisma_mapper_1.ReservationPrismaMapper.toDomain(record);
    }
    async save(reservation) {
        const record = reservation_prisma_mapper_1.ReservationPrismaMapper.toPersistence(reservation);
        const existingRecord = await this.reservationDelegate.findUnique({
            where: { id: record.id },
        });
        if (!existingRecord) {
            await this.reservationDelegate.create({
                data: record,
            });
            return;
        }
        const updateData = {
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
    get reservationDelegate() {
        return this.prisma
            .reservation;
    }
}
exports.PrismaReservationRepository = PrismaReservationRepository;
//# sourceMappingURL=prisma-reservation.repository.js.map
import { PrismaClient } from "@prisma/client";
import { AIKnowledgeContext, KnowledgeRepository } from "./knowledge-repository.interface";
export declare class SqlKnowledgeService implements KnowledgeRepository {
    private readonly prisma;
    private readonly cache;
    private readonly ttlMs;
    constructor(prisma: PrismaClient);
    retrieveRelevantContext(rawInput: string): Promise<AIKnowledgeContext>;
    private fetchRooms;
    private fetchGuests;
    private fetchReservations;
    private extractHint;
}

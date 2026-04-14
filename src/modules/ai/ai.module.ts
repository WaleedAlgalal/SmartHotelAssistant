import { Module } from "@nestjs/common";
import { ReservationModule } from "../reservation/reservation.module";
import { AI_KNOWLEDGE_REPOSITORY } from "./ai.tokens";
import { AIIntentService } from "./application/services/ai-intent.service";
import { LLMService } from "./infrastructure/llm/llm.service";
import { SqlKnowledgeService } from "./infrastructure/rag/sql-knowledge.service";
import { AIController } from "./presentation/controllers/ai.controller";
import { prismaClientProvider } from "../../shared/infrastructure/prisma/prisma-client.provider";

@Module({
  imports: [ReservationModule],
  controllers: [AIController],
  providers: [
    prismaClientProvider,
    AIIntentService,
    LLMService,
    SqlKnowledgeService,
    {
      provide: AI_KNOWLEDGE_REPOSITORY,
      useExisting: SqlKnowledgeService,
    },
  ],
})
export class AiModule {}

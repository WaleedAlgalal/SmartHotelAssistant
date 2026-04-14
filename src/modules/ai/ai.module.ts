import { Module } from "@nestjs/common";
import { ReservationModule } from "../reservation/reservation.module";
import { AIIntentService } from "./application/services/ai-intent.service";
import { LLMService } from "./infrastructure/llm/llm.service";
import { AIController } from "./presentation/controllers/ai.controller";

@Module({
  imports: [ReservationModule],
  controllers: [AIController],
  providers: [AIIntentService, LLMService],
})
export class AiModule {}

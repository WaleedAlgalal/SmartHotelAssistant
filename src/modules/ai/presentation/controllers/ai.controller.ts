import { Body, Controller, Post } from "@nestjs/common";
import { AIIntentService } from "../../application/services/ai-intent.service";
import { AICommandRequestDto } from "../dto/ai-command.request.dto";

@Controller("ai")
export class AIController {
  constructor(private readonly aiIntentService: AIIntentService) {}

  @Post("command")
  async command(
    @Body() body: AICommandRequestDto,
  ): Promise<{ intent: string; confidence: number; result: unknown }> {
    return this.aiIntentService.executeFromText(body.text);
  }
}

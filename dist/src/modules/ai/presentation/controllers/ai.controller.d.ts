import { AIIntentService } from "../../application/services/ai-intent.service";
import { AICommandRequestDto } from "../dto/ai-command.request.dto";
export declare class AIController {
    private readonly aiIntentService;
    constructor(aiIntentService: AIIntentService);
    command(body: AICommandRequestDto): Promise<{
        intent: string;
        confidence: number;
        result: unknown;
    }>;
}

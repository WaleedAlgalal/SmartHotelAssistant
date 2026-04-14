import { CancelReservationHandler } from "../../../reservation/application/commands/cancel-reservation.handler";
import { ConfirmReservationHandler } from "../../../reservation/application/commands/confirm-reservation.handler";
import { CreateReservationHandler } from "../../../reservation/application/commands/create-reservation.handler";
import { ExtendReservationHandler } from "../../../reservation/application/commands/extend-reservation.handler";
import { LLMService } from "../../infrastructure/llm/llm.service";
type AICommandExecutionResult = {
    intent: string;
    confidence: number;
    result: unknown;
};
export declare class AIIntentService {
    private readonly llmService;
    private readonly createReservationHandler;
    private readonly confirmReservationHandler;
    private readonly cancelReservationHandler;
    private readonly extendReservationHandler;
    constructor(llmService: LLMService, createReservationHandler: CreateReservationHandler, confirmReservationHandler: ConfirmReservationHandler, cancelReservationHandler: CancelReservationHandler, extendReservationHandler: ExtendReservationHandler);
    executeFromText(text: string): Promise<AICommandExecutionResult>;
    private resolveAICommand;
    private executeAICommand;
    private mapLLMOutputToAICommand;
    private detectIntentWithRules;
    private extractReservationId;
    private extractValue;
    private extractDate;
    private defaultCheckIn;
    private defaultCheckOut;
    private mapReservationResult;
}
export {};

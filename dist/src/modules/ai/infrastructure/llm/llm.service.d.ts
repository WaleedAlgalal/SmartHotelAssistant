import { LLMIntentOutput } from "./llm.types";
export declare class LLMService {
    inferIntent(rawInput: string): Promise<LLMIntentOutput>;
    private inferWithOpenAI;
    private inferWithMockProvider;
    private parseStrictJson;
    private validateOutput;
    private readString;
    private extractReservationId;
    private extractValue;
    private extractDate;
}

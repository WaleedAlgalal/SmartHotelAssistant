import { AIKnowledgeContext } from "../../infrastructure/rag/knowledge-repository.interface";
export declare const AI_INTENT_SYSTEM_PROMPT: string;
export declare function buildAIIntentUserPrompt(rawInput: string, context: AIKnowledgeContext): string;

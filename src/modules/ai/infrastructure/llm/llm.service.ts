import { Injectable } from "@nestjs/common";
import {
  AI_INTENT_SYSTEM_PROMPT,
  buildAIIntentUserPrompt,
} from "../../application/prompts/ai-intent.system-prompt";
import { AIKnowledgeContext } from "../rag/knowledge-repository.interface";
import { LLMIntentOutput } from "./llm.types";

@Injectable()
export class LLMService {
  async inferIntent(
    rawInput: string,
    context: AIKnowledgeContext,
  ): Promise<LLMIntentOutput> {
    const provider = (process.env.AI_LLM_PROVIDER ?? "mock").toLowerCase();

    if (provider === "openai") {
      return this.inferWithOpenAI(rawInput, context);
    }

    return this.inferWithMockProvider(rawInput, context);
  }

  private async inferWithOpenAI(
    rawInput: string,
    context: AIKnowledgeContext,
  ): Promise<LLMIntentOutput> {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error("OPENAI_API_KEY is missing.");
    }

    const model = process.env.OPENAI_MODEL ?? "gpt-4o-mini";
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        temperature: 0,
        messages: [
          { role: "system", content: AI_INTENT_SYSTEM_PROMPT },
          { role: "user", content: buildAIIntentUserPrompt(rawInput, context) },
        ],
      }),
    });

    if (!response.ok) {
      const body = await response.text();
      throw new Error(`OpenAI request failed (${response.status}): ${body}`);
    }

    const data = (await response.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };
    const content = data.choices?.[0]?.message?.content?.trim();

    if (!content) {
      throw new Error("OpenAI returned empty content.");
    }

    const parsed = this.parseStrictJson(content);
    return this.validateOutput(parsed);
  }

  private inferWithMockProvider(
    rawInput: string,
    context: AIKnowledgeContext,
  ): LLMIntentOutput {
    const text = rawInput.toLowerCase();

    if (text.includes("book")) {
      const now = new Date();
      const checkIn = new Date(now);
      checkIn.setDate(checkIn.getDate() + 1);
      const checkOut = new Date(checkIn);
      checkOut.setDate(checkOut.getDate() + 1);

      return {
        intent: "CreateReservationCommand",
        confidence: 0.86,
        entities: {
          guestId:
            this.extractValue(rawInput, "guest") ??
            context.guests[0]?.id ??
            "guest-default",
          roomId:
            this.extractValue(rawInput, "room") ??
            context.rooms[0]?.id ??
            "room-default",
          checkIn: checkIn.toISOString(),
          checkOut: checkOut.toISOString(),
        },
      };
    }

    if (text.includes("confirm")) {
      return {
        intent: "ConfirmReservationCommand",
        confidence: 0.9,
        entities: {
          reservationId:
            this.extractReservationId(rawInput) ??
            context.reservations[0]?.id ??
            undefined,
        },
      };
    }

    if (text.includes("cancel")) {
      return {
        intent: "CancelReservationCommand",
        confidence: 0.9,
        entities: {
          reservationId:
            this.extractReservationId(rawInput) ??
            context.reservations[0]?.id ??
            undefined,
        },
      };
    }

    if (text.includes("extend")) {
      return {
        intent: "ExtendReservationCommand",
        confidence: 0.88,
        entities: {
          reservationId:
            this.extractReservationId(rawInput) ??
            context.reservations[0]?.id ??
            undefined,
          checkOut: this.extractDate(rawInput),
        },
      };
    }

    throw new Error("Mock LLM could not infer supported intent.");
  }

  private parseStrictJson(content: string): unknown {
    const cleaned = content
      .replace(/^```json\s*/i, "")
      .replace(/^```\s*/i, "")
      .replace(/```$/i, "")
      .trim();

    return JSON.parse(cleaned);
  }

  private validateOutput(payload: unknown): LLMIntentOutput {
    if (!payload || typeof payload !== "object") {
      throw new Error("LLM output is not an object.");
    }

    const record = payload as {
      intent?: string;
      confidence?: number;
      entities?: Record<string, unknown>;
    };

    const allowedIntents = new Set([
      "CreateReservationCommand",
      "ConfirmReservationCommand",
      "CancelReservationCommand",
      "ExtendReservationCommand",
    ]);

    if (!record.intent || !allowedIntents.has(record.intent)) {
      throw new Error("LLM output intent is invalid.");
    }

    const confidence =
      typeof record.confidence === "number" ? record.confidence : 0.5;
    const entities = (record.entities ?? {}) as Record<string, unknown>;

    return {
      intent: record.intent as LLMIntentOutput["intent"],
      confidence: Math.min(Math.max(confidence, 0), 1),
      entities: {
        guestId: this.readString(entities.guestId),
        roomId: this.readString(entities.roomId),
        reservationId: this.readString(entities.reservationId),
        checkIn: this.readString(entities.checkIn),
        checkOut: this.readString(entities.checkOut),
      },
    };
  }

  private readString(value: unknown): string | undefined {
    if (typeof value !== "string") {
      return undefined;
    }

    const trimmed = value.trim();
    return trimmed.length > 0 ? trimmed : undefined;
  }

  private extractReservationId(rawInput: string): string | undefined {
    const match = rawInput.match(
      /(?:reservation(?:\s+id)?|id)\s*[:=]?\s*([a-zA-Z0-9_-]+)/i,
    );
    return match?.[1];
  }

  private extractValue(rawInput: string, key: "guest" | "room"): string | null {
    const match = rawInput.match(
      new RegExp(`${key}\\s*(?:id)?\\s*[:=]?\\s*([a-zA-Z0-9_-]+)`, "i"),
    );
    return match?.[1] ?? null;
  }

  private extractDate(rawInput: string): string {
    const isoDate = rawInput.match(/(\d{4}-\d{2}-\d{2})/)?.[1];
    if (isoDate) {
      return new Date(isoDate).toISOString();
    }

    const nextDay = new Date();
    nextDay.setDate(nextDay.getDate() + 1);
    return nextDay.toISOString();
  }
}

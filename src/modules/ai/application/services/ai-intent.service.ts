import { Injectable } from "@nestjs/common";
import { CancelReservationCommand } from "../../../reservation/application/commands/cancel-reservation.command";
import { CancelReservationHandler } from "../../../reservation/application/commands/cancel-reservation.handler";
import { ConfirmReservationCommand } from "../../../reservation/application/commands/confirm-reservation.command";
import { ConfirmReservationHandler } from "../../../reservation/application/commands/confirm-reservation.handler";
import { CreateReservationCommand } from "../../../reservation/application/commands/create-reservation.command";
import { CreateReservationHandler } from "../../../reservation/application/commands/create-reservation.handler";
import { ExtendReservationCommand } from "../../../reservation/application/commands/extend-reservation.command";
import { ExtendReservationHandler } from "../../../reservation/application/commands/extend-reservation.handler";
import { AICommand } from "../../domain/entities/ai-command.entity";
import { LLMService } from "../../infrastructure/llm/llm.service";
import { LLMIntentOutput } from "../../infrastructure/llm/llm.types";

type AICommandExecutionResult = {
  intent: string;
  confidence: number;
  result: unknown;
};

@Injectable()
export class AIIntentService {
  constructor(
    private readonly llmService: LLMService,
    private readonly createReservationHandler: CreateReservationHandler,
    private readonly confirmReservationHandler: ConfirmReservationHandler,
    private readonly cancelReservationHandler: CancelReservationHandler,
    private readonly extendReservationHandler: ExtendReservationHandler,
  ) {}

  async executeFromText(text: string): Promise<AICommandExecutionResult> {
    const aiCommand = await this.resolveAICommand(text);
    return this.executeAICommand(aiCommand);
  }

  private async resolveAICommand(text: string): Promise<AICommand> {
    const normalized = text.trim();
    if (!normalized) {
      throw new Error("Input text is required.");
    }

    try {
      const llmOutput = await this.llmService.inferIntent(normalized);
      return this.mapLLMOutputToAICommand(llmOutput, normalized);
    } catch {
      // Safe mode: fallback to deterministic local rules.
      return this.detectIntentWithRules(normalized);
    }
  }

  private async executeAICommand(aiCommand: AICommand): Promise<AICommandExecutionResult> {
    if (aiCommand.intent === "CreateReservationCommand") {
      const payload = aiCommand.payload as {
        reservationId: string;
        guestId: string;
        roomId: string;
        checkIn: string;
        checkOut: string;
      };

      const result = await this.createReservationHandler.execute(
        new CreateReservationCommand(
          payload.reservationId,
          payload.guestId,
          payload.roomId,
          payload.checkIn,
          payload.checkOut,
        ),
      );

      return {
        intent: aiCommand.intent,
        confidence: aiCommand.confidence,
        result: this.mapReservationResult(result),
      };
    }

    if (aiCommand.intent === "ConfirmReservationCommand") {
      const payload = aiCommand.payload as { reservationId: string };
      const result = await this.confirmReservationHandler.execute(
        new ConfirmReservationCommand(payload.reservationId),
      );

      return {
        intent: aiCommand.intent,
        confidence: aiCommand.confidence,
        result: this.mapReservationResult(result),
      };
    }

    if (aiCommand.intent === "CancelReservationCommand") {
      const payload = aiCommand.payload as { reservationId: string };
      const result = await this.cancelReservationHandler.execute(
        new CancelReservationCommand(payload.reservationId),
      );

      return {
        intent: aiCommand.intent,
        confidence: aiCommand.confidence,
        result: this.mapReservationResult(result),
      };
    }

    if (aiCommand.intent === "ExtendReservationCommand") {
      const payload = aiCommand.payload as {
        reservationId: string;
        newCheckOut: string;
      };
      const result = await this.extendReservationHandler.execute(
        new ExtendReservationCommand(payload.reservationId, payload.newCheckOut),
      );

      return {
        intent: aiCommand.intent,
        confidence: aiCommand.confidence,
        result: this.mapReservationResult(result),
      };
    }

    throw new Error("Unsupported intent.");
  }

  private mapLLMOutputToAICommand(output: LLMIntentOutput, rawInput: string): AICommand {
    if (output.intent === "CreateReservationCommand") {
      const checkIn = output.entities.checkIn ?? this.defaultCheckIn();
      const checkOut = output.entities.checkOut ?? this.defaultCheckOut(checkIn);

      return new AICommand(
        output.intent,
        output.confidence,
        {
          reservationId: output.entities.reservationId ?? `res-${Date.now()}`,
          guestId: output.entities.guestId ?? "guest-default",
          roomId: output.entities.roomId ?? "room-default",
          checkIn,
          checkOut,
        },
        rawInput,
      );
    }

    if (
      output.intent === "ConfirmReservationCommand" ||
      output.intent === "CancelReservationCommand"
    ) {
      const reservationId = output.entities.reservationId;
      if (!reservationId) {
        throw new Error("LLM did not provide reservationId.");
      }

      return new AICommand(
        output.intent,
        output.confidence,
        { reservationId },
        rawInput,
      );
    }

    if (output.intent === "ExtendReservationCommand") {
      const reservationId = output.entities.reservationId;
      const newCheckOut = output.entities.checkOut;
      if (!reservationId || !newCheckOut) {
        throw new Error("LLM did not provide required extend entities.");
      }

      return new AICommand(
        output.intent,
        output.confidence,
        { reservationId, newCheckOut },
        rawInput,
      );
    }

    throw new Error("Unsupported LLM intent.");
  }

  private detectIntentWithRules(rawInput: string): AICommand {
    const text = rawInput.toLowerCase();

    if (text.includes("book")) {
      const checkIn = this.defaultCheckIn();
      return new AICommand(
        "CreateReservationCommand",
        0.6,
        {
          reservationId: `res-${Date.now()}`,
          guestId: this.extractValue(rawInput, "guest") ?? "guest-default",
          roomId: this.extractValue(rawInput, "room") ?? "room-default",
          checkIn,
          checkOut: this.defaultCheckOut(checkIn),
        },
        rawInput,
      );
    }

    if (text.includes("confirm")) {
      return new AICommand(
        "ConfirmReservationCommand",
        0.6,
        { reservationId: this.extractReservationId(rawInput) },
        rawInput,
      );
    }

    if (text.includes("cancel")) {
      return new AICommand(
        "CancelReservationCommand",
        0.6,
        { reservationId: this.extractReservationId(rawInput) },
        rawInput,
      );
    }

    if (text.includes("extend")) {
      return new AICommand(
        "ExtendReservationCommand",
        0.6,
        {
          reservationId: this.extractReservationId(rawInput),
          newCheckOut: this.extractDate(rawInput),
        },
        rawInput,
      );
    }

    throw new Error("Unable to infer supported command intent.");
  }

  private extractReservationId(rawInput: string): string {
    const match = rawInput.match(
      /(?:reservation(?:\s+id)?|id)\s*[:=]?\s*([a-zA-Z0-9_-]+)/i,
    );
    if (!match?.[1]) {
      throw new Error("Reservation id is required for this action.");
    }
    return match[1];
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

  private defaultCheckIn(): string {
    const date = new Date();
    date.setDate(date.getDate() + 1);
    return date.toISOString();
  }

  private defaultCheckOut(checkInIso: string): string {
    const checkIn = new Date(checkInIso);
    if (Number.isNaN(checkIn.getTime())) {
      const fallback = new Date();
      fallback.setDate(fallback.getDate() + 2);
      return fallback.toISOString();
    }

    checkIn.setDate(checkIn.getDate() + 1);
    return checkIn.toISOString();
  }

  private mapReservationResult(result: {
    reservation: {
      id: string;
      guestId: string;
      roomId: string;
      status: string;
      stayPeriod: { checkIn: Date; checkOut: Date };
      createdAt: Date;
      updatedAt: Date;
    };
    domainEvents: unknown[];
  }): unknown {
    return {
      reservation: {
        id: result.reservation.id,
        guestId: result.reservation.guestId,
        roomId: result.reservation.roomId,
        status: result.reservation.status,
        checkIn: result.reservation.stayPeriod.checkIn.toISOString(),
        checkOut: result.reservation.stayPeriod.checkOut.toISOString(),
        createdAt: result.reservation.createdAt.toISOString(),
        updatedAt: result.reservation.updatedAt.toISOString(),
      },
      domainEvents: result.domainEvents,
    };
  }
}

export type AIIntentName = "CreateReservationCommand" | "ConfirmReservationCommand" | "CancelReservationCommand" | "ExtendReservationCommand";
export type LLMEntities = {
    guestId?: string;
    roomId?: string;
    reservationId?: string;
    checkIn?: string;
    checkOut?: string;
};
export type LLMIntentOutput = {
    intent: AIIntentName;
    confidence: number;
    entities: LLMEntities;
};

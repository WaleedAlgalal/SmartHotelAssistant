export type RoomKnowledge = {
  id: string;
  number: string;
  type: string;
  status: string;
};

export type GuestKnowledge = {
  id: string;
  name: string;
  phone: string | null;
};

export type ReservationKnowledge = {
  id: string;
  guestId: string;
  roomId: string;
  status: string;
  checkIn: string;
  checkOut: string;
};

export type AIKnowledgeContext = {
  rooms: RoomKnowledge[];
  guests: GuestKnowledge[];
  reservations: ReservationKnowledge[];
};

export interface KnowledgeRepository {
  retrieveRelevantContext(rawInput: string): Promise<AIKnowledgeContext>;
}

import { Reservation } from "../../domain/aggregates/reservation/reservation.aggregate";

export interface IReservationRepository {
  findById(id: string): Promise<Reservation | null>;
  save(reservation: Reservation): Promise<void>;
}

import "../../domain/entities/reservation_entity.dart";

abstract class ReservationRepository {
  Future<ReservationEntity> getById(String reservationId);
}

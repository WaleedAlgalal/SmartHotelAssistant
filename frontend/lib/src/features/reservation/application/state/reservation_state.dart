import "../../domain/entities/reservation_entity.dart";

class ReservationState {
  final bool isLoading;
  final String? errorMessage;
  final ReservationEntity? reservation;
  final List<ReservationEntity> reservations;

  const ReservationState({
    required this.isLoading,
    required this.errorMessage,
    required this.reservation,
    required this.reservations,
  });

  factory ReservationState.initial() {
    return const ReservationState(
      isLoading: false,
      errorMessage: null,
      reservation: null,
      reservations: <ReservationEntity>[],
    );
  }

  ReservationState copyWith({
    bool? isLoading,
    String? errorMessage,
    bool clearErrorMessage = false,
    ReservationEntity? reservation,
    bool clearReservation = false,
    List<ReservationEntity>? reservations,
  }) {
    return ReservationState(
      isLoading: isLoading ?? this.isLoading,
      errorMessage:
          clearErrorMessage ? null : (errorMessage ?? this.errorMessage),
      reservation: clearReservation ? null : (reservation ?? this.reservation),
      reservations: reservations ?? this.reservations,
    );
  }
}

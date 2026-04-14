import "package:flutter_riverpod/flutter_riverpod.dart";

import "../../data/dto/create_reservation_request_dto.dart";
import "../../data/dto/extend_reservation_request_dto.dart";
import "../../data/services/reservation_api_service.dart";
import "../../domain/entities/reservation_entity.dart";
import "../state/reservation_state.dart";

class ReservationNotifier extends StateNotifier<ReservationState> {
  final ReservationApiService _reservationApiService;

  ReservationNotifier(this._reservationApiService)
      : super(ReservationState.initial());

  Future<void> loadReservationById(String id) async {
    await _runRequest(() => _reservationApiService.getReservationById(id));
  }

  Future<void> createReservation(CreateReservationRequestDto request) async {
    await _runRequest(() => _reservationApiService.createReservation(request));
  }

  Future<void> confirmReservation(String id) async {
    await _runRequest(() => _reservationApiService.confirmReservation(id));
  }

  Future<void> cancelReservation(String id) async {
    await _runRequest(() => _reservationApiService.cancelReservation(id));
  }

  Future<void> extendReservation(String id, DateTime newCheckOut) async {
    final request = ExtendReservationRequestDto(newCheckOut: newCheckOut);
    await _runRequest(
        () => _reservationApiService.extendReservation(id, request));
  }

  Future<void> _runRequest(
    Future<ReservationEntity> Function() operation,
  ) async {
    state = state.copyWith(
      isLoading: true,
      clearErrorMessage: true,
    );

    try {
      final reservation = await operation();
      state = state.copyWith(
        isLoading: false,
        reservation: reservation,
        reservations: _upsertReservation(state.reservations, reservation),
        clearErrorMessage: true,
      );
    } catch (error) {
      state = state.copyWith(
        isLoading: false,
        errorMessage: error.toString(),
      );
    }
  }

  List<ReservationEntity> _upsertReservation(
    List<ReservationEntity> existing,
    ReservationEntity updated,
  ) {
    final next = [...existing];
    final index = next.indexWhere((item) => item.id == updated.id);

    if (index == -1) {
      next.add(updated);
    } else {
      next[index] = updated;
    }

    return next;
  }
}

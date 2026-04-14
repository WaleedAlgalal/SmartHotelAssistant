import "package:flutter_riverpod/flutter_riverpod.dart";

import "../../data/services/reservation_api_service.dart";
import "../notifiers/reservation_notifier.dart";
import "../state/reservation_state.dart";

final reservationApiServiceProvider = Provider<ReservationApiService>(
  (ref) => ReservationApiService(),
);

final reservationNotifierProvider =
    StateNotifierProvider<ReservationNotifier, ReservationState>(
  (ref) => ReservationNotifier(ref.read(reservationApiServiceProvider)),
);

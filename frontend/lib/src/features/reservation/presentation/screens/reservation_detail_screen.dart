import "package:flutter/material.dart";
import "package:flutter_riverpod/flutter_riverpod.dart";
import "package:intl/intl.dart";

import "../../application/providers/reservation_providers.dart";
import "../../domain/entities/reservation_entity.dart";
import "../widgets/reservation_status_chip.dart";

class ReservationDetailScreen extends ConsumerStatefulWidget {
  final String reservationId;

  const ReservationDetailScreen({
    super.key,
    required this.reservationId,
  });

  @override
  ConsumerState<ReservationDetailScreen> createState() =>
      _ReservationDetailScreenState();
}

class _ReservationDetailScreenState
    extends ConsumerState<ReservationDetailScreen> {
  @override
  void initState() {
    super.initState();
    Future.microtask(
      () => ref
          .read(reservationNotifierProvider.notifier)
          .loadReservationById(widget.reservationId),
    );
  }

  @override
  Widget build(BuildContext context) {
    final state = ref.watch(reservationNotifierProvider);
    final reservation = _findReservation(state);

    return Scaffold(
      appBar: AppBar(title: const Text("Reservation Detail")),
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: switch ((state.isLoading, state.errorMessage, reservation)) {
          (true, _, _) => const Center(child: CircularProgressIndicator()),
          (_, final error?, _) => Center(
              child: Text(
                error,
                style: TextStyle(color: Theme.of(context).colorScheme.error),
              ),
            ),
          (_, _, null) => const Center(child: Text("Reservation not found.")),
          (_, _, final ReservationEntity current) => _DetailContent(
              reservation: current,
              onConfirm: () => ref
                  .read(reservationNotifierProvider.notifier)
                  .confirmReservation(
                    widget.reservationId,
                  ),
              onCancel: () => ref
                  .read(reservationNotifierProvider.notifier)
                  .cancelReservation(
                    widget.reservationId,
                  ),
              onExtend: () => _showExtendDialog(context),
            ),
        },
      ),
    );
  }

  ReservationEntity? _findReservation(state) {
    final index = state.reservations.indexWhere(
      (item) => item.id == widget.reservationId,
    );
    if (index != -1) {
      return state.reservations[index];
    }

    if (state.reservation?.id == widget.reservationId) {
      return state.reservation;
    }

    return null;
  }

  Future<void> _showExtendDialog(BuildContext context) async {
    final picked = await showDatePicker(
      context: context,
      firstDate: DateTime.now().add(const Duration(days: 1)),
      lastDate: DateTime.now().add(const Duration(days: 365 * 3)),
      initialDate: DateTime.now().add(const Duration(days: 1)),
    );

    if (picked == null) return;
    await ref
        .read(reservationNotifierProvider.notifier)
        .extendReservation(widget.reservationId, picked);
  }
}

class _DetailContent extends StatelessWidget {
  final ReservationEntity reservation;
  final Future<void> Function() onConfirm;
  final Future<void> Function() onCancel;
  final Future<void> Function() onExtend;

  const _DetailContent({
    required this.reservation,
    required this.onConfirm,
    required this.onCancel,
    required this.onExtend,
  });

  @override
  Widget build(BuildContext context) {
    final dateFormat = DateFormat("yyyy-MM-dd");

    return ListView(
      children: [
        Row(
          children: [
            Expanded(
              child: Text(
                "Reservation #${reservation.id}",
                style: Theme.of(context).textTheme.titleMedium,
              ),
            ),
            ReservationStatusChip(status: reservation.status),
          ],
        ),
        const SizedBox(height: 12),
        Card(
          child: Padding(
            padding: const EdgeInsets.all(12),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text("Guest: ${reservation.guestId}"),
                Text("Room: ${reservation.roomId}"),
                Text("Check-in: ${dateFormat.format(reservation.checkIn)}"),
                Text("Check-out: ${dateFormat.format(reservation.checkOut)}"),
              ],
            ),
          ),
        ),
        const SizedBox(height: 16),
        Wrap(
          spacing: 8,
          runSpacing: 8,
          children: [
            FilledButton(
              onPressed: reservation.status == "CONFIRMED" ||
                      reservation.status == "CANCELLED"
                  ? null
                  : () => onConfirm(),
              child: const Text("Confirm"),
            ),
            OutlinedButton(
              onPressed: reservation.status == "CONFIRMED" ||
                      reservation.status == "CANCELLED"
                  ? null
                  : () => onCancel(),
              child: const Text("Cancel"),
            ),
            OutlinedButton(
              onPressed:
                  reservation.status == "CANCELLED" ? null : () => onExtend(),
              child: const Text("Extend Stay"),
            ),
          ],
        ),
      ],
    );
  }
}

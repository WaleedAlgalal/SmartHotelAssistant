import "package:flutter/material.dart";
import "package:flutter_riverpod/flutter_riverpod.dart";
import "package:intl/intl.dart";

import "../../application/providers/reservation_providers.dart";
import "reservation_create_screen.dart";
import "reservation_detail_screen.dart";
import "../widgets/reservation_status_chip.dart";

class ReservationListScreen extends ConsumerStatefulWidget {
  const ReservationListScreen({super.key});

  static const routeName = "/reservations";

  @override
  ConsumerState<ReservationListScreen> createState() =>
      _ReservationListScreenState();
}

class _ReservationListScreenState extends ConsumerState<ReservationListScreen> {
  final _reservationIdController = TextEditingController();

  @override
  void dispose() {
    _reservationIdController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final state = ref.watch(reservationNotifierProvider);
    final dateFormat = DateFormat("yyyy-MM-dd");

    return Scaffold(
      appBar: AppBar(
        title: const Text("Reservations"),
      ),
      body: Column(
        children: [
          Padding(
            padding: const EdgeInsets.all(16),
            child: Row(
              children: [
                Expanded(
                  child: TextField(
                    controller: _reservationIdController,
                    decoration: const InputDecoration(
                      labelText: "Load reservation by ID",
                    ),
                  ),
                ),
                const SizedBox(width: 8),
                FilledButton(
                  onPressed: state.isLoading ? null : _loadReservationById,
                  child: const Text("Load"),
                ),
              ],
            ),
          ),
          if (state.errorMessage != null)
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16),
              child: Text(
                state.errorMessage!,
                style: TextStyle(color: Theme.of(context).colorScheme.error),
              ),
            ),
          const SizedBox(height: 8),
          Expanded(
            child: switch ((state.isLoading, state.reservations.isEmpty)) {
              (true, _) => const Center(child: CircularProgressIndicator()),
              (_, true) => const Center(
                  child: Text("No reservations yet. Create or load one by ID."),
                ),
              (_, false) => ListView.builder(
                  itemCount: state.reservations.length,
                  itemBuilder: (context, index) {
                    final reservation = state.reservations[index];
                    return Card(
                      margin: const EdgeInsets.symmetric(
                        horizontal: 16,
                        vertical: 6,
                      ),
                      child: ListTile(
                        title: Text("Reservation ${reservation.id}"),
                        subtitle: Text(
                          "${dateFormat.format(reservation.checkIn)} - ${dateFormat.format(reservation.checkOut)}",
                        ),
                        trailing: ReservationStatusChip(
                          status: reservation.status,
                        ),
                        onTap: () {
                          Navigator.push(
                            context,
                            MaterialPageRoute(
                              builder: (_) => ReservationDetailScreen(
                                reservationId: reservation.id,
                              ),
                            ),
                          );
                        },
                      ),
                    );
                  },
                ),
            },
          ),
        ],
      ),
      floatingActionButton: FloatingActionButton.extended(
        onPressed: () {
          Navigator.push(
            context,
            MaterialPageRoute(builder: (_) => const ReservationCreateScreen()),
          );
        },
        label: const Text("Create"),
        icon: const Icon(Icons.add),
      ),
    );
  }

  Future<void> _loadReservationById() async {
    final id = _reservationIdController.text.trim();
    if (id.isEmpty) return;
    await ref
        .read(reservationNotifierProvider.notifier)
        .loadReservationById(id);
  }
}

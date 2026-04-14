import "package:flutter/material.dart";
import "package:flutter_riverpod/flutter_riverpod.dart";
import "package:intl/intl.dart";

import "../../application/providers/reservation_providers.dart";
import "../../data/dto/create_reservation_request_dto.dart";
import "reservation_detail_screen.dart";

class ReservationCreateScreen extends ConsumerStatefulWidget {
  const ReservationCreateScreen({super.key});

  @override
  ConsumerState<ReservationCreateScreen> createState() =>
      _ReservationCreateScreenState();
}

class _ReservationCreateScreenState
    extends ConsumerState<ReservationCreateScreen> {
  final _guestIdController = TextEditingController();
  final _roomIdController = TextEditingController();
  DateTime? _checkIn;
  DateTime? _checkOut;

  @override
  void dispose() {
    _guestIdController.dispose();
    _roomIdController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final state = ref.watch(reservationNotifierProvider);
    final formatter = DateFormat("yyyy-MM-dd");

    return Scaffold(
      appBar: AppBar(title: const Text("Create Reservation")),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          TextField(
            controller: _guestIdController,
            decoration: const InputDecoration(labelText: "Guest ID"),
          ),
          const SizedBox(height: 12),
          TextField(
            controller: _roomIdController,
            decoration: const InputDecoration(labelText: "Room ID"),
          ),
          const SizedBox(height: 12),
          ListTile(
            contentPadding: EdgeInsets.zero,
            title: const Text("Check-in"),
            subtitle: Text(
              _checkIn == null ? "Select date" : formatter.format(_checkIn!),
            ),
            trailing: const Icon(Icons.calendar_month),
            onTap: () => _pickCheckIn(context),
          ),
          ListTile(
            contentPadding: EdgeInsets.zero,
            title: const Text("Check-out"),
            subtitle: Text(
              _checkOut == null ? "Select date" : formatter.format(_checkOut!),
            ),
            trailing: const Icon(Icons.calendar_month),
            onTap: () => _pickCheckOut(context),
          ),
          if (state.errorMessage != null) ...[
            const SizedBox(height: 8),
            Text(
              state.errorMessage!,
              style: TextStyle(color: Theme.of(context).colorScheme.error),
            ),
          ],
          const SizedBox(height: 16),
          FilledButton(
            onPressed: state.isLoading ? null : _submit,
            child: state.isLoading
                ? const SizedBox(
                    width: 20,
                    height: 20,
                    child: CircularProgressIndicator(strokeWidth: 2),
                  )
                : const Text("Create Reservation"),
          ),
        ],
      ),
    );
  }

  Future<void> _pickCheckIn(BuildContext context) async {
    final now = DateTime.now();
    final picked = await showDatePicker(
      context: context,
      firstDate: DateTime(now.year - 1),
      lastDate: DateTime(now.year + 5),
      initialDate: _checkIn ?? now,
    );

    if (picked != null) {
      setState(() {
        _checkIn = picked;
        if (_checkOut != null && !_checkOut!.isAfter(_checkIn!)) {
          _checkOut = null;
        }
      });
    }
  }

  Future<void> _pickCheckOut(BuildContext context) async {
    final base = _checkIn ?? DateTime.now();
    final picked = await showDatePicker(
      context: context,
      firstDate: base.add(const Duration(days: 1)),
      lastDate: DateTime(base.year + 5),
      initialDate: _checkOut ?? base.add(const Duration(days: 1)),
    );

    if (picked != null) {
      setState(() => _checkOut = picked);
    }
  }

  Future<void> _submit() async {
    if (_guestIdController.text.trim().isEmpty ||
        _roomIdController.text.trim().isEmpty ||
        _checkIn == null ||
        _checkOut == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text("Please fill all fields.")),
      );
      return;
    }

    final request = CreateReservationRequestDto(
      reservationId: "res-${DateTime.now().microsecondsSinceEpoch}",
      guestId: _guestIdController.text.trim(),
      roomId: _roomIdController.text.trim(),
      checkIn: _checkIn!,
      checkOut: _checkOut!,
    );

    await ref
        .read(reservationNotifierProvider.notifier)
        .createReservation(request);
    final state = ref.read(reservationNotifierProvider);

    if (!mounted) return;
    if (state.errorMessage != null || state.reservation == null) {
      return;
    }

    Navigator.of(context).pushReplacement(
      MaterialPageRoute(
        builder: (_) => ReservationDetailScreen(
          reservationId: state.reservation!.id,
        ),
      ),
    );
  }
}

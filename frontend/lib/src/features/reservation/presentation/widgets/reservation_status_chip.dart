import "package:flutter/material.dart";

class ReservationStatusChip extends StatelessWidget {
  final String status;

  const ReservationStatusChip({
    super.key,
    required this.status,
  });

  @override
  Widget build(BuildContext context) {
    final normalized = status.toUpperCase();
    final label = switch (normalized) {
      "PENDING" => "CREATED",
      _ => normalized,
    };
    final color = switch (normalized) {
      "CONFIRMED" => Colors.green,
      "CANCELLED" => Colors.red,
      _ => Colors.orange,
    };

    return Chip(
      label: Text(
        label,
        style: const TextStyle(color: Colors.white),
      ),
      backgroundColor: color,
      visualDensity: VisualDensity.compact,
    );
  }
}

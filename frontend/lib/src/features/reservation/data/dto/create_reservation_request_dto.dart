class CreateReservationRequestDto {
  final String reservationId;
  final String guestId;
  final String roomId;
  final DateTime checkIn;
  final DateTime checkOut;

  const CreateReservationRequestDto({
    required this.reservationId,
    required this.guestId,
    required this.roomId,
    required this.checkIn,
    required this.checkOut,
  });

  Map<String, dynamic> toJson() {
    return {
      "reservationId": reservationId,
      "guestId": guestId,
      "roomId": roomId,
      "checkIn": checkIn.toIso8601String(),
      "checkOut": checkOut.toIso8601String(),
    };
  }
}

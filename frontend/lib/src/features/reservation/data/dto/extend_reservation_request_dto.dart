class ExtendReservationRequestDto {
  final DateTime newCheckOut;

  const ExtendReservationRequestDto({required this.newCheckOut});

  Map<String, dynamic> toJson() {
    return {
      "newCheckOut": newCheckOut.toIso8601String(),
    };
  }
}

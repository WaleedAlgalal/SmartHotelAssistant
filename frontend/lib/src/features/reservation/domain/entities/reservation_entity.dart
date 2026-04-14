class ReservationDomainEventEntity {
  final String name;
  final DateTime? occurredAt;

  const ReservationDomainEventEntity({
    required this.name,
    required this.occurredAt,
  });
}

class ReservationEntity {
  final String id;
  final String guestId;
  final String roomId;
  final String status;
  final DateTime checkIn;
  final DateTime checkOut;
  final DateTime createdAt;
  final DateTime updatedAt;
  final List<ReservationDomainEventEntity> domainEvents;

  const ReservationEntity({
    required this.id,
    required this.guestId,
    required this.roomId,
    required this.status,
    required this.checkIn,
    required this.checkOut,
    required this.createdAt,
    required this.updatedAt,
    required this.domainEvents,
  });
}

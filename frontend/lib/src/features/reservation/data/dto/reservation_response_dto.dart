import "../../domain/entities/reservation_entity.dart";

class ReservationEventResponseDto {
  final String name;
  final String? occurredAt;

  const ReservationEventResponseDto({
    required this.name,
    required this.occurredAt,
  });

  factory ReservationEventResponseDto.fromJson(Map<String, dynamic> json) {
    return ReservationEventResponseDto(
      name: json["name"] as String,
      occurredAt: json["occurredAt"] as String?,
    );
  }

  ReservationDomainEventEntity toDomain() {
    return ReservationDomainEventEntity(
      name: name,
      occurredAt: occurredAt == null ? null : DateTime.parse(occurredAt!),
    );
  }
}

class ReservationResponseDto {
  final String id;
  final String guestId;
  final String roomId;
  final String status;
  final String checkIn;
  final String checkOut;
  final String createdAt;
  final String updatedAt;
  final List<ReservationEventResponseDto> domainEvents;

  const ReservationResponseDto({
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

  factory ReservationResponseDto.fromJson(Map<String, dynamic> json) {
    final rawEvents = (json["domainEvents"] as List<dynamic>? ?? []);

    return ReservationResponseDto(
      id: json["id"] as String,
      guestId: json["guestId"] as String,
      roomId: json["roomId"] as String,
      status: json["status"] as String,
      checkIn: json["checkIn"] as String,
      checkOut: json["checkOut"] as String,
      createdAt: json["createdAt"] as String,
      updatedAt: json["updatedAt"] as String,
      domainEvents: rawEvents
          .map(
            (item) => ReservationEventResponseDto.fromJson(
                item as Map<String, dynamic>),
          )
          .toList(),
    );
  }

  ReservationEntity toDomain() {
    return ReservationEntity(
      id: id,
      guestId: guestId,
      roomId: roomId,
      status: status,
      checkIn: DateTime.parse(checkIn),
      checkOut: DateTime.parse(checkOut),
      createdAt: DateTime.parse(createdAt),
      updatedAt: DateTime.parse(updatedAt),
      domainEvents: domainEvents.map((event) => event.toDomain()).toList(),
    );
  }
}

import "package:dio/dio.dart";

import "../../../../shared/data/services/dio_client_factory.dart";
import "../../domain/entities/reservation_entity.dart";
import "../dto/create_reservation_request_dto.dart";
import "../dto/extend_reservation_request_dto.dart";
import "../dto/reservation_response_dto.dart";

class ReservationApiService {
  final Dio _dio;

  ReservationApiService({Dio? dio}) : _dio = dio ?? DioClientFactory.create();

  Future<ReservationEntity> createReservation(
    CreateReservationRequestDto request,
  ) async {
    final response = await _dio.post<Map<String, dynamic>>(
      "/reservations",
      data: request.toJson(),
    );

    return _mapReservationResponse(response.data);
  }

  Future<ReservationEntity> getReservationById(String id) async {
    final response = await _dio.get<Map<String, dynamic>>("/reservations/$id");
    return _mapReservationResponse(response.data);
  }

  Future<ReservationEntity> confirmReservation(String reservationId) async {
    final response = await _dio.post<Map<String, dynamic>>(
      "/reservations/$reservationId/confirm",
    );
    return _mapReservationResponse(response.data);
  }

  Future<ReservationEntity> cancelReservation(String reservationId) async {
    final response = await _dio.post<Map<String, dynamic>>(
      "/reservations/$reservationId/cancel",
    );
    return _mapReservationResponse(response.data);
  }

  Future<ReservationEntity> extendReservation(
    String reservationId,
    ExtendReservationRequestDto request,
  ) async {
    final response = await _dio.post<Map<String, dynamic>>(
      "/reservations/$reservationId/extend",
      data: request.toJson(),
    );
    return _mapReservationResponse(response.data);
  }

  ReservationEntity _mapReservationResponse(Map<String, dynamic>? data) {
    if (data == null) {
      throw const FormatException("Reservation API response body is empty.");
    }

    final dto = ReservationResponseDto.fromJson(data);
    return dto.toDomain();
  }
}

import "package:dio/dio.dart";

class DioClientFactory {
  static const String baseUrl = "http://localhost:3000";

  static Dio create() {
    return Dio(
      BaseOptions(
        baseUrl: baseUrl,
        connectTimeout: const Duration(seconds: 10),
        receiveTimeout: const Duration(seconds: 15),
        sendTimeout: const Duration(seconds: 10),
        contentType: "application/json",
        responseType: ResponseType.json,
      ),
    );
  }
}

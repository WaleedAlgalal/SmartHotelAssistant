class ApiErrorEntity {
  final String message;
  final int? statusCode;

  const ApiErrorEntity({
    required this.message,
    this.statusCode,
  });
}

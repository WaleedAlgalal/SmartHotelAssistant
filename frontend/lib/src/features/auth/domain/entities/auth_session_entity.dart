class AuthSessionEntity {
  final String userId;
  final String accessToken;

  const AuthSessionEntity({
    required this.userId,
    required this.accessToken,
  });
}

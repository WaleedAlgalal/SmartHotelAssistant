import "package:dio/dio.dart";
import "package:flutter_riverpod/flutter_riverpod.dart";

import "../../data/services/dio_client_factory.dart";

final dioProvider = Provider<Dio>((ref) => DioClientFactory.create());

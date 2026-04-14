import "package:flutter/material.dart";

import "features/auth/presentation/screens/login_screen.dart";
import "features/auth/presentation/screens/register_screen.dart";
import "features/reservation/presentation/screens/reservation_list_screen.dart";
import "shared/presentation/theme/app_theme.dart";

class SmartHotelApp extends StatelessWidget {
  const SmartHotelApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: "Smart Hotel Assistant",
      debugShowCheckedModeBanner: false,
      theme: AppTheme.light(),
      initialRoute: LoginScreen.routeName,
      routes: {
        LoginScreen.routeName: (_) => const LoginScreen(),
        RegisterScreen.routeName: (_) => const RegisterScreen(),
        ReservationListScreen.routeName: (_) => const ReservationListScreen(),
      },
    );
  }
}

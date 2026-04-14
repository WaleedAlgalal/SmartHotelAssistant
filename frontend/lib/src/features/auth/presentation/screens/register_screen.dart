import "package:flutter/material.dart";

class RegisterScreen extends StatelessWidget {
  const RegisterScreen({super.key});

  static const routeName = "/register";

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text("Register")),
      body: const Center(
        child: Padding(
          padding: EdgeInsets.all(20),
          child: Text(
            "Registration UI placeholder.\nWill be connected to backend in next steps.",
            textAlign: TextAlign.center,
          ),
        ),
      ),
    );
  }
}

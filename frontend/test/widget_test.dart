import "package:flutter_test/flutter_test.dart";
import "package:frontend/src/app.dart";

void main() {
  testWidgets("renders login screen", (tester) async {
    await tester.pumpWidget(const SmartHotelApp());

    expect(find.text("Smart Hotel Assistant"), findsOneWidget);
    expect(find.text("Login"), findsOneWidget);
  });
}

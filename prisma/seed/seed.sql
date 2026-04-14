DELETE FROM dbo.Reservation;
DELETE FROM dbo.Room;
DELETE FROM dbo.Guest;

INSERT INTO dbo.Guest (id, name, phone)
VALUES
  ('guest-001', 'Ahmed Ali', '0500000001'),
  ('guest-002', 'Sara Nasser', '0500000002');

INSERT INTO dbo.Room (id, number, type, status)
VALUES
  ('room-101', '101', 'STANDARD', 'AVAILABLE'),
  ('room-202', '202', 'DELUXE', 'AVAILABLE');

INSERT INTO dbo.Reservation (id, guestId, roomId, checkIn, checkOut, status, updatedAt)
VALUES
  ('res-001', 'guest-001', 'room-101', DATEADD(day, 1, SYSUTCDATETIME()), DATEADD(day, 4, SYSUTCDATETIME()), 'CREATED', SYSUTCDATETIME()),
  ('res-002', 'guest-002', 'room-202', DATEADD(day, 2, SYSUTCDATETIME()), DATEADD(day, 5, SYSUTCDATETIME()), 'CONFIRMED', SYSUTCDATETIME());

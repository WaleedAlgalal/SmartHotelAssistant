BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[Reservation] (
    [id] NVARCHAR(1000) NOT NULL,
    [guestId] NVARCHAR(1000) NOT NULL,
    [roomId] NVARCHAR(1000) NOT NULL,
    [checkIn] DATETIME2 NOT NULL,
    [checkOut] DATETIME2 NOT NULL,
    [status] NVARCHAR(1000) NOT NULL CONSTRAINT [Reservation_status_df] DEFAULT 'CREATED',
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [Reservation_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [Reservation_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[Guest] (
    [id] NVARCHAR(1000) NOT NULL,
    [name] NVARCHAR(1000) NOT NULL,
    [phone] NVARCHAR(1000),
    CONSTRAINT [Guest_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[Room] (
    [id] NVARCHAR(1000) NOT NULL,
    [number] NVARCHAR(1000) NOT NULL,
    [type] NVARCHAR(1000) NOT NULL,
    [status] NVARCHAR(1000) NOT NULL CONSTRAINT [Room_status_df] DEFAULT 'AVAILABLE',
    CONSTRAINT [Room_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- AddForeignKey
ALTER TABLE [dbo].[Reservation] ADD CONSTRAINT [Reservation_guestId_fkey] FOREIGN KEY ([guestId]) REFERENCES [dbo].[Guest]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Reservation] ADD CONSTRAINT [Reservation_roomId_fkey] FOREIGN KEY ([roomId]) REFERENCES [dbo].[Room]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH

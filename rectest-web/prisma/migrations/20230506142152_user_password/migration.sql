BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[UserPassword] (
    [user_id] NVARCHAR(1000) NOT NULL,
    [password_hash] NVARCHAR(1000) NOT NULL,
    CONSTRAINT [UserPassword_pkey] PRIMARY KEY CLUSTERED ([user_id])
);

-- AddForeignKey
ALTER TABLE [dbo].[UserPassword] ADD CONSTRAINT [UserPassword_user_id_fkey] FOREIGN KEY ([user_id]) REFERENCES [dbo].[User]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH

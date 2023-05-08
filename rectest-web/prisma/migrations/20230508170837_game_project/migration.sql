BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[GameProject] (
    [id] NVARCHAR(1000) NOT NULL,
    [name] NVARCHAR(1000) NOT NULL,
    [apiKey] NVARCHAR(1000) NOT NULL,
    [insertDate] DATETIME2 NOT NULL CONSTRAINT [GameProject_insertDate_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [GameProject_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [GameProject_apiKey_key] UNIQUE NONCLUSTERED ([apiKey])
);

-- CreateTable
CREATE TABLE [dbo].[GameProjectMember] (
    [gameProjectId] NVARCHAR(1000) NOT NULL,
    [userId] NVARCHAR(1000) NOT NULL,
    [accessLevel] NVARCHAR(1000) NOT NULL CONSTRAINT [GameProjectMember_accessLevel_df] DEFAULT 'Admin',
    CONSTRAINT [GameProjectMember_pkey] PRIMARY KEY CLUSTERED ([gameProjectId],[userId])
);

-- AddForeignKey
ALTER TABLE [dbo].[GameProjectMember] ADD CONSTRAINT [GameProjectMember_gameProjectId_fkey] FOREIGN KEY ([gameProjectId]) REFERENCES [dbo].[GameProject]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[GameProjectMember] ADD CONSTRAINT [GameProjectMember_userId_fkey] FOREIGN KEY ([userId]) REFERENCES [dbo].[User]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH

BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[TestRun] (
    [id] NVARCHAR(1000) NOT NULL,
    [total] INT NOT NULL,
    [success] INT NOT NULL,
    [Failed] INT NOT NULL,
    [gameProjectId] NVARCHAR(1000) NOT NULL,
    [insertDate] DATETIME2 NOT NULL CONSTRAINT [TestRun_insertDate_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [TestRun_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[TestResult] (
    [id] NVARCHAR(1000) NOT NULL,
    [testRunId] NVARCHAR(1000) NOT NULL,
    [testFile] NVARCHAR(1000) NOT NULL,
    [isSuccess] BIT NOT NULL,
    [errorMessage] NVARCHAR(1000),
    [recordingFileBase64] NVARCHAR(1000) NOT NULL,
    CONSTRAINT [TestResult_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- AddForeignKey
ALTER TABLE [dbo].[TestRun] ADD CONSTRAINT [TestRun_gameProjectId_fkey] FOREIGN KEY ([gameProjectId]) REFERENCES [dbo].[GameProject]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[TestResult] ADD CONSTRAINT [TestResult_testRunId_fkey] FOREIGN KEY ([testRunId]) REFERENCES [dbo].[TestRun]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH

/*
  Warnings:

  - You are about to drop the column `Failed` on the `TestRun` table. All the data in the column will be lost.
  - Added the required column `failed` to the `TestRun` table without a default value. This is not possible if the table is not empty.

*/
BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[TestRun] DROP COLUMN [Failed];
ALTER TABLE [dbo].[TestRun] ADD [failed] INT NOT NULL;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH

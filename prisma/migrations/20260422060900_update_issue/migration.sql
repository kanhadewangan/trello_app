/*
  Warnings:

  - Added the required column `label` to the `githubIssue` table without a default value. This is not possible if the table is not empty.
  - Added the required column `source` to the `githubIssue` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sourceId` to the `githubIssue` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `githubIssue` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "githubIssue" ADD COLUMN     "label" TEXT NOT NULL,
ADD COLUMN     "source" TEXT NOT NULL,
ADD COLUMN     "sourceId" INTEGER NOT NULL,
ADD COLUMN     "status" TEXT NOT NULL;

/*
  Warnings:

  - Added the required column `data` to the `notifications` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "notifications" ADD COLUMN     "data" TEXT NOT NULL;

/*
  Warnings:

  - Added the required column `prev_month` to the `StoredOperations` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "StoredOperations" ADD COLUMN     "prev_month" TIMESTAMPTZ NOT NULL;

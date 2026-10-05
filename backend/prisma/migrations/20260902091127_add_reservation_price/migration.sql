/*
  Warnings:

  - Added the required column `pricePerNight` to the `Reservation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalPrice` to the `Reservation` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Reservation" ADD COLUMN     "pricePerNight" INTEGER NOT NULL,
ADD COLUMN     "totalPrice" INTEGER NOT NULL;

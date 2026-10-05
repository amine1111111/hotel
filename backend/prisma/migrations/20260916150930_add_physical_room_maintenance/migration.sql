-- DropIndex
DROP INDEX "Reservation_checkIn_checkOut_idx";

-- DropIndex
DROP INDEX "Reservation_physicalRoomId_idx";

-- AlterTable
ALTER TABLE "PhysicalRoom" ADD COLUMN     "maintenance" BOOLEAN NOT NULL DEFAULT false;

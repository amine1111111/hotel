generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
}

model RoomType {
  id            String   @id
  type          String
  category      String

  name          String
  description   String

  size          Int
  pricePerNight Int

  maxAdults     Int
  maxChildren   Int
  maxGuests     Int

  bedType       String
  bedQuantity   Int
  bedSleeps     Int

  amenities     String[]

  heroImg       String
  roomCard      String
  roomImg       String

  rooms         PhysicalRoom[]

  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
}

model PhysicalRoom {
  id          String   @id
  roomNumber  String

  roomTypeId  String
  roomType RoomType @relation(fields: [roomTypeId], references: [id])

  reservations Reservation[]

  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@unique([roomTypeId, roomNumber])
  @@index([roomTypeId])
}

model Reservation {
  id              String        @id @default(cuid())

  physicalRoomId  String
physicalRoom PhysicalRoom @relation(fields: [physicalRoomId], references: [id])

  checkIn         DateTime
  checkOut        DateTime

  adults          Int
  children        Int

  guestName       String
  guestEmail      String
  guestPhone      String

    pricePerNight   Int
      totalPrice      Int

  status          ReservationStatus @default(PENDING)

  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  @@index([physicalRoomId])
  @@index([checkIn, checkOut])
}

enum ReservationStatus {
  PENDING
  CONFIRMED
  CANCELLED
  COMPLETED
}




model Admin {
  id        String   @id @default(cuid())

  email     String   @unique

  password  String

  createdAt DateTime @default(now())

  updatedAt DateTime @updatedAt
}
import 'dotenv/config'
import pkg from '@prisma/client'
const { PrismaClient } = pkg

import { PrismaPg } from '@prisma/adapter-pg'

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
})

const prisma = new PrismaClient({
  adapter,
})

const roomTypes = [
  {
    id: 'standard-single',
    displayOrder: 1,
    type: 'room',
    category: 'standard',
    name: 'Standard Single',
    description:
      'Chambre confortable et chaleureuse pour 1 personne, idéale pour les séjours d’affaires ou de courte durée.',
    size: 28,
    pricePerNight: 11500,

    maxAdults: 1,
    maxChildren: 0,
    maxGuests: 1,

    bedType: 'single',
    bedQuantity: 1,
    bedSleeps: 1,

    amenities: [
      'wifi',
      'tv',
      'ac',
      'bathroom',
    ],

    heroImg: '/images/rooms/standard-single.webp',
    roomCard: '/images/rooms/standard-single.webp',
    roomImg: '/images/rooms/standard-single.webp',
  },

  {
    id: 'standard-double',
    displayOrder: 2,
    type: 'room',
    category: 'standard',
    name: 'Standard Double',
    description:
      'Chambre spacieuse et chaleureuse pour 2 adultes, avec la possibilité d’accueillir un enfant.',
    size: 28,
    pricePerNight: 12500,

    maxAdults: 2,
    maxChildren: 1,
    maxGuests: 3,

    bedType: 'double',
    bedQuantity: 1,
    bedSleeps: 2,

    amenities: [
      'wifi',
      'tv',
      'ac',
      'bathroom',
    ],

    heroImg: '/images/rooms/standard-double.webp',
    roomCard: '/images/rooms/standard-double.webp',
    roomImg: '/images/rooms/standard-double.webp',
  },

  {
    id: 'executive-sea-view',
    displayOrder: 3,
    type: 'room',
    category: 'executive',
    name: 'Sea View',
    description:
      'Suite élégante avec une vue exceptionnelle sur la mer, idéale pour un séjour confortable et paisible.',
    size: 38,
    pricePerNight: 22500,

    maxAdults: 2,
    maxChildren: 0,
    maxGuests: 2,

    bedType: 'king',
    bedQuantity: 1,
    bedSleeps: 2,

    amenities: [
      'wifi',
      'tv',
      'ac',
      'terrace',
      'jacuzzi',
      'seaView',
      'miniBar',
      'butler',
    ],

    heroImg: '/images/rooms/Sea View.webp',
    roomCard: '/images/rooms/Sea View.webp',
    roomImg: '/images/rooms/Sea View.webp',
  },

  {
    id: 'deluxe-sea-view',
    displayOrder: 4,
    type: 'room',
    category: 'deluxe',
    name: 'Deluxe Suite',
    description:
      'Suite spacieuse avec salon clic-clac et une magnifique vue sur la mer, idéale pour un séjour en famille.',
    size: 58,
    pricePerNight: 24500,

    maxAdults: 2,
    maxChildren: 1,
    maxGuests: 3,

    bedType: 'king',
    bedQuantity: 1,
    bedSleeps: 2,

    amenities: [
      'wifi',
      'tv',
      'ac',
      'terrace',
      'jacuzzi',
      'seaView',
      'miniBar',
      'butler',
    ],

    heroImg: '/images/rooms/Deluxe Suite.webp',
    roomCard: '/images/rooms/Deluxe Suite.webp',
    roomImg: '/images/rooms/Deluxe Suite.webp',
  },

  {
    id: 'honeymoon-package',
    displayOrder: 5,
    type: 'package',
    category: 'special',
    name: 'Pack Nuit de Noces',
    description:
      'Célébrez votre lune de miel avec des prestations exceptionnelles. Prix fixe toute l’année.',
    size: 120,
    pricePerNight: 27500,

    maxAdults: 2,
    maxChildren: 0,
    maxGuests: 2,

    bedType: 'king',
    bedQuantity: 2,
    bedSleeps: 4,

    amenities: [
      'wifi',
      'tv',
      'ac',
      'terrace80m',
      'jacuzzi',
      'seaView',
      'butler',
      'breakfastIncluded',
    ],

    heroImg: '/images/rooms/Pack Nuit de Noces.webp',
    roomCard: '/images/rooms/Pack Nuit de Noces.webp',
    roomImg: '/images/rooms/Pack Nuit de Noces.webp',
  },
]
const roomsPerType = {
  'standard-single': ['101', '102', '103', '104', '105'],
  'standard-double': ['201', '202', '203', '204', '205'],
  'executive-sea-view': ['301', '302', '303', '304', '305'],
  'deluxe-sea-view': ['401', '402', '403', '404', '405'],
  'honeymoon-package': ['501', '502', '503', '504', '505'],
}

async function main() {
  for (const roomType of roomTypes) {
    await prisma.roomType.upsert({
      where: {
        id: roomType.id,
      },
      update: roomType,
      create: roomType,
    })
  }

  for (const [roomTypeId, roomNumbers] of Object.entries(
    roomsPerType
  )) {
    for (const roomNumber of roomNumbers) {
      await prisma.physicalRoom.upsert({
        where: {
          id: `${roomTypeId}-${roomNumber}`,
        },
        update: {
          roomNumber,
          roomTypeId,
        },
        create: {
          id: `${roomTypeId}-${roomNumber}`,
          roomNumber,
          roomTypeId,
        },
      })
    }
  }

  console.log('Database seeded successfully.')
}

main()
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
  
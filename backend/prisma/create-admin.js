import 'dotenv/config'
// NEW: Import bcrypt so we can securely hash the admin password.
import bcrypt from 'bcrypt'

// NEW: Import the existing Prisma client.
import prisma from '../src/db/prisma.js'

// NEW: Create the first administrator account.
const createAdmin = async () => {

   const email = process.env.ADMIN_EMAIL
  const password = process.env.ADMIN_PASSWORD

  try {
    // NEW: Check whether an administrator with this email already exists.
    const existingAdmin = await prisma.admin.findUnique({
      where: {
        email,
      },
    })

    // NEW: Stop the script if this admin account already exists.
    if (existingAdmin) {
      console.log('Admin account already exists.')
      return
    }

    // NEW: Convert the plain-text password into a secure bcrypt hash.
    const hashedPassword = await bcrypt.hash(password, 12)

    // NEW: Create the administrator in PostgreSQL.
    const admin = await prisma.admin.create({
      data: {
        email,
        password: hashedPassword,
      },
    })

    // NEW: Confirm that the administrator was created successfully.
    console.log('Admin account created successfully.')
    console.log(`Admin email: ${admin.email}`)
  } catch (error) {
    // NEW: Show any error that happened while creating the admin.
    console.error('Failed to create admin:', error)
  } finally {
    // NEW: Close the Prisma database connection.
    await prisma.$disconnect()
  }
}

// NEW: Run the admin creation function.
createAdmin()
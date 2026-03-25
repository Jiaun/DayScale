import { PrismaClient } from '../src/generated/prisma/client.js'

import { PrismaMariaDb } from '@prisma/adapter-mariadb'
const adapter = new PrismaMariaDb({
  host: 'localhost',
  port: 3306,
  connectionLimit: 5,
})

const prisma = new PrismaClient({ adapter })

async function main() {}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

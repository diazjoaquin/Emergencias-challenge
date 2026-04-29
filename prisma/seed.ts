import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL })
const prisma = new PrismaClient({ adapter })

const phoneTypes = ['mobile', 'home', 'work']

async function main() {
  for (const typeName of phoneTypes) {
    await prisma.phoneType.upsert({
      where: { typeName },
      update: {},
      create: { typeName },
    })
  }
  console.log('Seed completed: PhoneType records created.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())

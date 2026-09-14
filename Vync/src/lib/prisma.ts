import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '@/generated/prisma/client'

declare global {
  var prisma: PrismaClient | undefined
}

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL })

export const client = globalThis.prisma || new PrismaClient({ adapter })

if (process.env.NODE_ENV !== 'production') globalThis.prisma = client

import { PrismaMariaDb } from '@prisma/adapter-mariadb'

import { PrismaClient } from '@/generated/prisma/client'

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined }

const adapter = new PrismaMariaDb({
  host: process.env.DATABASE_HOST,
  port: Number(process.env.DATABASE_PORT),
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  connectionLimit: process.env.NODE_ENV === 'production' ? 20 : 5

  // connectTimeout: 30000,
  // acquireTimeout: 30000,
  // idleTimeout: 60000,
  // keepAliveDelay: 10000
})

export const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

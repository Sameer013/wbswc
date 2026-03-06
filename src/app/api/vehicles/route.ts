import { NextResponse } from 'next/server'

import { prisma } from '@/libs/prisma'

export async function GET() {
  try {
    const users = await prisma.users.findMany()

    return NextResponse.json({ success: true, data: users }, { status: 200 })
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Failed to fetch users' }, { status: 500 })
  }
}

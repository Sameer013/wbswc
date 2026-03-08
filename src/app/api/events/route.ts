import { NextResponse as res } from 'next/server'

import { prisma } from '@/libs/prisma'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { type, timestamp, value } = body

    if (!type || !timestamp || !value) {
      return res.json({ error: 'Missing required type, timestamp fields' }, { status: 400 })
    }

    const eventType = await prisma.event_type.findUnique({
      where: { eventType: type }
    })

    if (!eventType) {
      return res.json({ error: `Invalid event type: ${type}` }, { status: 400 })
    }

    const localTimestamp = timestamp.replace(' ', 'T') + '.000Z'

    const eventMaster = await prisma.eventmaster.create({
      data: {
        eventId: eventType.eventId,
        eventTimestamp: localTimestamp,

        value: value

        // eventTimestamp: timestamp
      }
    })

    return res.json({ success: true, data: eventMaster }, { status: 201 })
  } catch (error) {
    console.error('Full error:', error)

    return res.json(
      {
        error: `Failed to insert new event`,
        msg: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    )
  }
}

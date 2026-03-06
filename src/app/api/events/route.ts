import { NextResponse as res } from 'next/server'

import { prisma } from '@/libs/prisma'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { type, timestamp, value } = body

    if (!type || !timestamp || !value) {
      return res.json({ error: 'Missing required type, timestamp fields' }, { status: 400 })
    }

    const eventType = await prisma.event_Type.findUnique({
      where: { eventType: type }
    })

    if (!eventType) {
      return res.json({ error: `Invalid event type: ${type}` }, { status: 400 })
    }

    const eventMaster = await prisma.eventMaster.create({
      data: {
        eventId: eventType.eventId,

        eventTimestamp: new Date(timestamp),
        value: value

        // eventTimestamp: timestamp
      }
    })

    console.log('Inserted Time:', timestamp)

    console.log('Inserted eventMaster:', eventMaster)

    return res.json({ success: true, data: eventMaster }, { status: 201 })
  } catch (error) {
    return res.json({ error: `Failed to insert new event: ${error}` }, { status: 500 })
  }
}

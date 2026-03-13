import { NextResponse as res } from 'next/server'

import { prisma } from '@/libs/prisma'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { type, timestamp, location, severity, description } = body

    if (!type || !timestamp || !location || !severity || !description) {
      return res.json({ error: 'Missing required fields!' }, { status: 400 })
    }

    const localTimestamp = timestamp.replace(' ', 'T') + '.000Z'

    const result = await prisma.$transaction(async tx => {
      const eventType = await tx.event_type.findUnique({
        where: { eventType: type }
      })

      if (!eventType) {
        throw new Error(`Invalid event type: ${type}`)
      }

      console.log(eventType)

      const eventMaster = await tx.eventmaster.create({
        data: {
          eventId: eventType.eventId,
          eventTimestamp: localTimestamp,
          value: '1'
        }
      })

      console.log(eventMaster)

      const intrusionEvent = await tx.intrusionevent.create({
        data: {
          eventMasterId: eventMaster.id,
          description: description,
          location: location,
          severity: severity
        }
      })

      console.log(intrusionEvent)

      console.log('Inserted eventMaster:', eventMaster)
      console.log('Inserted intrusionEvent:', intrusionEvent)

      return { eventMaster, intrusionEvent }
    })

    return res.json({ success: true, data: result }, { status: 201 })
  } catch (error) {
    console.log(`Error:${error}`)

    return res.json({ error: `Failed to insert new event` }, { status: 500 })
  }
}

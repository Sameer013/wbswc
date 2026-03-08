import { NextResponse as res } from 'next/server'

import { prisma } from '@/libs/prisma'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { type, vehicle_no, vehicle_wt, timestamp, value } = body

    if (!type || !timestamp || !value || !vehicle_no || !vehicle_wt) {
      return res.json({ error: 'Missing required type, timestamp, or vehicle fields' }, { status: 400 })
    }

    const localTimestamp = timestamp.replace(' ', 'T') + '.000Z'

    const result = await prisma.$transaction(async tx => {
      const eventType = await tx.event_type.findUnique({
        where: { eventType: type }
      })

      if (!eventType) {
        throw new Error(`Invalid event type: ${type}`)
      }

      const eventMaster = await tx.eventmaster.create({
        data: {
          eventId: eventType.eventId,
          eventTimestamp: localTimestamp,
          value: `${vehicle_no}, ${vehicle_wt}`
        }
      })

      const anprEvent = await tx.anprevent.create({
        data: {
          eventMasterId: eventMaster.id,
          vehicleNo: vehicle_no,
          vehicleWt: parseFloat(vehicle_wt)
        }
      })

      console.log('Inserted eventMaster:', eventMaster)
      console.log('Inserted anprEvent:', anprEvent)

      return { eventMaster, anprEvent }
    })

    return res.json({ success: true, data: result }, { status: 201 })
  } catch (error) {
    return res.json({ error: `Failed to insert new event` }, { status: 500 })
  }
}

import { NextResponse as res } from 'next/server'

import { prisma } from '@/libs/prisma'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { type, vehicle_no, vehicle_wt, timestamp, value } = body

    if (!type || !timestamp || !value || !vehicle_no || !vehicle_wt) {
      return res.json({ error: 'Missing required type, timestamp, or vehicle fields' }, { status: 400 })
    }

    const result = await prisma.$transaction(async tx => {
      const eventType = await tx.event_Type.findUnique({
        where: { eventType: type }
      })

      if (!eventType) {
        throw new Error(`Invalid event type: ${type}`)
      }

      const eventMaster = await tx.eventMaster.create({
        data: {
          eventId: eventType.eventId,
          eventTimestamp: new Date(timestamp),
          value: `${vehicle_no}, ${vehicle_wt}`
        }
      })

      const anprEvent = await tx.anprEvent.create({
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
    return res.json({ error: `Failed to insert new event: ${error}` }, { status: 500 })
  }
}

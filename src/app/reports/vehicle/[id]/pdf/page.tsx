// import { prisma } from '@/libs/prisma'

import PDFButton from '@/components/PDFButton'

// import PdfClient from './PdfClient'
import { getReportData } from '@/app/server/action'

export default async function VehiclePdfPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const eventId = parseInt(id, 10)

  if (isNaN(eventId)) {
    return (
      <div className='flex h-screen items-center justify-center p-6'>
        <div className='rounded-lg bg-red-50 p-4 text-red-800'>Invalid Event ID format.</div>
      </div>
    )
  }

  const events = await getReportData(undefined, undefined, 20)

  // Fetch data
  // const event = await prisma.eventmaster.findUnique({
  //   where: { id: eventId },
  //   include: {
  //     anprevent: true,
  //     event_type: true
  //   }
  // })

  const event = Array.isArray(events) ? events[0] : events

  console.log('Fetched Event:', event.id, event ? 'Event found' : 'Event not found')

  if (!event || !event.id) {
    return (
      <div className='flex h-screen items-center justify-center p-6'>
        <div className='rounded-lg bg-red-50 p-4 text-red-800'>Event ID not found.</div>
      </div>
    )
  }

  // const recordStr = {
  //   id: event.id,
  //   entry_time:
  //   eventType: event.event_type.eventType,
  //   eventTimestamp: event.eventTimestamp.toISOString(),
  //   vehicleNo: event.anprevent.updated_vehicleNo ? event.anprevent.updated_vehicleNo : event.anprevent.vehicleNo,
  //   vehicleWt: event.anprevent.vehicleW
  // }

  // return <PdfClient record={recordStr} />
  return <PDFButton record={event} />
}

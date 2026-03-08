import { notFound } from 'next/navigation'

// import dynamic from 'next/dynamic'

import { prisma } from '@/libs/prisma'

import PdfViewerClient from './PdfViewerClient'

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

  // Fetch dataq
  const event = await prisma.eventmaster.findUnique({
    where: { id: eventId },
    include: {
      anprevent: true,
      event_type: true
    }
  })

  // If the event or vehicle record doesn't exist, show 404
  if (!event || !event.anprevent) {
    return (
      <div className='flex h-screen items-center justify-center p-6'>
        <div className='rounded-lg bg-red-50 p-4 text-red-800'>Event ID not found.</div>
      </div>
    )
  }

  const recordStr = {
    id: event.id,
    eventType: event.event_type.eventType,
    eventTimestamp: event.eventTimestamp.toISOString(),
    vehicleNo: event.anprevent.vehicleNo,
    vehicleWt: event.anprevent.vehicleWt
  }

  return <PdfViewerClient record={recordStr} />
}

import { prisma } from '@/libs/prisma'

import PdfClient from './PdfClient'

export default async function Page({ searchParams }: { searchParams: Promise<{ from: string, to: string }> }) {
 
  const { from, to } = await searchParams // to access ?from=${fromDate}&to=${toDate} in url

  if (!from || !to) {
    return (
      <div className='flex h-screen items-center justify-center p-6'>
        <div className='rounded-lg bg-red-50 p-4 text-red-800'>Invalid Date Range provided.</div>
      </div>
    )
  }

  const fromDate = new Date(from)
  const toDate = new Date(to)

  // Add 1 day to the 'to' date to make the range inclusive of the whole day
  toDate.setDate(toDate.getDate() + 1)

  if (isNaN(fromDate.getTime()) || isNaN(toDate.getTime())) {
    return (
      <div className='flex h-screen items-center justify-center p-6'>
        <div className='rounded-lg bg-red-50 p-4 text-red-800'>Invalid Date Format.</div>
      </div>
    )
  }

  // Fetch all events
  const events = await prisma.eventmaster.findMany({
    where: {
      eventTimestamp: {
        gte: fromDate,
        lt: toDate
      }
    },
    
    // distinct: ['eventTimestamp'],
    include: {
      anprevent: true,
      event_type: true
    },
    orderBy: {
      eventTimestamp: 'asc' 
    }
  })

 
  const formattedRecords = events.map(event => ({
    id: event.id,
    eventType: event.event_type?.eventType || 'Unknown',
    eventTimestamp: event.eventTimestamp, 
    vehicleNo: event.anprevent?.vehicleNo || '-',
    vehicleWt: event.anprevent?.vehicleWt || null
  }))

  return <PdfClient records={formattedRecords} fromDate={from} toDate={to} />
}

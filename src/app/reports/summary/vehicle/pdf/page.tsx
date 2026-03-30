import { prisma } from '@/libs/prisma'

import PdfClient from './PdfClient'

import { convertUTCtoLocalTime } from '@/utils/functions'

export default async function Page({ searchParams }: { searchParams: Promise<{ from: string; to: string }> }) {
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
  // const events = await prisma.eventmaster.findMany({
  //   where: {
  //     eventTimestamp: {
  //       gte: fromDate,
  //       lt: toDate
  //     }
  //   },

  //   // distinct: ['eventTimestamp'],
  //   include: {
  //     anprevent: true,
  //     event_type: true
  //   },
  //   orderBy: {
  //     eventTimestamp: 'asc'
  //   }
  // })

  const events2 = await prisma.vehicle_cycle.findMany({
    where: {
      cycle_date: {
        gte: fromDate,
        lt: toDate
      }
    },
    orderBy: {
      cycle_date: 'asc'
    }
  })

  // const formattedRecords = events.map(event => {
  //   return {
  //     id: event.id,
  //     eventType: event.event_type?.eventType || 'Unknown',
  //     eventTimestamp: convertUTCtoLocalTime(event.eventTimestamp), // UTC time that is coming from Prisma is in UTC format, so function to convert it to local timezone
  //     vehicleNo: event.anprevent?.vehicleNo || '-',
  //     vehicleWt: event.anprevent?.vehicleWt || null
  //   }
  // })

  const formattedRecords2 = events2.map(event => {
    return {
      id: event.id,
      vehicleNo: event.vehicleNo || 0,
      entry_time: convertUTCtoLocalTime(event.entry_time),
      weight_time: convertUTCtoLocalTime(event.weight_time),
      exit_time: convertUTCtoLocalTime(event.exit_time),
      weight: event.weight || null,
      cycle_date: event.cycle_date,
      created_at: convertUTCtoLocalTime(event.created_at),
      total_minutes: event.total_minutes
    }
  })

  console.log(formattedRecords2)

  return <PdfClient records={formattedRecords2} fromDate={from} toDate={to} />
}

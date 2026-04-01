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

  const events2 = await prisma.v_report.findMany({
    where: {
      event_date: {
        gte: fromDate,
        lt: toDate
      }
    },
    orderBy: {
      event_date: 'asc'
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

  // console.log(events2)

  const formattedRecords2 = events2.map((event, index) => {
    return {
      id: index + 1,
      vehicleNo: event.vehicleNo || 0,
      entry_time: convertUTCtoLocalTime(event.entry_time),
      exit_time: convertUTCtoLocalTime(event.exit_time),
      tear_wt_time: convertUTCtoLocalTime(event.tear_wt_time),
      gross_wt_time: convertUTCtoLocalTime(event.gross_wt_time),
      tear_wt: event.tear_wt || 0,
      gross_wt: event.gross_wt || 0,
      net_wt: event.net_wt || 0,
      event_date: convertUTCtoLocalTime(event.event_date)
    }
  })

  // console.log(formattedRecords2)

  return <PdfClient records={formattedRecords2} fromDate={from} toDate={to} />
}

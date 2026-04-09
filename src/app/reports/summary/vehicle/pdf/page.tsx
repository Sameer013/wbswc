// import { get } from 'node:http'

// import { prisma } from '@/libs/prisma'

import PdfClient from './PdfClient'

// import { convertUTCtoLocalTime } from '@/utils/functions'
import { getReportData } from '@/app/server/action'

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

  // const events2 = await prisma.v_report.findMany({
  //   where: {
  //     event_date: {
  //       gte: fromDate,
  //       lt: toDate
  //     }
  //   },
  //   orderBy: {
  //     event_date: 'asc'
  //   }
  // })
  const events2 = await getReportData(fromDate, toDate, undefined, 'asc')

  // console.log(events2)

  const formattedRecords2 = events2.map((event, index) => {
    // return {
    //   id: index + 1,
    //   vehicleNo: event.vehicleNo || 0,
    //   entry_time: convertUTCtoLocalTime(event.entry_time),
    //   exit_time: convertUTCtoLocalTime(event.exit_time),
    //   tare_wt_time: convertUTCtoLocalTime(event.tare_wt_time),
    //   gross_wt_time: convertUTCtoLocalTime(event.gross_wt_time),
    //   tare_wt: event.tare_wt || 0,
    //   gross_wt: event.gross_wt || 0,
    //   net_wt: event.net_wt || 0,
    //   event_date: convertUTCtoLocalTime(event.event_date)
    // }
    return {
      id: index + 1,
      vehicleNo: event.vehicleNo || 0,
      entry_time: event.entry_time,
      exit_time: event.exit_time,
      tare_wt_time: event.tare_wt_time,
      gross_wt_time: event.gross_wt_time,
      tare_wt: event.tare_wt || 0,
      gross_wt: event.gross_wt || 0,
      net_wt: event.net_wt ?? null,
      event_date: event.event_date
    }
  })

  // console.log(formattedRecords2)

  return <PdfClient records={formattedRecords2} fromDate={from} toDate={to} />
}

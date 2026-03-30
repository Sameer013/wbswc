'use client'

import dynamic from 'next/dynamic'

// We are using dynamic import with ssr: false to prevent the PDFViewer component from being rendered on the server (SSR).
const PDFViewer = dynamic(() => import('@react-pdf/renderer').then(mod => mod.PDFViewer), { ssr: false })

import VehicleSummaryReport from '@/components/reports/VehicleSummaryReport'
import type { EventSummaryRecord2 } from '@/components/reports/VehicleSummaryReport'

export default function PdfClient({
  records,
  fromDate,
  toDate
}: {
  records: EventSummaryRecord2[]
  fromDate: string
  toDate: string
}) {
  // Convert the ISO string dates back into true Date objects for the PDF renderer
  // const safeRecords = records.map(record => ({
  //   ...record,

  //   // eventTimestamp: new Date(record.eventTimestamp)
  //   eventTimestamp: record.eventTimestamp
  // }))

  return (
    <div className='flex h-screen w-full flex-col'>
      <PDFViewer className='min-h-screen w-full border-none'>
        <VehicleSummaryReport records={records} fromDate={fromDate} toDate={toDate} />
      </PDFViewer>
    </div>
  )
}

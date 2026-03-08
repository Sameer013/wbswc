'use client'

import dynamic from 'next/dynamic'

import VehicleReport from '@/components/reports/VehicleReport'

// We are using dynamic import with ssr: false to prevent the PDFViewer component from being rendered on the server (SSR).

const PDFViewer = dynamic(
  () => import('@react-pdf/renderer').then(mod => mod.PDFViewer),
  { ssr: false }
)

export type EventRecordStr = {
  id: number
  eventType: string
  eventTimestamp: string
  vehicleNo: string
  vehicleWt: number | null
}

export default function PdfClient({ record }: { record: EventRecordStr }) {
  // Convert serialized string back to Date for the PDF document
  const safeRecord = {
    ...record,
    eventTimestamp: new Date(record.eventTimestamp)
  }

  return (
    <div className='flex h-screen w-full flex-col'>
      <PDFViewer className='min-h-screen w-full border-none'>
        <VehicleReport record={safeRecord} />
      </PDFViewer>
    </div>
  )
}

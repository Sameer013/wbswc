'use client'

// import { useEffect, useRef, useState } from 'react'

import dynamic from 'next/dynamic'

import VehicleReport from '@/components/reports/VehicleReport'

const PDFViewer = dynamic(() => import('@react-pdf/renderer').then(mod => mod.PDFViewer), { ssr: false })

import type { EventSummaryRecord2 } from '@/components/reports/VehicleSummaryReport'

export default function PdfClient({ record }: { record: EventSummaryRecord2 }) {
  return (
    <div className='flex h-screen w-full flex-col items-center justify-center'>
      <PDFViewer className='min-h-screen w-full border-none'>
        <VehicleReport record={record} />
      </PDFViewer>
    </div>
  )
}

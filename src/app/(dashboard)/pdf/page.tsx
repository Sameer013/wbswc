'use client'

import { useState, useEffect } from 'react'

import { PDFViewer } from '@react-pdf/renderer'

import VehicleReport from '@/components/reports/VehicleReport'

import type { EventSummaryRecord2 } from '@/components/reports/VehicleSummaryReport'

// 1. Define your static dummy data here
// Make sure this matches your actual EventRecord type structure
const DUMMY_RECORD: EventSummaryRecord2 = {
  id: 1,
  vehicleNo: 'WB41G9503',
  entry_time: new Date(),
  exit_time: new Date(),
  tare_wt_time: new Date(),
  gross_wt_time: new Date(),
  tare_wt: 1000,
  gross_wt: 2000,
  net_wt: 1000,
  event_date: new Date(),
  entry_imageId: '162',
  exit_imageId: '163'
}

export default function LiveReportPage() {
  const [isClient, setIsClient] = useState(false)

  // 2. Ensure the PDFViewer only renders on the client side
  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        Loading PDF Viewer...
      </div>
    )
  }

  // 3. Render the PDFViewer filling the whole screen for easy development
  return (
    <div style={{ width: '100%', height: '100vh' }}>
      <PDFViewer width='100%' height='100%'>
        <VehicleReport record={DUMMY_RECORD} />
      </PDFViewer>
    </div>
  )
}

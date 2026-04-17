'use client'

import { useEffect } from 'react'

import { useRouter } from 'next/navigation'

import VehicleSummaryReport from '@/components/reports/VehicleSummaryReport'
import type { EventSummaryRecord2 } from '@/components/reports/VehicleSummaryReport'

interface PdfClientProps {
  records: EventSummaryRecord2[]
  fromDate: string
  toDate: string
}

export default function PdfClient({ records, fromDate, toDate }: PdfClientProps) {
  const router = useRouter()

  useEffect(() => {
    const downloadPdf = async () => {
      const { pdf } = await import('@react-pdf/renderer')

      const blob = await pdf(<VehicleSummaryReport records={records} fromDate={fromDate} toDate={toDate} />).toBlob()

      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')

      a.href = url
      a.download = `vehicle-report-${fromDate}-to-${toDate}.pdf`
      a.click()
      URL.revokeObjectURL(url)

      router.back()
    }

    downloadPdf()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return <></>
}

'use client'

import { useEffect } from 'react'

import { useRouter, useSearchParams } from 'next/navigation'

import type { BagSummaryRecord } from '@/components/reports/BagSummaryReport'
import BagsSummaryReport from '@/components/reports/BagSummaryReport'
import { getBagsCnt } from '@/app/server/action'

export default function Page() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const from = searchParams.get('from')
  const to = searchParams.get('to')

  useEffect(() => {
    if (!from || !to) return

    const fromDate = new Date(from)
    const toDate = new Date(to)

    if (isNaN(fromDate.getTime()) || isNaN(toDate.getTime())) return

    const downloadPdf = async () => {
      const records: BagSummaryRecord[] = await getBagsCnt(fromDate, toDate)

      const { pdf } = await import('@react-pdf/renderer')

      const blob = await pdf(<BagsSummaryReport records={records} fromDate={from} toDate={to} />).toBlob()

      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')

      a.href = url
      a.download = `bags-summary-report-${from}-to-${to}.pdf`
      a.click()
      URL.revokeObjectURL(url)

      router.back()
    }

    downloadPdf()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  if (!from || !to) {
    return (
      <div className='flex h-screen items-center justify-center p-6'>
        <div className='rounded-lg bg-red-50 p-4 text-red-800'>Invalid Date Range provided.</div>
      </div>
    )
  }

  if (isNaN(new Date(from).getTime()) || isNaN(new Date(to).getTime())) {
    return (
      <div className='flex h-screen items-center justify-center p-6'>
        <div className='rounded-lg bg-red-50 p-4 text-red-800'>Invalid Date Format.</div>
      </div>
    )
  }

  return <></>
}

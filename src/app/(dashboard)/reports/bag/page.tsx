'use client'

import { useState } from 'react'

import FilterReport from '@components/FilterReport'

const BagsReport = () => {
  const [loading, setLoading] = useState(false)

  const handleGenerate = async (fromDate: string, toDate: string) => {
    setLoading(true)

    try {
      const { pdf } = await import('@react-pdf/renderer')
      const { default: BagSummaryReport } = await import('@/components/reports/BagSummaryReport')
      const { getBagsCnt } = await import('@/app/server/action')

      const from = new Date(fromDate)
      const to = new Date(toDate)

      to.setDate(to.getDate() + 1)

      const events = await getBagsCnt(from, to)
      const records = events.map((event, index) => ({ ...event, id: index + 1 }))

      const blob = await pdf(<BagSummaryReport records={records} fromDate={fromDate} toDate={toDate} />).toBlob()

      const blobUrl = URL.createObjectURL(blob)
      const a = document.createElement('a')

      a.href = blobUrl
      a.download = `BagsCount-report-${fromDate}-to-${toDate}.pdf`
      a.click()
      URL.revokeObjectURL(blobUrl)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <FilterReport
      cardTitle='Bags Reports'
      cardDesc='Select a date range below to generate Bags Report'
      onGenerate={handleGenerate}
      loading={loading}
    />
  )
}

export default BagsReport

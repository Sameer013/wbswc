'use client'

import { useState } from 'react'

import FilterReport from '@components/FilterReport'

const IntrusionReport = () => {
  const [loading, setLoading] = useState(false)

  const handleGenerate = async (fromDate: string, toDate: string) => {
    setLoading(true)

    try {
      const { pdf } = await import('@react-pdf/renderer')
      const { default: IntrusionReport } = await import('@/components/reports/IntrusionReport')
      const { getIntrusionData } = await import('@/app/server/action')

      const from = new Date(fromDate)
      const to = new Date(toDate)

      const events = await getIntrusionData(from, to)
      const records = events.map((event, index) => ({ ...event, id: index + 1 }))

      const blob = await pdf(<IntrusionReport records={records} fromDate={fromDate} toDate={toDate} />).toBlob()

      const blobUrl = URL.createObjectURL(blob)
      const a = document.createElement('a')

      a.href = blobUrl
      a.download = `Intrusion-report-${fromDate}-to-${toDate}.pdf`
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
      cardTitle='Intrusion Reports'
      cardDesc='Select a date range below to generate Intrusion Report'
      onGenerate={handleGenerate}
      loading={loading}
    />
  )
}

export default IntrusionReport

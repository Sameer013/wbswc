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
      const fromDt = new Date(from.setHours(0, 0, 0, 0))
      const toDt = new Date(to.setHours(23, 59, 59, 999))

      // to.setDate(to.getDate() + 1)

      const events = await getIntrusionData(fromDt, toDt)
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

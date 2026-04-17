'use client'

import React, { useState } from 'react'

import { pdf } from '@react-pdf/renderer'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf'

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
  const [loading, setLoading] = useState(false)

  const handleGeneratePdf = async () => {
    setLoading(true)

    try {
      const doc = <VehicleSummaryReport records={records} fromDate={fromDate} toDate={toDate} />
      const blob = await pdf(doc).toBlob()

      const url = URL.createObjectURL(blob)
      const pdfWindow = window.open(url, '_blank')

      if (!pdfWindow) {
        alert('Please allow popups to view the PDF report.')
      }

      setTimeout(() => URL.revokeObjectURL(url), 120000)
    } catch (error) {
      console.error('PDF Generation Error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='flex h-screen w-full flex-col items-center justify-center'>
      <Button
        variant='outlined'
        startIcon={loading ? <CircularProgress size={18} color='inherit' /> : <PictureAsPdfIcon />}
        size='small'
        disabled={loading}
        onClick={handleGeneratePdf}
        sx={{ minWidth: '120px' }}
      >
        {loading ? 'Wait...' : 'Open PDF'}
      </Button>
    </div>
  )
}

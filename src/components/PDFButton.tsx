'use client'

import React, { useState } from 'react'

import { pdf } from '@react-pdf/renderer'
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'

import VehicleReport from '@/components/reports/VehicleReport'
import { getVehicleImage } from '@/app/server/action'

// Use the exact type that your table row provides
const PDFButton = ({ record }: { record: any }) => {
  const [loading, setLoading] = useState(false)

  const handleGeneratePdf = async () => {
    setLoading(true)

    try {
      // 1. Fetch the raw images from your server action
      // We use the ID already present in your manipulated record
      const entry_img = record.entry_imageId ? await getVehicleImage(record.entry_imageId) : null
      const exit_img = record.exit_imageId ? await getVehicleImage(record.exit_imageId) : null

      // 2. Create a final data object that combines your
      // manipulated row data with the freshly fetched images
      const finalReportData = {
        ...record,
        entry_image: entry_img,
        exit_image: exit_img
      }

      // 3. Generate the PDF instance
      const doc = <VehicleReport record={finalReportData} />
      const blob = await pdf(doc).toBlob()

      // 4. Create and trigger the viewer
      const url = URL.createObjectURL(blob)
      const pdfWindow = window.open(url, '_blank')

      // Safety check for popup blockers
      if (!pdfWindow) {
        alert('Please allow popups to view the PDF report.')
      }

      // Clean up the URL object from memory after the user has likely opened it
      setTimeout(() => URL.revokeObjectURL(url), 60000)
    } catch (error) {
      console.error('PDF Generation Error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button
      variant='outlined'
      startIcon={loading ? <CircularProgress size={18} color='inherit' /> : <PictureAsPdfIcon />}
      size='small'
      disabled={loading}
      onClick={handleGeneratePdf}
      sx={{ minWidth: '90px' }}
    >
      {loading ? 'Wait...' : 'PDF'}
    </Button>
  )
}

export default PDFButton

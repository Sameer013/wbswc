'use client'

import { usePDF } from '@react-pdf/renderer'
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf'
import Button from '@mui/material/Button'

import VehicleReport from '@/components/reports/VehicleReport'
import type { EventRecord } from '@/components/reports/VehicleReport'

const PDFButton = ({ record }: { record: EventRecord }) => {
  const [instance] = usePDF({ document: <VehicleReport record={record} /> })

  return (
    <Button
      variant='outlined'
      startIcon={<PictureAsPdfIcon />}
      size='medium'
      disabled={instance.loading}
      href={instance.url ?? '#'}
      target='_blank'
      rel='noopener noreferrer'
      component='a'
    >
      {instance.loading ? 'Loading...' : 'PDF'}
    </Button>
  )
}

export default PDFButton

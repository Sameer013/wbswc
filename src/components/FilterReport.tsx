'use client'

import { useState } from 'react'

import Grid from '@mui/material/Grid2'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'

interface FilterProps {
  cardTitle: string
  cardDesc: string
  onGenerate: (fromDate: string, toDate: string) => Promise<void>
  loading?: boolean
}

const FilterReport = ({ cardTitle, cardDesc, onGenerate, loading = false }: FilterProps) => {
  const [fromDate, setFromDate] = useState<string>('')
  const [toDate, setToDate] = useState<string>('')
  const [error, setError] = useState<string>('')

  const handleGenerate = async () => {
    setError('')

    if (!fromDate || !toDate) {
      setError('Please select both From and To dates.')

      return
    }

    if (new Date(fromDate) > new Date(toDate)) {
      setError('From Date cannot be later than To Date.')

      return
    }

    await onGenerate(fromDate, toDate)
  }

  return (
    <Grid container spacing={6}>
      <Grid size={{ xs: 12, md: 8, lg: 6 }}>
        <Card>
          <CardHeader title={cardTitle} />
          <CardContent>
            <Typography variant='body2' className='mb-6'>
              {cardDesc}
            </Typography>

            <div className='flex flex-col sm:flex-row gap-4 mb-6'>
              <TextField
                fullWidth
                label='From Date'
                type='date'
                value={fromDate}
                onChange={e => setFromDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                fullWidth
                label='To Date'
                type='date'
                value={toDate}
                onChange={e => setToDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
            </div>

            {error && (
              <Typography color='error' variant='body2' className='mb-4'>
                {error}
              </Typography>
            )}

            <Button
              variant='contained'
              color='primary'
              onClick={handleGenerate}
              disabled={loading}
              startIcon={
                loading ? <CircularProgress size={16} color='inherit' /> : <i className='tabler-file-invoice' />
              }
            >
              {loading ? 'Generating...' : 'Generate PDF'}
            </Button>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}

export default FilterReport

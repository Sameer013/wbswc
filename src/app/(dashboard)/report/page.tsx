'use client'

// MUI Imports
import { useState } from 'react'

import Grid from '@mui/material/Grid2'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'

const ReportPage = () => {
  const [fromDate, setFromDate] = useState<string>('')
  const [toDate, setToDate] = useState<string>('')
  const [error, setError] = useState<string>('')

  const handleGenerate = () => {
    setError('')

    if (!fromDate || !toDate) {
      setError('Please select both From and To dates.')
      
      return
    }

    if (new Date(fromDate) > new Date(toDate)) {
      setError('From Date cannot be later than To Date.')
      
      return
    }
    
    window.open(`/reports/summary/vehicle/pdf?from=${fromDate}&to=${toDate}`, '_blank')
  }

  return (
    <Grid container spacing={6}>
      <Grid size={{ xs: 12, md: 8, lg: 6 }}>
        <Card>
          <CardHeader title='MIS Report' />
          <CardContent>
            <Typography variant='body2' className='mb-6'>
              Select a date range below to generate MIS report.
            </Typography>

            <div className='flex flex-col sm:flex-row gap-4 mb-6'>
              <TextField
                fullWidth
                label='From Date'
                type='date'
                value={fromDate}
                onChange={e => setFromDate(e.target.value)}
                InputLabelProps={{
                  shrink: true
                }}
              />
              <TextField
                fullWidth
                label='To Date'
                type='date'
                value={toDate}
                onChange={e => setToDate(e.target.value)}
                InputLabelProps={{
                  shrink: true
                }}
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
              startIcon={<i className='tabler-file-invoice' />}
            >
              Generate PDF
            </Button>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}

export default ReportPage

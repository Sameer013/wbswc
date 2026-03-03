'use client'

// MUI Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'
import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'

// Components Imports

// Icon Imports
import WarningAmber from '@mui/icons-material/WarningAmber'
import LocationOn from '@mui/icons-material/LocationOn'
import AccessTime from '@mui/icons-material/AccessTime'

import OptionMenu from '@core/components/option-menu'

type DataType = {
  id: number
  title: string
  date: string
  location: string
  severity: 'high' | 'medium' | 'low'
  isNew?: boolean
}

const data: DataType[] = [
  {
    id: 1,
    title: 'Unauthorized Access Detected',
    date: '03-12-2024 02:15:44',
    location: 'WH1',
    severity: 'high',
    isNew: true
  },
  {
    id: 2,
    title: 'Perimeter Breach Alert',
    date: '03-12-2024 04:32:10',
    location: 'Gate B',
    severity: 'high',
    isNew: true
  },
  {
    id: 3,
    title: 'Motion Detected in Restricted Zone',
    date: '03-12-2024 07:48:55',
    location: 'Server Room',
    severity: 'medium'
  },
  { id: 4, title: 'Unauthorized Access Detected', date: '03-12-2024 09:05:30', location: 'WH3', severity: 'high' },
  { id: 5, title: 'Door Forced Open', date: '03-12-2024 11:22:18', location: 'Loading Bay', severity: 'high' },
  { id: 6, title: 'Tailgating Detected', date: '03-12-2024 13:10:05', location: 'Main Entrance', severity: 'medium' },
  { id: 7, title: 'After-Hours Access Attempt', date: '03-12-2024 22:47:33', location: 'WH5', severity: 'medium' },
  {
    id: 8,
    title: 'Badge Authentication Failed',
    date: '03-12-2024 15:55:21',
    location: 'Control Room',
    severity: 'low'
  },
  { id: 9, title: 'Fence Tamper Detected', date: '03-12-2024 17:30:09', location: 'North Perimeter', severity: 'high' },
  {
    id: 10,
    title: 'Unidentified Vehicle in Restricted Area',
    date: '03-12-2024 19:14:47',
    location: 'Parking Zone C',
    severity: 'medium'
  },
  { id: 11, title: 'Camera Obstruction Detected', date: '03-12-2024 20:58:02', location: 'Gate A', severity: 'low' },
  { id: 12, title: 'Multiple Failed Access Attempts', date: '03-12-2024 23:41:59', location: 'WH2', severity: 'high' }
]

const severityColor = (severity: DataType['severity']) => {
  switch (severity) {
    case 'high':
      return 'error'
    case 'medium':
      return 'warning'
    case 'low':
      return 'info'
  }
}

const LiveAlerts = () => {
  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardHeader
        title={
          <Box className='flex items-center gap-2'>
            <Typography variant='h5' fontWeight={600}>
              Intrusion Alerts
            </Typography>
            {/* Pulsing live dot */}
            <Box sx={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <Box
                sx={{
                  width: 10,
                  height: 10,
                  borderRadius: '50%',
                  backgroundColor: 'error.main',
                  '@keyframes ping': {
                    '0%': { transform: 'scale(1)', opacity: 1 },
                    '75%, 100%': { transform: 'scale(2)', opacity: 0 }
                  },
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    inset: 0,
                    borderRadius: '50%',
                    backgroundColor: 'error.main',
                    animation: 'ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite'
                  }
                }}
              />
            </Box>
            <Chip label='LIVE' size='small' color='error' sx={{ height: 18, fontSize: '0.6rem', fontWeight: 700 }} />
          </Box>
        }
        subheader='Total 104 alerts'
        action={<OptionMenu options={['All Alerts', 'High Severity', 'Medium Severity', 'Low Severity']} />}
      />

      <Divider />

      {/* Scrollable list */}
      <CardContent
        sx={{
          flex: 1,
          overflowY: 'auto',
          maxHeight: '67.75vh',
          display: 'flex',
          flexDirection: 'column',
          gap: 0,
          p: 0,
          '&:last-child': { pb: 0 },

          // Custom scrollbar
          '&::-webkit-scrollbar': { width: 4 },
          '&::-webkit-scrollbar-track': { backgroundColor: 'transparent' },
          '&::-webkit-scrollbar-thumb': { backgroundColor: 'divider', borderRadius: 4 }
        }}
      >
        {data.map((item, index) => (
          <Box key={item.id}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 3,
                px: 4,
                py: 3,
                transition: 'background-color 0.2s',
                backgroundColor: item.isNew ? 'action.hover' : 'transparent',
                '&:hover': { backgroundColor: 'action.hover' }
              }}
            >
              {/* Severity Icon */}
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 38,
                  height: 38,
                  borderRadius: '50%',
                  flexShrink: 0,
                  backgroundColor: `${severityColor(item.severity)}.lighterOpacity`
                }}
              >
                <WarningAmber fontSize='small' color={severityColor(item.severity)} />
              </Box>

              {/* Content */}
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Box className='flex items-center justify-between gap-2' sx={{ mb: 0.5 }}>
                  <Typography variant='body2' fontWeight={600} color='text.primary' noWrap sx={{ flex: 1 }}>
                    {item.title}
                  </Typography>
                  {item.isNew && (
                    <Chip
                      label='NEW'
                      size='small'
                      color='error'
                      variant='outlined'
                      sx={{ height: 16, fontSize: '0.55rem', fontWeight: 700, flexShrink: 0 }}
                    />
                  )}
                  <Chip
                    label={item.severity.toUpperCase()}
                    size='small'
                    color={severityColor(item.severity)}
                    sx={{ height: 18, fontSize: '0.6rem', fontWeight: 600, flexShrink: 0 }}
                  />
                </Box>

                <Box className='flex items-center gap-3 flex-wrap'>
                  <Box className='flex items-center gap-1'>
                    <AccessTime sx={{ fontSize: 12, color: 'text.disabled' }} />
                    <Typography variant='caption' color='text.disabled'>
                      {item.date}
                    </Typography>
                  </Box>
                  <Box className='flex items-center gap-1'>
                    <LocationOn sx={{ fontSize: 12, color: 'text.disabled' }} />
                    <Typography variant='caption' color='text.disabled'>
                      {item.location}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Box>

            {index < data.length - 1 && <Divider />}
          </Box>
        ))}
      </CardContent>
    </Card>
  )
}

export default LiveAlerts

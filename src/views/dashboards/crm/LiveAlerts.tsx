'use client'

import { useEffect, useRef, useState, useCallback } from 'react'

// MUI Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'
import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import IconButton from '@mui/material/IconButton'
import CircularProgress from '@mui/material/CircularProgress'
import CloseIcon from '@mui/icons-material/Close'

// Icon Imports
import WarningAmber from '@mui/icons-material/WarningAmber'

// import LocationOn from '@mui/icons-material/LocationOn'
import AccessTime from '@mui/icons-material/AccessTime'

import OptionMenu from '@core/components/option-menu'
import { getIntrusionAlerts } from '@/app/server/action'
import { formatTimestamp } from '@/utils/functions'

export type AlertType = {
  id: number
  description: string | null
  created_at: Date | null
  image: string | null
  location?: string
  severity?: string
  isNew?: boolean
}

const severityColor = (severity: AlertType['severity']) => {
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
  const [alerts, setAlerts] = useState<AlertType[]>([])
  const [newIds, setNewIds] = useState<Set<number>>(new Set())
  const [error, setError] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [loadingImg] = useState(false)
  const [imgUrl, setImgUrl] = useState<string | null>(null)

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const prevIdsRef = useRef<Set<number>>(new Set())

  const loadAlerts = useCallback(async () => {
    try {
      setError(null)
      const data = (await getIntrusionAlerts()) as AlertType[]

      const freshIds = new Set<number>()

      data.forEach(alert => {
        if (!prevIdsRef.current.has(alert.id)) freshIds.add(alert.id)
      })

      prevIdsRef.current = new Set(data.map(a => a.id))
      setNewIds(freshIds)
      setAlerts(data)

      if (freshIds.size > 0) {
        setTimeout(() => setNewIds(new Set()), 10000)
      }
    } catch (err) {
      console.error('Error fetching intrusion alerts:', err)
      setError('Failed to fetch alerts')
    }
  }, [])

  useEffect(() => {
    loadAlerts()
    intervalRef.current = setInterval(loadAlerts, 10_000)

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [loadAlerts])

  const handleCardClick = (image: string | null) => {
    if (!image) return
    setImgUrl(image)
    setIsModalOpen(true)
  }

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardHeader
        title={
          <Box className='flex items-center gap-2'>
            <Typography variant='h5' fontWeight={600}>
              Intrusion Alerts
            </Typography>
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
        subheader={`Total ${alerts.length} alerts`}
        action={<OptionMenu options={['All Alerts', 'High Severity', 'Medium Severity', 'Low Severity']} />}
      />

      <Divider />

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
          '&::-webkit-scrollbar': { width: 4 },
          '&::-webkit-scrollbar-track': { backgroundColor: 'transparent' },
          '&::-webkit-scrollbar-thumb': { backgroundColor: 'divider', borderRadius: 4 }
        }}
      >
        {error ? (
          <Box sx={{ py: 4, textAlign: 'center', px: 4 }}>
            <Typography variant='body2' color='error'>
              {error}
            </Typography>
          </Box>
        ) : alerts.length === 0 ? (
          <Box sx={{ py: 6, textAlign: 'center' }}>
            <Typography variant='body2' color='text.secondary' mt={0.5}>
              No intrusion alerts. System is secure.
            </Typography>
          </Box>
        ) : (
          alerts.map((item, index) => (
            <Box key={item.id}>
              {/* <Box
                sx={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 3,
                  px: 4,
                  py: 3,
                  transition: 'background-color 0.2s',
                  backgroundColor: newIds.has(item.id) ? 'action.hover' : 'transparent',
                  animation: newIds.has(item.id) ? 'slideIn 0.35s ease' : 'none',
                  '@keyframes slideIn': {
                    from: { opacity: 0, transform: 'translateY(-6px)' },
                    to: { opacity: 1, transform: 'translateY(0)' }
                  },
                  '&:hover': { backgroundColor: 'action.hover' }
                }}
              > */}
              <Box
                onClick={() => handleCardClick(item.image)}
                sx={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 3,
                  px: 4,
                  py: 3,
                  cursor: item.image ? 'pointer' : 'default', // ← show pointer only if image exists
                  transition: 'background-color 0.2s',
                  backgroundColor: newIds.has(item.id) ? 'action.hover' : 'transparent',
                  animation: newIds.has(item.id) ? 'slideIn 0.35s ease' : 'none',
                  '@keyframes slideIn': {
                    from: { opacity: 0, transform: 'translateY(-6px)' },
                    to: { opacity: 1, transform: 'translateY(0)' }
                  },
                  '&:hover': { backgroundColor: 'action.hover' }
                }}
              >
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
                  <WarningAmber fontSize='small' color={severityColor(item.severity) as any} />
                </Box>

                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Box className='flex items-center justify-between gap-2' sx={{ mb: 0.5 }}>
                    <Typography variant='body2' fontWeight={600} color='text.primary' noWrap sx={{ flex: 1 }}>
                      {item.description}
                    </Typography>
                    {newIds.has(item.id) && (
                      <Chip
                        label='NEW'
                        size='small'
                        color='error'
                        variant='outlined'
                        sx={{ height: 16, fontSize: '0.55rem', fontWeight: 700, flexShrink: 0 }}
                      />
                    )}
                    <Chip
                      label='MEDIUM'
                      size='small'
                      color={severityColor('medium') as any}
                      sx={{ height: 18, fontSize: '0.6rem', fontWeight: 600, flexShrink: 0 }}
                    />
                  </Box>

                  <Box className='flex items-center gap-3 flex-wrap'>
                    <Box className='flex items-center gap-1'>
                      <AccessTime sx={{ fontSize: 12, color: 'text.disabled' }} />
                      <Typography variant='caption' color='text.disabled'>
                        {item.created_at ? formatTimestamp(item.created_at) : '-'}
                      </Typography>
                    </Box>
                    {/* <Box className='flex items-center gap-1'>
                      <LocationOn sx={{ fontSize: 12, color: 'text.disabled' }} />
                      <Typography variant='caption' color='text.disabled'>
                        {item.location}
                      </Typography>
                    </Box> */}
                  </Box>
                </Box>
              </Box>

              {index < alerts.length - 1 && <Divider />}
            </Box>
          ))
        )}
      </CardContent>
      <Dialog
        open={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setImgUrl(null)
        }} // ← clear on close
        maxWidth='md'
        fullWidth
      >
        <DialogTitle className='flex justify-between items-center'>
          Intrusion Alert Image
          <IconButton
            onClick={() => {
              setIsModalOpen(false)
              setImgUrl(null)
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent className='flex justify-center items-center min-h-[300px]'>
          {loadingImg ? (
            <CircularProgress />
          ) : imgUrl ? (
            <img src={imgUrl} alt='Intrusion Alert' style={{ maxWidth: '100%', height: 'auto', borderRadius: '8px' }} />
          ) : (
            <Typography>No image available for this alert.</Typography>
          )}
        </DialogContent>
      </Dialog>
    </Card>
  )
}

export default LiveAlerts

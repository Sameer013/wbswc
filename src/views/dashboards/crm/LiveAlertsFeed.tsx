'use client'

import { useEffect, useRef, useState, useCallback } from 'react'

import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'
import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'

// Icon Imports
import LoginRounded from '@mui/icons-material/LoginRounded'
import LogoutRounded from '@mui/icons-material/LogoutRounded'
import FileUploadRounded from '@mui/icons-material/FileUploadRounded'
import FileDownloadRounded from '@mui/icons-material/FileDownloadRounded'
import PhotoCameraRounded from '@mui/icons-material/PhotoCameraRounded'

import AccessTime from '@mui/icons-material/AccessTime'

import OptionMenu from '@core/components/option-menu'

import { getLiveFeed } from '@/app/server/action'

export interface WarehouseEvent {
  id: number
  timestamp: Date
  event_msg: string
}

interface RawWarehouseEvent {
  id: number
  timestamp: string
  event_msg: string
}

type EventKey = 'entry' | 'exit' | 'loading' | 'unloading' | 'anpr'

type MuiColor = 'success' | 'error' | 'primary' | 'warning' | 'secondary'

interface EventMeta {
  label: string
  location: string
  color: MuiColor
  Icon: React.ElementType
}

type FilterOption = 'All Events' | 'Entry / Exit' | 'Loading / Unloading' | 'ANPR'

const FILTER_OPTIONS: FilterOption[] = ['All Events', 'Entry / Exit', 'Loading / Unloading', 'ANPR']

function matchesFilter(msg: string, filter: FilterOption): boolean {
  const key = msg?.toLowerCase().trim() as EventKey

  switch (filter) {
    case 'Entry / Exit':
      return key === 'entry' || key === 'exit'
    case 'Loading / Unloading':
      return key === 'loading' || key === 'unloading'
    case 'ANPR':
      return key === 'anpr'
    default:
      return true
  }
}

const EVENT_META: Record<EventKey, EventMeta> = {
  entry: { label: 'Vehicle Entry', location: 'Main Gate', color: 'success', Icon: LoginRounded },
  exit: { label: 'Vehicle Exit', location: 'Main Gate', color: 'error', Icon: LogoutRounded },
  loading: { label: 'Loading Activity', location: 'Loading Bay', color: 'primary', Icon: FileDownloadRounded },
  unloading: { label: 'Unloading Activity', location: 'Loading Bay', color: 'warning', Icon: FileUploadRounded },
  anpr: { label: 'ANPR Event', location: 'Perimeter', color: 'secondary', Icon: PhotoCameraRounded }
}

function getEventMeta(msg: string): EventMeta {
  const key = msg?.toLowerCase().trim() as EventKey

  return EVENT_META[key] ?? EVENT_META.anpr
}

function formatTimestamp(date: Date): string {
  const dd = String(date.getDate()).padStart(2, '0')
  const mm = String(date.getMonth() + 1).padStart(2, '0')
  const yyyy = date.getFullYear()
  const hh = String(date.getHours()).padStart(2, '0')
  const min = String(date.getMinutes()).padStart(2, '0')

  return `${dd}-${mm}-${yyyy} ${hh}:${min}`
}

function getRelativeTime(date: Date): string {
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffSec = Math.floor(diffMs / 1000)
  const diffMin = Math.floor(diffSec / 60)
  const diffHr = Math.floor(diffMin / 60)

  if (diffSec < 10) return 'just now'
  if (diffSec < 60) return `${diffSec}s ago`
  if (diffMin < 60) return `${diffMin}m ago`
  if (diffHr < 24) return `${diffHr}h ago`

  return `${Math.floor(diffHr / 24)}d ago`
}

const EventRow = ({ event, isNew, isLast }: { event: WarehouseEvent; isNew: boolean; isLast: boolean }) => {
  const meta = getEventMeta(event.event_msg)
  const { Icon, color } = meta

  return (
    <Box>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: 3,
          px: 4,
          py: 1,
          transition: 'background-color 0.3s',
          backgroundColor: isNew ? 'action.hover' : 'transparent',
          animation: isNew ? 'slideIn 0.35s ease' : 'none',
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
            width: 24,
            height: 24,
            borderRadius: '50%',
            flexShrink: 0,
            backgroundColor: `${color}.lighterOpacity`
          }}
        >
          <Icon fontSize='small' color={color} />
        </Box>

        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Box className='flex items-center gap-2' sx={{ mb: 0.5 }}>
            <Box className='flex items-center gap-3 flex-wrap'>
              <Box className='flex items-center gap-1'>
                <AccessTime sx={{ fontSize: 12, color: 'text.disabled' }} />
                <Typography variant='caption' color='text.disabled'>
                  {formatTimestamp(event.timestamp)}
                </Typography>
              </Box>
              <Typography
                variant='caption'
                sx={{ color: 'text.disabled', fontFamily: 'monospace', fontSize: '0.65rem' }}
              >
                #{event.id}
              </Typography>
            </Box>
            <Typography variant='body2' fontWeight={600} color='text.primary' noWrap sx={{ flex: 1 }}>
              {meta.label}
            </Typography>

            {isNew && (
              <Chip
                label='NEW'
                size='small'
                color='error'
                variant='outlined'
                sx={{ height: 16, fontSize: '0.55rem', fontWeight: 700, flexShrink: 0 }}
              />
            )}

            <Chip
              label={getRelativeTime(event.timestamp)}
              size='small'
              color={color}
              sx={{ height: 18, fontSize: '0.6rem', fontWeight: 600, flexShrink: 0 }}
            />
          </Box>
        </Box>
      </Box>

      {!isLast && <Divider />}
    </Box>
  )
}

const LiveAlerts = () => {
  const [visibleEvents, setVisibleEvents] = useState<WarehouseEvent[]>([])
  const [newIds, setNewIds] = useState<Set<number>>(new Set())
  const [error, setError] = useState<string | null>(null)

  const [activeFilter, setActiveFilter] = useState<FilterOption>('All Events')

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const prevIdsRef = useRef<Set<number>>(new Set())

  const loadEvents = useCallback(async () => {
    try {
      setError(null)
      const events = (await getLiveFeed()) as unknown as RawWarehouseEvent[]

      const mapped: WarehouseEvent[] = events.map(e => ({
        ...e,
        timestamp: new Date(e.timestamp)
      }))

      const freshIds = new Set<number>()

      mapped.forEach(e => {
        if (!prevIdsRef.current.has(e.id)) freshIds.add(e.id)
      })

      prevIdsRef.current = new Set(mapped.map(e => e.id))
      setNewIds(freshIds)
      setVisibleEvents(mapped)

      if (freshIds.size > 0) {
        setTimeout(() => setNewIds(new Set()), 2000)
      }
    } catch (err) {
      console.error('Error fetching warehouse events:', err)
      setError('Failed to fetch events')
    }
  }, [])

  useEffect(() => {
    loadEvents()
    intervalRef.current = setInterval(loadEvents, 1000)

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [loadEvents])

  const filteredEvents = visibleEvents.filter(e => matchesFilter(e.event_msg, activeFilter))

  const menuOptions = FILTER_OPTIONS.map(label => ({
    text: label,
    menuItemProps: {
      onClick: () => setActiveFilter(label),
      selected: activeFilter === label
    }
  }))

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardHeader
        sx={{ py: 1, px: 4 }}
        title={
          <Box className='flex items-center gap-2 '>
            <Typography variant='h6' fontWeight={600}>
              Warehouse Events
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

            <Typography variant='caption' color='text.secondary' fontSize='0.7rem'>
              {filteredEvents.length} {activeFilter === 'All Events' ? 'recent events' : `"${activeFilter}" events`}
            </Typography>
          </Box>
        }
        action={<OptionMenu options={menuOptions} />}
      />

      <Divider />

      <CardContent
        sx={{
          flex: 1,
          overflowY: 'auto',
          maxHeight: '19.8vh',
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
        ) : filteredEvents.length === 0 ? (
          <Box sx={{ py: 6, textAlign: 'center' }}>
            <Typography fontSize='1.5rem'>🏭</Typography>
            <Typography variant='body2' color='text.secondary' mt={0.5}>
              {visibleEvents.length === 0
                ? 'No activity yet. Waiting for warehouse events…'
                : `No "${activeFilter}" events found.`}
            </Typography>
          </Box>
        ) : (
          filteredEvents.map((event, index) => (
            <EventRow
              key={`${event.id}-${index}`}
              event={event}
              isNew={newIds.has(event.id)}
              isLast={index === filteredEvents.length - 1}
            />
          ))
        )}
      </CardContent>
    </Card>
  )
}

export default LiveAlerts

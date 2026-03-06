'use client'

import { useEffect, useRef, useState, useCallback } from 'react'

import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import Chip from '@mui/material/Chip'
import type { Theme } from '@mui/material/styles'

import { getLiveFeed } from '@/actions/action'

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

interface EventTheme {
  label: string
  icon: string
  color: (theme: Theme) => string
  bg: (theme: Theme) => string
  border: (theme: Theme) => string
  dot: (theme: Theme) => string
}

const EVENT_CONFIG: Record<EventKey, EventTheme> = {
  entry: {
    label: 'Vehicle Entry',
    icon: '→',
    color: t => t.palette.success.main,
    bg: t => (t.palette.mode === 'dark' ? 'rgba(34,197,94,0.12)' : t.palette.success.light + '33'),
    border: t => (t.palette.mode === 'dark' ? 'rgba(34,197,94,0.25)' : t.palette.success.light),
    dot: t => t.palette.success.main
  },
  exit: {
    label: 'Vehicle Exit',
    icon: '←',
    color: t => t.palette.error.main,
    bg: t => (t.palette.mode === 'dark' ? 'rgba(239,68,68,0.12)' : t.palette.error.light + '33'),
    border: t => (t.palette.mode === 'dark' ? 'rgba(239,68,68,0.25)' : t.palette.error.light),
    dot: t => t.palette.error.main
  },
  loading: {
    label: 'Loading',
    icon: '↑',
    color: t => t.palette.primary.main,
    bg: t => (t.palette.mode === 'dark' ? 'rgba(105,108,255,0.12)' : t.palette.primary.light + '33'),
    border: t => (t.palette.mode === 'dark' ? 'rgba(105,108,255,0.25)' : t.palette.primary.light),
    dot: t => t.palette.primary.main
  },
  unloading: {
    label: 'Unloading',
    icon: '↓',
    color: t => t.palette.warning.main,
    bg: t => (t.palette.mode === 'dark' ? 'rgba(245,158,11,0.12)' : t.palette.warning.light + '33'),
    border: t => (t.palette.mode === 'dark' ? 'rgba(245,158,11,0.25)' : t.palette.warning.light),
    dot: t => t.palette.warning.main
  },
  anpr: {
    label: 'ANPR Event',
    icon: '📷',
    color: t => t.palette.secondary.main,
    bg: t => (t.palette.mode === 'dark' ? 'rgba(255,255,255,0.06)' : t.palette.action.hover),
    border: t => t.palette.divider,
    dot: t => t.palette.secondary.main
  }
}

function getEventConfig(msg: string) {
  const key = msg?.toLowerCase().trim() as EventKey

  return EVENT_CONFIG[key] ?? EVENT_CONFIG.anpr
}

function formatTimestamp(date: Date): { date: string; time: string; relative: string } {
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffSec = Math.floor(diffMs / 1000)
  const diffMin = Math.floor(diffSec / 60)
  const diffHr = Math.floor(diffMin / 60)

  let relative = ''

  if (diffSec < 10) relative = 'just now'
  else if (diffSec < 60) relative = `${diffSec}s ago`
  else if (diffMin < 60) relative = `${diffMin}m ago`
  else if (diffHr < 24) relative = `${diffHr}h ago`
  else relative = `${Math.floor(diffHr / 24)}d ago`

  const dateStr = date.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  })

  const timeStr = date.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true
  })

  return { date: dateStr, time: timeStr, relative }
}

const PulseDot = ({ color }: { color: string }) => (
  <Box sx={{ position: 'relative', width: 10, height: 10, flexShrink: 0 }}>
    {/* <Box
      sx={{
        position: 'absolute',
        inset: 0,
        borderRadius: '50%',
        backgroundColor: color,
        opacity: 0.35,
        animation: 'ping 1.4s cubic-bezier(0,0,0.2,1) infinite',
        '@keyframes ping': {
          '0%': { transform: 'scale(1)', opacity: 0.35 },
          '75%, 100%': { transform: 'scale(2)', opacity: 0 }
        }
      }}
    />
    <Box
      sx={{
        position: 'absolute',
        inset: '2px',
        borderRadius: '50%',
        backgroundColor: color
      }}
    /> */}
    <Box
      sx={{
        width: 10,
        height: 10,
        borderRadius: '50%',
        backgroundColor: color,
        '@keyframes ping': {
          '0%': { transform: 'scale(1)', opacity: 1 },
          '75%, 100%': { transform: 'scale(2)', opacity: 0 }
        },
        '&::before': {
          content: '""',
          position: 'absolute',
          inset: 0,
          borderRadius: '50%',
          backgroundColor: color,
          animation: 'ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite'
        }
      }}
    />
  </Box>
)

const EventRow = ({ event, isNew }: { event: WarehouseEvent; isNew: boolean }) => {
  const cfg = getEventConfig(event.event_msg)
  const { date, time, relative } = formatTimestamp(event.timestamp)

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: '28px 1fr auto',
        alignItems: 'center',
        gap: 1.5,
        px: 1.5,
        py: 1.25,
        borderRadius: 2,
        border: '1px solid',
        borderColor: cfg.border,
        backgroundColor: cfg.bg,
        transition: 'all 0.3s ease',
        animation: isNew ? 'slideIn 0.35s ease' : 'none',
        '@keyframes slideIn': {
          from: { opacity: 0, transform: 'translateY(-6px)' },
          to: { opacity: 1, transform: 'translateY(0)' }
        }
      }}
    >
      {/* Icon Badge */}
      <Box
        sx={{
          width: 28,
          height: 28,
          borderRadius: 1.5,
          backgroundColor: cfg.color,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff',
          fontSize: '1rem',
          fontWeight: 700,
          flexShrink: 0,
          fontFamily: 'monospace'
        }}
      >
        {cfg.icon}
      </Box>

      <Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant='body2' fontWeight={600} sx={{ color: cfg.color, fontSize: '0.82rem', lineHeight: 1.2 }}>
            {cfg.label}
          </Typography>
          <Typography variant='caption' sx={{ color: 'text.disabled', fontSize: '0.68rem', fontFamily: 'monospace' }}>
            #{event.id}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mt: 0.25 }}>
          <Typography variant='caption' sx={{ color: 'text.secondary', fontSize: '0.7rem', fontFamily: 'monospace' }}>
            {date} · {time}
          </Typography>
        </Box>
      </Box>

      <Chip
        label={relative}
        size='small'
        sx={{
          height: 20,
          fontSize: '0.65rem',
          fontWeight: 600,
          backgroundColor: cfg.color + '18',
          color: cfg.color,
          border: `1px solid ${cfg.border}`,
          borderRadius: 1,
          '& .MuiChip-label': { px: 1 }
        }}
      />
    </Box>
  )
}

const LiveFeed = () => {
  const [visibleEvents, setVisibleEvents] = useState<WarehouseEvent[]>([])
  const [newIds, setNewIds] = useState<Set<number>>(new Set())
  const [error, setError] = useState<string | null>(null)

  // const [isLive, setIsLive] = useState(true)
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

  const counts = visibleEvents.reduce<Record<string, number>>((acc, e) => {
    const k = e.event_msg?.toLowerCase() ?? 'default'

    acc[k] = (acc[k] ?? 0) + 1

    return acc
  }, {})

  return (
    <Card
      sx={{
        borderRadius: 1.5,
        boxShadow: '0 1px 12px 0 rgba(0,0,0,0.07)',
        border: '1px solid',
        borderColor: 'divider'
      }}
    >
      {/* ── Header ── */}
      <CardHeader
        title={
          <Box
            sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 1 }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
              <Typography variant='h6' fontWeight={700} fontSize='0.95rem'>
                Warehouse Activity Log
              </Typography>
              <PulseDot color='#22c55e' />
              {/* <Chip
                label='LIVE'
                size='small'
                sx={{
                  height: 18,
                  fontSize: '0.6rem',
                  fontWeight: 800,
                  letterSpacing: '0.08em',
                  backgroundColor: '#dcfce7',
                  color: '#16a34a',
                  borderRadius: 1,
                  '& .MuiChip-label': { px: 0.75 }
                }}
              /> */}
            </Box>
            <Typography variant='caption' color='text.secondary' fontSize='0.7rem'>
              {visibleEvents.length} recent events
            </Typography>
          </Box>
        }
        sx={{ py: 1, pb: 1.5, pl: 1.5 }}
      />

      {/* ── Summary Chips ── */}
      {visibleEvents.length > 0 && (
        <Box sx={{ px: 2, pb: 1.25, display: 'flex', gap: 0.75, flexWrap: 'wrap' }}>
          {(Object.keys(EVENT_CONFIG) as EventKey[])
            .filter(k => k !== 'anpr' && counts[k])
            .map(k => {
              const cfg = EVENT_CONFIG[k]

              return (
                <Chip
                  key={k}
                  label={`${cfg.icon} ${cfg.label}: ${counts[k]}`}
                  size='small'
                  sx={{
                    height: 22,
                    fontSize: '0.68rem',
                    fontWeight: 600,
                    backgroundColor: cfg.bg,
                    color: cfg.color,
                    border: `1px solid ${cfg.border}`,
                    borderRadius: 1,
                    '& .MuiChip-label': { px: 1 }
                  }}
                />
              )
            })}
        </Box>
      )}

      <Divider />

      {/* ── Event List ── */}
      <CardContent sx={{ py: 1.5, px: 2, '&:last-child': { pb: 1.5 } }}>
        {error ? (
          <Box sx={{ py: 3, textAlign: 'center' }}>
            <Typography variant='body2' color='error'>
              {error}
            </Typography>
          </Box>
        ) : visibleEvents.length === 0 ? (
          <Box sx={{ py: 4, textAlign: 'center' }}>
            <Typography fontSize='1.5rem'>🏭</Typography>
            <Typography variant='body2' color='text.secondary' mt={0.5}>
              No activity yet. Waiting for warehouse events…
            </Typography>
          </Box>
        ) : (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 0.75,
              maxHeight: 320,
              overflowY: 'auto',
              pr: 0.5,
              '&::-webkit-scrollbar': { width: 4 },
              '&::-webkit-scrollbar-track': { backgroundColor: 'transparent' },
              '&::-webkit-scrollbar-thumb': { backgroundColor: '#d1d5db', borderRadius: 4 }
            }}
          >
            {visibleEvents.map((event, idx) => (
              <EventRow key={`${event.id}-${idx}`} event={event} isNew={newIds.has(event.id)} />
            ))}
          </Box>
        )}
      </CardContent>
    </Card>
  )
}

export default LiveFeed

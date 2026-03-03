'use client'

import { useEffect, useRef, useState } from 'react'

import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'

import Divider from '@mui/material/Divider'

export interface WarehouseEvent {
  timestamp: string
  event_msg: string
}

interface WarehouseLiveFeedProps {
  events?: WarehouseEvent[]
}

// const dummyFeedEvents: WarehouseEvent[] = []

const dummyFeedEvents: WarehouseEvent[] = [
  { timestamp: '03-03-2026 08:02', event_msg: 'Truck entered in Bay 3' },
  { timestamp: '03-03-2026 08:15', event_msg: 'Unloading started at Bay 3' },

  { timestamp: '03-03-2026 08:44', event_msg: 'Unloading completed at Bay 3' },
  { timestamp: '03-03-2026 09:10', event_msg: 'Truck exited from Bay 3' },
  { timestamp: '03-03-2026 09:30', event_msg: 'Truck entered in Bay 1' },
  { timestamp: '03-03-2026 09:45', event_msg: 'Loading started at Bay 1' },
  { timestamp: '03-03-2026 10:12', event_msg: 'Vehicle arrived at Main Gate' },
  { timestamp: '03-03-2026 10:30', event_msg: 'Loading completed at Bay 1' },
  { timestamp: '03-03-2026 10:55', event_msg: 'Truck exited from Bay 1' },
  { timestamp: '03-03-2026 11:20', event_msg: 'Truck entered in Bay 2' },
  { timestamp: '03-03-2026 08:02', event_msg: 'Truck entered in Bay 3' },
  { timestamp: '03-03-2026 08:15', event_msg: 'Unloading started at Bay 3' },
  { timestamp: '03-03-2026 08:44', event_msg: 'Unloading completed at Bay 3' },
  { timestamp: '03-03-2026 09:10', event_msg: 'Truck exited from Bay 3' },
  { timestamp: '03-03-2026 09:30', event_msg: 'Truck entered in Bay 1' },
  { timestamp: '03-03-2026 09:45', event_msg: 'Loading started at Bay 1' },
  { timestamp: '03-03-2026 10:12', event_msg: 'Vehicle arrived at Main Gate' },
  { timestamp: '03-03-2026 10:30', event_msg: 'Loading completed at Bay 1' },
  { timestamp: '03-03-2026 10:55', event_msg: 'Truck exited from Bay 1' },
  { timestamp: '03-03-2026 11:20', event_msg: 'Truck entered in Bay 2' }
]

const LiveFeed = ({ events = dummyFeedEvents }: WarehouseLiveFeedProps) => {
  const [visibleEvents, setVisibleEvents] = useState<WarehouseEvent[]>([])
  const prevLengthRef = useRef(0)

  useEffect(() => {
    setVisibleEvents([...events].reverse())
    prevLengthRef.current = events.length
  }, [events])

  return (
    <Card>
      <CardHeader
        title={
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Typography variant='h6' fontWeight={600}>
                Live Warehouse Events
              </Typography>
            </Box>
            <Typography variant='caption' color='text.secondary'>
              {events.length} total events
            </Typography>
          </Box>
        }
        sx={{ py: 2, pb: 1.5 }}
      />
      <Divider />
      <CardContent sx={{ py: 1.5, px: 2, '&:last-child': { pb: 1.5 } }}>
        {visibleEvents.length === 0 ? (
          <Box sx={{ py: 3, textAlign: 'center' }}>
            <Typography variant='body2' color='text.secondary'>
              No events yet. Waiting for activity...
            </Typography>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75, maxHeight: 180, overflowY: 'auto', pr: 0.5 }}>
            {visibleEvents.map((event, idx) => (
              <Box
                key={`${event.timestamp}-${idx}`}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  px: 1.5,
                  py: 1,
                  borderRadius: 1.5,
                  border: '1px solid',
                  borderColor: 'divider',
                  backgroundColor: 'action.hover'
                }}
              >
                <Typography variant='body2' fontWeight={500} color='text.primary'>
                  {event.event_msg}
                </Typography>
                <Typography
                  variant='caption'
                  color='text.secondary'
                  sx={{ flexShrink: 0, fontFamily: 'monospace', fontSize: '0.7rem', ml: 2 }}
                >
                  {event.timestamp}
                </Typography>
              </Box>
            ))}
          </Box>
        )}
      </CardContent>
    </Card>
  )
}

export default LiveFeed

'use server'

import { prisma } from '@/libs/prisma'

import db from '@/libs/db'
import type { VehicleType } from '@/views/list/ProductListTable'
import type { AlertType } from '@/views/dashboards/crm/LiveAlerts'

interface WarehouseEvent {
  id: number
  timestamp: Date
  event_msg: string
}

export async function getLiveFeed(): Promise<WarehouseEvent[]> {
  const events = await prisma.$queryRaw<WarehouseEvent[]>`SELECT e.id as id, et.eventType as event_msg ,
    e.eventtimestamp as timestamp FROM eventmaster e 
    JOIN event_type et on e.eventId = et.eventId
    ORDER BY e.eventTimestamp desc
    LIMIT 20
  `

  return events
}

export type VehicleStatPeriod = {
  todayCount: number
  monthCount: number
  yearCount: number
}

export type VehicleStats = {
  entry: VehicleStatPeriod
  exit: VehicleStatPeriod
  load: VehicleStatPeriod
  unload: VehicleStatPeriod
}

type ViewRow = {
  entryCnt: number
  exitCnt: number
  loadCnt: number
  unloadCnt: number
}

export async function getVehicleStats(): Promise<VehicleStats> {
  try {
    const result = await prisma.$queryRaw<(ViewRow & { period: string })[]>`
    SELECT 'day'   as period, entryCnt, exitCnt, loadCnt, unloadCnt FROM v_day
    UNION ALL
    SELECT 'month' as period, entryCnt, exitCnt, loadCnt, unloadCnt FROM v_mnthdata
    UNION ALL
    SELECT 'year'  as period, entryCnt, exitCnt, loadCnt, unloadCnt FROM v_alldata
  `

    const n = (v: number) => Number(v ?? 0)

    const day = result.find(r => r.period === 'day') ?? { entryCnt: 1, exitCnt: 1, loadCnt: 1, unloadCnt: 1 }
    const month = result.find(r => r.period === 'month') ?? { entryCnt: 0, exitCnt: 0, loadCnt: 0, unloadCnt: 0 }
    const all = result.find(r => r.period === 'year') ?? { entryCnt: 0, exitCnt: 0, loadCnt: 0, unloadCnt: 0 }

    return {
      entry: { todayCount: n(day.entryCnt), monthCount: n(month.entryCnt), yearCount: n(all.entryCnt) },
      exit: { todayCount: n(day.exitCnt), monthCount: n(month.exitCnt), yearCount: n(all.exitCnt) },
      load: { todayCount: n(day.loadCnt), monthCount: n(month.loadCnt), yearCount: n(all.loadCnt) },
      unload: { todayCount: n(day.unloadCnt), monthCount: n(month.unloadCnt), yearCount: n(all.unloadCnt) }
    }
  } catch (error) {
    console.error('getVehicleStats failed:', error)

    // Return last known default instead of crashing
    return {
      entry: { todayCount: 0, monthCount: 0, yearCount: 0 },
      exit: { todayCount: 0, monthCount: 0, yearCount: 0 },
      load: { todayCount: 0, monthCount: 0, yearCount: 0 },
      unload: { todayCount: 0, monthCount: 0, yearCount: 0 }
    }
  }
}

export async function getChartData() {
  try {
    const [data] = await db.query(`
      SELECT date, entryCnt 'Entry', exitCnt 'Exit', loadCnt 'Loading', unloadCnt 'Unloading'
      FROM (
        SELECT date, entryCnt, exitCnt, loadCnt, unloadCnt
        FROM v_chartdata
        ORDER BY date DESC
        LIMIT 15
      ) AS recent
      ORDER BY date ASC`)

    return { data: data }
  } catch (error) {
    console.error('getChartData failed:', error)

    return { data: [] }
  }
}

export async function getVehicleTableData() {
  try {
    const [data] = await db.query(`
      select e.id,e.eventTimestamp timestamp, a.vehicleNo, time(e.eventTimestamp) entry_time,'-' exit_time,a.vehicleWt
from eventmaster e
join anprevent a on e.id = a.eventMasterId
order by e.eventTimestamp desc limit 20`)

    return data as VehicleType[]
  } catch (error) {
    console.error('Fetch failed:', error)

    return [] as VehicleType[]
  }
}

export async function getIntrusionAlerts(): Promise<AlertType[]> {
  try {
    const data = await prisma.intrusionevent.findMany({
      include: {
        eventmaster: {
          select: {
            eventTimestamp: true
          }
        }
      },
      orderBy: {
        eventmaster: {
          eventTimestamp: 'desc'
        }
      }
    })

    return data.map(event => ({
      id: event.id,
      description: event.description,
      location: event.location,
      severity: event.severity,
      timestamp: event.eventmaster.eventTimestamp.toISOString(),
      isNew: false
    }))
  } catch (error) {
    console.error('Fetch failed:', error)

    return []
  }
}

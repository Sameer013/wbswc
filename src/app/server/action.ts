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

import type { EventSummaryRecord2 } from '@/components/reports/VehicleSummaryReport'
import type { AnprEventRecord } from '../(dashboard)/vehicles/anpr/page'
import type { VehicleEventRecord } from '../(dashboard)/vehicles/entryexit/page'
import { convertUTCtoLocalTime } from '@/utils/functions'
import type { BagSummaryRecord } from '@/components/reports/BagSummaryReport'

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
      select e.id,e.eventTimestamp timestamp, a.updated_vehicleNo,a.vehicleNo, time(e.eventTimestamp) entry_time,'-' exit_time,a.vehicleWt
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
    const data = await prisma.intrusion_event.findMany({
      orderBy: { created_at: 'desc' }
    })

    return data.map(event => ({
      id: event.id,
      description: event.description,
      created_at: convertUTCtoLocalTime(event.created_at),
      image: event.image ? `data:image/jpg;base64,${Buffer.from(event.image).toString('base64')}` : '',
      isNew: false
    }))
  } catch (error) {
    console.error('Fetch failed:', error)

    return []
  }
}

function toISTDate(date: Date, time: 'start' | 'end'): Date {
  const dateStr = date.toISOString().split('T')[0] // get YYYY-MM-DD part

  if (time === 'start') {
    return new Date(`${dateStr}T00:00:00+05:30`)
  } else {
    return new Date(`${dateStr}T23:59:59+05:30`)
  }
}

type AnprEvent = { time: string; weight: number }

function splitAnprIntoCycles(anprEvents: AnprEvent[]): AnprEvent[][] {
  if (anprEvents.length === 0) return []
  if (anprEvents.length === 1) return [anprEvents]

  const groups: AnprEvent[][] = []
  let current: AnprEvent[] = [anprEvents[0]]

  for (let i = 1; i < anprEvents.length; i++) {
    const prev = anprEvents[i - 1]
    const curr = anprEvents[i]

    if (curr.time < prev.time) {
      groups.push(current)
      current = [curr]
    } else {
      current.push(curr)
    }
  }

  groups.push(current)

  return groups
}

function deriveWeights(group: AnprEvent[]) {
  if (group.length === 0) {
    return { tare_wt: null, tare_wt_time: null, gross_wt: null, gross_wt_time: null, net_wt: null }
  }

  const sorted = [...group].sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime())
  const tare = sorted[0]
  const gross = sorted[1] ?? null

  return {
    tare_wt: tare.weight,
    tare_wt_time: tare.time,
    gross_wt: gross?.weight ?? null,
    gross_wt_time: gross?.time ?? null,
    net_wt: gross ? Math.abs(gross.weight - tare.weight) : null
  }
}

export async function getReportData(
  from?: Date,
  to?: Date,
  limit?: number,
  order: 'asc' | 'desc' = 'desc'
): Promise<EventSummaryRecord2[]> {
  try {
    const data = await prisma.vehicle_cycle.findMany({
      where: {
        ...(from && to ? { cycle_date: { gte: from, lte: to } } : {})
      },
      orderBy: { cycle_date: 'desc' },
      ...(limit ? { take: limit } : {})
    })

    const reportData: EventSummaryRecord2[] = []
    let globalId = 1

    data.forEach(record => {
      // 1. Parse gate events
      type GateEvent = { time: string; movement: '1' | '2'; imageId: string }
      let gateEvents: GateEvent[] = []

      if (record.info_entryexit) {
        const [times_str, movements_str, image_str] = record.info_entryexit.split('#')
        const times = times_str?.split(',') ?? []
        const movements = movements_str?.split(',') ?? []
        const imageIds = image_str?.split(',') ?? []

        gateEvents = movements.map((movement, i) => ({
          time: times[i],
          imageId: imageIds[i],
          movement: movement as '1' | '2'
        }))
      }

      // 2. Parse ANPR events, sort chronologically
      let anprEvents: AnprEvent[] = []

      if (record.info_anpr) {
        const [times_str, weights_str] = record.info_anpr.split('#')
        const times = times_str?.split(',') ?? []
        const weights = weights_str?.split(',') ?? []

        anprEvents = weights.map((w, i) => ({
          time: times[i],
          weight: Number(w)
        }))
      }

      anprEvents.sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime())

      // 3. Build gate cycles
      type Cycle = {
        entry_time: string | null
        exit_time: string | null
        entry_imageId?: string | null
        exit_imageId?: string | null
      }
      const cycles: Cycle[] = []

      if (gateEvents.length === 0) {
        cycles.push({
          entry_time: null,
          exit_time: null,
          entry_imageId: null,
          exit_imageId: null
        })
      } else {
        let currentEntry: string | null = null
        let currentEntryImg: string | null = null

        gateEvents.forEach(event => {
          if (event.movement === '1') {
            if (currentEntry !== null) {
              cycles.push({
                entry_time: currentEntry,
                exit_time: null,
                entry_imageId: currentEntryImg,
                exit_imageId: null
              })
            }

            currentEntry = event.time
            currentEntryImg = event.imageId
          } else if (event.movement === '2') {
            cycles.push({
              entry_time: currentEntry,
              exit_time: event.time,
              entry_imageId: currentEntryImg,
              exit_imageId: event.imageId
            })
            currentEntry = null
            currentEntryImg = null
          }
        })

        if (currentEntry !== null) {
          cycles.push({
            entry_time: currentEntry,
            exit_time: null,
            entry_imageId: currentEntryImg,
            exit_imageId: null
          })
        }
      }

      // 4. Link ANPR weights to cycles
      cycles.forEach(cycle => {
        const hasGateWindow = !!(cycle.entry_time || cycle.exit_time)
        let cycleWeights: AnprEvent[] = []

        if (hasGateWindow) {
          const cycleStart = cycle.entry_time
            ? new Date(cycle.entry_time)
            : toISTDate(new Date(record.cycle_date), 'start')

          const cycleEnd = cycle.exit_time ? new Date(cycle.exit_time) : toISTDate(new Date(record.cycle_date), 'end')

          cycleWeights = anprEvents.filter(e => {
            const t = new Date(e.time)

            return t >= cycleStart && t <= cycleEnd && t.toDateString() === new Date(record.cycle_date).toDateString()
          })
        }

        const weightsOutsideWindow = hasGateWindow && cycleWeights.length === 0 && anprEvents.length > 0

        const weightsToSplit = cycleWeights.length > 0 ? cycleWeights : anprEvents

        const weightGroups = splitAnprIntoCycles(weightsToSplit)

        // const hasMultipleGroups = weightGroups.length > 1

        weightGroups.forEach((group, groupIndex) => {
          const isFirstGroup = groupIndex === 0
          const isLastGroup = groupIndex === weightGroups.length - 1

          const { tare_wt, tare_wt_time, gross_wt, gross_wt_time, net_wt } = deriveWeights(group)

          const entry_time: string = weightsOutsideWindow
            ? '-'
            : isFirstGroup
              ? (cycle.entry_time?.slice(11, 16) ?? '-')
              : '-'

          const exit_time: string = weightsOutsideWindow
            ? '-'
            : isLastGroup
              ? (cycle.exit_time?.slice(11, 16) ?? '-')
              : '-'

          const entry_imageId = !weightsOutsideWindow && isFirstGroup ? (cycle.entry_imageId ?? null) : null

          const exit_imageId = !weightsOutsideWindow && isLastGroup ? (cycle.exit_imageId ?? null) : null

          reportData.push({
            id: globalId++,
            vehicleNo: record.vehicleNo ?? null,
            event_date: record.cycle_date,
            entry_time,
            exit_time,
            entry_imageId,
            exit_imageId,
            tare_wt,
            tare_wt_time,
            gross_wt,
            gross_wt_time,
            net_wt
          })
        })
      })
    })

    // 6. Sort
    const ordered_reportData = reportData.sort((a, b) => {
      const dateA = new Date(a.event_date as string)
      const dateB = new Date(b.event_date as string)

      if (dateB.getTime() !== dateA.getTime()) {
        return dateB.getTime() - dateA.getTime()
      }

      const timeA = a.entry_time !== '-' ? (a.entry_time as string) : '00:00'
      const timeB = b.entry_time !== '-' ? (b.entry_time as string) : '00:00'

      return timeB.localeCompare(timeA)
    })

    return order === 'asc' ? reportData : ordered_reportData
  } catch (error) {
    console.error('Fetch failed:', error)

    return []
  }
}

export async function getVehicleImage(id: string): Promise<string> {
  try {
    const image = await prisma.entry_exit_images.findUnique({
      where: { id: Number(id) }
    })

    if (!image || !image.truckImage) return ''

    return `data:image/jpg;base64,${Buffer.from(image.truckImage).toString('base64')}`
  } catch (error) {
    console.error('Fetch failed:', error)

    return ''
  }
}

export async function getAnprImage(id: string): Promise<string> {
  try {
    const image = await prisma.weighbridge_images.findUnique({
      where: { id: Number(id) }
    })

    if (!image || !image.truckImage) return ''

    return `data:image/jpg;base64,${Buffer.from(image.truckImage).toString('base64')}`
  } catch (error) {
    console.error('Fetch failed:', error)

    return ''
  }
}

export async function getAnprData(): Promise<[] | AnprEventRecord[]> {
  try {
    const data = await prisma.anprevent.findMany({
      orderBy: { created_at: 'desc' },
      take: 20
    })

    if (!data || data.length === 0) return []

    // console.log(JSON.stringify(data))
    const finalData = data.map(item => ({
      ...item,
      created_at: item.created_at ? convertUTCtoLocalTime(item.created_at) : null,
      updated_at: item.updated_at ? convertUTCtoLocalTime(item.updated_at) : null
    }))

    return finalData
  } catch (error) {
    console.error('Fetch failed:', error)

    return [] as AnprEventRecord[]
  }
}

export async function getEntryExitData(): Promise<[] | VehicleEventRecord[]> {
  try {
    const data = await prisma.vehicle_event.findMany({
      orderBy: { created_at: 'desc' },
      take: 20
    })

    if (!data || data.length === 0) return []

    // console.log(JSON.stringify(data))
    const finalData = data.map(item => ({
      ...item,
      created_at: item.created_at ? convertUTCtoLocalTime(item.created_at) : null,
      updated_at: item.updated_at ? convertUTCtoLocalTime(item.updated_at) : null
    }))

    return finalData
  } catch (error) {
    console.error('Fetch failed:', error)

    return [] as AnprEventRecord[]
  }
}

export async function getBagsCnt(from: Date, to: Date): Promise<BagSummaryRecord[]> {
  try {
    const data = await prisma.v_bagsCnt.findMany({
      where: { dt: { gte: from, lt: to } }
    })

    return (data ?? []).map((row, index) => ({ ...row, id: index + 1, dt: convertUTCtoLocalTime(row.dt) }))
  } catch (error) {
    console.error('Fetch failed:', error)

    return []
  }
}

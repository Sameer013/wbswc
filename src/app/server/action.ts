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

// export async function getVehicleData() {
//   try {
//     const [anpr_data, entryexit_data] = await Promise.all([prisma.vw_danpr.findMany(), prisma.vw_entryexit.findMany()])

//     // Build Map from entryexit keyed by vno

//     const entryExitMap = new Map( // Looping through entryexit_data to create a map of vno to entry/exit times
//       entryexit_data.map(record => {
//         const times = record.evt?.split(',') ?? [] // '2026-04-03 08:48:55,2026-04-03 08:48:55' --> ['2026-04-03 08:48:55','2026-04-03 08:48:55']
//         const types = record.et?.split(',') ?? [] // '1,2' --> ['1','2']

//         // Creating one single array of events with time and movement type
//         const events = types.map((type, i) => ({
//           time: times[i]?.trim() ?? null,
//           type: type.trim()
//         }))

//         // Resulted Array =>[{ time: '2026-04-03 08:48:55', type: '1' },{ time: '2026-04-03 10:45:24', type: '2' },{ time: '2026-04-03 11:46:55', type: '2' }]

//         const vehicle_cycle: { entryTime: string | null; exitTime: string | null }[] = []

//         let curr_entryTime: string | null = null

//         for (let i = 0; i < events.length; i++) {
//           const event = events[i]

//           if (event.type === '1') {
//             if (curr_entryTime !== null) {
//               vehicle_cycle.push({
//                 entryTime: curr_entryTime,
//                 exitTime: null
//               })
//             }

//             curr_entryTime = event.time
//           } else if (event.type === '2') {
//             vehicle_cycle.push({
//               entryTime: curr_entryTime,
//               exitTime: event.time
//             })

//             curr_entryTime = null
//           }
//         }

//         if (curr_entryTime !== null) {
//           vehicle_cycle.push({
//             entryTime: curr_entryTime,
//             exitTime: null
//           })
//         }

//         return [record.vno, vehicle_cycle]
//       })
//     )

//     // Merge anpr + entryexit by matching vno
//     const formattedData = anpr_data.map(anpr => {
//       const match = entryExitMap.get(anpr.vno)

//       return {
//         // --- From vw_danpr ---
//         date: anpr.dt,
//         plate: anpr.vno,
//         speed: anpr.wts, // wts = weight/speed?
//         images: anpr.imgs,

//         // --- From vw_entryexit ---
//         entryTime: match?.entryTime ?? null,
//         exitTime: match?.exitTime ?? null,

//         // --- Derived ---
//         status: match?.exitTime ? 'exited' : match?.entryTime ? 'inside' : 'unknown'
//       }
//     })

//     return { formattedData }
//   } catch (error) {
//     console.error('Fetch failed:', error)

//     return { formattedData: [] }
//   }
// }

export async function getVehicleData(from: Date, to: Date): Promise<VehicleType[]> {
  try {
    const [anpr_data, entryexit_data] = await Promise.all([
      prisma.vw_danpr.findMany({ where: { dt: { gte: from, lte: to } } }),
      prisma.vw_entryexit.findMany({ where: { dt: { gte: from, lte: to } } })
    ])

    const anprMap = new Map(anpr_data.map(a => [a.vno, a]))

    const formattedData: VehicleType[] = entryexit_data.flatMap(record => {
      const times = record.evt?.split(',') ?? []
      const types = record.et?.split(',') ?? []

      const anpr = anprMap.get(record.vno)
      const weights = anpr?.wts?.split(',').map(Number) ?? []

      const events = types
        .map((type, i) => ({
          type: type.trim(),
          time: times[i]?.trim() ?? null,
          weight: weights[i] ?? null
        }))
        .filter(e => e.time !== null)

      events.sort((a, b) => new Date(a.time!).getTime() - new Date(b.time!).getTime())

      const rows: VehicleType[] = []
      let currentEntry: (typeof events)[0] | null = null

      for (const event of events) {
        if (event.type === '1') {
          if (currentEntry) {
            rows.push({
              id: `${record.vno}-${currentEntry.time}`,
              timestamp: currentEntry.time!,

              vehicleNo: record.vno,
              entry_time: currentEntry.time!,
              exit_time: null,

              tareWt: currentEntry.weight ?? null,
              grossWt: currentEntry.weight ?? null,

              tarewtTimestamp: currentEntry.time!,
              grosswtTimestamp: currentEntry.time!
            })
          }

          currentEntry = event
        } else if (event.type === '2') {
          if (currentEntry) {
            const w1 = currentEntry.weight
            const w2 = event.weight

            const tareWt = w1 ?? null
            const grossWt = w2 ?? null

            rows.push({
              id: `${record.vno}-${currentEntry.time}-${event.time}`,
              timestamp: event.time!,

              vehicleNo: record.vno,
              entry_time: currentEntry.time!,
              exit_time: event.time!,

              tareWt,
              grossWt,

              tarewtTimestamp: currentEntry.time!,
              grosswtTimestamp: event.time!
            })

            currentEntry = null
          } else {
            // exit without entry
            rows.push({
              id: `${record.vno}-${event.time}`,
              timestamp: event.time!,

              vehicleNo: record.vno,
              entry_time: null,
              exit_time: event.time!,

              tareWt: event.weight ?? null,
              grossWt: event.weight ?? null,

              tarewtTimestamp: event.time!,
              grosswtTimestamp: event.time!
            })
          }
        }
      }

      // leftover entry
      if (currentEntry) {
        rows.push({
          id: `${record.vno}`,
          timestamp: currentEntry.time!,

          vehicleNo: record.vno,
          entry_time: currentEntry.time!,
          exit_time: null,

          tareWt: currentEntry.weight ?? null,
          grossWt: currentEntry.weight ?? null,

          tarewtTimestamp: currentEntry.time!,
          grosswtTimestamp: currentEntry.time!
        })
      }

      return rows
    })

    formattedData.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    console.log('Formatted Vehicle Data:', formattedData)

    const dataWithIds = formattedData.map((item, index) => ({
      ...item,
      id: index + 1
    }))

    return dataWithIds
  } catch (error) {
    console.error('Fetch failed:', error)

    return []
  }
}

export async function getReportData(from: Date, to: Date): Promise<EventSummaryRecord2[]> {
  try {
    const data = await prisma.vehicle_cycle.findMany({
      where: {
        cycle_date: {
          gte: from,
          lte: to
        }
      },

      orderBy: { cycle_date: 'asc' }
    })

    const reportData: EventSummaryRecord2[] = []
    let globalId = 0

    data.forEach(record => {
      // ─── Parse info_entryexit (DESC order → reverse to ASC) ─────────
      type GateEvent = { time: string; movement: '1' | '2' }
      let gateEvents: GateEvent[] = []

      if (record.info_entryexit) {
        const [times_str, movements_str] = record.info_entryexit.split('#')
        const times = times_str?.split(',') ?? []
        const movements = movements_str?.split(',') ?? []

        // reverse both since entryexit is DESC
        times.reverse()
        movements.reverse()

        gateEvents = movements.map((movement, i) => ({
          time: times[i],
          movement: movement as '1' | '2'
        }))
      }

      // ─── Parse info_anpr (already ASC order) ────────────────────────
      type AnprEvent = { time: string; weight: number }
      let anprEvents: AnprEvent[] = []

      if (record.info_anpr) {
        const [times_str, weights_str] = record.info_anpr.split('#')
        const times = times_str?.split(',') ?? []
        const weights = weights_str?.split(',') ?? []

        anprEvents = weights
          .map((w, i) => ({
            time: times[i],
            weight: parseFloat(w)
          }))
          .filter(e => !isNaN(e.weight))
      }

      // ─── Build cycles ────────────────────────────────────────────────
      type Cycle = { entry_time: string | null; exit_time: string | null }
      const cycles: Cycle[] = []

      if (gateEvents.length === 0) {
        // no gate events at all — one dummy cycle for ANPR fallback
        cycles.push({ entry_time: null, exit_time: null })
      } else {
        let currentEntry: string | null = null

        gateEvents.forEach(event => {
          if (event.movement === '1') {
            if (currentEntry !== null) {
              // missed exit — close previous cycle, start new one
              cycles.push({ entry_time: currentEntry, exit_time: null })
            }

            currentEntry = event.time
          } else if (event.movement === '2') {
            cycles.push({
              entry_time: currentEntry,
              exit_time: event.time
            })
            currentEntry = null
          }
        })

        // if last entry never got an exit
        if (currentEntry !== null) {
          cycles.push({ entry_time: currentEntry, exit_time: null })
        }
      }

      // ─── Link ANPR weights to cycles ────────────────────────────────
      cycles.forEach(cycle => {
        let cycleWeights: AnprEvent[] = []

        if (cycle.entry_time || cycle.exit_time) {
          // find cycle boundaries
          // if entry missing → use start of day
          // if exit missing → use end of day
          const cycleStart = cycle.entry_time ? new Date(cycle.entry_time) : new Date(`${record.cycle_date}T00:00:00`)

          const cycleEnd = cycle.exit_time ? new Date(cycle.exit_time) : new Date(`${record.cycle_date}T23:59:59`)

          cycleWeights = anprEvents.filter(e => {
            const t = new Date(e.time)

            return t >= cycleStart && t <= cycleEnd
          })
        }

        // fallback → no weights found in range, use all weights
        if (cycleWeights.length === 0) {
          cycleWeights = anprEvents
        }

        // tare = min weight, gross = max weight
        let tare_wt: number | null = null
        let gross_wt: number | null = null
        let tare_wt_time: string | null = null
        let gross_wt_time: string | null = null
        let net_wt: number | null = null

        if (cycleWeights.length >= 1) {
          const minEntry = cycleWeights.reduce((a, b) => (a.weight <= b.weight ? a : b))
          const maxEntry = cycleWeights.reduce((a, b) => (a.weight >= b.weight ? a : b))

          tare_wt = minEntry.weight
          tare_wt_time = minEntry.time

          if (maxEntry.weight === minEntry.weight) {
            // only one unique weight reading — no gross, no net
            gross_wt = null
            gross_wt_time = null
            net_wt = null
          } else {
            gross_wt = maxEntry.weight
            gross_wt_time = maxEntry.time
            net_wt = gross_wt - tare_wt
          }
        }

        if (gateEvents.length === 0) {
          cycles.push({ entry_time: null, exit_time: null })
        }

        reportData.push({
          id: globalId++,
          vehicleNo: record.vehicleNo ?? null,
          event_date: record.cycle_date ?? null,
          entry_time: cycle.entry_time?.slice(11, 16) ?? '-',
          exit_time: cycle.exit_time?.slice(11, 16) ?? '-',
          tare_wt,
          tare_wt_time,
          gross_wt,
          gross_wt_time,
          net_wt
        })
      })
    })

    console.log('Processed Report Data:', reportData)

    return reportData
  } catch (error) {
    console.error('Fetch failed:', error)

    return []
  }
}

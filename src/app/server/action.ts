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
function toISTDate(date: Date, time: 'start' | 'end'): Date {
  const dateStr = date.toISOString().split('T')[0] // get YYYY-MM-DD part

  if (time === 'start') {
    return new Date(`${dateStr}T00:00:00+05:30`)
  } else {
    return new Date(`${dateStr}T23:59:59+05:30`)
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
      // Parsing info_entryexit
      type GateEvent = { time: string; movement: '1' | '2' }
      let gateEvents: GateEvent[] = []

      if (record.info_entryexit) {
        const [times_str, movements_str] = record.info_entryexit.split('#')
        const times = times_str?.split(',') ?? []
        const movements = movements_str?.split(',') ?? []

        // console.log('Times_str:', times_str)
        // console.log('Movements_str:', movements_str)

        gateEvents = movements.map((movement, i) => ({
          time: times[i],
          movement: movement as '1' | '2'
        }))

        // console.log('Parsed Gate Events:', gateEvents)
      }

      type AnprEvent = { time: string; weight: number }
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

      // console.log('Parsed ANPR Events:', anprEvents)

      // Vehicle cycles
      type Cycle = { entry_time: string | null; exit_time: string | null }
      const cycles: Cycle[] = []

      // It handles and creates cycles if there is no entry but exit, entry but no exit everything is taken care of
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

      // Link ANPR weights to cycles
      cycles.forEach(cycle => {
        let cycleWeights: AnprEvent[] = []

        if (cycle.entry_time || cycle.exit_time) {
          // Find events where atleast one of these is true
          // if entry missing → use start of day
          // if exit missing → use end of day
          const cycleStart = cycle.entry_time
            ? new Date(cycle.entry_time)
            : toISTDate(new Date(record.cycle_date), 'start')

          const cycleEnd = cycle.exit_time ? new Date(cycle.exit_time) : toISTDate(new Date(record.cycle_date), 'end')

          // filter weights that fall wiithin the cycle entry exit time
          cycleWeights = anprEvents.filter(e => {
            const t = new Date(e.time)

            // Return true and false
            return t >= cycleStart && t <= cycleEnd && t.toDateString() === new Date(record.cycle_date).toDateString()
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
          // Using reduce() to comapre two values at a time in just 2 lines of code instead of loops
          // tare_wt = 0
          // gross_wt = 0
          // for(let i=0; i< cycleWeights.length; i++){
          // let wt = cycleWeights[i].weight
          // let time = cycleWeights[i].time
          // if( wt < tare_wt){ tare_wt = wt}
          // if( wt > gross_wt){ gross_wt = wt}
          // }
          const minWt = cycleWeights.reduce((a, b) => (a.weight <= b.weight ? a : b))
          const maxWt = cycleWeights.reduce((a, b) => (a.weight >= b.weight ? a : b))

          tare_wt = minWt.weight
          tare_wt_time = minWt.time

          if (maxWt.weight === minWt.weight) {
            // only one unique weight reading no gross, no net
            gross_wt = null
            gross_wt_time = null
            net_wt = null
          } else {
            gross_wt = maxWt.weight
            gross_wt_time = maxWt.time
            net_wt = gross_wt - tare_wt
          }
        }

        if (gateEvents.length === 0) {
          cycles.push({ entry_time: null, exit_time: null })
        }

        reportData.push({
          id: globalId++,
          vehicleNo: record.vehicleNo ?? null,
          event_date: record.cycle_date,
          entry_time: cycle.entry_time?.slice(11, 16) ?? '-',
          exit_time: cycle.exit_time?.slice(11, 16) ?? '-',
          tare_wt: tare_wt,
          tare_wt_time: tare_wt_time,
          gross_wt: gross_wt,
          gross_wt_time: gross_wt_time,
          net_wt: net_wt
        })
      })
    })

    const ordered_reportData = reportData.sort((a, b) => {
      // Sort by event_date desc
      const dateA = new Date(a.event_date as string)
      const dateB = new Date(b.event_date as string)

      if (dateB.getTime() !== dateA.getTime()) {
        return dateB.getTime() - dateA.getTime() // desc by date
      }

      // If same date, sort by entry_time desc
      const timeA = a.entry_time !== '-' ? (a.entry_time as string) : '00:00'
      const timeB = b.entry_time !== '-' ? (b.entry_time as string) : '00:00'

      return timeB.localeCompare(timeA)
    })

    // console.log('Processed Report Data:', ordered_reportData)

    return order === 'asc' ? reportData : ordered_reportData
  } catch (error) {
    console.error('Fetch failed:', error)

    return []
  }
}

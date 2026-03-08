'use client'

import { useEffect, useState } from 'react'

import Grid from '@mui/material/Grid2'

import VehicleNoCard from '@views/dashboards/crm/VehicleNoCard'

import { getVehicleStats } from '@/app/server/action'

type VehicleStat = {
  todayCount: number
  monthCount: number
  yearCount: number
}

type VehicleStatsData = {
  entry: VehicleStat
  exit: VehicleStat
  load: VehicleStat
  unload: VehicleStat
}

const defaultStats: VehicleStatsData = {
  entry: { todayCount: 0, monthCount: 0, yearCount: 0 },
  exit: { todayCount: 0, monthCount: 0, yearCount: 0 },
  load: { todayCount: 0, monthCount: 0, yearCount: 0 },
  unload: { todayCount: 0, monthCount: 0, yearCount: 0 }
}

const DashboardCard2 = () => {
  const [data, setData] = useState<VehicleStatsData>(defaultStats)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const stats = await getVehicleStats()

        setData(stats)
      } catch (error) {
        console.error('Failed to fetch vehicle stats:', error)
      }
    }

    fetchStats()

    const interval = setInterval(fetchStats, 5000) // Interval to fetch stats every 1 second, it is calling fetchStats function

    return () => clearInterval(interval) // This is required to clear the interval time when the user click on another that mean the component is umountd
  }, [])

  return (
    <>
      <Grid size={{ xs: 12, sm: 3 }}>
        <VehicleNoCard
          title='ENTRY'
          type='entry'
          todayCount={data.entry.todayCount}
          monthCount={data.entry.monthCount}
          yearCount={data.entry.yearCount}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 3 }}>
        <VehicleNoCard
          title='EXIT'
          type='exit'
          todayCount={data.exit.todayCount}
          monthCount={data.exit.monthCount}
          yearCount={data.exit.yearCount}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 3 }}>
        <VehicleNoCard
          title='LOADING'
          type='load'
          todayCount={data.load.todayCount}
          monthCount={data.load.monthCount}
          yearCount={data.load.yearCount}

          // iconSrc='/icons/loading.png'
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 3 }}>
        <VehicleNoCard
          title='UNLOADING'
          type='unload'
          todayCount={data.unload.todayCount}
          monthCount={data.unload.monthCount}
          yearCount={data.unload.yearCount}

          // iconSrc='/icons/unloading.png'
        />
      </Grid>
    </>
  )
}

export default DashboardCard2

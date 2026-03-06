import Grid from '@mui/material/Grid2'

import VehicleNoCard from '@views/dashboards/crm/VehicleNoCard'

import { getVehicleStats } from '@/app/server/action'

const DashboardCard = async () => {
  const data = await getVehicleStats()

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
          iconSrc='/icons/loading.png'
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 3 }}>
        <VehicleNoCard
          title='UNLOADING'
          type='unload'
          todayCount={data.unload.todayCount}
          monthCount={data.unload.monthCount}
          yearCount={data.unload.yearCount}
          iconSrc='/icons/unloading.png'
        />
      </Grid>
    </>
  )
}

export default DashboardCard

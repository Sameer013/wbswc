import Grid from '@mui/material/Grid2'

import VehicleNoCard from '@views/dashboards/crm/VehicleNoCard'
import LiveAlerts from '@/views/dashboards/crm/LiveAlerts'
import DonutChart from '@/views/charts/DonutChart'
import Statictics from '@/views/charts/Statistics'
import OverviewTable from '@/views/tables/OverviewTable'

// TODO [Database Integration]
// Replace dummyTrucks with an API call or server-side fetch like:
// with Prisma:
// const truckData = await prisma.truck.findMany()

import { dummyTrucks } from '@/data/truckDummydata'

const Dashboard = async () => {
  return (
    <Grid container spacing={6}>
      {/* Left section */}
      <Grid size={{ xs: 12, md: 8 }} sx={{ order: { xs: 1, md: 1 } }}>
        <Grid container spacing={6}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <VehicleNoCard title='Entry' type='entry' todayCount={30} weekCount={184} monthCount={720} />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <VehicleNoCard title='Exit' type='exit' todayCount={20} weekCount={120} monthCount={480} />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <VehicleNoCard title='Loading' type='load' todayCount={20} weekCount={120} monthCount={480} />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <VehicleNoCard title='Unloading' type='unload' todayCount={20} weekCount={120} monthCount={480} />
          </Grid>
        </Grid>
      </Grid>

      {/* Right section */}
      <Grid size={{ xs: 12, md: 4 }} sx={{ order: { xs: 99, md: 2 } }}>
        <Grid container spacing={6}>
          <Grid size={{ xs: 12 }}>
            <LiveAlerts />
          </Grid>
          {/* Add more charts here */}
          {/* <Grid size={{ xs: 12 }}>
            <YourNextChart />
          </Grid> */}
        </Grid>
      </Grid>

      <Grid size={{ xs: 12, sm: 6 }} sx={{ order: { xs: 2, md: 3 } }}>
        <DonutChart title='Total Movement' sub_title='Various Movement accross Warehouse' />
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }} sx={{ order: { xs: 2, md: 3 } }}>
        <Statictics />
      </Grid>
      <Grid size={{ xs: 12, sm: 12 }} sx={{ order: { xs: 4, md: 4 } }}>
        <OverviewTable truckData={dummyTrucks} />
      </Grid>
    </Grid>
  )
}

export default Dashboard

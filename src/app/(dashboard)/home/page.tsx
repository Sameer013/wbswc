import Grid from '@mui/material/Grid2'

import LiveAlerts from '@/views/dashboards/crm/LiveAlerts'

// import DonutChart from '@/views/charts/DonutChart'
// import Statictics from '@/views/charts/Statistics'

// TODO [Database Integration]
// Replace dummyTrucks with an API call or server-side fetch like:
// with Prisma:
// const truckData = await prisma.truck.findMany()

// import { dummyTrucks } from '@/data/truckDummydata'
import LineChart from '@/views/charts/LineChart'

// import LiveFeed from '@/components/LiveFeed'
import LiveAlertsFeed from '@/views/dashboards/crm/LiveAlertsFeed'

import DashboardCard2 from '@/components/DashboardCard'

const Dashboard = async () => {
  return (
    <Grid container spacing={6}>
      {/* Left section */}
      <Grid size={{ xs: 12, md: 8 }} sx={{ order: { xs: 1, md: 1 } }}>
        <Grid container spacing={6}>
          <DashboardCard2 />
          {/* <Grid size={{ xs: 12, sm: 3 }}>
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
          </Grid> */}
          {/* <Grid size={{ xs: 12, sm: 12 }} sx={{ order: { xs: 4, md: 4 } }}>
            <OverviewTable truckData={dummyTrucks} />
          </Grid> */}
          <Grid size={{ xs: 12, sm: 12 }} sx={{ order: { xs: 4, md: 4 } }}>
            <LineChart />
          </Grid>
          {/* <Grid size={{ xs: 12, sm: 12 }} sx={{ order: { xs: 4, md: 4 } }}>
            <LiveFeed />
          </Grid> */}
          <Grid size={{ xs: 12 }} sx={{ order: { xs: 5, md: 5 } }}>
            <LiveAlertsFeed />
          </Grid>
        </Grid>
      </Grid>

      {/* Right section */}
      <Grid size={{ xs: 12, md: 4 }} sx={{ order: { xs: 99, md: 2 } }}>
        <Grid container spacing={6}>
          <Grid size={{ xs: 12 }}>
            <LiveAlerts />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  )
}

export default Dashboard

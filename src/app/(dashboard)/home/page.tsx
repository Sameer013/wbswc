import Grid from '@mui/material/Grid2'

import LiveAlerts from '@/views/dashboards/crm/LiveAlerts'

import LineChart from '@/views/charts/LineChart'

import LiveAlertsFeed from '@/views/dashboards/crm/LiveAlertsFeed'

import DashboardCard2 from '@/components/DashboardCard2'

const Dashboard = () => {
  return (
    <Grid container spacing={6}>
      {/* Left section */}
      <Grid size={{ xs: 12, md: 8 }} sx={{ order: { xs: 1, md: 1 } }}>
        <Grid container spacing={6}>
          <DashboardCard2 />
         
          <Grid size={{ xs: 12, sm: 12 }} sx={{ order: { xs: 4, md: 4 } }}>
            <LineChart />
          </Grid>
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

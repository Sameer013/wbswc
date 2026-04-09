// MUI Imports
import Grid from '@mui/material/Grid2'

import { getReportData } from '@/app/server/action'

// Component Imports
import ProductListTable from '@views/list/ProductListTable'

// Data Imports
// import { getEcommerceData } from '@/app/server/actions'

const VehiclesTable = async () => {
  const data = await getReportData(undefined, undefined, 20)

  // const data = await getReportData(new Date('2026-04-03'), new Date('2026-04-05'), 20)

  // const data2 = await getVehicleData()

  return (
    <Grid container spacing={6}>
      <Grid size={{ xs: 12 }}>
        <ProductListTable tableData={data} />
      </Grid>
    </Grid>
  )
}

export default VehiclesTable

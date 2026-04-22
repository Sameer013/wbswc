// MUI Imports
import Grid from '@mui/material/Grid2'

import { getReportData } from '@/app/server/action'

// Component Imports
import ProductListTable from '@views/list/ProductListTable'

const VehiclesTable = async () => {
  const data = await getReportData(new Date(), new Date(), 50)

  return (
    <Grid container spacing={6}>
      <Grid size={{ xs: 12 }}>
        <ProductListTable tableData={data} />
      </Grid>
    </Grid>
  )
}

export default VehiclesTable

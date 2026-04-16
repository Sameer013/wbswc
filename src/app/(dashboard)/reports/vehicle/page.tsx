import FilterReport from '@components/FilterReport'

const VehiclesReport = async () => {
  return (
    <FilterReport
      url='/reports/summary/vehicle/pdf'
      cardTitle='Vehicles Reports'
      cardDesc='Select a data range below to generate MIS Report'
    />
  )
}

export default VehiclesReport

import FilterReport from '@components/FilterReport'

const BagsReport = async () => {
  return (
    <FilterReport
      url='/reports/summary/vehicle/pdf'
      cardTitle='Bagging Reports'
      cardDesc='Select a data range below to generate Bagging Report'
    />
  )
}

export default BagsReport

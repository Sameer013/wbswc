'use client'

// Next Imports
import dynamic from 'next/dynamic'

// MUI Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'

// Third-party Imports
import type { ApexOptions } from 'apexcharts'

// Styled Component Imports
const AppReactApexCharts = dynamic(() => import('@/libs/styles/AppReactApexCharts'))

const chartCategories = {
  dates: [
    '7/12',
    '8/12',
    '9/12',
    '10/12',
    '11/12',
    '12/12',
    '13/12',
    '14/12',
    '15/12',
    '16/12',
    '17/12',
    '18/12',
    '19/12',
    '20/12',
    '21/12'
  ]
}

const series = [
  {
    type: 'line',
    name: 'Entry',
    data: [42, 55, 38, 61, 47, 70, 33, 58, 65, 44, 52, 39, 67, 48, 56]
  },
  {
    type: 'line',
    name: 'Exit',
    data: [38, 50, 35, 57, 43, 65, 30, 54, 60, 40, 48, 36, 62, 44, 51]
  },
  {
    type: 'bar',
    name: 'Loading',
    data: [320, 450, 280, 510, 390, 620, 240, 480, 550, 360, 430, 300, 580, 410, 470]
  },
  {
    type: 'bar',
    name: 'Unloading',
    data: [290, 420, 260, 480, 370, 590, 220, 450, 520, 340, 400, 275, 550, 385, 445]
  }
]

const LineChart = () => {
  const divider = 'var(--mui-palette-divider)'
  const disabledText = 'var(--mui-palette-text-disabled)'

  const options: ApexOptions = {
    chart: {
      type: 'line',
      parentHeightOffset: 0,
      zoom: { enabled: false },
      toolbar: { show: false }
    },
    legend: {
      show: true,
      position: 'bottom'
    },

    // colors: ['#ff9f43', '#28c76f', '#ea5455', '#7367f0'],
    colors: ['#ea5455', '#7367f0', '#ff9f43', '#28c76f'],
    stroke: {
      curve: 'straight',
      dashArray: [0, 0, 0, 0], // Truck Exit dashed, rest solid
      width: [2, 2, 0, 0] // No stroke width for bars
    },
    dataLabels: { enabled: false },
    markers: {
      size: 0,
      strokeWidth: 1,
      strokeOpacity: 1,

      // colors: ['#ff9f43', '#28c76f', '#ea5455', '#7367f0'],
      colors: ['#ea5455', '#7367f0', '#ff9f43', '#28c76f'],
      strokeColors: ['#fff']
    },
    grid: {
      padding: { top: -10 },
      borderColor: divider,
      xaxis: { lines: { show: true } }
    },
    tooltip: {
      shared: true,
      intersect: false
    },

    yaxis: [
      {
        seriesName: 'Truck Entry',
        opposite: false,
        title: {
          text: 'Truck Count',
          style: { color: '#ff9f43' }
        },
        labels: {
          style: { colors: disabledText, fontSize: '13px' }
        }
      },
      {
        seriesName: 'Truck Entry',
        show: false
      },
      {
        // y1 — Bars: Goods Loading (index 2)
        seriesName: 'Loading',
        opposite: true,
        title: {
          text: 'Goods (tons)',
          style: { color: '#ea5455' }
        },
        labels: {
          style: { colors: disabledText, fontSize: '13px' }
        }
      },
      {
        seriesName: 'Loading',
        show: false
      }
    ],
    xaxis: {
      axisBorder: { show: false },
      axisTicks: { color: divider },
      crosshairs: { stroke: { color: divider } },
      labels: {
        style: { colors: disabledText, fontSize: '13px' }
      },

      categories: chartCategories.dates
    }
  }

  return (
    <Card>
      <CardHeader
        title='Overview of Truck Movements'
        sx={{
          flexDirection: ['column', 'row'],
          alignItems: ['flex-start', 'center'],
          '& .MuiCardHeader-action': { mb: 0 },
          '& .MuiCardHeader-content': { mb: [0, 0] }
        }}
      />
      <CardContent>
        <AppReactApexCharts type='line' width='100%' height={200} options={options} series={series} />
      </CardContent>
    </Card>
  )
}

export default LineChart

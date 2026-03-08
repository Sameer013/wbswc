'use client'

// Next Imports
import { useEffect, useState } from 'react'

import dynamic from 'next/dynamic'

// MUI Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import { useTheme } from '@mui/material/styles'

// Third-party Imports
import type { ApexOptions } from 'apexcharts'

// Server Action
import { getChartData } from '@/app/server/action'

// Styled Component Imports
const AppReactApexCharts = dynamic(() => import('@/libs/styles/AppReactApexCharts'))

interface ChartRow {
  date: string
  Entry: string
  Exit: string
  Loading: string
  Unloading: string
}

const LineChart = () => {
  const [data, setData] = useState<ChartRow[]>([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getChartData()

        if (res && Array.isArray(res.data)) {
          setData(res.data as ChartRow[])
        } else if (Array.isArray(res)) {
          setData(res as ChartRow[])
        }
      } catch (error) {
        console.error('Failed to fetch Chart Series.')
      }
    }

    fetchData()

    const interval = setInterval(fetchData, 60000)

    return () => clearInterval(interval)
  }, [])

  const theme = useTheme()
  const divider = 'var(--mui-palette-divider)'
  const paper = 'var(--mui-palette-background-paper)'
  const disabledText = 'var(--mui-palette-text-disabled)'
  const secondaryText = 'var(--mui-palette-text-secondary)'
  const mode = theme.palette.mode

  const colors = ['#ea5455', '#7367f0', '#ff9f43', '#28c76f']

  const categories = data.map(d =>
    new Date(d.date).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'numeric'
    })
  )

  const series = [
    {
      name: 'Entry',
      type: 'line',
      data: data.map(d => Number(d.Entry))
    },
    {
      name: 'Exit',
      type: 'line',
      data: data.map(d => Number(d.Exit))
    },
    {
      name: 'Loading',
      type: 'line',
      data: data.map(d => Number(d.Loading))
    },
    {
      name: 'Unloading',
      type: 'line',
      data: data.map(d => Number(d.Unloading))
    }
  ]

  const options: ApexOptions = {
    chart: {
      type: 'line',
      parentHeightOffset: 0,
      zoom: { enabled: false },
      toolbar: { show: false }
    },
    theme: { mode },
    legend: {
      show: true,
      position: 'bottom'
    },
    colors,
    stroke: {
      curve: 'straight',
      dashArray: [0, 0, 0, 0],
      width: [2, 2, 2, 2]
    },
    dataLabels: { enabled: false },
    markers: {
      size: 0,
      strokeWidth: 1,
      strokeOpacity: 1,
      colors,
      strokeColors: paper
    },
    grid: {
      padding: { top: -10 },
      borderColor: divider,
      xaxis: { lines: { show: true } }
    },
    tooltip: {
      shared: true,
      intersect: false,
      theme: mode
    },
    yaxis: [
      {
        seriesName: 'Entry',
        opposite: false,
        title: {
          text: 'Truck Count',
          style: { color: secondaryText }
        },
        labels: {
          style: { colors: disabledText, fontSize: '13px' }
        }
      },
      { seriesName: 'Exit', show: false },
      {
        seriesName: 'Loading',
        opposite: true,
        title: {
          text: 'Loading Count',
          style: { color: secondaryText }
        },
        labels: {
          style: { colors: disabledText, fontSize: '13px' }
        }
      },
      { seriesName: 'Unloading', show: false }
    ],
    xaxis: {
      axisBorder: { show: false },
      axisTicks: { color: divider },
      crosshairs: { stroke: { color: divider } },
      labels: {
        style: { colors: disabledText, fontSize: '13px' }
      },
      categories
    }
  }

  return (
    <Card>
      <CardHeader title='Overview of Truck Movements' />
      <CardContent>
        <AppReactApexCharts type='line' width='100%' height={200} options={options} series={series} />
      </CardContent>
    </Card>
  )
}

export default LineChart

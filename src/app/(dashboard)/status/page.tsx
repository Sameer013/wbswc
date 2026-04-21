'use client'

import { useMemo, useState, useEffect } from 'react'

import { Card, CardHeader, Typography, Button, Chip, Box } from '@mui/material'
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getSortedRowModel,
  type FilterFn
} from '@tanstack/react-table'

import RefreshIcon from '@mui/icons-material/Refresh'

import DownloadIcon from '@mui/icons-material/Download'

import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord'

// import CustomTextField from '@core/components/mui/TextField'
import tableStyles from '@core/styles/table.module.css'
import { exportToCSV, formatTimestamp } from '@/utils/functions'

import { getDeviceStatus } from '@/app/server/action'

// Icons

export type DeviceStatusType = {
  id: number
  ip: string
  desc: string | null
  status: string | 'Online' | 'Offline'
  last_down: string | Date | null
  duration: number // in minutes
}

const columnHelper = createColumnHelper<DeviceStatusType>()

const DeviceStatusTable = () => {
  const [data, setData] = useState<DeviceStatusType[]>([])
  const [loading, setLoading] = useState(false)

  const fetchData = async () => {
    setLoading(true)
    const result = await getDeviceStatus()

    setData(result)
    setLoading(false)
  }

  useEffect(() => {
    fetchData()
    const interval = setInterval(fetchData, 30000) // Auto-refresh every 30s

    return () => clearInterval(interval)
  }, [])

  const columns = useMemo(
    () => [
      columnHelper.accessor('desc', {
        header: 'Device Name',
        cell: ({ row }) => (
          <Box>
            <Typography variant='body1' fontWeight='600'>
              {row.original.desc}
            </Typography>
            <Typography variant='caption' color='textSecondary'>
              {row.original.ip}
            </Typography>
          </Box>
        )
      }),
      columnHelper.accessor('status', {
        header: 'Current Status',
        cell: ({ row }) => (
          <Chip
            icon={<FiberManualRecordIcon sx={{ fontSize: '12px !important' }} />}
            label={row.original.status}
            size='small'
            variant='tonal'
            color={row.original.status === 'Online' ? 'success' : 'error'}
            sx={{ fontWeight: 'bold' }}
          />
        )
      }),
      columnHelper.accessor('last_down', {
        header: 'Last Downtime',
        cell: ({ row }) => (
          <Typography variant='body2'>
            {row.original.last_down ? formatTimestamp(new Date(row.original.last_down)) : 'Never'}
          </Typography>
        )
      }),
      columnHelper.accessor('duration', {
        header: 'Duration (Min)',
        cell: ({ row }) => (
          <Typography
            variant='body2'
            color={row.original.duration > 10 ? 'error.main' : 'textPrimary'}
            fontWeight={row.original.duration > 10 ? 'bold' : 'normal'}
          >
            {row.original.duration} mins
          </Typography>
        )
      })
    ],
    []
  )

  const fuzzyFilter: FilterFn<any> = (row, columnId, value) => {
    const cellValue = String(row.getValue(columnId) ?? '').toLowerCase()

    return cellValue.includes(String(value).toLowerCase())
  }

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),

    filterFns: { fuzzy: fuzzyFilter },
    initialState: { sorting: [{ id: 'status', desc: true }] }
  })

  return (
    <Card>
      <CardHeader
        title='Device Connectivity Monitor'
        action={
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button variant='outlined' startIcon={<RefreshIcon />} onClick={fetchData} disabled={loading}>
              Refresh
            </Button>
            <Button variant='contained' startIcon={<DownloadIcon />} onClick={() => exportToCSV(table)} color='primary'>
              Export CSV
            </Button>
          </Box>
        }
      />

      <div className='overflow-x-auto'>
        <table className={tableStyles.table}>
          <thead>
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <th key={header.id} onClick={header.column.getToggleSortingHandler()}>
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan={4} className='text-center p-10'>
                  No Data Available
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map(row => (
                <tr key={row.id}>
                  {row.getVisibleCells().map(cell => (
                    <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </Card>
  )
}

export default DeviceStatusTable

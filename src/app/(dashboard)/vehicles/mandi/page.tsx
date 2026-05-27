'use client'

import { useEffect, useMemo, useState } from 'react'

// MUI Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import Button from '@mui/material/Button'
import MenuItem from '@mui/material/MenuItem'
import TablePagination from '@mui/material/TablePagination'
import Typography from '@mui/material/Typography'

import Chip from '@mui/material/Chip'
import Skeleton from '@mui/material/Skeleton'
import TextField from '@mui/material/TextField'

// Third-party Imports
import classnames from 'classnames'
import { rankItem } from '@tanstack/match-sorter-utils'
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel
} from '@tanstack/react-table'
import type { ColumnDef, FilterFn } from '@tanstack/react-table'

// Custom Components & Utils
import CustomTextField from '@core/components/mui/TextField'
import TablePaginationComponent from '@components/TablePaginationComponent'
import tableStyles from '@core/styles/table.module.css'
import { formatDate, formatTimestamp } from '@/utils/functions'

// Server Actions
import { getMandiCases } from '@/app/server/action'

export type MandiCaseRecord = {
  id: number
  cycle_date: Date | null
  vehicle_no: string | null
  cycle_part: any | null
  entry_time: Date | null
  exit_time: Date | null
  weights: string | null
}

const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
  const itemRank = rankItem(row.getValue(columnId), value)

  addMeta({ itemRank })

  return itemRank.passed
}

const columnHelper = createColumnHelper<MandiCaseRecord>()

const MandiCaseTable = () => {
  const [data, setData] = useState<MandiCaseRecord[]>([])
  const [globalFilter, setGlobalFilter] = useState('')
  const [loading, setLoading] = useState(true)
  const [fromDate, setFromDate] = useState<string>('')
  const [toDate, setToDate] = useState<string>('')

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)

      try {
        const result = await getMandiCases(new Date(), new Date(), 100)

        setData(result)
      } catch (error) {
        console.error('Error fetching mandi cases:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleDateFilter = async () => {
    if (!fromDate || !toDate) {
      alert('Please select both dates')

      return
    }

    setLoading(true)

    try {
      const result = await getMandiCases(new Date(fromDate), new Date(toDate))

      setData(result)
    } catch (error) {
      console.error('Error fetching filtered mandi cases:', error)
    } finally {
      setLoading(false)
    }
  }

  const columns = useMemo<ColumnDef<MandiCaseRecord, any>[]>(
    () => [
      columnHelper.accessor('id', {
        header: 'ID',
        cell: ({ row }) => <Typography color='primary'>#{row.original.id}</Typography>
      }),
      columnHelper.accessor('cycle_date', {
        header: 'Cycle Date',
        cell: ({ row }) => (
          <Typography color='primary'>
            {row.original.cycle_date ? formatDate(row.original.cycle_date) : '--'}
          </Typography>
        )
      }),
      columnHelper.accessor('vehicle_no', {
        header: 'Vehicle Number',
        cell: ({ row }) => <Chip label={row.original.vehicle_no} color='error' variant='tonal' size='small' />
      }),
      columnHelper.accessor('cycle_part', {
        header: 'Cycle Part',
        cell: ({ row }) => (
          <Typography variant='body2' className='max-w-[200px] truncate'>
            {row.original.cycle_part || 'No cycle part'}
          </Typography>
        )
      }),
      columnHelper.accessor('entry_time', {
        header: 'Entry Time',
        cell: ({ row }) => (
          <Typography variant='body2' className='max-w-[200px] truncate'>
            {row.original.entry_time ? formatTimestamp(row.original.entry_time) : '--'}
          </Typography>
        )
      }),
      columnHelper.accessor('exit_time', {
        header: 'Exit Time',
        cell: ({ row }) => (
          <Typography variant='body2' className='max-w-[200px] truncate'>
            {row.original.exit_time ? formatTimestamp(row.original.exit_time) : '--'}
          </Typography>
        )
      }),
      columnHelper.accessor('weights', {
        header: 'Weight',
        cell: ({ row }) => (
          <Typography variant='body2' className='max-w-[200px] truncate'>
            {row.original.weights !== null ? row.original.weights : '--'}
          </Typography>
        )
      })
    ],
    []
  )

  const table = useReactTable({
    data,
    columns,
    filterFns: { fuzzy: fuzzyFilter },
    state: { globalFilter },
    initialState: {
      pagination: { pageSize: 10 },
      sorting: [{ id: 'id', desc: true }]
    },
    globalFilterFn: fuzzyFilter,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel()
  })

  return (
    <Card>
      <CardHeader title='Mandi Cases' />
      <div className='flex flex-wrap justify-between gap-4 p-4'>
        <div className='flex flex-wrap items-center gap-4'>
          <CustomTextField
            value={globalFilter ?? ''}
            onChange={e => setGlobalFilter(e.target.value)}
            placeholder='Search Mandi Cases...'
            size='small'
            sx={{ width: { xs: '100%', sm: 250 } }}
          />
          <TextField
            label='From Date'
            type='date'
            size='small'
            value={fromDate}
            onChange={e => setFromDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
            sx={{ width: { xs: '48%', sm: 180 } }}
          />
          <TextField
            label='To Date'
            type='date'
            size='small'
            value={toDate}
            onChange={e => setToDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
            sx={{ width: { xs: '48%', sm: 180 } }}
          />
          <Button variant='contained' size='small' onClick={handleDateFilter}>
            Apply
          </Button>
        </div>
        <div className='flex items-center gap-4'>
          <CustomTextField
            select
            value={table.getState().pagination.pageSize}
            onChange={e => table.setPageSize(Number(e.target.value))}
            className='is-[70px]'
          >
            <MenuItem value='10'>10</MenuItem>
            <MenuItem value='25'>25</MenuItem>
            <MenuItem value='50'>50</MenuItem>
          </CustomTextField>
        </div>
      </div>

      <div className='overflow-x-auto'>
        <table className={tableStyles.table}>
          <thead>
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <th key={header.id}>
                    <div
                      className={classnames({
                        'flex items-center': header.column.getIsSorted(),
                        'cursor-pointer select-none': header.column.getCanSort()
                      })}
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      {flexRender(header.column.columnDef.header, header.getContext())}
                      {{
                        asc: <i className='tabler-chevron-up text-xl' />,
                        desc: <i className='tabler-chevron-down text-xl' />
                      }[header.column.getIsSorted() as 'asc' | 'desc'] ?? null}
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {loading ? (
              Array.from(new Array(5)).map((_, index) => (
                <tr key={`skeleton-${index}`}>
                  {columns.map((_, colIndex) => (
                    <td key={`col-${colIndex}`}>
                      <Skeleton variant='text' sx={{ fontSize: '1rem', my: 1 }} />
                    </td>
                  ))}
                </tr>
              ))
            ) : table.getRowModel().rows.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className='text-center p-10'>
                  <Typography color='textSecondary'>No mandi cases recorded</Typography>
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

      <TablePagination
        component={() => <TablePaginationComponent table={table} />}
        count={table.getFilteredRowModel().rows.length}
        rowsPerPage={table.getState().pagination.pageSize}
        page={table.getState().pagination.pageIndex}
        onPageChange={(_, page) => table.setPageIndex(page)}
      />
    </Card>
  )
}

export default MandiCaseTable

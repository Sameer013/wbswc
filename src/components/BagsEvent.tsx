'use client'

// app/(dashboard)/vehicles/bags/BagsEvent.tsx (or components/BagsEvent.tsx)
// Client Component

import { useMemo, useState, useTransition, useCallback } from 'react'

// MUI Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import Button from '@mui/material/Button'
import MenuItem from '@mui/material/MenuItem'
import TablePagination from '@mui/material/TablePagination'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import CircularProgress from '@mui/material/CircularProgress'

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
import type { ColumnDef, FilterFn, Table } from '@tanstack/react-table'

// Custom Components
import CustomTextField from '@core/components/mui/TextField'
import TablePaginationComponent from '@components/TablePaginationComponent'

// Style Imports
import tableStyles from '@core/styles/table.module.css'

// Types & Utils
import type { BagSummaryRecord } from '@/components/reports/BagSummaryReport'
import { formatDate } from '@/utils/functions'
import { getBagsCnt } from '@/app/server/action'

// Types

export type BagVehicleType = BagSummaryRecord & { actions?: string }

interface BagsEventProps {
  initialData?: BagVehicleType[]
}

// Helpers

const fuzzyFilter: FilterFn<BagVehicleType> = (row, columnId, value, addMeta) => {
  const itemRank = rankItem(row.getValue(columnId), value)

  addMeta({ itemRank })

  return itemRank.passed
}

const columnHelper = createColumnHelper<BagVehicleType>()

const BagsEvent = ({ initialData = [] }: BagsEventProps) => {
  // Seed state from server-fetched data — no useEffect for initial load needed
  const [data, setData] = useState<BagVehicleType[]>(initialData)
  const [globalFilter, setGlobalFilter] = useState('')
  const [rowSelection, setRowSelection] = useState({})
  const [fromDate, setFromDate] = useState<string>('')
  const [toDate, setToDate] = useState<string>('')
  const [isPending, startTransition] = useTransition()
  const [eventFilter, setEventFilter] = useState<string>('')

  // Date-filter handler
  const handleDateFilter = useCallback(() => {
    if (!fromDate || !toDate) {
      alert('Please select both dates')

      return
    }

    startTransition(async () => {
      const filtered = await getBagsCnt(new Date(fromDate), new Date(toDate))

      setData(filtered)
    })
  }, [fromDate, toDate])

  const filteredData = useMemo(() => {
    if (!eventFilter) return data

    return data.filter(row => row.type_of_event === eventFilter)
  }, [data, eventFilter])

  // Columns
  const columns = useMemo<ColumnDef<BagVehicleType, any>[]>(
    () => [
      columnHelper.accessor('id', {
        header: 'ID',
        cell: ({ row }) => <Typography>#{row.original.id}</Typography>
      }),
      columnHelper.accessor('cycle_date', {
        header: 'Date',
        cell: ({ row }) => (
          <Typography>{row.original.cycle_date ? formatDate(new Date(row.original.cycle_date)) : '*'}</Typography>
        )
      }),

      columnHelper.accessor('vehicleNo', {
        header: 'Vehicle No',

        cell: ({ row }) => <Typography fontWeight={700}>{row.original.vehicleNo ?? '*'}</Typography>

        // cell: () => <Typography fontWeight={700}>{'*'}</Typography>
      }),

      columnHelper.accessor('start_time', {
        header: 'Time (In)',

        // cell: () => <Typography>{'*'}</Typography>

        cell: ({ row }) => (
          <Typography>
            {row.original.start_time
              ? new Date(row.original.start_time).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit'
                })
              : '*'}
          </Typography>
        )
      }),
      columnHelper.accessor('end_time', {
        header: 'Time (Out)',

        // cell: () => <Typography>{'*'}</Typography>

        cell: ({ row }) => (
          <Typography>
            {row.original.end_time
              ? new Date(row.original.end_time).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit'
                })
              : '*'}
          </Typography>
        )
      }),
      columnHelper.accessor('type_of_event', {
        header: 'Event (Load/Unload)',
        cell: ({ row }) => <Typography>{row.original.type_of_event ?? '*'}</Typography>
      }),
      columnHelper.accessor('cnt', {
        header: 'Bag Count',
        cell: ({ row }) => <Typography>{row.original.cnt ?? '0'}</Typography>
      })
    ],
    []
  )

  // Table instance
  const table = useReactTable({
    data: filteredData,
    columns,
    filterFns: { fuzzy: fuzzyFilter },
    state: { rowSelection, globalFilter },
    initialState: { pagination: { pageSize: 10 } },
    enableRowSelection: true,
    globalFilterFn: fuzzyFilter,
    onRowSelectionChange: setRowSelection,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel()
  })

  function exportToCSV(table: any, filename: string) {
    const rows = table.getFilteredRowModel().rows

    if (!rows.length) {
      alert('No data to export')

      return
    }

    const headers = ['ID', 'Date', 'Vehicle No', 'Time_in', 'Time_out', 'event_type', 'bag_count']

    const csvData = rows.map((row: any) => {
      const r = row.original

      return [
        `${r.id}`,
        formatDate(new Date(r.cycle_date)),
        r.vehicleNo,
        r.start_time ? new Date(r.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '*',
        r.end_time ? new Date(r.end_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '*',
        r.type_of_event ?? '*',
        r.cnt ?? '0'
      ]
    })

    const csvContent = [headers, ...csvData].map(row => row.map((val: any) => `"${val}"`).join(',')).join('\n')

    const blob = new Blob([csvContent], {
      type: 'text/csv;charset=utf-8;'
    })

    const url = URL.createObjectURL(blob)

    const link = document.createElement('a')

    link.href = url
    link.download = `${filename}_${new Date().toISOString().split('T')[0]}.csv`

    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    URL.revokeObjectURL(url)
  }

  const handleExport = () => exportToCSV(table, 'bags_report')

  // Render
  return (
    <Card>
      <CardHeader title='Bags Summary Report' />

      {/* Toolbar */}
      <div className='flex flex-wrap justify-between gap-4 p-4'>
        {/* Left: search + date filters */}
        <div className='flex flex-wrap items-center gap-4'>
          <CustomTextField
            value={globalFilter ?? ''}
            onChange={e => setGlobalFilter(e.target.value)}
            placeholder='Search'
            size='small'
            sx={{ width: { xs: '100%', sm: 250 } }}
          />
          <TextField
            select
            label='Event Type'
            value={eventFilter}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEventFilter(e.target.value)}
            size='small'
            InputLabelProps={{ shrink: true }}
            SelectProps={{ displayEmpty: true }}
            sx={{ width: { xs: '100%', sm: 160 } }}
          >
            <MenuItem value=''>All Events</MenuItem>
            <MenuItem value='Loading'>Loading</MenuItem>
            <MenuItem value='Unloading'>Unloading</MenuItem>
          </TextField>
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
          <Button
            variant='contained'
            size='small'
            onClick={handleDateFilter}
            disabled={isPending}
            startIcon={isPending ? <CircularProgress size={14} color='inherit' /> : undefined}
          >
            {isPending ? 'Loading…' : 'Apply'}
          </Button>
        </div>

        {/* Right: page-size selector + CSV export */}
        <div className='flex flex-wrap items-center gap-4 max-sm:flex-col max-sm:is-full'>
          <CustomTextField
            select
            value={table.getState().pagination.pageSize}
            onChange={e => table.setPageSize(Number(e.target.value))}
            className='is-[70px] max-sm:is-full'
          >
            <MenuItem value='10'>10</MenuItem>
            <MenuItem value='25'>25</MenuItem>
            <MenuItem value='50'>50</MenuItem>
          </CustomTextField>
          <Button color='primary' variant='tonal' startIcon={<i className='tabler-upload' />} onClick={handleExport}>
            Export CSV
          </Button>
        </div>
        <div className='px-4 py-3 border-bs'>
          <Typography variant='caption' color='var(--mui-palette-error-main)' className='flex items-center gap-1'>
            <span style={{ color: 'var(--mui-palette-error-main)', fontWeight: 'bold' }}>*</span>
            <strong>Note:</strong>Data marked with an asterisk was excluded due to an SOP Mismatch during automated
            curation.
          </Typography>
        </div>
      </div>

      {/* Table */}
      <div className='overflow-x-auto'>
        <table className={tableStyles.table}>
          <thead>
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <th key={header.id}>
                    {!header.isPlaceholder && (
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
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.length === 0 ? (
              <tr>
                <td colSpan={table.getVisibleFlatColumns().length} className='text-center p-4'>
                  No data available for today, Please select a different date or check back later.
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map(row => (
                <tr key={row.id} className={classnames({ selected: row.getIsSelected() })}>
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
        component={() => <TablePaginationComponent table={table as Table<unknown>} />}
        count={table.getFilteredRowModel().rows.length}
        rowsPerPage={table.getState().pagination.pageSize}
        page={table.getState().pagination.pageIndex}
        onPageChange={(_, page) => table.setPageIndex(page)}
      />
    </Card>
  )
}

export default BagsEvent

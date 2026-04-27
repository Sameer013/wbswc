'use client'

// app/(dashboard)/vehicles/bags/BagsEvent.tsx (or components/BagsEvent.tsx)
// ─── Client Component ─────────────────────────────────────────────────────────

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
import { exportToCSV, formatDate } from '@/utils/functions'
import { getBagsCnt } from '@/app/server/action'

// ─── Types ────────────────────────────────────────────────────────────────────

export type BagVehicleType = BagSummaryRecord & { actions?: string }

// ✅ Props no longer include `tableData` — use `initialData` to clarify
// this data comes from the server, not from a parent page component.
interface BagsEventProps {
  initialData?: BagVehicleType[]
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const fuzzyFilter: FilterFn<BagVehicleType> = (row, columnId, value, addMeta) => {
  const itemRank = rankItem(row.getValue(columnId), value)

  addMeta({ itemRank })

  return itemRank.passed
}

const columnHelper = createColumnHelper<BagVehicleType>()

// ─── Component ────────────────────────────────────────────────────────────────

const BagsEvent = ({ initialData = [] }: BagsEventProps) => {
  // Seed state from server-fetched data — no useEffect for initial load needed
  const [data, setData] = useState<BagVehicleType[]>(initialData)
  const [globalFilter, setGlobalFilter] = useState('')
  const [rowSelection, setRowSelection] = useState({})
  const [fromDate, setFromDate] = useState<string>('')
  const [toDate, setToDate] = useState<string>('')
  const [isPending, startTransition] = useTransition()

  // ── Date-filter handler ─────────────────────────────────────────────────────
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

  // ── Columns ─────────────────────────────────────────────────────────────────
  const columns = useMemo<ColumnDef<BagVehicleType, any>[]>(
    () => [
      columnHelper.accessor('id', {
        header: 'ID',
        cell: ({ row }) => <Typography>#{row.original.id}</Typography>
      }),
      columnHelper.accessor('cycle_date', {
        header: 'Cycle Date',
        cell: ({ row }) => (
          <Typography>{row.original.cycle_date ? formatDate(new Date(row.original.cycle_date)) : '-'}</Typography>
        )
      }),
      columnHelper.accessor('vehicleNo', {
        header: 'Vehicle No',
        cell: ({ row }) => <Typography fontWeight={700}>{row.original.vehicleNo ?? '-'}</Typography>
      }),
      columnHelper.accessor('type_of_event', {
        header: 'Event Type',
        cell: ({ row }) => <Typography>{row.original.type_of_event ?? '-'}</Typography>
      }),
      columnHelper.accessor('cnt', {
        header: 'Bag Count',
        cell: ({ row }) => <Typography>{row.original.cnt ?? 0}</Typography>
      }),
      columnHelper.accessor('start_time', {
        header: 'Start Time',
        cell: ({ row }) => (
          <Typography>
            {row.original.start_time
              ? new Date(row.original.start_time).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit'
                })
              : '-'}
          </Typography>
        )
      }),
      columnHelper.accessor('end_time', {
        header: 'End Time',
        cell: ({ row }) => (
          <Typography>
            {row.original.end_time
              ? new Date(row.original.end_time).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit'
                })
              : '-'}
          </Typography>
        )
      })
    ],
    []
  )

  // ── Table instance ──────────────────────────────────────────────────────────
  const table = useReactTable({
    data,
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

  const handleExport = () => exportToCSV(table)

  // ── Render ──────────────────────────────────────────────────────────────────
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
                  No bag records found for the selected criteria.
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

      {/* Pagination */}
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

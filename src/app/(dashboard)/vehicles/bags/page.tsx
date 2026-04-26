'use client'

import { useMemo, useState, useEffect } from 'react'

// MUI Imports
// import dynamic from 'next/dynamic'

import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import Button from '@mui/material/Button'
import MenuItem from '@mui/material/MenuItem'
import TablePagination from '@mui/material/TablePagination'
import Typography from '@mui/material/Typography'
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

// import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf'

// Custom Components
import CustomTextField from '@core/components/mui/TextField'
import TablePaginationComponent from '@components/TablePaginationComponent'

// Style Imports
import tableStyles from '@core/styles/table.module.css'

// Types & Utils
import type { BagSummaryRecord } from '@/components/reports/BagSummaryReport'
import { exportToCSV, formatDate } from '@/utils/functions'
import { getBagsCnt } from '@/app/server/action'

// const PDFButton = dynamic(() => import('@/components/PDFButton'), {
//   ssr: false,
//   loading: () => (
//     <Button variant='outlined' startIcon={<PictureAsPdfIcon />} size='medium' disabled>
//       PDF
//     </Button>
//   )
// })

// Refactored Type Helper
export type BagVehicleType = BagSummaryRecord & { actions?: string }

const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
  const itemRank = rankItem(row.getValue(columnId), value)

  addMeta({ itemRank })

  return itemRank.passed
}

const columnHelper = createColumnHelper<BagVehicleType>()

const BagsEvent = ({ tableData = [] }: { tableData?: BagVehicleType[] }) => {
  const [data, setData] = useState<BagVehicleType[]>(tableData)
  const [globalFilter, setGlobalFilter] = useState('')
  const [rowSelection, setRowSelection] = useState({})
  const [fromDate, setFromDate] = useState<string>('')
  const [toDate, setToDate] = useState<string>('')

  useEffect(() => {
    const fetchData = async () => {
      if (!fromDate && !toDate) {
        // Ensure getReportData returns the correct BagSummaryRecord format
        const stats = await getBagsCnt(new Date(), new Date())

        setData(stats)
      }
    }

    fetchData()
  }, [fromDate, toDate])

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
              ? new Date(row.original.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
              : '-'}
          </Typography>
        )
      }),
      columnHelper.accessor('end_time', {
        header: 'End Time',
        cell: ({ row }) => (
          <Typography>
            {row.original.end_time
              ? new Date(row.original.end_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
              : '-'}
          </Typography>
        )
      })

      //   {
      //     id: 'actions',
      //     header: 'Reports',
      //     enableSorting: false,
      //     cell: ({ row }) => (
      //       <div className='flex items-center'>
      //         <PDFButton record={row.original} />
      //       </div>
      //     )
      //   }
    ],
    []
  )

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

  const handleDateFilter = async () => {
    if (!fromDate || !toDate) {
      alert('Please select both dates')

      return
    }

    const filtered = await getBagsCnt(new Date(fromDate), new Date(toDate))

    setData(filtered)
  }

  return (
    <Card>
      <CardHeader title='Bags Summary Report' />
      <div className='flex flex-wrap justify-between gap-4 p-4'>
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
          <Button variant='contained' size='small' onClick={handleDateFilter}>
            Apply
          </Button>
        </div>
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

export default BagsEvent

'use client'

import { useMemo, useState, useEffect } from 'react'

// import Link from 'next/link'

// import { useRouter } from 'next/navigation'

// MUI Imports
import dynamic from 'next/dynamic'

import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import Button from '@mui/material/Button'

// import Chip from '@mui/material/Chip'
// import Checkbox from '@mui/material/Checkbox'
import MenuItem from '@mui/material/MenuItem'
import TablePagination from '@mui/material/TablePagination'

// import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf'

import Typography from '@mui/material/Typography'

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

import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf'

import TextField from '@mui/material/TextField'

import CustomTextField from '@core/components/mui/TextField'

// import OptionMenu from '@core/components/option-menu'

import TablePaginationComponent from '@components/TablePaginationComponent'

// Style Imports
import tableStyles from '@core/styles/table.module.css'
import type { EventSummaryRecord2 } from '@/components/reports/VehicleSummaryReport'
import { exportToCSV, formatDate } from '@/utils/functions'
import { getReportData } from '@/app/server/action'

const PDFButton = dynamic(() => import('@/components/PDFButton'), {
  ssr: false,
  loading: () => (
    <Button variant='outlined' startIcon={<PictureAsPdfIcon />} size='medium' disabled>
      PDF
    </Button>
  )
})

export type VehicleType = EventSummaryRecord2 & { actions?: string }

const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
  const itemRank = rankItem(row.getValue(columnId), value)

  addMeta({ itemRank })

  return itemRank.passed
}

const columnHelper = createColumnHelper<VehicleType>()

const ProductListTable = ({ tableData = [] }: { tableData?: VehicleType[] }) => {
  const [data, setData] = useState<VehicleType[]>(tableData)
  const [globalFilter, setGlobalFilter] = useState('')
  const [rowSelection, setRowSelection] = useState({})
  const [fromDate, setFromDate] = useState<string>('')
  const [toDate, setToDate] = useState<string>('')

  useEffect(() => {
    const fetchData = async () => {
      if (!fromDate && !toDate) {
        const stats = await getReportData(new Date(), new Date())

        setData(stats)
      }
    }

    fetchData()

    // const interval = setInterval(fetchData, 60000)

    // return () => clearInterval(interval)
  }, [fromDate, toDate])

  const columns = useMemo<ColumnDef<VehicleType, any>[]>(
    () => [
      // {
      //   id: 'select',
      //   header: ({ table }) => (
      //     <Checkbox
      //       checked={table.getIsAllRowsSelected()}
      //       indeterminate={table.getIsSomeRowsSelected()}
      //       onChange={table.getToggleAllRowsSelectedHandler()}
      //     />
      //   ),
      //   cell: ({ row }) => (
      //     <Checkbox
      //       checked={row.getIsSelected()}
      //       disabled={!row.getCanSelect()}
      //       indeterminate={row.getIsSomeSelected()}
      //       onChange={row.getToggleSelectedHandler()}
      //     />
      //   )
      // },
      columnHelper.accessor('id', {
        header: 'Trip ID',
        cell: ({ row }) => <Typography>T{row.original.id}</Typography>
      }),

      // columnHelper.accessor('timestamp', {
      //   header: 'Timestamp',
      //   cell: ({ row }) => <Typography>{new Date(row.original.timestamp).toLocaleString()}</Typography>
      // }),
      columnHelper.accessor('event_date', {
        header: 'Date',
        cell: ({ row }) => {
          // const date = new Date(row.original.event_date?.toString() || '--')
          // const formatted = `${String(date.getDate()).padStart(2, '0')}-${String(date.getMonth() + 1).padStart(2, '0')}-${date.getFullYear()}`

          return (
            <Typography>{row.original.event_date ? formatDate(new Date(row.original.event_date)) : '-'}</Typography>
          )
        }
      }),
      columnHelper.accessor('vehicleNo', {
        header: 'Vehicle No',
        cell: ({ row }) => <Typography fontWeight={700}>{row.original.vehicleNo}</Typography>
      }),
      columnHelper.accessor('entry_time', {
        header: 'Entry Time',
        cell: ({ row }) => <Typography>{row.original.entry_time?.toString().slice(0, 5) ?? '-'}</Typography>
      }),
      columnHelper.accessor('exit_time', {
        header: 'Exit Time',
        cell: ({ row }) => <Typography>{row.original.exit_time?.toString().slice(0, 5) ?? '-'}</Typography>
      }),
      columnHelper.accessor('tare_wt', {
        header: 'Tare Weight (KG)',
        cell: ({ row }) => (
          <Typography color={row.original.tare_wt ? 'inherit' : 'text.secondary'}>
            {row.original.tare_wt ?? 'Not recorded'}
          </Typography>
        )
      }),
      columnHelper.accessor('tare_wt_time', {
        header: 'Tare Timestamp',

        cell: ({ row }) => (
          <Typography>
            {row.original.tare_wt_time ? row.original.tare_wt_time.toString().slice(11, 16) : '-'}
          </Typography>
        ) //TODO add weight timestamp
        // cell: ({ row }) => <Typography>NULL</Typography>
      }),
      columnHelper.accessor('gross_wt', {
        header: 'Gross Weight (KG)',
        cell: ({ row }) => (
          <Typography sx={{ color: row.original.gross_wt ? 'inherit' : 'text.secondary' }}>
            {row.original.gross_wt ?? 'Not recorded'}
          </Typography>
        )
      }),

      columnHelper.accessor('gross_wt_time', {
        header: 'Gross Timestamp',

        cell: ({ row }) => (
          <Typography>
            {row.original.gross_wt_time ? row.original.gross_wt_time.toString().slice(11, 16) : '-'}
          </Typography>
        )
      }),
      columnHelper.accessor('net_wt', {
        header: 'Net Weight (KG)',
        cell: ({ row }) => <Typography>{row.original.net_wt ? row.original.net_wt : '-'}</Typography>
      }),

      {
        id: 'actions',
        header: 'Reports',
        enableSorting: false,
        cell: ({ row }) => (
          <div className='flex items-center'>
            {/* <Link href={`/reports/vehicle/${row.original.id}/pdf`} target='_blank' rel='noopener noreferrer'> */}
            {/* <IconButton>
                <i className='tabler-file-invoice text-textSecondary' />
              </IconButton> */}
            {/* <Button variant='outlined' startIcon={<PictureAsPdfIcon />} size='medium' onClick={() => window.open(`/reports/vehicle/${id}/pdf`, '_blank')}>
              PDF
            </Button> */}
            <PDFButton record={row.original} />
            {/* <PictureAsPdfIcon /> */}
            {/* </Link> */}
            {/* <OptionMenu
              iconButtonProps={{ size: 'medium' }}
              iconClassName='text-textSecondary'
              options={[
                { text: 'Download', icon: 'tabler-download' },
                {
                  text: 'Delete',
                  icon: 'tabler-trash',
                  menuItemProps: {
                    onClick: () => setData(prev => prev.filter(v => v.id !== row.original.id))
                  }
                },
                { text: 'Duplicate', icon: 'tabler-copy' }
              ]}
            /> */}
          </div>
        )
      }
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

  const handleExport = () => {
    exportToCSV(table)
  }

  const handleDateFilter = async () => {
    if (!fromDate || !toDate) {
      alert('Please select both dates')

      return
    }

    const filtered = await getReportData(new Date(fromDate), new Date(toDate), undefined, 'desc')

    // console.log('Filtered Data:', filtered)
    setData(filtered)
  }

  return (
    <Card>
      <CardHeader title='Vehicles Summary' />
      <div className='flex flex-wrap justify-between gap-4 p-4'>
        <div className='flex flex-wrap items-center gap-4'>
          {/* Search */}
          <CustomTextField
            value={globalFilter ?? ''}
            onChange={e => setGlobalFilter(e.target.value)}
            placeholder='Search'
            size='small'
            sx={{ width: { xs: '100%', sm: 250 } }}
          />

          {/* From Date */}
          <TextField
            label='From Date'
            type='date'
            size='small'
            value={fromDate}
            onChange={e => setFromDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
            sx={{ width: { xs: '48%', sm: 180 } }}
          />

          {/* To Date */}
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
                <td colSpan={table.getVisibleFlatColumns().length} className='text-center'>
                  No data available for today, Please Select a different date or check back later.
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

export default ProductListTable

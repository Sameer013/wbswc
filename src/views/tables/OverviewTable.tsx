'use client'

// React Imports
import { useState, useMemo } from 'react'

// MUI Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import Checkbox from '@mui/material/Checkbox'
import TablePagination from '@mui/material/TablePagination'
import Chip from '@mui/material/Chip'
import Typography from '@mui/material/Typography'

// Third-party Imports
import classnames from 'classnames'
import { rankItem } from '@tanstack/match-sorter-utils'
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFacetedMinMaxValues,
  getPaginationRowModel,
  getSortedRowModel
} from '@tanstack/react-table'
import type { ColumnDef, FilterFn } from '@tanstack/react-table'
import type { RankingInfo } from '@tanstack/match-sorter-utils'

// Type Imports
import TablePaginationComponent from '@components/TablePaginationComponent'
import type { ThemeColor } from '@core/types'
import type { Truck } from '@/types/warehouseTypes'

// Components Imports
import CustomAvatar from '@core/components/mui/Avatar'
import OptionMenu from '@core/components/option-menu'

// Style Imports
import tableStyles from '@core/styles/table.module.css'

declare module '@tanstack/table-core' {
  interface FilterFns {
    fuzzy: FilterFn<unknown>
  }
  interface FilterMeta {
    itemRank: RankingInfo
  }
}

type chipColorType = {
  color: ThemeColor
}

export const statusChipColor: { [key: string]: chipColorType } = {
  entry: { color: 'success' },
  exit: { color: 'error' },
  loading: { color: 'warning' },
  unloading: { color: 'info' }
}

const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
  const itemRank = rankItem(row.getValue(columnId), value)

  addMeta({ itemRank })

  return itemRank.passed
}

const columnHelper = createColumnHelper<Truck>()

// TODO [DATABASE INTEGRATION]:
// When connecting to the database, remove the truckData prop
// and fetch data directly inside this component using:
//
// Option A - REST API (useEffect):
// useEffect(() => {
//   fetch('/api/trucks')
//     .then(res => res.json())
//     .then(data => setData(data))
// }, [])
//
// Option B - React Query (recommended for real-time):
// const { data } = useQuery({ queryKey: ['trucks'], queryFn: fetchTrucks })
//
// Option C - Server Component (best for SSR, move 'use client' up):
// Convert to async server component and pass data as prop from page.tsx

const OverviewTable = ({ truckData }: { truckData?: Truck[] }) => {
  const [rowSelection, setRowSelection] = useState({})
  const [data] = useState<Truck[]>(truckData ?? [])

  const columns = useMemo<ColumnDef<Truck, any>[]>(
    () => [
      {
        id: 'select',
        header: ({ table }) => (
          <Checkbox
            {...{
              checked: table.getIsAllRowsSelected(),
              indeterminate: table.getIsSomeRowsSelected(),
              onChange: table.getToggleAllRowsSelectedHandler()
            }}
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            {...{
              checked: row.getIsSelected(),
              disabled: !row.getCanSelect(),
              indeterminate: row.getIsSomeSelected(),
              onChange: row.getToggleSelectedHandler()
            }}
          />
        )
      },
      columnHelper.accessor('plateNumber', {
        header: 'Plate Number',
        cell: ({ row }) => (
          <div className='flex items-center gap-4'>
            <CustomAvatar skin='light' color='secondary'>
              <i className='tabler-truck text-[28px]' />
            </CustomAvatar>
            <Typography className='font-medium' color='text.primary'>
              {row.original.plateNumber}
            </Typography>
          </div>
        )
      }),
      columnHelper.accessor('driverName', {
        header: 'Driver',
        cell: ({ row }) => <Typography>{row.original.driverName}</Typography>
      }),
      columnHelper.accessor('warehouseZone', {
        header: 'Zone',
        cell: ({ row }) => <Typography>{row.original.warehouseZone}</Typography>
      }),
      columnHelper.accessor('cargoType', {
        header: 'Cargo Type',
        cell: ({ row }) => <Typography>{row.original.cargoType}</Typography>
      }),
      columnHelper.accessor('entryTime', {
        header: 'Entry Time',
        cell: ({ row }) => <Typography>{row.original.entryTime}</Typography>
      }),
      columnHelper.accessor('exitTime', {
        header: 'Exit Time',
        cell: ({ row }) => <Typography>{row.original.exitTime ?? '—'}</Typography>
      }),
      columnHelper.accessor('status', {
        header: 'Status',
        cell: ({ row }) => (
          <Chip
            variant='tonal'
            label={row.original.status.charAt(0).toUpperCase() + row.original.status.slice(1)}
            size='small'
            color={statusChipColor[row.original.status].color}
          />
        )
      })
    ],
    []
  )

  const table = useReactTable({
    data: data as Truck[],
    columns,
    filterFns: {
      fuzzy: fuzzyFilter
    },
    state: {
      rowSelection
    },
    initialState: {
      pagination: {
        pageSize: 5
      }
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFacetedMinMaxValues: getFacetedMinMaxValues()
  })

  return (
    <Card>
      <CardHeader title='Live Event Overview' action={<OptionMenu options={['Refresh', 'Update', 'Share']} />} />
      <div className='overflow-x-auto'>
        <table className={tableStyles.table}>
          <thead>
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <th key={header.id}>
                    {header.isPlaceholder ? null : (
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
          {table.getFilteredRowModel().rows.length === 0 ? (
            <tbody>
              <tr>
                <td colSpan={table.getVisibleFlatColumns().length} className='text-center'>
                  No data available
                </td>
              </tr>
            </tbody>
          ) : (
            <tbody>
              {table
                .getRowModel()
                .rows.slice(0, table.getState().pagination.pageSize)
                .map(row => (
                  <tr key={row.id} className={classnames({ selected: row.getIsSelected() })}>
                    {row.getVisibleCells().map(cell => (
                      <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
                    ))}
                  </tr>
                ))}
            </tbody>
          )}
        </table>
      </div>
      <TablePagination
        component={() => <TablePaginationComponent table={table as any} />}
        count={table.getFilteredRowModel().rows.length}
        rowsPerPage={table.getState().pagination.pageSize}
        page={table.getState().pagination.pageIndex}
        onPageChange={(_, page) => {
          table.setPageIndex(page)
        }}
      />
    </Card>
  )
}

export default OverviewTable

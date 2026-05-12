'use client'

import { useEffect, useMemo, useState } from 'react'

// MUI Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import Button from '@mui/material/Button'
import MenuItem from '@mui/material/MenuItem'
import TablePagination from '@mui/material/TablePagination'
import Typography from '@mui/material/Typography'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import IconButton from '@mui/material/IconButton'
import CircularProgress from '@mui/material/CircularProgress'
import Chip from '@mui/material/Chip'
import Skeleton from '@mui/material/Skeleton'

// Icons
import VisibilityIcon from '@mui/icons-material/Visibility'
import CloseIcon from '@mui/icons-material/Close'

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
import { formatTimestamp } from '@/utils/functions'

// Server Actions
import { getIntrusionData, getIntrusionImage } from '@/app/server/action'

// Define the type based on intrusion_event schema
export type IntrusionEventRecord = {
  id: number
  intrusion_type: string
  description: string | null
  image: any | null
  created_at: Date | null
  intrusion_dt: Date | null
}

const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
  const itemRank = rankItem(row.getValue(columnId), value)

  addMeta({ itemRank })

  return itemRank.passed
}

const columnHelper = createColumnHelper<IntrusionEventRecord>()

const IntrusionEventTable = () => {
  // States
  const [data, setData] = useState<IntrusionEventRecord[]>([])
  const [globalFilter, setGlobalFilter] = useState('')
  const [imgUrl, setImgUrl] = useState<string>('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [loading, setLoading] = useState(true) // Table loading state
  const [loadingImg, setLoadingImg] = useState(false) // Modal image loading state

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)

      try {
        const result = await getIntrusionData()

        setData(result)
      } catch (error) {
        console.error('Error fetching intrusion data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // Handle Image View
  const handleViewImage = async (id: number) => {
    setLoadingImg(true)
    setIsModalOpen(true)

    try {
      const base64 = await getIntrusionImage(id)

      setImgUrl(base64)
    } catch (error) {
      console.error('Failed to load image', error)
      setImgUrl('')
    } finally {
      setLoadingImg(false)
    }
  }

  const columns = useMemo<ColumnDef<IntrusionEventRecord, any>[]>(
    () => [
      columnHelper.accessor('id', {
        header: 'ID',
        cell: ({ row }) => <Typography color='primary'>#{row.original.id}</Typography>
      }),
      columnHelper.accessor('created_at', {
        header: 'Date',
        cell: ({ row }) => (
          <Typography color='primary'>
            {row.original.created_at ? formatTimestamp(row.original.created_at) : '--'}
          </Typography>
        )
      }),
      columnHelper.accessor('intrusion_type', {
        header: 'Type',
        cell: ({ row }) => <Chip label={row.original.intrusion_type} color='error' variant='tonal' size='small' />
      }),
      columnHelper.accessor('description', {
        header: 'Description',
        cell: ({ row }) => (
          <Typography variant='body2' className='max-w-[200px] truncate'>
            {row.original.description || 'No description'}
          </Typography>
        )
      }),

      {
        id: 'actions',
        header: 'Actions',
        enableSorting: false,
        cell: ({ row }) => (
          <div className='flex items-center gap-2'>
            <Button
              variant='tonal'
              size='small'
              startIcon={<VisibilityIcon />}
              onClick={() => handleViewImage(row.original.id)}
            >
              View Image
            </Button>
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
      <CardHeader title='Intrusion Events Log' />
      <div className='flex flex-wrap justify-between gap-4 p-4'>
        <CustomTextField
          value={globalFilter ?? ''}
          onChange={e => setGlobalFilter(e.target.value)}
          placeholder='Search Intrusion Type...'
          size='small'
          sx={{ width: { xs: '100%', sm: 250 } }}
        />
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
                  <Typography color='textSecondary'>No intrusion events recorded</Typography>
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

      {/* Image Viewer Modal */}
      <Dialog open={isModalOpen} onClose={() => setIsModalOpen(false)} maxWidth='md' fullWidth>
        <DialogTitle className='flex justify-between items-center'>
          Intrusion Evidence
          <IconButton onClick={() => setIsModalOpen(false)}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent className='flex justify-center items-center min-h-[300px]'>
          {loadingImg ? (
            <CircularProgress />
          ) : imgUrl ? (
            <img src={imgUrl} alt='Intrusion' style={{ maxWidth: '100%', height: 'auto', borderRadius: '8px' }} />
          ) : (
            <Typography>No image available.</Typography>
          )}
        </DialogContent>
      </Dialog>
    </Card>
  )
}

export default IntrusionEventTable

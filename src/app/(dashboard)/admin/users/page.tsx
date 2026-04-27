'use client'

import { useMemo, useState, useEffect } from 'react'

import { useRouter } from 'next/navigation'

// MUI Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'

import Button from '@mui/material/Button'
import MenuItem from '@mui/material/MenuItem'
import TablePagination from '@mui/material/TablePagination'
import Typography from '@mui/material/Typography'

// import Dialog from '@mui/material/Dialog'
// import DialogContent from '@mui/material/DialogContent'
// import DialogTitle from '@mui/material/DialogTitle'
// import IconButton from '@mui/material/IconButton'
// import CircularProgress from '@mui/material/CircularProgress'

// import Chip from '@mui/material/Chip'

// Icons
// import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf'
// import VisibilityIcon from '@mui/icons-material/Visibility'

// import CloseIcon from '@mui/icons-material/Close'

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
import { getUsers } from '@/app/server/action' // Assuming this is where you exported it

// Define the type based on your SQL schema
export type Users = {
  id: number
  email: string
  phone: string
  name: string
  role_id: number
  created_at: Date | null
  password: string
}

const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
  const itemRank = rankItem(row.getValue(columnId), value)

  addMeta({ itemRank })

  return itemRank.passed
}

const columnHelper = createColumnHelper<Users>()

// const defaultData: AnprEventRecord[] = await getAnprData()

const UsersTable = () => {
  // States
  const [data, setData] = useState<Users[]>([])
  const [globalFilter, setGlobalFilter] = useState('')
  const router = useRouter()

  // const [imgUrl, setImgUrl] = useState<string>('')
  // const [isModalOpen, setIsModalOpen] = useState(false)
  // const [loadingImg, setLoadingImg] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      const data = await getUsers()

      setData(data)

      return data
    }

    fetchData()
  }, [])

  // Handle Image View
  const handleButton = () => {
    router.push('/admin/users/add')
  }

  const lastRunTime = '2026-04-14 11:12:34'

  const columns = useMemo<ColumnDef<Users, any>[]>(
    () => [
      columnHelper.accessor('id', {
        header: 'ID',
        cell: ({ row }) => <Typography color='primary'>#{row.original.id}</Typography>
      }),
      columnHelper.accessor('email', {
        header: 'Email',
        cell: ({ row }) => <Typography fontWeight={600}>{row.original.email}</Typography>
      }),
      columnHelper.accessor('name', {
        header: 'Name',
        cell: ({ row }) => <Typography fontWeight={600}>{row.original.name}</Typography>
      }),
      columnHelper.accessor('phone', {
        header: 'Phone',
        cell: ({ row }) => <Typography>{row.original.phone || 'N/A'}</Typography>
      }),
      columnHelper.accessor('created_at', {
        header: 'Timestamp',
        cell: ({ row }) => (
          <Typography>
            {row.original.created_at ? formatTimestamp(new Date(row.original.created_at)) : 'N/A'}
          </Typography>
        )
      })

      // {
      //   id: 'actions',
      //   header: 'Actions',
      //   enableSorting: false,
      //   cell: ({ row }) => (
      //     <div className='flex items-center gap-2'>
      //       {row.original.imageId && (
      //         <Button
      //           variant='tonal'
      //           size='small'
      //           startIcon={<VisibilityIcon />}
      //           onClick={() => handleViewImage(row.original.imageId!)}
      //         >
      //           View Image
      //         </Button>
      //       )}
      //     </div>
      //   )
      // }
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
      sorting: [{ id: 'id', desc: true }] // Default sort desc
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
      {/* <CardHeader title='Anpr Events Log' /> */}
      <CardHeader
        title='User Management'
        action={
          lastRunTime && (
            <Typography
              variant='caption'
              color='textSecondary'
              sx={{
                fontStyle: 'italic',
                display: 'block',
                mt: 2, // Fine-tune vertical alignment with the title
                mr: 2 // Spacing from the right edge
              }}
            >
              {/* Last run of Correction Algorithm: <strong>{lastRunTime}</strong> */}
            </Typography>
          )
        }
      />

      <div className='flex flex-wrap justify-between gap-4 p-4'>
        <CustomTextField
          value={globalFilter ?? ''}
          onChange={e => setGlobalFilter(e.target.value)}
          placeholder='Search'
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
          <Button
            color='primary'
            variant='contained'
            startIcon={<i className='tabler-user-plus' />}
            onClick={handleButton}
          >
            Add User
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
            {table.getRowModel().rows.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className='text-center p-10'>
                  <Typography color='textSecondary'>No vehicle events recorded</Typography>
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
      {/* <Dialog open={isModalOpen} onClose={() => setIsModalOpen(false)} maxWidth='md' fullWidth>
        <DialogTitle className='flex justify-between items-center'>
          Captured Vehicle Image
          <IconButton onClick={() => setIsModalOpen(false)}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent className='flex justify-center items-center min-h-[300px]'>
          {loadingImg ? (
            <CircularProgress />
          ) : imgUrl ? (
            <img src={imgUrl} alt='Vehicle Capture' style={{ maxWidth: '100%', height: 'auto', borderRadius: '8px' }} />
          ) : (
            <Typography>No image found for this record.</Typography>
          )}
        </DialogContent>
      </Dialog> */}
    </Card>
  )
}

export default UsersTable

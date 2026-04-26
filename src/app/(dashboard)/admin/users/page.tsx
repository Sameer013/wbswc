'use client'

import { useMemo, useState, useEffect } from 'react'

import Link from 'next/link'
import { useRouter } from 'next/navigation'

// MUI Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import MenuItem from '@mui/material/MenuItem'
import TablePagination from '@mui/material/TablePagination'
import IconButton from '@mui/material/IconButton'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogActions from '@mui/material/DialogActions'

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

// Component & Style Imports
import CustomTextField from '@core/components/mui/TextField'
import TablePaginationComponent from '@components/TablePaginationComponent'
import tableStyles from '@core/styles/table.module.css'
import { formatDate } from '@/utils/functions'

// --- Types ---
export type UserType = {
  id: number
  email: string
  phone: string | null
  name: string
  created_at: string | Date
  role_id: number // 1: Admin, 2: Manager
}

const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
  const itemRank = rankItem(row.getValue(columnId), value)

  addMeta({ itemRank })

  return itemRank.passed
}

const columnHelper = createColumnHelper<UserType>()

const UsersListTable = ({ tableData = [] }: { tableData?: UserType[] }) => {
  // --- States ---
  const [data, setData] = useState<UserType[]>(tableData)
  const [globalFilter, setGlobalFilter] = useState('')
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null)

  const router = useRouter()

  // --- Auth Mock ---
  // Replace this with your actual auth state (e.g., from useSession or Redux)
  const currentUser = { role_id: 1 }
  const isAdmin = currentUser.role_id === 1

  // --- Handlers ---
  const handleDeleteClick = (id: number) => {
    setSelectedUserId(id)
    setDeleteDialogOpen(true)
  }

  const handleConfirmDelete = async () => {
    // Call your server action here: await deleteUser(selectedUserId)
    setData(prev => prev.filter(user => user.id !== selectedUserId))
    setDeleteDialogOpen(false)
  }

  // --- Columns Definition ---
  const columns = useMemo<ColumnDef<UserType, any>[]>(
    () => [
      columnHelper.accessor('name', {
        header: 'User',
        cell: ({ row }) => (
          <div className='flex flex-col'>
            <Typography variant='h6' className='text-sm font-medium'>
              {row.original.name}
            </Typography>
            <Typography variant='caption'>{row.original.email}</Typography>
          </div>
        )
      }),
      columnHelper.accessor('role_id', {
        header: 'Role',
        cell: ({ row }) => (
          <Typography color={row.original.role_id === 1 ? 'primary' : 'secondary'}>
            {row.original.role_id === 1 ? 'Admin' : 'Manager'}
          </Typography>
        )
      }),
      columnHelper.accessor('phone', {
        header: 'Phone',
        cell: ({ row }) => <Typography>{row.original.phone || 'N/A'}</Typography>
      }),
      columnHelper.accessor('created_at', {
        header: 'Joined Date',
        cell: ({ row }) => <Typography>{formatDate(new Date(row.original.created_at))}</Typography>
      }),
      {
        id: 'actions',
        header: 'Actions',
        enableSorting: false,
        cell: ({ row }) => (
          <div className='flex items-center gap-2'>
            {/* View/Edit Action: Navigates to a shared page */}
            <IconButton
              onClick={() => router.push(`/users/manage/${row.original.id}`)}
              title={isAdmin ? 'Edit User' : 'View Details'}
            >
              <i className={isAdmin ? 'tabler-edit' : 'tabler-eye'} />
            </IconButton>

            {/* DELETE: Only allow admins to see/interact with delete */}
            {isAdmin && (
              <IconButton color='error' onClick={() => handleDeleteClick(row.original.id)}>
                <i className='tabler-trash' />
              </IconButton>
            )}
          </div>
        )
      }
    ],
    [isAdmin, router]
  )

  const table = useReactTable({
    data,
    columns,
    filterFns: { fuzzy: fuzzyFilter },
    state: { globalFilter },
    globalFilterFn: fuzzyFilter,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel()
  })

  return (
    <Card>
      <CardHeader
        title='User Management'
        action={
          /* Only Admins can create new users */
          isAdmin && (
            <Button
              variant='contained'
              startIcon={<i className='tabler-plus' />}
              onClick={() => router.push('/users/manage')}
            >
              Add New User
            </Button>
          )
        }
      />

      <div className='flex justify-between p-4 gap-4'>
        <CustomTextField
          value={globalFilter ?? ''}
          onChange={e => setGlobalFilter(e.target.value)}
          placeholder='Search Users...'
          className='max-sm:is-full'
        />
        <CustomTextField
          select
          value={table.getState().pagination.pageSize}
          onChange={e => table.setPageSize(Number(e.target.value))}
        >
          <MenuItem value='10'>10</MenuItem>
          <MenuItem value='25'>25</MenuItem>
        </CustomTextField>
      </div>

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
            {table.getRowModel().rows.map(row => (
              <tr key={row.id}>
                {row.getVisibleCells().map(cell => (
                  <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
                ))}
              </tr>
            ))}
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

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Are you sure you want to delete this user?</DialogTitle>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button color='error' variant='contained' onClick={handleConfirmDelete}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  )
}

export default UsersListTable

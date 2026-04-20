// app/admin/users/new/page.tsx
'use client'

import { useState } from 'react'

import { useRouter } from 'next/navigation'

import { createUser } from '@/app/server/action'

export default function CreateUserPage() {
  const [error, setError] = useState<string | null>(null)
  const [isPending, setIsPending] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsPending(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    const result = await createUser(formData)

    if (result?.error) {
      setError(result.error)
      setIsPending(false)
    } else if (result?.success) {
      // Redirect back to the user list or dashboard on success
      router.push('/home')
    }
  }

  return (
    <div className='max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md'>
      <h1 className='text-2xl font-bold mb-6 text-gray-800'>Add New User</h1>

      {error && <div className='mb-4 p-3 bg-red-100 text-red-700 rounded'>{error}</div>}

      <form onSubmit={handleSubmit} className='space-y-4'>
        <div>
          <label className='block text-sm font-medium text-gray-700'>Name</label>
          <input
            type='text'
            name='name'
            required
            className='mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border'
          />
        </div>

        <div>
          <label className='block text-sm font-medium text-gray-700'>Email</label>
          <input
            type='email'
            name='email'
            required
            className='mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border'
          />
        </div>

        <div>
          <label className='block text-sm font-medium text-gray-700'>Password</label>
          <input
            type='password'
            name='password'
            required
            className='mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border'
          />
        </div>

        <div>
          <label className='block text-sm font-medium text-gray-700'>Role</label>
          <select
            name='role_id'
            className='mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border'
            defaultValue='2'
          >
            <option value='2'>Standard User</option>
            {/* <option value='MANAGER'>Manager</option> */}
            <option value='1'>Admin</option>
          </select>
        </div>

        <button
          type='submit'
          disabled={isPending}
          className='w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 disabled:bg-blue-400'
        >
          {isPending ? 'Creating...' : 'Create User'}
        </button>
      </form>
    </div>
  )
}

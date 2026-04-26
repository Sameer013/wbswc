'use client'

import { useState } from 'react'

import { useRouter } from 'next/navigation'

// MUI Imports
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import Alert from '@mui/material/Alert'
import MenuItem from '@mui/material/MenuItem'
import InputAdornment from '@mui/material/InputAdornment'
import CircularProgress from '@mui/material/CircularProgress'

// Icons
import PersonIcon from '@mui/icons-material/Person'
import EmailIcon from '@mui/icons-material/Email'
import LockIcon from '@mui/icons-material/Lock'
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings'

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
      router.push('/home')
    }
  }

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10, px: 2 }}>
      <Card sx={{ maxWidth: 500, width: '100%', boxShadow: 4, borderRadius: 3 }}>
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ mb: 3, textAlign: 'center' }}>
            <Typography variant='h5' fontWeight='700' color='textPrimary' gutterBottom>
              Add New User
            </Typography>
            <Typography variant='body2' color='textSecondary'>
              Fill in the details to create a new system account
            </Typography>
          </Box>

          {error && (
            <Alert severity='error' sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <TextField
                fullWidth
                label='Name'
                name='name'
                required
                variant='outlined'
                placeholder='John Doe'
                InputProps={{
                  startAdornment: (
                    <InputAdornment position='start'>
                      <PersonIcon color='action' />
                    </InputAdornment>
                  )
                }}
              />

              <TextField
                fullWidth
                label='Email Address'
                name='email'
                type='email'
                required
                variant='outlined'
                placeholder='john@example.com'
                InputProps={{
                  startAdornment: (
                    <InputAdornment position='start'>
                      <EmailIcon color='action' />
                    </InputAdornment>
                  )
                }}
              />

              <TextField
                fullWidth
                label='Password'
                name='password'
                type='password'
                required
                variant='outlined'
                InputProps={{
                  startAdornment: (
                    <InputAdornment position='start'>
                      <LockIcon color='action' />
                    </InputAdornment>
                  )
                }}
              />

              <TextField
                select
                fullWidth
                label='Assign Role'
                name='role_id'
                defaultValue='2'
                InputProps={{
                  startAdornment: (
                    <InputAdornment position='start'>
                      <AdminPanelSettingsIcon color='action' />
                    </InputAdornment>
                  )
                }}
              >
                <MenuItem value='2'>Manager</MenuItem>
                <MenuItem value='1'>Admin</MenuItem>
              </TextField>

              <Button
                type='submit'
                variant='contained'
                size='large'
                disabled={isPending}
                sx={{
                  mt: 1,
                  height: 48,
                  fontWeight: 'bold',
                  textTransform: 'none',
                  fontSize: '1rem'
                }}
              >
                {isPending ? <CircularProgress size={24} color='inherit' /> : 'Create User'}
              </Button>

              <Button variant='text' color='inherit' onClick={() => router.back()} sx={{ textTransform: 'none' }}>
                Cancel
              </Button>
            </Box>
          </form>
        </CardContent>
      </Card>
    </Box>
  )
}

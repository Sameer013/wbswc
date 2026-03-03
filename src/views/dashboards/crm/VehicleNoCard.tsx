'use client'

// MUI Imports
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import Grid from '@mui/material/Grid2'
import Divider from '@mui/material/Divider'
import Box from '@mui/material/Box'
import type { SvgIconProps } from '@mui/material/SvgIcon'

// Icon Imports
// import LocalShipping from '@mui/icons-material/LocalShipping'
import Login from '@mui/icons-material/Login'
import Logout from '@mui/icons-material/Logout'
import ArrowCircleDown from '@mui/icons-material/ArrowCircleDown'
import ArrowCircleUp from '@mui/icons-material/ArrowCircleUp'

// import Chip from '@mui/material/Chip'

// import Inventory from '@mui/icons-material/Inventory'

interface VehicleNoCardProps {
  title: string
  type: 'entry' | 'exit' | 'unload' | 'load'
  todayCount: number
  weekCount: number
  monthCount: number
}

const iconConfig = {
  entry: {
    Icon: Login,
    iconColor: 'primary' as SvgIconProps['color'],
    arrow: '→',
    countColor: 'text.primary',
    bgColor: 'rgba(105, 108, 255, 0.08)',
    borderColor: 'rgba(105, 108, 255, 0.3)'
  },
  exit: {
    Icon: Logout,
    iconColor: 'primary' as SvgIconProps['color'],
    arrow: '←',
    countColor: 'text.primary',
    bgColor: 'rgba(105, 108, 255, 0.08)',
    borderColor: 'rgba(105, 108, 255, 0.3)'
  },
  unload: {
    Icon: ArrowCircleUp,
    iconColor: 'warning' as SvgIconProps['color'],
    arrow: '↑',
    countColor: 'warning.main',
    bgColor: 'rgba(255, 152, 0, 0.08)',
    borderColor: 'rgba(255, 152, 0, 0.3)'
  },
  load: {
    Icon: ArrowCircleDown,
    iconColor: 'warning' as SvgIconProps['color'],
    arrow: '↓',
    countColor: 'warning.main',
    bgColor: 'rgba(255, 152, 0, 0.08)',
    borderColor: 'rgba(255, 152, 0, 0.3)'
  }
}

// const iconConfig = {
//   entry: {
//     Icon: Login,
//     iconColor: 'success' as SvgIconProps['color'],
//     arrow: '→',
//     countColor: 'success.main',
//     bgColor: 'rgba(76, 175, 80, 0.08)',
//     borderColor: 'rgba(76, 175, 80, 0.3)'
//   },
//   exit: {
//     Icon: Logout,
//     iconColor: 'error' as SvgIconProps['color'],
//     arrow: '←',
//     countColor: 'error.main',
//     bgColor: 'rgba(244, 67, 54, 0.08)',
//     borderColor: 'rgba(244, 67, 54, 0.3)'
//   },
//   unload: {
//     Icon: ArrowCircleUp,
//     iconColor: 'warning' as SvgIconProps['color'],
//     arrow: '←',
//     countColor: 'warning.main',
//     bgColor: 'rgba(255, 152, 0, 0.08)',
//     borderColor: 'rgba(255, 152, 0, 0.3)'
//   },
//   load: {
//     Icon: ArrowCircleDown,
//     iconColor: 'primary' as SvgIconProps['color'],
//     arrow: '→',
//     countColor: 'primary.main',
//     bgColor: 'rgba(105, 108, 255, 0.08)',
//     borderColor: 'rgba(105, 108, 255, 0.3)'
//   }
// }

const StatCard = ({ label, count, type }: { label: string; count: number; type: VehicleNoCardProps['type'] }) => {
  const config = iconConfig[type]

  return (
    <Card
      variant='outlined'
      sx={{
        boxShadow: 'none',
        height: '100%',
        borderColor: config.borderColor,
        backgroundColor: config.bgColor
      }}
    >
      <CardContent sx={{ py: 1.5, px: 2, '&:last-child': { pb: 1.5 } }}>
        <Typography variant='caption' color='text.secondary'>
          {label}
        </Typography>
        <Box className='flex items-center gap-2' sx={{ mt: 0.5 }}>
          <Typography variant='h5' color={config.countColor} fontWeight={700}>
            {count}
          </Typography>
          {/* <Chip label='+12.6%' color='success' variant='tonal' size='small' /> */}
        </Box>
      </CardContent>
    </Card>
  )
}

const VehicleNoCard = ({ title, type, todayCount, weekCount, monthCount }: VehicleNoCardProps) => {
  const config = iconConfig[type]
  const { Icon } = config

  return (
    <Card>
      <CardHeader
        title={
          <Box className='flex items-center gap-3'>
            {/* Icon box */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 42,
                height: 42,
                borderRadius: 2,
                backgroundColor: config.bgColor,
                border: `1px solid ${config.borderColor}`,
                position: 'relative',
                flexShrink: 0
              }}
            >
              <Icon color={config.iconColor} fontSize='medium' />
              {/* Arrow badge */}
              <Box
                sx={{
                  position: 'absolute',
                  bottom: -6,
                  right: -6,
                  width: 18,
                  height: 18,
                  borderRadius: '50%',
                  backgroundColor: 'background.paper',
                  border: `1px solid ${config.borderColor}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.6rem',
                  color: config.countColor,
                  fontWeight: 700,
                  lineHeight: 1
                }}
              >
                {config.arrow}
              </Box>
            </Box>
            <Typography variant='h6' fontWeight={600}>
              {title}
            </Typography>
          </Box>
        }
        sx={{ py: 2 }}
      />
      <Divider />
      <CardContent sx={{ py: 2, '&:last-child': { pb: 2 } }}>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12 }}>
            <StatCard label='Today' count={todayCount} type={type} />
          </Grid>
          <Grid size={{ xs: 6, sm: 6 }}>
            <StatCard label='Last 7 days' count={weekCount} type={type} />
          </Grid>
          <Grid size={{ xs: 6, sm: 6 }}>
            <StatCard label='Last 30 days' count={monthCount} type={type} />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
}

export default VehicleNoCard

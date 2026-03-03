'use client'

import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import Divider from '@mui/material/Divider'
import Box from '@mui/material/Box'
import type { SvgIconProps } from '@mui/material/SvgIcon'
import Login from '@mui/icons-material/Login'
import Logout from '@mui/icons-material/Logout'
import ArrowCircleDown from '@mui/icons-material/ArrowCircleDown'
import ArrowCircleUp from '@mui/icons-material/ArrowCircleUp'

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
    countColor: 'text.primary',
    bgColor: 'rgba(255, 152, 0, 0.08)',
    borderColor: 'rgba(255, 152, 0, 0.3)'
  },
  load: {
    Icon: ArrowCircleDown,
    iconColor: 'warning' as SvgIconProps['color'],
    arrow: '↓',
    countColor: 'text.primary',
    bgColor: 'rgba(255, 152, 0, 0.08)',
    borderColor: 'rgba(255, 152, 0, 0.3)'
  }
}

const StatItem = ({
  label,
  count,
  type,
  isToday
}: {
  label: string
  count: number
  type: VehicleNoCardProps['type']
  isToday?: boolean
}) => {
  const config = iconConfig[type]

  return (
    <Box
      sx={{
        flex: 1,
        px: 1.5,
        py: 1,
        borderRadius: 1.5,
        backgroundColor: isToday ? config.borderColor : config.bgColor,
        border: `1px solid ${config.borderColor}`,
        minWidth: 0
      }}
    >
      <Typography variant='caption' color={isToday ? 'text.primary' : 'text.secondary'} display='block' noWrap>
        {label}
      </Typography>
      <Typography variant='h6' color={config.countColor} fontWeight={isToday ? 800 : 700} lineHeight={1.3}>
        {count}
      </Typography>
    </Box>
  )
}

const VehicleNoCard = ({ title, type, todayCount, weekCount, monthCount }: VehicleNoCardProps) => {
  const config = iconConfig[type]
  const { Icon } = config

  return (
    <Card sx={{ height: '100%' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, px: 2, py: 1.25 }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 34,
            height: 34,
            borderRadius: 1.5,
            backgroundColor: config.bgColor,
            border: `1px solid ${config.borderColor}`,
            position: 'relative',
            flexShrink: 0
          }}
        >
          <Icon color={config.iconColor} sx={{ fontSize: 18 }} />
          <Box
            sx={{
              position: 'absolute',
              bottom: -5,
              right: -5,
              width: 15,
              height: 15,
              borderRadius: '50%',
              backgroundColor: 'background.paper',
              border: `1px solid ${config.borderColor}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.5rem',
              color: config.countColor,
              fontWeight: 700,
              lineHeight: 1
            }}
          >
            {config.arrow}
          </Box>
        </Box>
        <Typography variant='h6' fontWeight={600} noWrap>
          {title}
        </Typography>
      </Box>

      <Divider />

      <CardContent sx={{ py: 1.5, px: 1.5, '&:last-child': { pb: 1.5 } }}>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <StatItem label='Today' count={todayCount} type={type} isToday />
          <StatItem label='7 days' count={weekCount} type={type} />
          <StatItem label='30 days' count={monthCount} type={type} />
        </Box>
      </CardContent>
    </Card>
  )
}

export default VehicleNoCard

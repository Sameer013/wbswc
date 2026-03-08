'use client'

import Image from 'next/image'

import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import Divider from '@mui/material/Divider'
import Box from '@mui/material/Box'
import type { SvgIconProps } from '@mui/material/SvgIcon'

// import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined'
import Logout from '@mui/icons-material/Logout'
import Login from '@mui/icons-material/Login'
import ArrowCircleDown from '@mui/icons-material/ArrowCircleDown'
import ArrowCircleUp from '@mui/icons-material/ArrowCircleUp'

interface VehicleNoCardProps {
  title: string
  type: 'entry' | 'exit' | 'unload' | 'load'
  todayCount: number
  monthCount: number
  yearCount: number
  iconSrc?: string
}

const iconConfig = {
  entry: {
    Icon: Login,
    iconColor: 'primary' as SvgIconProps['color'],
    countColor: 'text.primary',
    bgColor: 'rgba(105, 108, 255, 0.08)',
    borderColor: 'rgba(105, 108, 255, 0.3)',
    accentColor: '#696cff'
  },
  exit: {
    Icon: Logout,
    iconColor: 'primary' as SvgIconProps['color'],
    countColor: 'text.primary',
    bgColor: 'rgba(105, 108, 255, 0.08)',
    borderColor: 'rgba(105, 108, 255, 0.3)',
    accentColor: '#696cff'
  },
  unload: {
    Icon: ArrowCircleUp,
    iconColor: 'warning' as SvgIconProps['color'],
    countColor: 'text.primary',
    bgColor: 'rgba(255, 152, 0, 0.08)',
    borderColor: 'rgba(255, 152, 0, 0.3)',
    accentColor: '#ff9800'
  },
  load: {
    Icon: ArrowCircleDown,
    iconColor: 'warning' as SvgIconProps['color'],
    countColor: 'text.primary',
    bgColor: 'rgba(255, 152, 0, 0.08)',
    borderColor: 'rgba(255, 152, 0, 0.3)',
    accentColor: '#ff9800'
  }
}

const VehicleNoCard = ({ title, type, todayCount, monthCount, yearCount, iconSrc }: VehicleNoCardProps) => {
  const config = iconConfig[type]
  const { Icon } = config

  return (
    <Card sx={{ height: '100%' }}>
      <Box
        sx={{
          px: 2,
          py: 0.75,
          backgroundColor: config.bgColor,
          borderBottom: `1px solid ${config.borderColor}`,
          textAlign: 'center'
        }}
      >
        <Typography variant='h6' fontWeight={700} letterSpacing={2} sx={{ fontSize: '0.625rem' }}>
          {title}
        </Typography>
      </Box>

      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-around',
          px: 2.5,
          py: 2
        }}
      >
        {iconSrc ? (
          <Image src={iconSrc} alt={title} width={38} height={38} style={{ objectFit: 'contain' }} />
        ) : (
          <Icon color={config.iconColor} sx={{ fontSize: 36 }} />
        )}
        {/* <Icon color={config.iconColor} sx={{ fontSize: 36 }} /> */}

        <Box sx={{ textAlign: 'right' }}>
          <Typography fontWeight={800} color={config.countColor} sx={{ fontSize: '2.5rem', lineHeight: 1 }}>
            {todayCount}
          </Typography>
        </Box>
      </Box>

      <Divider />

      <CardContent sx={{ py: 1.5, px: 1.5, '&:last-child': { pb: 1.5 } }}>
        <Box sx={{ display: 'flex', gap: 1 }}>
          {[
            { label: 'M', count: monthCount },
            { label: 'Y', count: yearCount }
          ].map(({ label, count }) => (
            <Box
              key={label}
              sx={{
                flex: 1,
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-evenly',
                px: 1.5,
                py: 1,
                borderRadius: 1.5,
                backgroundColor: config.bgColor,
                border: `1px solid ${config.borderColor}`,
                gap: 1
              }}
            >
              <Typography variant='caption' color='text.secondary' display='block' sx={{ fontSize: '0.625rem' }}>
                {label}
              </Typography>
              <Typography variant='h5' fontWeight={700} color='text.primary' fontSize={'1.25rem'} lineHeight={1.3}>
                {count}
              </Typography>
            </Box>
          ))}
        </Box>
      </CardContent>
    </Card>
  )
}

export default VehicleNoCard

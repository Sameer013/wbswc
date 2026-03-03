// Type Imports
import type { HorizontalMenuDataType } from '@/types/menuTypes'

const horizontalMenuData = (): HorizontalMenuDataType[] => [
  {
    label: 'Dashboard',
    href: '/home',
    icon: 'tabler-smart-home'
  },
  {
    label: 'About',
    href: '/about',
    icon: 'tabler-info-circle'
  },
  {
    label: 'Vehicles',
    href: '/vehicles',
    icon: 'tabler-car'
  },
  {
    label: 'AI Camera Feed',
    href: '/ai-camera-feed',
    icon: 'tabler-camera'
  }
]

export default horizontalMenuData

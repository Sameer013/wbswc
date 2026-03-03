// Type Imports
import type { VerticalMenuDataType } from '@/types/menuTypes'

const verticalMenuData = (): VerticalMenuDataType[] => [
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

export default verticalMenuData

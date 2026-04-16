// MUI Imports
import InitColorSchemeScript from '@mui/material/InitColorSchemeScript'

import Providers from './providers'

// Third-party Imports
import 'react-perfect-scrollbar/dist/css/styles.css'

// Type Imports
import type { ChildrenType } from '@core/types'

// Util Imports
import { getSystemMode } from '@core/utils/serverHelpers'

// Style Imports
import '@/app/globals.css'

// Generated Icon CSS Imports
import '@assets/iconify-icons/generated-icons.css'

export const metadata = {
  title: 'West Bengal Warehouse Management System',
  description:
    'Warehouse management system for West Bengal, built with Next.js, React, and Material-UI. Features include inventory tracking, order management, and real-time analytics to optimize warehouse operations.'
}

const RootLayout = async (props: ChildrenType) => {
  const { children } = props

  // Vars

  const systemMode = await getSystemMode()
  const direction = 'ltr'

  return (
    <html id='__next' lang='en' dir={direction} suppressHydrationWarning>
      <body className='flex is-full min-bs-full flex-auto flex-col'>
        <InitColorSchemeScript attribute='data' defaultMode={systemMode} />
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}

export default RootLayout

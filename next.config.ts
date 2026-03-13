import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  basePath: process.env.BASEPATH,
  transpilePackages: ['@react-pdf/renderer'],

  // experimental: {
  //   esmExternals: 'loose'
  // },
  // serverExternalPackages: ['@react-pdf/renderer'],
  redirects: async () => {
    return [
      {
        source: '/',
        destination: '/home',
        permanent: true,
        locale: false
      }
    ]
  }
}

export default nextConfig

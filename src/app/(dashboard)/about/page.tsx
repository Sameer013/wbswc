'use client'

import { getReportData } from '@/app/server/action'

const data = await getReportData()

console.log('Vehicle data in page component:', data)

export default function Page() {
  return <>Hello Sameer</>
}

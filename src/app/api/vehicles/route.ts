import { NextResponse } from 'next/server'

import { getVehicleTableData } from '@/app/server/action'

export async function GET() {
  try {
    const chartData = await getVehicleTableData()

    return NextResponse.json({ success: true, data: chartData })
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Failed to fetch users' }, { status: 500 })
  }
}

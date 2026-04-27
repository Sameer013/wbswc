// app/(dashboard)/vehicles/bags/page.tsx
// ─── Server Component (Next.js 15) ────────────────────────────────────────────
// Page components in Next.js 15 ONLY accept `params` and `searchParams`.
// Data fetching belongs here; pass results to Client Components as props.

import { getBagsCnt } from '@/app/server/action'
import BagsEvent from '@/components/BagsEvent'

// Next.js 15: searchParams is now a Promise — must be awaited
interface PageProps {
  params: Promise<{ [key: string]: string | string[] }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function Page({ searchParams }: PageProps) {
  // Await searchParams before reading values (Next.js 15 requirement)
  const resolvedParams = await searchParams

  // Optional: support pre-filtering via URL query params
  const from = typeof resolvedParams.from === 'string' ? new Date(resolvedParams.from) : new Date()
  const to = typeof resolvedParams.to === 'string' ? new Date(resolvedParams.to) : new Date()

  // Fetch on the server — no useEffect needed for initial load
  const initialData = await getBagsCnt(from, to)

  return <BagsEvent initialData={initialData} />
}

import { getBagsCnt } from '@/app/server/action'
import BagsEvent from '@/components/BagsEvent'

interface PageProps {
  params: Promise<{ [key: string]: string | string[] }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function Page({ searchParams }: PageProps) {
  const resolvedParams = await searchParams

  const from = typeof resolvedParams.from === 'string' ? new Date(resolvedParams.from) : new Date()
  const to = typeof resolvedParams.to === 'string' ? new Date(resolvedParams.to) : new Date()

  const initialData = await getBagsCnt(from, to)

  return <BagsEvent initialData={initialData} />
}

// import { renderToStream } from '@react-pdf/renderer'
// import { createElement } from 'react'
// import MyDocument from '@/components/testPdf'

// export type EventRecord = {
//   id: number
//   eventType: string
//   eventTimestamp: Date
//   vehicleNo: string
//   vehicleWt: number | null
// }

// export async function generatePdfStream(record: EventRecord) {
//   // Dynamically require to isolate from Next.js module scope
//   const { renderToStream } = await import('@react-pdf/renderer')
//   const { default: MyDocument } = await import('@/components/testPdf')
//   const { createElement } = await import('react')

//   return renderToStream(createElement(MyDocument))
// }

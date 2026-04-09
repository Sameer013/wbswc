// Format Timestamp Function
// This function was created to convert the time mismatch that is happening with Prsima by default
// Prisma tires to save time in +00:00 format which for my team is headache in database so I am trying to save +05:30 format and make it ISO by appending 'Z'
// to it which make it hassle when I am trying to convert it back to browser time as browser js will try to adjust it according to my current timestamp
// TODO: Improve this time alogorithm
// How to use
//{formatTimestamp(event.timestamp)} thats it, this event.timestamp must be Date type value

export function formatTimestamp(date: Date): string {
  const dd = String(date.getDate()).padStart(2, '0')
  const mm = String(date.getMonth() + 1).padStart(2, '0')
  const yyyy = date.getFullYear()
  const hh = String(date.getHours()).padStart(2, '0')
  const min = String(date.getMinutes()).padStart(2, '0')

  return `${dd}-${mm}-${yyyy} ${hh}:${min}`
}

export function convertUTCtoLocalTime(date: Date | null): Date | null {
  if (!date) return null

  const d = date

  const dd = String(d.getUTCDate()).padStart(2, '0')
  const mm = String(d.getUTCMonth() + 1).padStart(2, '0')
  const yyyy = d.getUTCFullYear()
  const hh = String(d.getUTCHours()).padStart(2, '0')
  const min = String(d.getUTCMinutes()).padStart(2, '0')
  const ss = String(d.getUTCSeconds()).padStart(2, '0')

  return new Date(`${yyyy}-${mm}-${dd}T${hh}:${min}:${ss}`)
}

export function formatDate(d: Date): string {
  return `${String(d.getDate()).padStart(2, '0')}-${String(d.getMonth() + 1).padStart(2, '0')}-${d.getFullYear()}`
}

export function formatInputDate(dateStr: string): string {
  try {
    const d = new Date(dateStr)

    return formatDate(d)
  } catch (e) {
    return dateStr
  }
}

export function blobToBase64(buffer: ArrayBuffer): string {
  return `data:image/jpeg;base64,${Buffer.from(buffer).toString('base64')}`
}

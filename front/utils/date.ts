import type { Dayjs } from 'dayjs'

export const formatMonthTitle = (date: Dayjs) => {
  const s = date.format('MMMM YYYY')
  return s.charAt(0).toUpperCase() + s.slice(1)
}
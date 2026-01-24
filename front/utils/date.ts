// import type { Dayjs } from 'dayjs'

// export const formatMonthTitle = (date: Dayjs) => {
//   const formattedMonthTitle = date.format(DATE_FORMAT_MONTH_YEAR_ONLY)
//   return formattedMonthTitle.charAt(0).toUpperCase() + formattedMonthTitle.slice(1)
// }

import type { Dayjs } from 'dayjs'

export const formatMonthTitle = (date: Dayjs, locale?: string) => {
  const d = locale ? date.locale(locale) : date
  const formattedMonthTitle = d.format(DATE_FORMAT_MONTH_YEAR_ONLY)
  return formattedMonthTitle.charAt(0).toUpperCase() + formattedMonthTitle.slice(1)
}
import type { Dayjs } from 'dayjs'

export const formatMonthTitle = (date: Dayjs, locale?: string) => {
  const localeDate = locale ? date.locale(locale) : date
  const formattedMonthTitle = localeDate.format(DATE_MONTH_YEAR_ONLY_FORMAT)
  return formattedMonthTitle.charAt(0).toUpperCase() + formattedMonthTitle.slice(1)
}
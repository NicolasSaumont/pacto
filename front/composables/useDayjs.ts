import dayjs, { type Dayjs } from 'dayjs'
import { useI18n } from 'vue-i18n'

export const useDayjs = () => {
  const { locale } = useI18n()

  const date = (date?: dayjs.ConfigType): Dayjs =>
    dayjs(date).locale(locale.value)

  return {
    dayjs: date,
  }
}

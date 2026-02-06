import dayjs from 'dayjs'
import 'dayjs/locale/fr'

export default defineNuxtPlugin(() => {
  dayjs.locale('fr')
})
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

// Icônes solides
import { 
  faBoxesStacked,
  faFileContract,
  faFilePen,
  faUsers,
} from '@fortawesome/free-solid-svg-icons'

// Icônes brands
import {  } from '@fortawesome/free-brands-svg-icons'

export default defineNuxtPlugin((nuxtApp) => {
  library.add(
    faBoxesStacked,
    faFileContract,
    faFilePen,
    faUsers,
  )

  nuxtApp.vueApp.component('FontAwesomeIcon', FontAwesomeIcon)
})
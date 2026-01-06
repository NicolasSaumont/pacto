import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

// Icônes solides
import { 
  faBoxesStacked,
  faFileContract,
  faFilePen,
  faUser,
} from '@fortawesome/free-solid-svg-icons'

// Icônes brands
import {  } from '@fortawesome/free-brands-svg-icons'

export default defineNuxtPlugin((nuxtApp) => {
  library.add(
    faBoxesStacked,
    faFileContract,
    faFilePen,
    faUser,
  )

  nuxtApp.vueApp.component('FontAwesomeIcon', FontAwesomeIcon)
})
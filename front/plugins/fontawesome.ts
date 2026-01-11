import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

// Icônes solides
import { 
  faBoxesStacked,
  faCircleXmark,
  faFileContract,
  faFilePen,
  faMagnifyingGlass,
  faSortDown,
  faSortUp,
  faTrash,
  faUsers,
  faXmark,
} from '@fortawesome/free-solid-svg-icons'

// Icônes brands
import {  } from '@fortawesome/free-brands-svg-icons'

export default defineNuxtPlugin((nuxtApp) => {
  library.add(
    faBoxesStacked,
    faCircleXmark,
    faFileContract,
    faFilePen,
    faMagnifyingGlass,
    faSortDown,
    faSortUp,
    faTrash,
    faUsers,
    faXmark,
  )

  nuxtApp.vueApp.component('FontAwesomeIcon', FontAwesomeIcon)
})
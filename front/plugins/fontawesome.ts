import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

// Icônes solides
import {
  faArrowLeft,
  faArrowRotateLeft,
  faArrowRight,
  faBoxesStacked,
  faCircleCheck,
  faCircleInfo,
  faCircleXmark,
  faCopy,
  faFileContract,
  faFilePen,
  faFloppyDisk,
  faMagnifyingGlass,
  faPrint,
  faSortDown,
  faSortUp,
  faTrash,
  faTriangleExclamation,
  faUsers,
  faXmark,
} from '@fortawesome/free-solid-svg-icons'

// Icônes brands
import {} from '@fortawesome/free-brands-svg-icons'

export default defineNuxtPlugin((nuxtApp) => {
  library.add(
    faArrowLeft,
    faArrowRotateLeft,
    faArrowRight,
    faBoxesStacked,
    faCircleCheck,
    faCircleInfo,
    faCircleXmark,
    faCopy,
    faFileContract,
    faFilePen,
    faFloppyDisk,
    faMagnifyingGlass,
    faPrint,
    faSortDown,
    faSortUp,
    faTrash,
    faTriangleExclamation,
    faUsers,
    faXmark,
  )

  nuxtApp.vueApp.component('FontAwesomeIcon', FontAwesomeIcon)
})

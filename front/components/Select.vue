<script setup lang="ts">
import type { ISelectProps } from '../types/select'

const props = withDefaults(defineProps<ISelectProps>(), {
  clearable: true,
  theme: 'dark',
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: SelectOptionValue | SelectOptionValue[] | null): void
  (e: 'icon-click'): void
}>()

defineOptions({ inheritAttrs: false })
const attrs = useAttrs()

const {
  selectClasses,
  iconColorClass,
  rightPaddingClass,
  clearRightClass,
} = useSelect(props)

const rootRef = ref<HTMLElement | null>(null)
const triggerRef = ref<HTMLButtonElement | null>(null)

const isDropdownOpen = ref(false)
const activeIndex = ref<number>(-1)

const selectedOption = computed(() => {
  return props.options.find(option => option.value === props.modelValue) ?? null
})

const selectedValues = computed<SelectOptionValue[]>(() => {
  if (props.multiple) {
    return Array.isArray(props.modelValue) ? props.modelValue : []
  }
  return props.modelValue === null || props.modelValue === undefined || props.modelValue === ''
    ? []
    : [props.modelValue as SelectOptionValue]
})

const isSelected = (value: SelectOptionValue) =>
  selectedValues.value.includes(value)

const selectedOptions = computed(() =>
  props.options.filter(o => isSelected(o.value))
)

// const displayLabel = computed(() => {
//   if (selectedOption.value) return selectedOption.value.label
//   return props.placeholder ?? ''
// })

const displayLabel = computed(() => {
  if (props.multiple) {
    if (selectedOptions.value.length) {
      // variante 1: compteur
      // return `${selectedOptions.value.length} sélectionné(s)`
      // variante 2: liste jointe (si tu préfères)
      return selectedOptions.value.map(o => o.label).join(', ')
    }
    return props.placeholder ?? ''
  }

  const single = props.options.find(o => o.value === props.modelValue) ?? null
  return single ? single.label : (props.placeholder ?? '')
})

// const hasValue = computed(() =>
//   props.modelValue !== undefined && props.modelValue !== null && props.modelValue !== ''
// )
const hasValue = computed(() => {
  if (props.multiple) return selectedValues.value.length > 0
  return props.modelValue !== undefined && props.modelValue !== null && props.modelValue !== ''
})

const closeDropdown = () => {
  isDropdownOpen.value = false
  activeIndex.value = -1
}

const openDropdown = () => {
  if (props.disabled || props.loading) return
  isDropdownOpen.value = true

  // Mettre le focus clavier sur l'option sélectionnée, sinon première enabled
  const selectedIdx = props.options.findIndex(o => o.value === props.modelValue)
  if (selectedIdx >= 0 && !props.options[selectedIdx]?.disabled) {
    activeIndex.value = selectedIdx
  } else {
    activeIndex.value = props.options.findIndex(o => !o.disabled)
  }
}

const toggleDropdown = () => {
  if (isDropdownOpen.value) closeDropdown()
  else openDropdown()
}

const MAX_CHIPS_TO_SHOW = 2

const visibleChips = computed(() => {
  if (!props.multiple) return []
  return selectedOptions.value.slice(0, MAX_CHIPS_TO_SHOW)
})

const extraChipsCount = computed(() => {
  if (!props.multiple) return 0
  return Math.max(0, selectedOptions.value.length - visibleChips.value.length)
})

const removeValue = (value: SelectOptionValue) => {
  if (!props.multiple) return
  const current = selectedValues.value.slice()
  const idx = current.indexOf(value)
  if (idx >= 0) current.splice(idx, 1)
  emit('update:modelValue', current)
}

// const selectOption = (opt: ISelectOption) => {
//   if (opt.disabled) return
//   emit('update:modelValue', opt.value)
//   closeDropdown()
// }
const selectOption = (opt: ISelectOption) => {
  if (opt.disabled) return

  if (!props.multiple) {
    emit('update:modelValue', opt.value)
    closeDropdown()
    return
  }

  const current = selectedValues.value.slice()
  const idx = current.indexOf(opt.value)

  if (idx >= 0) current.splice(idx, 1)
  else current.push(opt.value)

  emit('update:modelValue', current)
  // en multiple on ne ferme pas automatiquement
}

const reset = () => {
  emit('update:modelValue', props.multiple ? [] : null)
  closeDropdown()
}

// click outside
onMounted(() => {
  const onDocClick = (e: MouseEvent) => {
    if (!rootRef.value) return
    const target = e.target as Node
    if (!rootRef.value.contains(target)) closeDropdown()
  }
  document.addEventListener('mousedown', onDocClick)
  onUnmounted(() => document.removeEventListener('mousedown', onDocClick))
})
</script>

<template>
  <div ref="rootRef" class="w-full max-w-72" v-bind="attrs">
    <label v-if="label" class="block mb-1 text-sm font-medium text-gray-400">
      {{ label }}
    </label>

    <!-- Trigger -->
    <div class="relative">
      <button
        ref="triggerRef"
        type="button"
        class="w-full h-8 text-left"
        :disabled="disabled || loading"
        :class="[
          selectClasses,
          rightPaddingClass,
          'flex items-center justify-between min-w-0',
          (disabled || loading) && 'cursor-not-allowed opacity-80',
        ]"
        @click="toggleDropdown"
        aria-haspopup="listbox"
        :aria-expanded="isDropdownOpen"
      >
        <div class="flex items-center gap-1 flex-1 min-w-0">
          <!-- MULTIPLE: chips -->
          <template v-if="multiple">
            <template v-if="selectedOptions.length">
              <span
                v-for="opt in visibleChips"
                :key="String(opt.value)"
                class="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs max-w-[10rem]"
                :class="theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-900'"
                @mousedown.prevent
                @click.stop
              >
                <span class="truncate max-w-[8rem]">{{ opt.label }}</span>

                <!-- remove chip -->
                <FontAwesomeIcon
                  icon="xmark"
                  class="text-[10px] opacity-80 hover:opacity-100 cursor-pointer"
                  @mousedown.prevent
                  @click.stop="removeValue(opt.value)"
                />
              </span>

              <span
                v-if="extraChipsCount > 0"
                class="inline-flex items-center px-2 py-0.5 rounded-md text-xs shrink-0"
                :class="theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-900'"
              >
                +{{ extraChipsCount }}
              </span>
            </template>

            <!-- placeholder si vide -->
            <span v-else class="truncate text-gray-500">
              {{ placeholder ?? '' }}
            </span>
          </template>

          <!-- SINGLE: label normal -->
          <template v-else>
            <span
              class="truncate flex-1 min-w-0"
              :class="[
                !selectedOption && placeholder ? 'text-gray-500' : '',
              ]"
            >
              {{ displayLabel }}
            </span>
          </template>
        </div>
      </button>

      <!-- CLEAR -->
      <FontAwesomeIcon
        v-if="hasValue && clearable && !disabled && !loading"
        icon="circle-xmark"
        class="absolute top-1/2 -translate-y-1/2 cursor-pointer"
        :class="[iconColorClass, clearRightClass]"
        @click.stop="reset"
      />

      <!-- LOADING -->
      <span
        v-if="loading"
        class="absolute top-1/2 -translate-y-1/2"
        :class="clearRightClass"
        aria-label="loading"
      >
        <span
          class="block h-5 w-5 rounded-full border-2 border-transparent border-t-current animate-spin"
          :class="iconColorClass"
        />
      </span>

      <!-- Optional trailing icon (à droite) -->
      <FontAwesomeIcon
        v-if="icon"
        :icon="icon"
        class="absolute right-10 top-1/2 -translate-y-1/2"
        :class="[iconColorClass, (disabled || loading) && 'opacity-50']"
      />

      <!-- Chevron animé -->
      <FontAwesomeIcon
        icon="chevron-down"
        class="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer transition-transform duration-200"
        :class="[
          iconColorClass,
          (disabled || loading) && 'opacity-50',
          isDropdownOpen && 'rotate-180',
        ]"
        @click="() => {
          triggerRef?.focus()
          toggleDropdown()
        }"
      />

      <!-- Dropdown -->
      <Transition
        enter-active-class="transition duration-150 ease-out"
        enter-from-class="opacity-0 -translate-y-1"
        enter-to-class="opacity-100 translate-y-0"
        leave-active-class="transition duration-120 ease-in"
        leave-from-class="opacity-100 translate-y-0"
        leave-to-class="opacity-0 -translate-y-1"
      >
        <ul
          v-if="isDropdownOpen"
          class="absolute z-50 mt-1 w-full max-h-32 overflow-auto rounded-lg border shadow-lg scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800"
          :class="[
            theme === 'dark'
              ? 'bg-gray-800 border-gray-600'
              : 'bg-white border-gray-300',
          ]"
          role="listbox"
          tabindex="0"
        >
          <li
            v-for="(opt, idx) in options"
            :key="String(opt.value)"
            role="option"
            :aria-selected="isSelected(opt.value)"
            class="px-3 py-2 text-sm cursor-pointer select-none"
            :class="[
              opt.disabled && 'opacity-50 cursor-not-allowed',
              idx === activeIndex && !opt.disabled && (theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'),
              theme === 'dark' ? 'text-white' : 'text-gray-900',
            ]"
            @mouseenter="!opt.disabled && (activeIndex = idx)"
            @mousedown.prevent
            @click="selectOption(opt)"
          >
            <div class="flex items-center justify-between gap-2">
              <span
                class="truncate"
                :class="[
                  opt.value === modelValue && 'font-semibold',
                ]"
              >
                {{ opt.label }}
              </span>

              <FontAwesomeIcon
                v-if="isSelected(opt.value)"
                icon="check"
                class="shrink-0"
                :class="iconColorClass"
              />
            </div>
          </li>
        </ul>
      </Transition>
    </div>
  </div>
</template>

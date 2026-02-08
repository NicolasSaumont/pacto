<script setup lang="ts">
import { useDebounce } from '@vueuse/core'
import type { ISelectProps } from '../types/select'

const props = withDefaults(defineProps<ISelectProps<any, any>>(), {
  clearable: true,
  theme: 'dark',
  multiple: false,
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: any[] | any | null): void
  (e: 'icon-click'): void
}>()

defineOptions({ inheritAttrs: false })

const attrs = useAttrs()
const { t } = useI18n()

const {
  selectClasses,
  iconColorClass,
  rightPaddingClass,
  clearRightClass,
} = useSelect(props)

const MAX_CHIPS_TO_SHOW = 2

const rootRef = ref<HTMLElement | null>(null)
const triggerRef = ref<HTMLButtonElement | null>(null)

const isDropdownOpen = ref(false)
const activeIndex = ref<number>(-1)
const filterQuery = ref('')
const filterInputRef = ref<{ focus: () => void } | null>(null)

// --- extractors (label/value/disabled) ---
const getLabel = (option: OptionT): string => {
  if (props.getOptionLabel) return props.getOptionLabel(option)
  if (props.labelKey) return String(option?.[props.labelKey] ?? '')
  if (option?.label !== undefined) return String(option.label)
  return String(option ?? '')
}

const getValue = (option: OptionT): ValueT => {
  if (props.getOptionValue) return props.getOptionValue(option)
  if (props.valueKey) return option?.[props.valueKey]
  if (option?.value !== undefined) return option.value
  return option
}

const isOptionDisabled = (option: OptionT): boolean => {
  if (props.getOptionDisabled) return props.getOptionDisabled(option)
  return Boolean(option?.disabled)
}

// --- selection ---
const selectedValues = computed<ValueT[]>(() => {
  if (props.multiple) return Array.isArray(props.modelValue) ? props.modelValue : []
  return props.modelValue === null || props.modelValue === undefined || props.modelValue === ''
    ? []
    : [props.modelValue as ValueT]
})

const isSelectedOpt = (option: OptionT) => {
  const value = getValue(option)
  return selectedValues.value.some((selectedValue) => selectedValue === value)
}

const selectedOptions = computed<OptionT[]>(() =>
  props.options.filter((option) => isSelectedOpt(option)),
)

const hasValue = computed(() => {
  if (props.multiple) return selectedValues.value.length > 0
  return props.modelValue !== undefined && props.modelValue !== null && props.modelValue !== '' && props.modelValue !== 0
})

// --- trigger display ---
const selectedOption = computed(() => {
  // utile pour le placeholder en single
  if (props.multiple) return null
  return props.options.find((option) => getValue(option) === props.modelValue) ?? null
})

const displayLabel = computed(() => {
  if (props.multiple) {
    return selectedOptions.value.length ? '' : (props.placeholder ?? '')
  }
  return selectedOption.value ? getLabel(selectedOption.value) : (props.placeholder ?? '')
})

// chips
const visibleChips = computed(() => {
  if (!props.multiple) return []
  return selectedOptions.value.slice(0, MAX_CHIPS_TO_SHOW)
})

const extraChipsCount = computed(() => {
  if (!props.multiple) return 0
  return Math.max(0, selectedOptions.value.length - visibleChips.value.length)
})

const removeValue = (value: ValueT) => {
  if (!props.multiple) return
  const current = selectedValues.value.slice()
  const index = current.findIndex(selectedValue => selectedValue === value)
  if (index >= 0) current.splice(index, 1)
  emit('update:modelValue', current)
}

// --- dropdown open/close ---
const closeDropdown = () => {
  isDropdownOpen.value = false
  activeIndex.value = -1
  filterQuery.value = ''
}

const onClick = (event: MouseEvent) => {
  if (!rootRef.value) return
  const target = event.target as Node
  if (!rootRef.value.contains(target)) closeDropdown()
}

const openDropdown = () => {
  if (props.disabled || props.loading) return
  isDropdownOpen.value = true

  // focus input si filter
  if (props.filter) {
    // optionnel: reset à chaque ouverture
    filterQuery.value = ''
    nextTick(() => filterInputRef.value?.focus())
  }

  const options = filteredOptions.value

  if (!props.multiple) {
    const selectedIdx = options.findIndex(option => getValue(option) === props.modelValue)
    if (selectedIdx >= 0 && !isOptionDisabled(options[selectedIdx])) {
      activeIndex.value = selectedIdx
      return
    }
  }
  activeIndex.value = options.findIndex(option => !isOptionDisabled(option))
}

const toggleDropdown = () => {
  if (isDropdownOpen.value) closeDropdown()
  else openDropdown()
}

// --- select option ---
const selectOption = (option: OptionT) => {
  if (isOptionDisabled(option)) return

  const value = getValue(option)

  if (!props.multiple) {
    emit('update:modelValue', value)
    closeDropdown()
    return
  }

  const current = selectedValues.value.slice()
  const index = current.findIndex(selectedValue => selectedValue === value)

  if (index >= 0) current.splice(index, 1)
  else current.push(value)

  emit('update:modelValue', current)
}

const reset = () => {
  emit('update:modelValue', props.multiple ? [] : null)
  closeDropdown()
}

// --- filter ---
const normalizedQuery = computed(() => filterQuery.value.trim().toLowerCase())
const debouncedQuery = useDebounce(normalizedQuery, INPUT_DEBOUNCE)

const filteredOptions = computed(() => {
  if (!props.filter) return props.options
  const query = debouncedQuery.value
  if (!query) return props.options

  // si l’utilisateur fournit sa logique de filtre
  if (props.filterFn) {
    return props.options.filter(option => props.filterFn!(option, filterQuery.value))
  }

  // filtre par défaut: sur le label
  return props.options.filter((option) => {
    const label = getLabel(option).toLowerCase()
    return label.includes(query)
  })
})

// Quand la liste filtrée change, l’option actuellement active
// peut ne plus exister : on recalcule donc l’index actif
// en pointant vers la première option sélectionnable 
watch([() => props.filter, debouncedQuery], () => {
  if (!isDropdownOpen.value) return
  const index = filteredOptions.value.findIndex(option => !isOptionDisabled(option))
  activeIndex.value = index
})

onMounted(() => document.addEventListener('mousedown', onClick))

onUnmounted(() => document.removeEventListener('mousedown', onClick))
</script>

<template>
  <div ref="rootRef" class="w-full max-w-72" v-bind="attrs">
    <label v-if="label" class="flex gap-1 mb-1 text-sm font-medium text-gray-400">
      <span>{{ label }}</span>
      <span v-if="required" class="text-red-600">*</span>
    </label>

    <div class="relative">
      <!-- Trigger -->
      <button
        ref="triggerRef"
        type="button"
        class="w-full h-8 text-left"
        :disabled="disabled || loading"
        :class="[
          selectClasses,
          rightPaddingClass,
          'flex items-center justify-between min-w-0',
          (disabled || loading) ? 'cursor-not-allowed opacity-50' : 'cursor-pointer',
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
                v-for="option in visibleChips"
                :key="String(getValue(option))"
                :title="getLabel(option)"
                class="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs max-w-20"
                :class="theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-900'"
                @mousedown.prevent
                @click.stop
              >
                <span class="truncate max-w-[8rem]">{{ getLabel(option) }}</span>

                <FontAwesomeIcon
                  icon="xmark"
                  class="text-[10px] hover:opacity-100"
                  :class="(disabled || loading) ? 'cursor-not-allowed opacity-50' : 'cursor-pointer opacity-80'"
                  @mousedown.prevent
                  @click.stop="removeValue(getValue(option))"
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

          <!-- SINGLE -->
          <template v-else>
            <span
              class="truncate flex-1 min-w-0"
              :class="[!selectedOption && placeholder ? 'text-gray-500' : '']"
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
        class="absolute top-1/2 -translate-y-1/2"
        :class="[
          iconColorClass, 
          clearRightClass,
          (disabled || loading) ? 'cursor-not-allowed opacity-50' : 'cursor-pointer',
        ]"
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

      <!-- Optional trailing icon -->
      <FontAwesomeIcon
        v-if="icon"
        :icon="icon"
        class="absolute right-10 top-1/2 -translate-y-1/2"
        :class="[iconColorClass, (disabled || loading) && 'opacity-50']"
      />

      <!-- Chevron -->
      <FontAwesomeIcon
        icon="chevron-down"
        class="absolute right-3 top-1/2 -translate-y-1/2 transition-transform duration-200"
        :class="[
          iconColorClass,
          (disabled || loading) ? 'cursor-not-allowed opacity-50' : 'cursor-pointer',
          isDropdownOpen && 'rotate-180',
        ]"
        @mousedown.prevent
        @click="() => { triggerRef?.focus(); toggleDropdown() }"
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
          :class="[theme === 'dark' ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-300']"
          role="listbox"
          tabindex="0"
        >
          <!-- FILTER INPUT -->
          <li 
            v-if="filter" 
            class="px-2 py-2 sticky top-0 z-10"
            :class="[theme === 'dark' ? 'bg-gray-800' : 'bg-white']"
            @mousedown.stop
            @click.stop
          >
            <Input 
              ref="filterInputRef"
              v-model="filterQuery"
              :placeholder="t('common.search')"
            />
          </li>

          <li
            v-for="(option, index) in filteredOptions"
            :key="String(getValue(option))"
            role="option"
            :aria-selected="isSelectedOpt(option)"
            class="px-3 py-2 text-sm cursor-pointer select-none"
            :class="[
              isOptionDisabled(option) && 'opacity-50 cursor-not-allowed',
              index === activeIndex && !isOptionDisabled(option) && (theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'),
              theme === 'dark' ? 'text-white' : 'text-gray-900',
            ]"
            @mouseenter="!isOptionDisabled(option) && (activeIndex = index)"
            @mousedown.prevent
            @click="selectOption(option)"
          >
            <div class="flex items-center justify-between gap-2 min-w-0">
              <span class="truncate flex-1 min-w-0" :class="[isSelectedOpt(option) && 'font-semibold']">
                {{ getLabel(option) }}
              </span>

              <FontAwesomeIcon
                v-if="isSelectedOpt(option)"
                icon="check"
                class="shrink-0"
                :class="iconColorClass"
              />
            </div>
          </li>
          <div 
            v-if="filteredOptions.length === 0" 
            class="px-3 py-2 text-sm italic select-none"
            @click="toggleDropdown"
          >
            {{ t('common.no-data') }}
          </div>
        </ul>
      </Transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ISelectProps } from '../types/select'

const props = withDefaults(defineProps<ISelectProps<any, any>>(), {
  clearable: true,
  theme: 'dark',
  multiple: false,
  maxChipsToShow: 2,
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

type OptionT = any
type ValueT = any

const rootRef = ref<HTMLElement | null>(null)
const triggerRef = ref<HTMLButtonElement | null>(null)

const isDropdownOpen = ref(false)
const activeIndex = ref<number>(-1)

// --- extractors (label/value/disabled) ---
const getLabel = (opt: OptionT): string => {
  if (props.getOptionLabel) return props.getOptionLabel(opt)
  if (props.labelKey) return String(opt?.[props.labelKey] ?? '')
  if (opt?.label !== undefined) return String(opt.label)
  return String(opt ?? '')
}

const getValue = (opt: OptionT): ValueT => {
  if (props.getOptionValue) return props.getOptionValue(opt)
  if (props.valueKey) return opt?.[props.valueKey]
  if (opt?.value !== undefined) return opt.value
  return opt
}

const isOptDisabled = (opt: OptionT): boolean => {
  if (props.getOptionDisabled) return props.getOptionDisabled(opt)
  return Boolean(opt?.disabled)
}

// --- selection ---
const selectedValues = computed<ValueT[]>(() => {
  if (props.multiple) return Array.isArray(props.modelValue) ? props.modelValue : []
  return props.modelValue === null || props.modelValue === undefined || props.modelValue === ''
    ? []
    : [props.modelValue as ValueT]
})

const isSelectedOpt = (opt: OptionT) => {
  const v = getValue(opt)
  return selectedValues.value.some((sv) => sv === v)
}

const selectedOptions = computed<OptionT[]>(() =>
  props.options.filter((opt) => isSelectedOpt(opt)),
)

const hasValue = computed(() => {
  if (props.multiple) return selectedValues.value.length > 0
  return props.modelValue !== undefined && props.modelValue !== null && props.modelValue !== ''
})

// --- trigger display ---
const selectedOption = computed(() => {
  // utile pour le placeholder en single
  if (props.multiple) return null
  return props.options.find((opt) => getValue(opt) === props.modelValue) ?? null
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
  return selectedOptions.value.slice(0, props.maxChipsToShow ?? 2)
})

const extraChipsCount = computed(() => {
  if (!props.multiple) return 0
  return Math.max(0, selectedOptions.value.length - visibleChips.value.length)
})

const removeValue = (value: ValueT) => {
  if (!props.multiple) return
  const current = selectedValues.value.slice()
  const idx = current.findIndex(v => v === value)
  if (idx >= 0) current.splice(idx, 1)
  emit('update:modelValue', current)
}

// --- dropdown open/close ---
const closeDropdown = () => {
  isDropdownOpen.value = false
  activeIndex.value = -1
}

const openDropdown = () => {
  if (props.disabled || props.loading) return
  isDropdownOpen.value = true

  // focus clavier : selected sinon premier non-disabled
  if (!props.multiple) {
    const selectedIdx = props.options.findIndex(o => getValue(o) === props.modelValue)
    if (selectedIdx >= 0 && !isOptDisabled(props.options[selectedIdx])) {
      activeIndex.value = selectedIdx
      return
    }
  }
  activeIndex.value = props.options.findIndex(o => !isOptDisabled(o))
}

const toggleDropdown = () => {
  if (isDropdownOpen.value) closeDropdown()
  else openDropdown()
}

// --- select option ---
const selectOption = (opt: OptionT) => {
  if (isOptDisabled(opt)) return

  const v = getValue(opt)

  if (!props.multiple) {
    emit('update:modelValue', v)
    closeDropdown()
    return
  }

  const current = selectedValues.value.slice()
  const idx = current.findIndex(x => x === v)

  if (idx >= 0) current.splice(idx, 1)
  else current.push(v)

  emit('update:modelValue', current)
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
                :key="String(getValue(opt))"
                :title="getLabel(opt)"
                class="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs max-w-20"
                :class="theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-900'"
                @mousedown.prevent
                @click.stop
              >
                <span class="truncate max-w-[8rem]">{{ getLabel(opt) }}</span>

                <FontAwesomeIcon
                  icon="xmark"
                  class="text-[10px] opacity-80 hover:opacity-100 cursor-pointer"
                  @mousedown.prevent
                  @click.stop="removeValue(getValue(opt))"
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
        class="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer transition-transform duration-200"
        :class="[
          iconColorClass,
          (disabled || loading) && 'opacity-50',
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
          <li
            v-for="(opt, idx) in options"
            :key="String(getValue(opt))"
            role="option"
            :aria-selected="isSelectedOpt(opt)"
            class="px-3 py-2 text-sm cursor-pointer select-none"
            :class="[
              isOptDisabled(opt) && 'opacity-50 cursor-not-allowed',
              idx === activeIndex && !isOptDisabled(opt) && (theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'),
              theme === 'dark' ? 'text-white' : 'text-gray-900',
            ]"
            @mouseenter="!isOptDisabled(opt) && (activeIndex = idx)"
            @mousedown.prevent
            @click="selectOption(opt)"
          >
            <div class="flex items-center justify-between gap-2 min-w-0">
              <span class="truncate flex-1 min-w-0" :class="[isSelectedOpt(opt) && 'font-semibold']">
                {{ getLabel(opt) }}
              </span>

              <FontAwesomeIcon
                v-if="isSelectedOpt(opt)"
                icon="check"
                class="shrink-0"
                :class="iconColorClass"
              />
            </div>
          </li>
          <div 
            v-if="options.length === 0" 
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

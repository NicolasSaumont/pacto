// useSelect.ts
export function useSelect(props: ISelectProps) {
  const basicClasses = [
    'border rounded-lg pl-3 py-1 text-sm cursor-pointer focus:outline-none focus:ring-2 appearance-none',
  ]

  const themeClasses: Record<TInputTheme, string[]> = {
    dark: ['bg-gray-800 border-gray-600 text-white', 'focus:ring-blue-500'],
    light: ['bg-white border-gray-300 text-gray-900', 'focus:ring-blue-500'],
  }

  const selectClasses = computed(() => [
    ...basicClasses,
    ...themeClasses[props.theme ?? 'dark'],
  ])

  const iconColorClass = computed(() =>
    props.theme === 'light' ? 'text-gray-500' : 'text-gray-400',
  )

  const hasTrailingIcon = computed(() => Boolean(props.icon))
  // const hasClear = computed(() => {
  //   const v = props.modelValue
  //   return props.clearable && v !== undefined && v !== null && v !== ''
  // })
  const hasClear = computed(() => {
    const v = props.modelValue
    if (!props.clearable) return false
    if (Array.isArray(v)) return v.length > 0
    return v !== undefined && v !== null && v !== ''
  })

  const rightPaddingClass = computed(() => {
    const hasSpinner = Boolean(props.loading)
    // clear + icon/spinner
    if (hasClear.value && (hasTrailingIcon.value || hasSpinner)) return 'pr-16'
    // clear ou icon/spinner
    if (hasClear.value || hasTrailingIcon.value || hasSpinner) return 'pr-10'
    return 'pr-3'
  })

  const clearRightClass = computed(() =>
    hasTrailingIcon.value || props.loading ? 'right-16' : 'right-10',
  )

  return {
    selectClasses,
    iconColorClass,
    rightPaddingClass,
    clearRightClass,
  }
}

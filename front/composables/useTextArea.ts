export function useTextarea(props: ITextareaProps) {
  const basicClasses = [
    'border rounded-lg pl-3 py-2 text-sm focus:outline-none focus:ring-2',
    'min-h-[96px]', // hauteur mini (≈ rows 4)
  ]

  const themeClasses: Record<TInputTheme, string[]> = {
    dark: ['bg-gray-800 border-gray-600 text-white', 'focus:ring-blue-500'],
    light: ['bg-white border-gray-300 text-gray-900', 'focus:ring-blue-500'],
  }

  const textareaClasses = computed(() => [
    ...basicClasses,
    ...themeClasses[props.theme ?? 'dark'],
  ])

  const iconColorClass = computed(() =>
    props.theme === 'light' ? 'text-gray-500' : 'text-gray-400'
  )

  const hasTrailingIcon = computed(() => Boolean(props.icon))
  const hasClear = computed(() => Boolean(props.modelValue?.length))

  const rightPaddingClass = computed(() => {
    if (hasClear.value && hasTrailingIcon.value) return 'pr-16'
    if (hasClear.value || hasTrailingIcon.value) return 'pr-10'
    return 'pr-3'
  })

  // pour textarea, même logique de right (top change côté template)
  const clearRightClass = computed(() =>
    hasTrailingIcon.value ? 'right-10' : 'right-3'
  )

  return {
    clearRightClass,
    iconColorClass,
    textareaClasses,
    rightPaddingClass,
  }
}

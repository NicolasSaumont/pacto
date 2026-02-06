export function useInput(props: IInputProps) {
  const basicClasses = [
    'border rounded-lg pl-3 py-1 text-sm focus:outline-none focus:ring-2',
  ]

  const themeClasses: Record<TInputTheme, string[]> = {
    dark: [
      'bg-gray-800 border-gray-600 text-white',
      'focus:ring-blue-500',
    ],
    light: [
      'bg-white border-gray-300 text-gray-900',
      'focus:ring-blue-500',
    ],
  }

  const inputClasses = computed(() => [
    ...basicClasses,
    ...themeClasses[props.theme ?? 'dark']
  ])

  const iconColorClass = computed(() =>
    props.theme === 'light' ? 'text-gray-500' : 'text-gray-400'
  )

  const hasTrailingIcon = computed(() => Boolean(props.icon))           // icône à droite (loupe/users)
  
  // bouton clear visible
  const hasClear = computed(() => {
    const value = props.modelValue
    return value !== undefined && value !== null && value !== ''
  })

  // padding droite de l'input selon ce qu'on affiche à droite
  const rightPaddingClass = computed(() => {
    // clear + trailing icon
    if (hasClear.value && hasTrailingIcon.value) return 'pr-16'
    // clear seul OU trailing icon seul
    if (hasClear.value || hasTrailingIcon.value) return 'pr-10'
    // rien à droite
    return 'pr-3'
  })

  // position du clear
  const clearRightClass = computed(() =>
    hasTrailingIcon.value ? 'right-10' : 'right-3'
  )

  return { 
    clearRightClass,
    iconColorClass,
    inputClasses,
    rightPaddingClass,
  }
}
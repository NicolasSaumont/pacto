export function useButton(props: IButtonProps) {
  const basicClasses = computed(() => [
    'font-medium rounded-lg transition-colors',
    'disabled:opacity-50 disabled:cursor-not-allowed',
  ])

  const buttonPadding = computed(() => (props.label ? 'py-3 px-4' : 'p-3'))

  const colorStyles: Record<
    ButtonColorEnum,
    {
      normal: string[]
      flat: string[]
      outline: string[]
    }
  > = {
    primary: {
      normal: ['bg-blue-500 text-white', 'enabled:hover:bg-blue-700'],
      flat: ['enabled:hover:bg-blue-900/75'],
      outline: ['border border-blue-500', 'enabled:hover:bg-blue-900/20'],
    },
    red: {
      normal: ['bg-red-500 text-white', 'enabled:hover:bg-red-700'],
      flat: ['text-red-500', 'enabled:hover:bg-red-900/40'],
      outline: ['border border-red-500', 'enabled:hover:bg-red-900/40'],
    },
    white: {
      normal: ['bg-white text-gray-900', 'enabled:hover:bg-white/80'],
      flat: ['enabled:hover:bg-gray-200/20'],
      outline: ['border border-white', 'enabled:hover:bg-gray-200/20'],
    },
  }

  const colorStylesClasses = computed(() => {
    const colorStyle = colorStyles[props.color ?? 'primary']
    if (props.outline) return colorStyle.outline
    if (props.flat) return colorStyle.flat
    return colorStyle.normal
  })

  const buttonStyle = computed(() => [
    ...basicClasses.value,
    buttonPadding.value,
    props.label && 'w-48',
    ...colorStylesClasses.value,
  ])

  return {
    buttonStyle,
  }
}

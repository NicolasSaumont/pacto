export function useButton(props: IButtonProps) {
  const basicClasses = computed(() => [
    'font-medium rounded-lg max-w-44 transition-colors',
    'disabled:opacity-50 disabled:cursor-not-allowed',
  ])

  const paddingClasses = computed(() =>
    props.label
      ? 'py-3 px-4'
      : 'p-3'
  )

  const colorStyles: Record<TButtonColor, {
    normal: string[]
    flat: string[]
  }> = {
    primary: {
      normal: ['bg-blue-500 text-white', 'enabled:hover:bg-blue-700'],
      flat: ['enabled:hover:bg-blue-900/75'],
    },
    red: {
      normal: ['bg-red-500 text-white', 'enabled:hover:bg-red-700'],
      flat: ['text-red-500', 'enabled:hover:bg-red-900/40'],
    },
  }

  const buttonStyle = computed(() => [
    ...basicClasses.value,
    paddingClasses.value,
    ...(props.flat
      ? colorStyles[props.color ?? 'primary'].flat
      : colorStyles[props.color ?? 'primary'].normal),
])  

  return { 
    buttonStyle,
  }
}
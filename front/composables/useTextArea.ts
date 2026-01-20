export function useTextarea(
  props: ITextareaProps,
  refs: {
    constraintRef: Ref<HTMLElement | null>
    textareaRef: Ref<HTMLTextAreaElement | null>
  }
) {
  // --- Styles wrapper (porte bg/border + ring-offset) ---
  const wrapperClasses = computed(() => {
    if (props.theme === 'light') {
      return ['bg-white border-gray-300', 'focus-within:ring-offset-white']
    }
    return ['bg-gray-800 border-gray-600', 'focus-within:ring-offset-gray-900']
  })

  // --- Styles textarea (PAS de border/bg/ring ici) ---
  const textareaClasses = computed(() => [
    'text-sm pl-3 py-2',
    props.theme === 'light' ? 'text-gray-900' : 'text-white',
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

  const clearRightClass = computed(() =>
    hasTrailingIcon.value ? 'right-10' : 'right-3'
  )

  const scrollbarClasses = computed(() =>
    props.theme === 'light'
      ? 'scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200'
      : 'scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800'
  )

  // --- Max-height dynamique = hauteur dispo dans constraintRef ---
  const maxHeightPx = ref<number>(0)

  const textareaMaxHeightStyle = computed(() => {
    // On laisse toujours un petit "gap" pour éviter de toucher le bas
    const safety = 6
    const h = Math.max(0, maxHeightPx.value - safety)
    return h > 0 ? { maxHeight: `${h}px` } : {}
  })

  let ro: ResizeObserver | null = null

  const updateMaxHeight = () => {
    if (!props.resize) return
    const c = refs.constraintRef.value
    if (!c) return
    // hauteur dispo = hauteur intérieure de la zone restante
    maxHeightPx.value = c.clientHeight
  }

  onMounted(() => {
    updateMaxHeight()

    ro = new ResizeObserver(() => updateMaxHeight())
    if (refs.constraintRef.value) ro.observe(refs.constraintRef.value)

    window.addEventListener('resize', updateMaxHeight, { passive: true })
  })

  onBeforeUnmount(() => {
    window.removeEventListener('resize', updateMaxHeight)
    ro?.disconnect()
    ro = null
  })

  return {
    clearRightClass,
    iconColorClass,
    wrapperClasses,
    textareaClasses,
    rightPaddingClass,
    scrollbarClasses,
    textareaMaxHeightStyle,
  }
}

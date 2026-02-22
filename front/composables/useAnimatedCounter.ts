export function useAnimatedCounter(target: number, duration = 1000, displayRef?: Ref<number>) {
  const display = displayRef ?? ref(0)
  let start: number | null = null
  let animationFrame: number

  function step(timestamp: number) {
    if (!start) start = timestamp
    const progress = Math.min((timestamp - start) / duration, 1)
    display.value = Math.floor(progress * target)
    if (progress < 1) {
      animationFrame = requestAnimationFrame(step)
    }
  }

  animationFrame = requestAnimationFrame(step)

  return display
}
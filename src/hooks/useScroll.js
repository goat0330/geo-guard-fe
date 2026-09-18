import { nextTick, onBeforeUnmount, onMounted, ref, unref, watch } from 'vue'

const DEFAULT_THRESHOLD = 16
const AUTO_SCROLL_OFFSET = 4

const getTargetElement = (target) => {
  const rawTarget = unref(target)

  if (!rawTarget) {
    return null
  }

  if (rawTarget instanceof HTMLElement) {
    return rawTarget
  }

  if (typeof rawTarget !== 'string') {
    return null
  }

  if (rawTarget.startsWith('#') || rawTarget.startsWith('.')) {
    return document.querySelector(rawTarget)
  }

  return document.getElementById(rawTarget) || document.querySelector(`.${rawTarget}`) || document.querySelector(rawTarget)
}

export const useScroll = (target, options = {}) => {
  const threshold = options.threshold ?? DEFAULT_THRESHOLD
  const isScrollBlocked = ref(false)
  let targetEl = null
  let isProgrammaticScrolling = false
  let scrollUnlockTimer = null
  let stopTargetWatch = null

  const isAtBottom = (el) => {
    if (!el) {
      return false
    }

    return el.scrollHeight - el.scrollTop - el.clientHeight <= threshold
  }

  const updateScrollState = () => {
    if (!targetEl) {
      return
    }

    if (isProgrammaticScrolling) {
      return
    }

    isScrollBlocked.value = !isAtBottom(targetEl)
  }

  const scrollBottom = async(force = false) => {
    await nextTick()

    targetEl = getTargetElement(target)
    if (!targetEl) {
      return false
    }

    if (isScrollBlocked.value && !force) {
      return false
    }

    // 自动跟随保留微小余量，避免子像素取整触发浏览器向上回夹。
    const maxScrollTop = Math.max(0, targetEl.scrollHeight - targetEl.clientHeight)
    const nextScrollTop = force ? maxScrollTop : Math.max(0, maxScrollTop - AUTO_SCROLL_OFFSET)
    if (!force && nextScrollTop <= targetEl.scrollTop) {
      return true
    }

    isProgrammaticScrolling = true
    targetEl.scrollTo({
      top: nextScrollTop,
      behavior: 'auto',
    })

    if (scrollUnlockTimer) {
      cancelAnimationFrame(scrollUnlockTimer)
    }

    scrollUnlockTimer = requestAnimationFrame(() => {
      isScrollBlocked.value = false
      isProgrammaticScrolling = false
      scrollUnlockTimer = null
    })
    return true
  }

  onMounted(() => {
    stopTargetWatch = watch(
      () => getTargetElement(target),
      (nextTarget, previousTarget) => {
        previousTarget?.removeEventListener('scroll', updateScrollState)
        targetEl = nextTarget
        if (!targetEl) return

        updateScrollState()
        targetEl.addEventListener('scroll', updateScrollState, { passive: true })
      },
      { immediate: true, flush: 'post' },
    )
  })

  onBeforeUnmount(() => {
    stopTargetWatch?.()
    if (scrollUnlockTimer) {
      cancelAnimationFrame(scrollUnlockTimer)
      scrollUnlockTimer = null
    }

    if (!targetEl) {
      return
    }

    targetEl.removeEventListener('scroll', updateScrollState)
  })

  return {
    isScrollBlocked,
    scrollBottom,
  }
}

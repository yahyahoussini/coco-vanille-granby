'use client'
import { useEffect, useRef } from 'react'

// Brings the current chip into view when its line of chips is wider than the screen (enhancement only: it scrolls
// the line sideways, never the page). Renders an empty hidden marker inside `within` to find its line.
// Defaults: the menu's family chips; the box page passes its day chips.
export function CurrentChip({ within = '.cat-nav', list = '.cat-nav-list', current = '[aria-current="page"]' }) {
  const ref = useRef(null)
  useEffect(() => {
    const line = ref.current?.closest(within)?.querySelector(list)
    const chip = line?.querySelector(current)
    if (!line || !chip || line.scrollWidth <= line.clientWidth) return
    const box = line.getBoundingClientRect()
    const at = chip.getBoundingClientRect()
    line.scrollLeft += at.left - box.left - (box.width - at.width) / 2
  }, [within, list, current])
  return <span ref={ref} hidden />
}

'use client'
import { useEffect, useRef } from 'react'

// The phone menu (< 60rem): a popover sheet opened by the header's « Menu » button. The popover API does the
// essentials without JavaScript: open, Escape and light dismiss, focus into the sheet (autofocus on its close
// button), focus back to the button. This adds the rest while the sheet covers the page: Tab and Shift+Tab stay
// inside it, and following a link closes it (a client navigation keeps the header mounted).
export function MenuSheet({ id, label, className, children }) {
  const ref = useRef(null)
  useEffect(() => {
    const sheet = ref.current
    if (!sheet || typeof sheet.hidePopover !== 'function') return undefined
    const isOpen = () => sheet.matches(':popover-open')
    const onKey = (e) => {
      if (e.key !== 'Tab' || !isOpen()) return
      const list = [...sheet.querySelectorAll('a[href], button:not([disabled])')].filter((el) => el.getClientRects().length > 0)
      if (!list.length) return
      const first = list[0]
      const last = list.at(-1)
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }
    const onClick = (e) => {
      const link = e.target instanceof Element ? e.target.closest('a[href]') : null
      if (link && isOpen()) sheet.hidePopover()
    }
    sheet.addEventListener('keydown', onKey)
    sheet.addEventListener('click', onClick)
    return () => {
      sheet.removeEventListener('keydown', onKey)
      sheet.removeEventListener('click', onClick)
    }
  }, [])
  return (
    <div ref={ref} id={id} popover="auto" role="dialog" aria-modal="true" aria-label={label} className={className}>
      {children}
    </div>
  )
}

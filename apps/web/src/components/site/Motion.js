'use client'
import { useEffect } from 'react'

// One small motion layer for the public site (no library). Enhancement only: every element is visible and usable
// without it, with CSS animations off, and with prefers-reduced-motion (then nothing moves at all).
//   data-reveal              fades up once when it enters the viewport (hidden only after this script has run)
//   data-reveal-stagger      sets --i on its children so their reveal is staggered
//   data-parallax="0.12"     drifts with the scroll (transform only; never on a touch screen)
//   data-scroll-progress     gets --progress (0 → 1) while it crosses the viewport (ring rotation, marquee)
//   data-magnetic            follows the pointer by a few pixels      ┐ fine pointer with hover only
//   data-spotlight           gets --mx / --my for a soft radial glow  │
//   data-tilt                tilts by up to 4°                        │
//   data-depth="0.6"         moves with the pointer inside [data-stage] ┘
//   .rail                    keyboard focus on an item brings it fully into view, on its snap position
// The header reads three facts on <html> (site.css decides): data-scrolled once the page has scrolled (condensed,
// shadow), data-scroll-deep past the first screenful of header (the phone bar may slide away) and
// data-scroll-dir, the direction of the last scroll.
export function Motion() {
  useEffect(() => {
    const root = document.documentElement
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches
    const coarse = window.matchMedia('(pointer: coarse)').matches
    const cleanups = []
    const on = (target, type, fn, opts) => {
      target.addEventListener(type, fn, opts)
      cleanups.push(() => target.removeEventListener(type, fn, opts))
    }

    // The direction changes only after 6 px of travel, so a finger's tremor never toggles the header; the
    // position is clamped, so the rubber band at either end of the page never reads as a scroll back.
    let anchorY = window.scrollY
    const visible = new Set()
    let frame = 0
    const tick = () => {
      frame = 0
      const max = Math.max(0, root.scrollHeight - window.innerHeight)
      const y = Math.min(Math.max(0, window.scrollY), max)
      root.toggleAttribute('data-scrolled', y > 24)
      root.toggleAttribute('data-scroll-deep', y > 160)
      if (Math.abs(y - anchorY) > 6) {
        root.dataset.scrollDir = y > anchorY ? 'down' : 'up'
        anchorY = y
      } else if (!root.dataset.scrollDir) root.dataset.scrollDir = 'up'
      if (reduce) return
      const vh = window.innerHeight
      for (const el of visible) {
        const r = el.getBoundingClientRect()
        if (el.hasAttribute('data-parallax') && !coarse) {
          const factor = parseFloat(el.dataset.parallax) || 0.1
          const offset = (r.top + r.height / 2 - vh / 2) * -factor
          el.style.setProperty('--parallax', `${offset.toFixed(1)}px`)
        }
        if (el.hasAttribute('data-scroll-progress')) {
          const progress = Math.min(1, Math.max(0, (vh - r.top) / (vh + r.height)))
          el.style.setProperty('--progress', progress.toFixed(4))
        }
      }
    }
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(tick)
    }
    on(window, 'scroll', schedule, { passive: true })
    on(window, 'resize', schedule, { passive: true })

    // Scroll-linked elements are only measured while they are on screen.
    const watcher = new IntersectionObserver((entries) => {
      for (const e of entries) e.isIntersecting ? visible.add(e.target) : visible.delete(e.target)
      schedule()
    })

    // Reveal on scroll: elements already on screen (or above it) are shown at once, so nothing flashes.
    const revealer = reduce
      ? null
      : new IntersectionObserver(
          (entries) => {
            for (const e of entries) {
              if (!e.isIntersecting) continue
              e.target.classList.add('is-in')
              revealer.unobserve(e.target)
            }
          },
          { rootMargin: '0px 0px -6% 0px', threshold: 0.08 },
        )

    const prepare = (scope) => {
      scope.querySelectorAll?.('[data-reveal-stagger]').forEach((list) => {
        Array.from(list.children).forEach((child, i) => child.style.setProperty('--i', String(Math.min(i, 8))))
      })
      scope.querySelectorAll?.('[data-parallax], [data-scroll-progress]').forEach((el) => watcher.observe(el))
      if (!revealer) return
      const vh = window.innerHeight
      scope.querySelectorAll?.('[data-reveal]:not(.is-in)').forEach((el) => {
        if (el.getBoundingClientRect().top < vh * 0.94) el.classList.add('is-in')
        else revealer.observe(el)
      })
    }
    prepare(document)
    if (!reduce) root.classList.add('motion-ready')
    schedule()

    // Client-side navigations bring new sections: prepare them too.
    const mutations = new MutationObserver((records) => {
      for (const r of records) r.addedNodes.forEach((n) => n.nodeType === 1 && prepare(n.parentElement || n))
    })
    mutations.observe(document.body, { childList: true, subtree: true })

    // Keyboard focus in a swipe rail (.rail, site.css: phones): the browser scrolls the focused card or chip into
    // view, then the mandatory snapping pulls the rail back and leaves it half under the edge. Once that has
    // happened, the rail glides to the item's own snap position (a jump with reduced motion). One listener for
    // every rail, present or added later; a tap or a click (no :focus-visible) leaves the rail where it is.
    const keyboardFocus = (el) => {
      try {
        return el.matches(':focus-visible')
      } catch {
        return true
      }
    }
    on(document, 'focusin', (event) => {
      const item = event.target instanceof Element ? event.target.closest('.rail > *') : null
      if (!item) return
      requestAnimationFrame(() => {
        const focused = document.activeElement
        if (!focused || !item.contains(focused) || !keyboardFocus(focused)) return
        const rail = item.parentElement
        const r = item.getBoundingClientRect()
        const box = rail.getBoundingClientRect()
        if (r.left >= box.left - 0.5 && r.right <= box.right + 0.5) return
        const pad = parseFloat(getComputedStyle(rail).scrollPaddingInlineStart) || 0
        rail.scrollTo({ left: rail.scrollLeft + r.left - box.left - pad, behavior: reduce ? 'auto' : 'smooth' })
      })
    })

    // Pointer effects: fine pointer with hover only, never with reduced motion.
    if (finePointer && !reduce) {
      let pointerFrame = 0
      let last = null
      const reset = (el) => {
        el.style.removeProperty('--mag-x')
        el.style.removeProperty('--mag-y')
        el.style.removeProperty('--tilt-x')
        el.style.removeProperty('--tilt-y')
      }
      let current = { magnetic: null, tilt: null, stage: null }
      const pointer = () => {
        pointerFrame = 0
        if (!last) return
        const target = last.target instanceof Element ? last.target : null
        const magnetic = target?.closest('[data-magnetic]') || null
        const tilt = target?.closest('[data-tilt]') || null
        const spot = target?.closest('[data-spotlight]') || null
        const stage = target?.closest('[data-stage]') || null
        if (current.magnetic && current.magnetic !== magnetic) reset(current.magnetic)
        if (current.tilt && current.tilt !== tilt) reset(current.tilt)
        if (current.stage && current.stage !== stage) {
          current.stage.querySelectorAll('[data-depth]').forEach((d) => {
            d.style.removeProperty('--depth-x')
            d.style.removeProperty('--depth-y')
          })
        }
        if (magnetic) {
          const r = magnetic.getBoundingClientRect()
          const dx = (last.clientX - (r.left + r.width / 2)) / r.width
          const dy = (last.clientY - (r.top + r.height / 2)) / r.height
          magnetic.style.setProperty('--mag-x', `${(dx * 10).toFixed(1)}px`)
          magnetic.style.setProperty('--mag-y', `${(dy * 8).toFixed(1)}px`)
        }
        if (tilt) {
          const r = tilt.getBoundingClientRect()
          const px = (last.clientX - r.left) / r.width - 0.5
          const py = (last.clientY - r.top) / r.height - 0.5
          tilt.style.setProperty('--tilt-x', `${(py * -6).toFixed(2)}deg`)
          tilt.style.setProperty('--tilt-y', `${(px * 6).toFixed(2)}deg`)
        }
        if (spot) {
          const r = spot.getBoundingClientRect()
          spot.style.setProperty('--mx', `${(last.clientX - r.left).toFixed(0)}px`)
          spot.style.setProperty('--my', `${(last.clientY - r.top).toFixed(0)}px`)
        }
        if (stage) {
          const r = stage.getBoundingClientRect()
          const px = (last.clientX - r.left) / r.width - 0.5
          const py = (last.clientY - r.top) / r.height - 0.5
          stage.querySelectorAll('[data-depth]').forEach((d) => {
            const depth = parseFloat(d.dataset.depth) || 0.5
            d.style.setProperty('--depth-x', `${(px * 28 * depth).toFixed(1)}px`)
            d.style.setProperty('--depth-y', `${(py * 22 * depth).toFixed(1)}px`)
          })
        }
        current = { magnetic, tilt, stage }
      }
      on(
        document,
        'pointermove',
        (e) => {
          if (e.pointerType !== 'mouse') return
          last = e
          if (!pointerFrame) pointerFrame = requestAnimationFrame(pointer)
        },
        { passive: true },
      )
      on(document, 'pointerleave', () => {
        Object.values(current).forEach((el) => el && reset(el))
      })
    }

    return () => {
      cleanups.forEach((fn) => fn())
      watcher.disconnect()
      revealer?.disconnect()
      mutations.disconnect()
      cancelAnimationFrame(frame)
    }
  }, [])
  return null
}

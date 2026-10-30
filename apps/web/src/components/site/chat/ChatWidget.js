'use client'
import { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react'
import { chatCopy } from '@/lib/chat/copy'
import { quickAnswers } from '@/lib/chat/answers'
import { statusLine } from '@/lib/chat/schedule'
import { Icon } from '../Icon'
import '@/styles/chat.css'

// « Écrivez-nous », the site's own chat (research/sessions/04 #10). Facts come from chatFacts() on the server
// (lib/chat/facts.js); quick answers show at once and are never sent; a typed message goes to /svc/clavardage/,
// the shop answers from Coco Studio during opening hours. Desktop: a launcher bottom right. Phones: the tab bar's
// « Écrire » (any [data-chat-open] element opens the panel; without JavaScript it is a plain link).
const API = '/svc/clavardage/'
const MAX = 1000 // lib/chat/validate.js LIMITS.text

// lib/chat/token.js FLAG_COOKIE (cv_chat=1): a conversation exists on this browser.
const hasFlag = () => typeof document !== 'undefined' && /(?:^|;\s*)cv_chat=1/.test(document.cookie)
const timeOf = (at) => new Date(at).getTime() || 0

export function ChatWidget({ locale = 'fr', facts }) {
  const c = chatCopy(locale)
  const id = useId()
  const [open, setOpen] = useState(false)
  // The panel is rendered on first use only: pages carry no chat text for crawlers or screen readers until then.
  const [mounted, setMounted] = useState(false)
  const [sheet, setSheet] = useState(false)
  const [thread, setThread] = useState({ conversation: false, messages: [], unread: 0, status: null, profile: null })
  const [local, setLocal] = useState([])
  const [text, setText] = useState('')
  const [sending, setSending] = useState(false)
  const [error, setError] = useState(null)
  const [status, setStatus] = useState(null)
  const [profileOpen, setProfileOpen] = useState(false)
  const [profileNote, setProfileNote] = useState(null)
  const [justSent, setJustSent] = useState(false)
  const panelRef = useRef(null)
  const logRef = useRef(null)
  const openerRef = useRef(null)
  const launcherRef = useRef(null)
  const honeypotRef = useRef(null)

  const answers = useMemo(() => quickAnswers(facts, locale), [facts, locale])

  // The status line is read in the browser clock (no server/client mismatch) and refreshed every minute.
  useEffect(() => {
    const read = () => setStatus(statusLine(facts?.schedule, locale))
    read()
    const timer = setInterval(read, 60_000)
    return () => clearInterval(timer)
  }, [facts, locale])

  const fetchThread = useCallback(async (markRead) => {
    try {
      const res = await fetch(`${API}${markRead ? '?read=1' : ''}`, { headers: { accept: 'application/json' }, cache: 'no-store' })
      if (!res.ok) return
      const data = await res.json()
      if (data?.ok) setThread(data)
    } catch {
      // Offline or server busy: the next poll tries again.
    }
  }, [])

  // Poll only when a conversation exists: every 15 s while open, every 60 s otherwise, never in a hidden tab.
  useEffect(() => {
    if (!hasFlag() && !thread.conversation) return
    if (open) fetchThread(true)
    const every = open ? 15_000 : 60_000
    const timer = setInterval(() => {
      if (document.visibilityState === 'visible' && (hasFlag() || thread.conversation)) fetchThread(open)
    }, every)
    return () => clearInterval(timer)
  }, [open, thread.conversation, fetchThread])

  // First visit of the page: one quiet check for a reply waiting (unread badge).
  useEffect(() => {
    if (hasFlag()) fetchThread(false)
  }, [fetchThread])

  const openPanel = useCallback((opener) => {
    openerRef.current = opener || launcherRef.current
    setSheet(window.matchMedia('(max-width: 59.99rem)').matches)
    setMounted(true)
    setOpen(true)
  }, [])

  const closePanel = useCallback(() => {
    setOpen(false)
    const back = openerRef.current
    if (back && typeof back.focus === 'function') requestAnimationFrame(() => back.focus())
  }, [])

  // Any [data-chat-open] element (the phone tab bar's « Écrire ») opens the panel.
  useEffect(() => {
    const onClick = (e) => {
      const trigger = e.target instanceof Element ? e.target.closest('[data-chat-open]') : null
      if (!trigger || facts?.enabled === false) return
      e.preventDefault()
      openPanel(trigger)
    }
    document.addEventListener('click', onClick)
    return () => document.removeEventListener('click', onClick)
  }, [openPanel, facts])

  // Open: focus the panel, Escape closes, the page behind the phone sheet does not scroll.
  useEffect(() => {
    if (!open) return
    panelRef.current?.focus()
    const onKey = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        closePanel()
      }
    }
    document.addEventListener('keydown', onKey)
    const root = document.documentElement
    if (sheet) root.classList.add('chat-sheet-open')
    return () => {
      document.removeEventListener('keydown', onKey)
      root.classList.remove('chat-sheet-open')
    }
  }, [open, sheet, closePanel])

  // Phones: the sheet follows the visual viewport, so the on-screen keyboard never covers the composer
  // (iOS ignores interactive-widget; Android's default only resizes the visual viewport).
  useEffect(() => {
    const vv = window.visualViewport
    const panel = panelRef.current
    if (!open || !sheet || !vv || !panel) return undefined
    const fit = () => {
      panel.style.setProperty('--chat-vh', `${Math.round(vv.height)}px`)
      panel.style.setProperty('--chat-top', `${Math.round(vv.offsetTop)}px`)
    }
    // The keyboard took room: keep the newest message just above the composer.
    const resize = () => {
      fit()
      const log = logRef.current
      if (log) log.scrollTop = log.scrollHeight
    }
    fit()
    vv.addEventListener('resize', resize)
    vv.addEventListener('scroll', fit)
    return () => {
      vv.removeEventListener('resize', resize)
      vv.removeEventListener('scroll', fit)
      panel.style.removeProperty('--chat-vh')
      panel.style.removeProperty('--chat-top')
    }
  }, [open, sheet])

  // Newest message in view.
  const items = useMemo(() => {
    const server = (thread.messages || []).map((m) => ({ key: `s-${m.id}`, from: m.from === 'shop' ? 'shop' : 'you', text: m.text, at: timeOf(m.at) }))
    return [...server, ...local].sort((a, b) => a.at - b.at)
  }, [thread.messages, local])

  useEffect(() => {
    const log = logRef.current
    if (log) log.scrollTop = log.scrollHeight
  }, [items, open])

  const ask = (answer) => {
    const now = Date.now()
    setLocal((list) => [...list, { key: `q-${now}`, from: 'you', text: answer.label, at: now, quick: true }, { key: `a-${now}`, from: 'auto', text: answer.text, links: answer.links, at: now + 1 }])
  }

  const send = async (e) => {
    e?.preventDefault()
    const value = text.trim()
    if (!value) {
      setError(c.errors.empty)
      return
    }
    setSending(true)
    setError(null)
    try {
      const res = await fetch(API, {
        method: 'POST',
        headers: { 'content-type': 'application/json', accept: 'application/json' },
        body: JSON.stringify({ text: value, page: window.location.pathname, locale, website: honeypotRef.current?.value || '' }),
      })
      const data = await res.json().catch(() => null)
      if (!res.ok || !data?.ok) {
        setError(data?.message?.[locale] || data?.message?.fr || c.errors.invalid)
        return
      }
      setThread(data)
      setText('')
      setJustSent(true)
      if (!data.profile?.hasContact && !profileNote) setProfileOpen(true)
    } catch {
      setError(c.errors.network)
    } finally {
      setSending(false)
    }
  }

  const saveProfile = async (e) => {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    setError(null)
    try {
      const res = await fetch(API, {
        method: 'POST',
        headers: { 'content-type': 'application/json', accept: 'application/json' },
        body: JSON.stringify({ intent: 'profile', name: form.get('name') || '', contact: form.get('contact') || '', replyByConsent: form.get('consent') === 'on', locale, website: '' }),
      })
      const data = await res.json().catch(() => null)
      if (!res.ok || !data?.ok) {
        setError(data?.message?.[locale] || data?.message?.fr || c.errors.invalid)
        return
      }
      setThread(data)
      setProfileOpen(false)
      setProfileNote(c.saved(Boolean(data.profile?.replyByConsent)))
    } catch {
      setError(c.errors.network)
    }
  }

  if (!facts || facts.enabled === false) return null

  const unread = open ? 0 : thread.unread || 0
  const statusClass = status?.open === true ? 'is-open' : status?.open === false ? 'is-closed' : 'is-unknown'
  const titleId = `${id}-title`
  const errorId = `${id}-error`
  const counterId = `${id}-counter`

  return (
    <>
      <button
        ref={launcherRef}
        type="button"
        className={`chat-launcher ${statusClass}`}
        data-nosnippet=""
        aria-expanded={open}
        aria-controls={`${id}-panel`}
        onClick={(e) => (open ? closePanel() : openPanel(e.currentTarget))}
        data-magnetic=""
      >
        <span className="chat-launcher-icon">
          <Icon name="chat" size={22} />
          <span className="chat-dot" aria-hidden="true" />
        </span>
        <span className="chat-launcher-label">{c.launcher}</span>
        {unread > 0 && (
          <span className="chat-unread">
            <span aria-hidden="true">{unread}</span>
            <span className="visually-hidden">{c.unread(unread)}</span>
          </span>
        )}
      </button>

      {mounted && (
        <div
          id={`${id}-panel`}
          ref={panelRef}
          className={`chat-panel${sheet ? ' is-sheet' : ''}`}
          role="dialog"
          aria-modal={sheet ? 'true' : 'false'}
          aria-labelledby={titleId}
          tabIndex={-1}
          hidden={!open}
        >
          <header className="chat-head">
            <img className="chat-avatar" src="/brand/logo-badge-96.webp" width="44" height="44" alt="" />
            <div className="chat-head-text">
              <h2 id={titleId} className="chat-title">
                {facts.name}
              </h2>
              {status && (
                <p className={`chat-status ${statusClass}`}>
                  <span className="chat-dot" aria-hidden="true" />
                  {status.text}
                </p>
              )}
            </div>
            <button type="button" className="chat-close" onClick={closePanel}>
              <Icon name="close" size={22} label={c.close} />
            </button>
          </header>

          <div ref={logRef} className="chat-body">
            <div className="chat-log" role="log" aria-live="polite" aria-label={c.log}>
              <p className="chat-bubble from-auto">
                <span className="chat-author">{c.shop}</span>
                {c.greeting}
              </p>
              {items.map((m) => (
                <div key={m.key} className={`chat-bubble from-${m.from}`}>
                  <span className="chat-author">{m.from === 'you' ? c.you : m.from === 'auto' ? c.auto : c.shop}</span>
                  <p>{m.text}</p>
                  {m.links?.length > 0 && (
                    <ul className="chat-links">
                      {m.links.map((l) => (
                        <li key={l.href}>
                          <a href={l.href} {...(l.external ? { target: '_blank', rel: 'noopener' } : {})}>
                            {l.label}
                            {l.external && <span className="visually-hidden"> {c.newTab}</span>}
                            <Icon name="arrow" size={16} />
                          </a>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
              {justSent && thread.status !== 'closed' && <p className="chat-note">{c.received}</p>}
              {thread.status === 'closed' && <p className="chat-note">{c.closedThread}</p>}
              {profileNote && <p className="chat-note">{profileNote}</p>}
            </div>
            {profileOpen && (
              <form className="chat-profile" onSubmit={saveProfile}>
                <p className="chat-profile-title">{c.profileTitle}</p>
                <p className="chat-profile-intro">{c.profileIntro}</p>
                <div className="chat-profile-fields">
                  <label>
                    <span>{c.name}</span>
                    <input name="name" autoComplete="given-name" maxLength={60} />
                  </label>
                  <label>
                    <span>{c.contact}</span>
                    <input name="contact" autoComplete="tel" inputMode="email" maxLength={120} />
                  </label>
                </div>
                <label className="chat-consent">
                  <input type="checkbox" name="consent" />
                  <span>{c.consent}</span>
                </label>
                <p className="chat-privacy">
                  {c.privacy} {facts.links?.privacy && <a href={facts.links.privacy}>{c.privacyLink}</a>}
                </p>
                <div className="chat-profile-actions">
                  <button type="submit" className="btn btn-primary btn-small">
                    {c.save}
                  </button>
                  <button type="button" className="btn btn-quiet btn-small" onClick={() => setProfileOpen(false)}>
                    {c.later}
                  </button>
                </div>
              </form>
            )}
          </div>

          {answers.length > 0 && (
            <div className="chat-quick" role="group" aria-label={c.quick}>
              {answers.map((a) => (
                <button key={a.key} type="button" className="chat-chip" onClick={() => ask(a)}>
                  <Icon name={a.icon} size={16} />
                  {a.label}
                </button>
              ))}
            </div>
          )}

          <form className="chat-composer" onSubmit={send} noValidate>
            {error && (
              <p id={errorId} className="chat-error" role="alert">
                {error}
              </p>
            )}
            <label htmlFor={`${id}-text`} className="visually-hidden">
              {c.composer}
            </label>
            <textarea
              id={`${id}-text`}
              value={text}
              onChange={(e) => setText(e.target.value.slice(0, MAX))}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) send(e)
              }}
              placeholder={c.placeholder}
              rows={2}
              maxLength={MAX}
              aria-describedby={[error ? errorId : null, text.length > MAX - 150 ? counterId : null].filter(Boolean).join(' ') || undefined}
            />
            {/* Honeypot: people never see or fill it; bots that do are answered and ignored. */}
            <input ref={honeypotRef} className="chat-hp" type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" />
            <div className="chat-composer-row">
              {text.length > MAX - 150 ? (
                <span id={counterId} className="chat-counter">
                  {c.counter(text.length, MAX)}
                </span>
              ) : thread.conversation && !profileOpen ? (
                <button type="button" className="chat-link-button" onClick={() => setProfileOpen(true)}>
                  {c.edit}
                </button>
              ) : (
                <span />
              )}
              <button type="submit" className="chat-send" disabled={sending}>
                <span>{sending ? c.sending : c.send}</span>
                <Icon name="send" size={18} />
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  )
}

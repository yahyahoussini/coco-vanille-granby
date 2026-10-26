import Link from 'next/link'
import { studioPage } from '@/lib/studio/guard'
import { tabsFor, homeFor, ROLE_LABELS } from '@/lib/studio/roles'
import { TabBar } from '@/components/studio/TabBar'
import { SyncChip } from '@/components/studio/SyncChip'
import { Snackbar } from '@/components/studio/Snackbar'
import { ClientBoot } from '@/components/studio/ClientBoot'
import { badgeCounts } from '@/lib/studio/badges'

export const dynamic = 'force-dynamic'

// Studio shell (16 §3.0): top bar with the sync chip and the person chip, the screen, the role's tab bar.
export default async function StudioShell({ children }) {
  const ctx = await studioPage(null)
  const { user, device } = ctx
  const badges = await badgeCounts(ctx).catch(() => ({}))
  return (
    <>
      <a className="st-skip" href="#contenu">
        Aller au contenu
      </a>
      <header className="st-top">
        <Link className="st-brand" href={homeFor(user)}>
          Coco Studio
        </Link>
        <SyncChip />
        <Link className="st-chip" href={device?.shared ? '/qui/' : '/plus/reglages/'} aria-label={`${user.name}, ${ROLE_LABELS[user.role]}${device?.shared ? ' · changer de personne' : ' · réglages'}`}>
          <span aria-hidden="true">{device?.shared ? '⇄' : '◍'}</span> {user.name}
        </Link>
      </header>
      <main className="st-main" id="contenu" tabIndex={-1}>
        {children}
      </main>
      <TabBar tabs={tabsFor(user)} badges={badges} />
      <Snackbar />
      <ClientBoot shared={Boolean(device?.shared)} />
    </>
  )
}

import { OfflineStatus } from '@/components/studio/OfflineStatus'

export const metadata = { title: 'Hors ligne · Coco Studio' }
export const dynamic = 'force-static'

// Offline page cached by the service worker. No personal data: the outbox count is read on the device.
export default function HorsLigne() {
  return (
    <main className="st-auth" id="contenu">
      <h1>Hors ligne</h1>
      <p className="st-lead">Coco Studio n’a pas de réseau. Les commandes sont en sécurité sur le serveur.</p>
      <OfflineStatus />
      <p className="meta">Sans réseau : « Épuisé », « Prête », « Remettre », la photo de la vitrine et les questions sont gardés sur l’appareil et partent tout seuls au retour du réseau. Les soumissions, remboursements, fermetures et heures attendent le réseau.</p>
      <p className="meta">En cas de besoin : la liste imprimée ce matin.</p>
    </main>
  )
}

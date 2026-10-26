import { studioPage } from '@/lib/studio/guard'
import { canSee } from '@/lib/studio/roles'

export const metadata = { title: 'Plus · Coco Studio' }

// Plus (16 §2.1): everything that is not a daily tab, filtered by role.
export default async function Plus() {
  const { user } = await studioPage('plus')
  const links = [
    ['boutique', '/boutique/', 'Boutique & heures', 'Fermeture, délai, pause, heures, capacité'],
    ['semaine', '/semaine/', 'Cette semaine', '5 chiffres et 3 actions au plus'],
    ['vitrine', '/vitrine/', 'Vitrine', 'Épuisé, photo du jour'],
    ['produits', '/plus/produits/', 'Produits', 'Prix, allergènes, taxes'],
    ['question', '/plus/question/', 'Noter une question de client', 'Pour la FAQ du site'],
    ['agence', '/agence/', 'Agence', 'Rapports et système'],
    ['reglages', '/plus/reglages/', 'Réglages', 'Appareil, équipe, NIP, clés'],
  ].filter(([screen]) => canSee(user, screen))
  const advanced = ['proprietaire', 'gerant', 'agence'].includes(user.role)
  return (
    <>
      <div className="st-head">
        <h1>Plus</h1>
      </div>
      <ul className="nav-list">
        {links.map(([key, href, label, hint]) => (
          <li key={key}>
            <a href={href}>
              <span>
                {label}
                <small>{hint}</small>
              </span>
              <span aria-hidden="true">›</span>
            </a>
          </li>
        ))}
        {advanced && (
          <li>
            <a href="/admin">
              <span>
                Avancé
                <small>Pages, FAQ, traductions, médias, modèles de messages, journal</small>
              </span>
              <span aria-hidden="true">›</span>
            </a>
          </li>
        )}
      </ul>
    </>
  )
}

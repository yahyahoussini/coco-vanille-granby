// Ordering templates (order, box, checkout, thanks) — owned by the ordering module (M2-B).
// Each receives { locale, business, shop, page, doc } from SitePage.
import { marker } from '@/lib/facts'

function Placeholder({ doc }) {
  return (
    <article className="wrap page">
      <h1>{doc?.h1 || doc?.title}</h1>
      <p className="notice fact-needed" data-nosnippet="">{marker('module de commande (en construction)')}</p>
    </article>
  )
}

export const orderingTemplates = {
  order: Placeholder,
  box: Placeholder,
  checkout: Placeholder,
  thanks: Placeholder,
}

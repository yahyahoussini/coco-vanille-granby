import { studioPage } from '@/lib/studio/guard'
import { shortDay, localParts, clockOf, relative } from '@/lib/studio/time'
import { readReport, integrations } from '@/lib/studio/reports'
import { systemTile } from '@/lib/studio/week'

export const metadata = { title: 'Agence · Coco Studio' }

// Agence (desktop, 16 §4.7): read-only views of the rank-first reports (Gates, Scoreboard) with empty states until
// the reports exist, Intégrations, Système, the customer-question queue and the audit log. The owner reads it.
export default async function Agence() {
  const ctx = await studioPage('agence')
  const now = new Date()
  const [gates, scoreboard, system, questions, log] = await Promise.all([
    readReport('gates.json'),
    readReport('scoreboard.json'),
    systemTile(ctx.payload, { now }),
    ctx.payload.find({ collection: 'questions', where: { status: { equals: 'new' } }, sort: '-createdAt', limit: 20, depth: 0, ...ctx.as }),
    ctx.payload.find({ collection: 'audit-log', sort: '-createdAt', limit: 20, depth: 0, ...ctx.as }),
  ])
  const failing = (gates || []).filter((g) => g.status !== 'pass')
  return (
    <div className="agence-page">
      <div className="st-head">
        <h1>Agence</h1>
        <span className="st-date">{ctx.user.role === 'proprietaire' ? 'Lecture seule' : shortDay(localParts(now).iso)}</span>
      </div>

      <section aria-labelledby="gates">
        <h2 id="gates">Gates</h2>
        {gates ? (
          <table className="st-table">
            <caption className="sr-only">Gates du Ranking Stack</caption>
            <thead>
              <tr>
                <th scope="col">Couche</th>
                <th scope="col">Gate</th>
                <th scope="col">État</th>
                <th scope="col">Dernière exécution</th>
                <th scope="col">Responsable</th>
              </tr>
            </thead>
            <tbody>
              {gates.map((g, i) => (
                <tr key={i}>
                  <td>{g.layer}</td>
                  <td>{g.name}</td>
                  <td>
                    <span className="tag" data-tone={g.status === 'pass' ? 'ok' : 'bad'}>
                      {g.status === 'pass' ? '✓ réussi' : '× échoué'}
                    </span>
                  </td>
                  <td>{g.lastRun ? `${shortDay(localParts(g.lastRun).iso)} ${clockOf(g.lastRun)}` : '—'}</td>
                  <td>{g.owner || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="empty">Aucun rapport de gates pour l’instant. Les résultats de rank-first (exécution du vendredi) apparaîtront ici en lecture seule.</p>
        )}
        {gates && <p className="meta">{failing.length ? `${failing.length} en échec` : 'Tout passe.'}</p>}
      </section>

      <section aria-labelledby="scoreboard">
        <h2 id="scoreboard">Scoreboard</h2>
        {scoreboard ? (
          <table className="st-table">
            <caption className="sr-only">Une ligne par semaine</caption>
            <thead>
              <tr>
                <th scope="col">Semaine</th>
                <th scope="col">SEO</th>
                <th scope="col">AEO</th>
                <th scope="col">GEO</th>
              </tr>
            </thead>
            <tbody>
              {scoreboard.slice(-8).map((s) => (
                <tr key={s.week}>
                  <td>{shortDay(s.week)}</td>
                  <td>{s.seo ?? '—'}</td>
                  <td>{s.aeo ?? '—'}</td>
                  <td>{s.geo ?? '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="empty">Pas encore de scoreboard. Il faut 4 semaines de mesure (weekly.mjs) avant la première tendance.</p>
        )}
      </section>

      <section aria-labelledby="integrations">
        <h2 id="integrations">Intégrations</h2>
        <ul className="rows card">
          {integrations().map((i) => (
            <li key={i.key}>
              <span className="grow">{i.label}</span>
              <span className="tag" data-tone={i.ok ? 'ok' : 'warn'}>
                {i.ok ? '✓' : '!'} {i.note}
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="systeme">
        <h2 id="systeme">Système</h2>
        <div className="st-banner" data-tone={system.tone}>
          <span>{system.text}</span>
        </div>
        <p className="meta">Sauvegardes, disponibilité et certificat : moniteur de l’agence (17 §8.2).</p>
      </section>

      <section aria-labelledby="questions">
        <h2 id="questions">Questions de clients à traiter</h2>
        {questions.docs.length ? (
          <ul className="rows card">
            {questions.docs.map((q) => (
              <li key={q.id}>
                <span className="grow">
                  {q.text} <span className="lang">{(q.language || 'fr').toUpperCase()}</span>
                </span>
                <span className="meta">
                  {q.source} · {relative(q.createdAt, now)}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="empty">Aucune question en attente.</p>
        )}
      </section>

      <section aria-labelledby="journal">
        <h2 id="journal">Journal (20 derniers changements)</h2>
        <ul className="rows card">
          {log.docs.map((e) => (
            <li key={e.id}>
              <span className="grow">{e.summary || e.action}</span>
              <span className="meta">{relative(e.createdAt, now)}</span>
            </li>
          ))}
        </ul>
        <p>
          <a href="/admin/collections/audit-log">Tout le journal dans « Avancé »</a>
        </p>
      </section>
    </div>
  )
}

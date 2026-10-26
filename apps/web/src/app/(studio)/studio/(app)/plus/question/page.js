import Link from 'next/link'
import { studioPage } from '@/lib/studio/guard'
import { relative } from '@/lib/studio/time'
import { ActionForm } from '@/components/studio/ActionForm'
import { Flash } from '@/components/studio/Flash'

export const metadata = { title: 'Noter une question · Coco Studio' }

const BACK = '/plus/question/'

// « Noter une question de client » (16 §2.3 #36): one line, the agency turns it into a FAQ answer on the site.
export default async function Question({ searchParams }) {
  const ctx = await studioPage('question')
  const recent = await ctx.payload.find({ collection: 'questions', sort: '-createdAt', limit: 10, depth: 0, ...ctx.as })
  return (
    <>
      <p>
        <Link href="/plus/">‹ Plus</Link>
      </p>
      <div className="st-head">
        <h1>Noter une question de client</h1>
      </div>
      <Flash ctx={ctx} searchParams={searchParams} back={BACK} />
      <ActionForm type="question.create" back={BACK} className="card" pending="Question notée…">
        <div className="field">
          <label htmlFor="question">La question, telle que le client l’a posée</label>
          <textarea id="question" name="text" required maxLength={1000} placeholder="ex. Avez-vous des gâteaux sans lactose?" />
          <span className="hint">Pas de nom ni de téléphone : la question seulement.</span>
        </div>
        <fieldset className="field">
          <legend>Langue</legend>
          <div className="choices">
            {[
              ['fr', 'Français'],
              ['en', 'English'],
              ['es', 'Español'],
            ].map(([v, l]) => (
              <label className="choice" key={v}>
                <input type="radio" name="language" value={v} defaultChecked={v === 'fr'} />
                <span>{l}</span>
              </label>
            ))}
          </div>
        </fieldset>
        <fieldset className="field">
          <legend>D’où vient-elle?</legend>
          <div className="choices">
            {[
              ['comptoir', 'Comptoir'],
              ['telephone', 'Téléphone'],
              ['instagram', 'Instagram'],
              ['courriel', 'Courriel'],
              ['avis', 'Avis'],
            ].map(([v, l]) => (
              <label className="choice" key={v}>
                <input type="radio" name="source" value={v} defaultChecked={v === 'comptoir'} />
                <span>{l}</span>
              </label>
            ))}
          </div>
        </fieldset>
        <button className="btn btn-primary" type="submit">
          Noter la question
        </button>
      </ActionForm>
      {recent.docs.length > 0 && (
        <section aria-labelledby="recentes">
          <h2 id="recentes">Dernières questions</h2>
          <ul className="rows card">
            {recent.docs.map((q) => (
              <li key={q.id}>
                <span className="grow">{q.text}</span>
                <span className="meta">{relative(q.createdAt)}</span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </>
  )
}

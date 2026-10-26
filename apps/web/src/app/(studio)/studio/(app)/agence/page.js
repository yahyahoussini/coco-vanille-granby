import { studioPage } from '@/lib/studio/guard'

export const metadata = { title: 'Agence · Coco Studio' }

// Agence (desktop). Read-only views of the rank-first reports come with a later sub-task.
export default async function Agence() {
  await studioPage('agence')
  return (
    <div className="st-head">
      <h1>Agence</h1>
    </div>
  )
}

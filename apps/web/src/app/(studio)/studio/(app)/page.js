import { studioPage } from '@/lib/studio/guard'
import { longDay, todayISO } from '@/lib/studio/time'

// Aujourd'hui (home). The pickup list and quick actions come with the next sub-task.
export default async function Aujourdhui() {
  await studioPage('aujourdhui')
  return (
    <div className="st-head">
      <h1>Aujourd’hui</h1>
      <span className="st-date">{longDay(todayISO())}</span>
    </div>
  )
}

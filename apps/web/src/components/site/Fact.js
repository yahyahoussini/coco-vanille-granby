import { isMissing, marker } from '@/lib/facts'

// Renders a fact or a visible [[FACT NEEDED]] marker (zero-invention rule).
export function Fact({ value, label, id, children }) {
  if (isMissing(value)) {
    return (
      <span className="fact-needed" data-fact={id} data-nosnippet="">
        {marker(label)}
      </span>
    )
  }
  return <span data-fact={id}>{children ?? value}</span>
}

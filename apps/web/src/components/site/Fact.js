import { isMissing, marker } from '@/lib/facts'

// Renders a fact. A missing one reads « demandez à la boutique » (site.css), with its marker in data-marker for the gate.
export function Fact({ value, label, id, children }) {
  if (isMissing(value)) {
    return (
      <span className="fact-needed" data-marker={marker(label)} data-fact={id} data-nosnippet="" />
    )
  }
  return <span data-fact={id}>{children ?? value}</span>
}

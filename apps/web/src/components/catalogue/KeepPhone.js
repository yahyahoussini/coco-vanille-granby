// « … appelez-nous au 450-372-7177. »: the phone number never breaks at its hyphens on a narrow screen.
// The sentence is the copy's own; only the number is wrapped in a no-wrap span.
export function KeepPhone({ text, phone }) {
  const at = phone && text ? text.indexOf(phone) : -1
  if (at < 0) return text || null
  return (
    <>
      {text.slice(0, at)}
      <span className="nowrap">{phone}</span>
      {text.slice(at + phone.length)}
    </>
  )
}

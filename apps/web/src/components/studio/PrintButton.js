'use client'

// « Imprimer »: inside a form it also posts (the production list records its printed snapshot); then it opens
// the print dialog, which is also the PDF fallback (16b §3).
export function PrintButton({ label = 'Imprimer', submit = true }) {
  return (
    <button className="btn btn-primary" type={submit ? 'submit' : 'button'} onClick={() => setTimeout(() => window.print(), submit ? 300 : 0)}>
      {label}
    </button>
  )
}

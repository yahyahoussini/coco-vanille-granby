import { Icon } from '../site/Icon'

// The site's one fold for lists and reference material (styles: catalogue.css .fold): a native <details>, so what it
// holds stays in the server's HTML, opens without JavaScript, and opens by itself on a deep link or a search in the
// page. The summary says plainly what is inside, with its count. Never around a price's first rows, the request form
// or an allergen warning (those stay in view).
export function Fold({ summary, open, className = '', children }) {
  return (
    <details className={`fold ${className}`.trim()} open={open}>
      <summary className="fold-summary">
        {summary}
        <Icon name="chevron" size={20} className="fold-chevron" />
      </summary>
      {children}
    </details>
  )
}

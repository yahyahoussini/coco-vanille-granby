// « Ma boîte » and checkout (task in progress).
import { orderingCopy } from './copy'

export function BoxTemplate({ locale }) {
  return (
    <article className="wrap page ordering">
      <h1>{orderingCopy(locale).pageTitles.box}</h1>
    </article>
  )
}

export function CheckoutTemplate({ locale }) {
  return (
    <article className="wrap page ordering">
      <h1>{orderingCopy(locale).pageTitles.checkout}</h1>
    </article>
  )
}

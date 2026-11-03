// The sentences of the site that say how an order is paid. They follow what the owner chose in Studio › Plus › Paiement, so
// the FAQ, the terms of sale and the privacy policy stay true the moment the online payment is turned on or off. The copy
// keeps a [[FACT NEEDED: label]] slot for each (src/seed/content.js), filled like the owner's answers (lib/data.js), but these
// are never asked in « Faits du site ». Pure module.
// mode: 'counter' | 'both' | 'online' (lib/payments/provider.js). No way to pay at all ('none') reads like 'counter'.
import { frTypo } from './typo.js'

export const PAYMENT_FACTS = [
  {
    id: 'auto:paiement-facon',
    fr: ['façon de payer une commande du site'],
    en: ['how a website order is paid'],
    counter: { fr: 'à la cueillette', en: 'at pickup' },
    both: { fr: 'à la cueillette ou en ligne', en: 'at pickup or online' },
    online: { fr: 'en ligne, par carte', en: 'online, by card' },
  },
  {
    id: 'auto:paiement-carte',
    fr: ['carte demandée en ligne'],
    en: ['card asked for online'],
    counter: { fr: 'Aucune carte n’est demandée en ligne.', en: 'No card is asked for online.' },
    both: { fr: 'Aucune carte n’est demandée si vous payez à la cueillette; en ligne, Stripe traite la carte et le site ne voit jamais son numéro.', en: 'No card is asked for if you pay at pickup; online, Stripe handles the card and the website never sees its number.' },
    online: { fr: 'Stripe traite la carte, et le site ne voit jamais son numéro.', en: 'Stripe handles the card, and the website never sees its number.' },
  },
  {
    id: 'auto:paiement-numero',
    fr: ['numéro de carte conservé'],
    en: ['card number stored'],
    counter: { fr: 'Non : le site ne demande aucun numéro de carte; le paiement se fait au comptoir, à la cueillette.', en: 'No: the website never asks for a card number; payment is made at the counter, at pickup.' },
    both: { fr: 'Non : le site ne voit ni ne garde jamais votre numéro de carte. Si vous payez en ligne, c’est Stripe qui le traite; le site reçoit seulement le résultat du paiement.', en: 'No: the website never sees or stores your card number. If you pay online, Stripe handles it; the website only receives the result of the payment.' },
    online: { fr: 'Non : le site ne voit ni ne garde jamais votre numéro de carte. C’est Stripe qui le traite; le site reçoit seulement le résultat du paiement.', en: 'No: the website never sees or stores your card number. Stripe handles it; the website only receives the result of the payment.' },
  },
  {
    id: 'auto:paiement-vie-privee',
    fr: ['paiement, liste de la vie privée'],
    en: ['payment, privacy list'],
    counter: { fr: 'Paiement : au comptoir, à la cueillette; le site ne demande aucun numéro de carte.', en: 'Payment: at the counter, at pickup; the website never asks for a card number.' },
    both: { fr: 'Paiement : au comptoir, à la cueillette, ou en ligne avec Stripe, qui reçoit votre carte, votre courriel et le montant; le site ne garde que le résultat du paiement.', en: 'Payment: at the counter, at pickup, or online with Stripe, which receives your card, your email and the amount; the website only keeps the result of the payment.' },
    online: { fr: 'Paiement : en ligne avec Stripe, qui reçoit votre carte, votre courriel et le montant; le site ne garde que le résultat du paiement.', en: 'Payment: online with Stripe, which receives your card, your email and the amount; the website only keeps the result of the payment.' },
  },
  {
    id: 'auto:paiement-fournisseur',
    fr: ['processeur de paiement en service'],
    en: ['payment processor in service'],
    counter: { fr: 'Aucun processeur de paiement n’est en service.', en: 'No payment processor is in service.' },
    both: { fr: 'Stripe traite les paiements par carte en ligne (Canada et États-Unis).', en: 'Stripe handles online card payments (Canada and the United States).' },
    online: { fr: 'Stripe traite les paiements par carte en ligne (Canada et États-Unis).', en: 'Stripe handles online card payments (Canada and the United States).' },
  },
  {
    id: 'auto:paiement-quand',
    fr: ['quand se paie une commande'],
    en: ['when an order is paid'],
    counter: { fr: 'Une commande passée en ligne ou par téléphone se paie au comptoir, à la cueillette; aucune carte n’est demandée en ligne.', en: 'An order placed online or by phone is paid at the counter, at pickup; no card is asked for online.' },
    both: { fr: 'Une commande passée en ligne se paie au comptoir, à la cueillette, ou en ligne par carte, à votre choix dans le récapitulatif. Un paiement en ligne est débité quand vous le confirmez, et tout remboursement revient sur la même carte. Une commande par téléphone se paie au comptoir.', en: 'An order placed online is paid at the counter, at pickup, or online by card, as you choose in the summary. An online payment is charged when you confirm it, and any refund goes back to the same card. An order placed by phone is paid at the counter.' },
    online: { fr: 'Une commande passée en ligne se paie en ligne par carte, au moment de la confirmer, et tout remboursement revient sur la même carte. Une commande par téléphone se paie au comptoir.', en: 'An order placed online is paid online by card when you confirm it, and any refund goes back to the same card. An order placed by phone is paid at the counter.' },
  },
  {
    id: 'auto:paiement-temoins',
    fr: ['témoins de paiement'],
    en: ['payment cookies'],
    counter: { fr: 'Paiement : aucun témoin, le site ne prend pas de paiement en ligne.', en: 'Payment: no cookies, the website takes no online payment.' },
    both: { fr: 'Paiement : si vous payez en ligne, Stripe dépose ses propres témoins, nécessaires à la sécurité du paiement.', en: 'Payment: if you pay online, Stripe sets its own cookies, needed to keep the payment secure.' },
    online: { fr: 'Paiement : Stripe dépose ses propres témoins, nécessaires à la sécurité du paiement.', en: 'Payment: Stripe sets its own cookies, needed to keep the payment secure.' },
  },
]

// Map(fact id → sentence) for one language, ready to join the owner's answers.
export function paymentAnswers(mode = 'counter', locale = 'fr') {
  const key = mode === 'both' || mode === 'online' ? mode : 'counter'
  const lang = locale === 'en' ? 'en' : 'fr'
  return new Map(PAYMENT_FACTS.map((f) => [f.id, lang === 'fr' ? frTypo(f[key].fr) : f[key].en]))
}

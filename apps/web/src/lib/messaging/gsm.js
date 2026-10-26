// SMS cost trap (10 §6): one character outside GSM-7 turns the whole text into UCS-2 (70 characters a segment).
// French: é è à ù É are GSM-7; ê â î ô û ç ’ « » ° are not. Spanish: á í ó ú are not. Templates are written
// GSM-safe and every text goes through toGsm() before it leaves, so names or dates can't break the encoding.
const BASIC = '@£$¥èéùìòÇ\nØø\rÅåΔ_ΦΓΛΩΠΨΣΘΞÆæßÉ !"#¤%&\'()*+,-./0123456789:;<=>?¡ABCDEFGHIJKLMNOPQRSTUVWXYZÄÖÑÜ§¿abcdefghijklmnopqrstuvwxyzäöñüà'
const EXTENDED = '^{}\\[~]|€\f'
const basic = new Set([...BASIC])
const extended = new Set([...EXTENDED])

const MAP = {
  ' ': ' ', ' ': ' ', ' ': ' ', '’': "'", '‘': "'", 'ʼ': "'", '“': '"', '”': '"', '«': '"', '»': '"',
  '–': '-', '—': '-', '…': '...', '°': ' ', '·': '-',
  â: 'a', á: 'a', ã: 'a', À: 'A', Â: 'A', Á: 'A', ê: 'e', ë: 'e', È: 'E', Ê: 'E', Ë: 'E', î: 'i', ï: 'i', í: 'i', Î: 'I', Ï: 'I', Í: 'I',
  ô: 'o', ó: 'o', õ: 'o', Ô: 'O', Ó: 'O', û: 'u', ú: 'u', Û: 'U', Ù: 'U', Ú: 'U', ç: 'c', ÿ: 'y', œ: 'oe', Œ: 'OE',
}

export const isGsm = (text) => [...text].every((ch) => basic.has(ch) || extended.has(ch))

export function toGsm(text) {
  return [...String(text)].map((ch) => (basic.has(ch) || extended.has(ch) ? ch : MAP[ch] ?? '?')).join('')
}

// → { encoding: 'GSM-7'|'UCS-2', units, segments }
export function smsInfo(text) {
  if (isGsm(text)) {
    const units = [...text].reduce((n, ch) => n + (extended.has(ch) ? 2 : 1), 0)
    return { encoding: 'GSM-7', units, segments: units <= 160 ? 1 : Math.ceil(units / 153) }
  }
  const units = text.length
  return { encoding: 'UCS-2', units, segments: units <= 70 ? 1 : Math.ceil(units / 67) }
}

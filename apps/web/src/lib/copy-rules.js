// Copy rules shared by the page-contract test (test/unit/content.test.js), the Journal checks (lib/journal.js
// checkPost) and the journal seed: how words are counted, the sentence a search engine lifts, and the words the
// site never writes (00 §3.2, §10.1; 04 §3). Pure module (relative imports only).
import { MARKER_RE } from './facts.js'

const MARKERS = new RegExp(MARKER_RE.source, 'g')

// A marker stands for the fact it will become: it counts as one word.
export const countWords = (text = '') =>
  String(text ?? '')
    .replace(MARKERS, 'X')
    .split(/\s+/)
    .filter((w) => /[\p{L}\p{N}]/u.test(w)).length

// The first sentence of a passage (the one an answer box lifts); a marker is one word.
export const firstSentence = (text = '') => String(text ?? '').replace(MARKERS, 'X').split(/(?<=[.!?])\s/)[0]

// [pattern, why]: never in the copy of any page or post.
export const BANNED = [
  [/mariage|wedding|boda/i, 'weddings are frozen'],
  [/\bmeilleur|\bbest\b|\bmejor\b/i, 'no superlatives as facts'],
  [/prix sur demande|price on request/i, 'prices are never "on request"'],
  [/ramassage/i, '« cueillette », not « ramassage »'],
  [/\bWhatsApp\b/i, 'no WhatsApp (M11)'],
]

// Journal posts, on top of BANNED: no invented testimonial or award, and no text written at the answer engines
// instead of the reader. Whole words only (« imprimé » and « supprimé » are not « primé »).
export const POST_BANNED = [
  ...BANNED,
  [/(?<!\p{L})(témoignages?|testimonials?|prix remportés?|award-winning|primée?s?)(?!\p{L})/iu, 'no invented testimonial or award'],
  [/\b(ChatGPT|Perplexity|Gemini|Copilot|LLM|language models?|moteurs? (de réponse|d['’]IA)|AI (engines?|assistants?))\b/i, 'no text addressed to AI engines'],
]

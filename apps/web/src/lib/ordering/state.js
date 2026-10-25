// Order state machine shared by the public checkout, Studio and the worker (10 §2, 16 §3.2).
// « En préparation » is derived from the production date; nobody taps it.
export const TRANSITIONS = {
  pending_payment: ['paid', 'cancelled'],
  paid: ['ready', 'cancelled', 'refunded', 'not_picked_up'],
  ready: ['picked_up', 'paid', 'not_picked_up', 'cancelled', 'refunded'],
  picked_up: ['ready'], // undo window only
  not_picked_up: ['ready', 'picked_up', 'cancelled', 'refunded'],
  cancelled: ['refunded'],
  refunded: [],
}

// Who may move an order to a state (16 §2.2: Comptoir can't cancel or refund).
export const TRANSITION_ROLES = {
  paid: ['proprietaire', 'gerant', 'comptoir', 'integration'],
  ready: ['proprietaire', 'gerant', 'comptoir'],
  picked_up: ['proprietaire', 'gerant', 'comptoir'],
  not_picked_up: ['proprietaire', 'gerant', 'comptoir', 'integration'],
  cancelled: ['proprietaire', 'gerant'],
  refunded: ['proprietaire'],
}

export function canTransition(from, to, role) {
  if (!TRANSITIONS[from]?.includes(to)) return false
  if (!role) return false
  return (TRANSITION_ROLES[to] || []).includes(role)
}

export function assertTransition(from, to, role) {
  if (!canTransition(from, to, role)) {
    const err = new Error(`Transition refusée : ${from} → ${to} (${role || 'anonyme'})`)
    err.status = 409
    throw err
  }
}

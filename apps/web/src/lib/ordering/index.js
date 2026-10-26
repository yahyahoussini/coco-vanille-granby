// The ordering engine's public surface for Studio (admin.cocovanillegranby.com) and other server code.
// Everything here runs on the server with the Payload Local API; callers check the staff role first
// (createOrder and sendQuote also refuse a `req` whose user is not staff).
export { createOrder, sendQuote, availableWindows, availableDays, capacityOn, offerStates, HOLD_MINUTES } from './create-order.js'
export { productOfferState, cutoffLine, readyLabel, onlineState } from './availability.js'
export { holidaySuggestions, quebecHolidays } from './holidays.js'
export { orderTotals, totalsRows } from './totals.js'
export { errorText } from './errors.js'
export { TRANSITIONS, TRANSITION_ROLES, canTransition, assertTransition } from './state.js'
export { recordCounterPayment, markOrderPaid, markDepositPaid } from '../payments/settle.js'
export { notifyReady, notifyNotPickedUp, notifyOrderConfirmed, notifyQuoteSent, scheduleReminder } from '../messaging/notify.js'
export { enqueueMessage, cancelQueued, UNDO_SECONDS } from '../messaging/queue.js'

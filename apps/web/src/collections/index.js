import { Users } from './Users.js'
import { Media } from './Media.js'
import { Allergens, Categories, Products, Seasons } from './Catalog.js'
import { Pages, Redirects } from './Content.js'
import { Orders } from './Orders.js'
import { Requests, RequestPhotos } from './Requests.js'
import { CapacityPools } from './Capacity.js'
import { Messages } from './Messages.js'
import { Reviews } from './Reviews.js'
import { AuditLog } from './AuditLog.js'
import { Questions } from './Questions.js'
import { withRevalidation } from '../lib/revalidate.js'

// What the public site shows: a change refreshes its ISR pages (lib/revalidate.js). Capacity pools only feed
// the « Prête dès … » line, which renews within 5 minutes on its own.
const PUBLIC = ['media', 'allergens', 'categories', 'products', 'seasons', 'pages']

export const collections = [Users, Media, Allergens, Categories, Products, Seasons, Pages, Redirects, Orders, Requests, RequestPhotos, CapacityPools, Messages, Reviews, AuditLog, Questions].map((c) =>
  PUBLIC.includes(c.slug) ? withRevalidation(c) : c,
)

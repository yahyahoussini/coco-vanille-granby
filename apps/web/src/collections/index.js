import { Users } from './Users.js'
import { Media } from './Media.js'
import { Allergens, Categories, Products, Seasons } from './Catalog.js'
import { operationsCollections } from './Operations.js'
import { Pages, Redirects } from './Content.js'

export const collections = [Users, Media, Allergens, Categories, Products, Seasons, Pages, Redirects, ...operationsCollections]

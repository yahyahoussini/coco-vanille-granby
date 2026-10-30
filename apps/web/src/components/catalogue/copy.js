// Catalogue interface copy (cards, family chips, product page). Québec French is the source; EN/ES adapt it.
// Pure module (no React, no alias imports) so node --test can load it.
const fr = {
  families: 'Familles de la carte',
  wholeMenu: 'Toute la carte',
  products: (n) => (n === 1 ? '1 produit' : `${n} produits`),
  portionOne: '1 portion',
  // The unit after a single serving in a compact price row (« 1 portion »; several: t(locale).portions).
  portionUnit: 'portion',
  ahead: (d) => `À commander ${d} d’avance`,
  add: 'Ajouter à ma boîte',
  // The short visible word, then the rest of the same name, read by screen readers (« Ajouter » + « à ma boîte »).
  addShort: 'Ajouter',
  addRest: ' à ma boîte',
  addNamed: (title) => `Ajouter à ma boîte : ${title}`,
  from: 'dès',
  size: 'Format',
  qty: 'Quantité',
  less: 'Diminuer la quantité',
  more: 'Augmenter la quantité',
  each: 'l’unité',
  readyCard: 'Quand est-ce prêt?',
  photoSoon: 'Photo à venir',
}

const en = {
  families: 'Menu families',
  wholeMenu: 'Whole menu',
  products: (n) => (n === 1 ? '1 item' : `${n} items`),
  portionOne: '1 serving',
  portionUnit: 'serving',
  ahead: (d) => `Order ${d} ahead`,
  add: 'Add to my box',
  addShort: 'Add',
  addRest: ' to my box',
  addNamed: (title) => `Add to my box: ${title}`,
  from: 'from',
  size: 'Size',
  qty: 'Quantity',
  less: 'Decrease the quantity',
  more: 'Increase the quantity',
  each: 'each',
  readyCard: 'When is it ready?',
  photoSoon: 'Photo coming soon',
}

const es = {
  families: 'Familias de la carta',
  wholeMenu: 'Toda la carta',
  products: (n) => (n === 1 ? '1 producto' : `${n} productos`),
  portionOne: '1 porción',
  portionUnit: 'porción',
  ahead: (d) => `Pedir con ${d} de antelación`,
  add: 'Añadir a mi caja',
  addShort: 'Añadir',
  addRest: ' a mi caja',
  addNamed: (title) => `Añadir a mi caja: ${title}`,
  from: 'desde',
  size: 'Tamaño',
  qty: 'Cantidad',
  less: 'Disminuir la cantidad',
  more: 'Aumentar la cantidad',
  each: 'la unidad',
  readyCard: '¿Cuándo está listo?',
  photoSoon: 'Foto próximamente',
}

const COPY = { fr, en, es }
export const catalogueCopy = (locale) => COPY[locale] || fr

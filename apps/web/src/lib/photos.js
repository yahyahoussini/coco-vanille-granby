// Illustration photos used until the shop's own photos replace them (research/sessions/04 #12; on 2026-11-01 Yahya
// asked for a picture in every place that should have one): free licences only (Unsplash License; a CC licence
// with its attribution where noted), no face, no brand, no storefront. The site never puts one in
// JSON-LD as the shop's product, writes nothing on the picture (owner's decision, 2026-11-04), and shows the owner's
// own photo instead as soon as it exists (a product's photos, a page's hero, the « Vitrine du jour »).
// Files: public/photos/<key>-<width>.avif and .webp, metadata stripped; hero and products 4:5, the others 4:3.
// Pure module (no imports) so node --test can load it.

export const PHOTOS = {
  hero: {
    widths: [640, 960, 1280],
    width: 1280,
    height: 1600,
    alt: {
      fr: 'Croissants dorés sur du papier parchemin',
      en: 'Golden croissants on parchment paper',
      es: 'Croissants dorados sobre papel pergamino',
    },
    credit: {
      author: 'Conor Brown',
      profile: 'https://unsplash.com/@commonboxturtle',
      source: 'https://unsplash.com/photos/a-bunch-of-croissants-that-are-on-a-table-sqkXyyj4WdE',
      license: 'Unsplash License',
    },
  },
  viennoiseries: {
    widths: [480, 800, 1200],
    width: 1200,
    height: 900,
    alt: {
      fr: 'Croissants et chocolatines sur une planche de bois, avec du chocolat et du beurre',
      en: 'Croissants and pains au chocolat on a wooden board, with chocolate and butter',
      es: 'Croissants y panes de chocolate sobre una tabla de madera, con chocolate y mantequilla',
    },
    credit: {
      author: 'tabitha turner',
      profile: 'https://unsplash.com/@tabithaturnervisuals',
      source: 'https://unsplash.com/photos/pastries-and-baking-tools-for-breakfast-Ns2aJ5OXKds',
      license: 'Unsplash License',
    },
  },
  pains: {
    widths: [480, 800, 1200],
    width: 1200,
    height: 900,
    alt: {
      fr: 'Baguettes sur une planche de bois, dont une tranchée sur la longueur',
      en: 'Baguettes on a wooden board, one sliced lengthwise',
      es: 'Baguettes sobre una tabla de madera, una cortada a lo largo',
    },
    credit: {
      author: 'Anastasia gezalova',
      profile: 'https://unsplash.com/@nastasiko',
      source: 'https://unsplash.com/photos/brown-bread-on-white-table-JWz5jMjsblU',
      license: 'Unsplash License',
    },
  },
  patisseries: {
    widths: [480, 800, 1200],
    width: 1200,
    height: 900,
    alt: {
      fr: 'Tartelettes à la crème garnies de bleuets et de pistaches, sur une caisse en bois',
      en: 'Cream tartlets topped with blueberries and pistachios on a wooden crate',
      es: 'Tartaletas de crema con arándanos y pistachos sobre una caja de madera',
    },
    credit: {
      author: 'Max Griss',
      profile: 'https://unsplash.com/@grissphoto',
      source: 'https://unsplash.com/photos/four-desserts-are-arranged-on-a-wooden-tray-RvvBVx2E7DY',
      license: 'Unsplash License',
    },
  },
  gateaux: {
    widths: [480, 800, 1200],
    width: 1200,
    height: 900,
    alt: {
      fr: 'Gâteau étagé à la crème fouettée et à la confiture de framboises, sur un plateau de bois',
      en: 'Layer cake with whipped cream and raspberry jam on a wooden board',
      es: 'Pastel de capas con crema batida y mermelada de frambuesa sobre una tabla de madera',
    },
    credit: {
      author: 'Aneta Voborilova',
      profile: 'https://unsplash.com/@anetvob',
      source: 'https://unsplash.com/photos/white-and-brown-cake-on-white-ceramic-plate-mlcm6qi9Bu8',
      license: 'Unsplash License',
    },
  },
  cafe: {
    widths: [480, 800, 1200],
    width: 1200,
    height: 900,
    alt: {
      fr: 'Café latte avec un dessin de feuille dans la mousse, sur une table en bois',
      en: 'Latte with a leaf pattern in the foam, on a wooden table',
      es: 'Café con leche con una hoja dibujada en la espuma, sobre una mesa de madera',
    },
    credit: {
      author: 'Joe Hepburn',
      profile: 'https://unsplash.com/@thatjoebloke',
      source: 'https://unsplash.com/photos/cup-of-cappuccino-EcWFOYOpkpY',
      license: 'Unsplash License',
    },
  },

  // Product illustrations (4:5, like the product cards), shown where a product has no photo of its own yet:
  // never in the product's JSON-LD (Product.image lists the shop's photos only).
  'croissant-aux-amandes': product(
    { fr: 'Croissants garnis d’amandes effilées sur un plateau de marbre', en: 'Croissants topped with sliced almonds on a marble tray', es: 'Croissants cubiertos de almendras laminadas sobre una bandeja de mármol' },
    { author: 'Redd Francisco', profile: 'https://unsplash.com/@reddfrancisco', source: 'https://unsplash.com/photos/brown-and-white-bread-on-white-textile-5HC8MhpE7dA' },
  ),
  'paris-brest': product(
    { fr: 'Couronne de pâte à choux garnie de crème, sur une assiette rose', en: 'Choux pastry ring filled with cream on a pink plate', es: 'Corona de masa choux rellena de crema, sobre un plato rosa' },
    { author: 'Christian Agbede', profile: 'https://unsplash.com/@chriscreations__', source: 'https://unsplash.com/photos/a-cream-filled-pastry-ring-with-sliced-almonds-cB3IP8hbyhE' },
  ),
  // A real vol-au-vent (shrimp filling): the shop's filling is an owner fact, and the alt says what this one holds.
  'vol-au-vent': product(
    { fr: 'Vol-au-vent garni de crevettes en sauce crémeuse, dans une assiette blanche', en: 'Vol-au-vent filled with shrimp in a creamy sauce on a white plate', es: 'Vol-au-vent relleno de gambas en salsa cremosa, en un plato blanco' },
    { author: 'Anima Visual', profile: 'https://unsplash.com/@animavisual', source: 'https://unsplash.com/photos/a-white-plate-topped-with-food-on-top-of-a-wooden-table-pn7dIk2kiYw' },
  ),
  'shortcake-aux-fraises': product(
    { fr: 'Part de gâteau à la crème fouettée et aux fraises, une fraise sur le dessus', en: 'Slice of cake layered with whipped cream and strawberries, a strawberry on top', es: 'Porción de pastel con nata montada y fresas, una fresa encima' },
    { author: 'WKH Studio', profile: 'https://unsplash.com/@wkhstudio', source: 'https://unsplash.com/photos/square-strawberry-shortcake-with-a-single-strawberry-on-top-bFFg_Ba4WTQ' },
  ),
  'croissant-au-beurre': product(
    { fr: 'Deux croissants dorés dans une assiette noire, à côté d’un verre de lait', en: 'Two golden croissants on a black plate beside a glass of milk', es: 'Dos croissants dorados en un plato negro, junto a un vaso de leche' },
    { author: 'Kobby Mendez', profile: 'https://unsplash.com/@kobbymendez', source: 'https://unsplash.com/photos/bread-on-brown-wooden-tray-beside-white-ceramic-mug-iyM-XTsTiek' },
  ),
  'gateau-au-chocolat': product(
    { fr: 'Gâteau étagé au chocolat nappé de chocolat coulant et de petites perles', en: 'Layered chocolate cake with a chocolate drip and small decorative pearls', es: 'Pastel de capas de chocolate con chocolate derretido y pequeñas perlas' },
    { author: 'kaouther djouada', profile: 'https://unsplash.com/@__kaouther_', source: 'https://unsplash.com/photos/chocolate-mousse-cake-with-sugar-pearls-hcEDfkiVmMI' },
  ),

  // Page pictures (4:3), under each page's h1 and answer (pagePhotoKey below).
  vitrine: wide(
    { fr: 'Tartelettes aux framboises, aux bleuets et aux fraises près de petits gâteaux, en vitrine', en: 'Raspberry, blueberry and strawberry tartlets beside small cakes in a pastry display case', es: 'Tartaletas de frambuesa, arándano y fresa junto a pequeños pasteles en una vitrina' },
    { author: 'Natalia Y.', profile: 'https://unsplash.com/@foxfox', source: 'https://unsplash.com/photos/pastries-in-display-cabinet-o9kswzHrvMs' },
  ),
  boite: wide(
    { fr: 'Gâteau à la crème et aux petits fruits, tranché dans une boîte blanche ouverte', en: 'Cream cake topped with berries, cut into slices in an open white box', es: 'Pastel de crema con frutos rojos, cortado en porciones dentro de una caja blanca abierta' },
    { author: 'Louis Hansel', profile: 'https://unsplash.com/@louishansel', source: 'https://unsplash.com/photos/white-and-red-cake-on-white-box-jKB9ZgUmf3M' },
  ),
  parts: wide(
    { fr: 'Gâteau au chocolat étagé sur un présentoir en bois, une part servie dans une assiette', en: 'Chocolate layer cake on a wooden cake stand, one slice served on a plate', es: 'Pastel de chocolate en capas sobre un soporte de madera, con una porción en un plato' },
    { author: 'Jacob Schwartz', profile: 'https://unsplash.com/@rosenberg12', source: 'https://unsplash.com/photos/round-cake-on-brown-wooden-cake-stand-enVg_Vtsw1c' },
  ),
  'gateau-fete': wide(
    { fr: 'Haut d’un gâteau blanc décoré de volants de crème au beurre et de cerises rouges', en: 'Top of a white cake decorated with piped buttercream ruffles and red cherries', es: 'Parte superior de un pastel blanco decorado con volantes de crema de mantequilla y cerezas rojas' },
    { author: 'Paulina Kaminska', profile: 'https://unsplash.com/@paulinaka', source: 'https://unsplash.com/photos/a-close-up-of-a-cake-with-cherries-on-top-ibVD6ZZCwKY' },
  ),
  buche: wide(
    { fr: 'Bûche de Noël au chocolat saupoudrée de sucre à glacer, entourée de petits champignons décoratifs', en: 'Chocolate Yule log dusted with icing sugar, surrounded by small decorative mushrooms', es: 'Tronco de Navidad de chocolate espolvoreado con azúcar glas y rodeado de pequeñas setas decorativas' },
    { author: 'Alex Diffor', profile: 'https://unsplash.com/@adiffor', source: 'https://unsplash.com/photos/a-wooden-cutting-board-topped-with-a-piece-of-cake-EJNbxF8dYjM' },
  ),

  ingredients: wide(
    { fr: 'Farine, œufs, beurre en cubes, lait et sucre, avec un fouet et un rouleau à pâte', en: 'Flour, cracked eggs, cubed butter, milk and sugar with a whisk and a rolling pin', es: 'Harina, huevos, mantequilla en cubos, leche y azúcar, con un batidor y un rodillo' },
    { author: 'Diana Krotova', profile: 'https://unsplash.com/@redpuma', source: 'https://unsplash.com/photos/a-table-topped-with-bowls-of-food-and-a-whisk--NmIsfg5DEk' },
  ),
  pause: wide(
    { fr: 'Café latte avec un dessin dans la mousse, près de croissants et de chocolatines sur ardoise', en: 'Latte with foam art beside croissants and pains au chocolat on a slate board', es: 'Café con leche con dibujo en la espuma, junto a croissants y panes de chocolate' },
    { author: 'Christopher Chung', profile: 'https://unsplash.com/@christopher_chung_photography', source: 'https://unsplash.com/photos/cup-of-coffee-with-latte-art-and-croissants-lMSmhRDS0Ik' },
  ),
  // Generic baking (journal posts only: never on the About page, where it could pass for the shop's kitchen).
  boulangerie: wide(
    { fr: 'Mains qui pétrissent une pâte sur une table farinée, à côté d’un rouleau à pâte', en: 'Hands kneading a ball of dough on a floured table beside a rolling pin', es: 'Manos amasando una bola de masa sobre una mesa enharinada, junto a un rodillo' },
    { author: 'Nadya Spetnitskaya', profile: 'https://unsplash.com/@kiboka', source: 'https://unsplash.com/photos/person-making-dough-beside-brown-wooden-rolling-pin-tOYiQxF9-Ys' },
  ),
  // The workshops are painting and beads on an object (shop's reel, research/20b): paint and brushes, no baking.
  peinture: wide(
    { fr: 'Boîtier de peintures de couleur et deux pinceaux sur une table blanche', en: 'A tray of coloured paints and two brushes on a white table', es: 'Una caja de pinturas de colores y dos pinceles sobre una mesa blanca' },
    { author: 'Megan Lee', profile: 'https://unsplash.com/@meganlee007', source: 'https://unsplash.com/photos/a-tray-of-paint-and-a-brush-on-a-table-fmfO0rdP2g8' },
  ),
  // The Zoo de Granby itself (Wikimedia Commons, September 2023): CC BY-SA 4.0 asks for the author, the licence and
  // the change (cropped and resized), all in the page caption; the changed photo stays under CC BY-SA 4.0.
  zoo: {
    kind: 'place',
    widths: [480, 800, 1000],
    width: 1000,
    height: 750,
    alt: {
      fr: 'Éléphant d’Afrique debout sur l’herbe de son enclos, au Zoo de Granby',
      en: 'African elephant standing on the grass of its enclosure at the Granby Zoo',
      es: 'Elefante africano de pie sobre la hierba de su recinto en el Zoo de Granby',
    },
    credit: {
      author: 'Prettyfield',
      profile: 'https://commons.wikimedia.org/wiki/File:Elephant_granby.jpg',
      source: 'https://commons.wikimedia.org/wiki/File:Elephant_granby.jpg',
      license: 'CC BY-SA 4.0',
      licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
      modified: true,
    },
  },

  // The shop's surroundings: a real map, not an illustration (the attribution is in the image and the
  // caption). OpenStreetMap standard tiles, built once by scratchpad/make-map.cjs around the shop's coordinates.
  'carte-granby': {
    kind: 'map',
    widths: [480, 800, 1200],
    width: 1200,
    height: 900,
    alt: {
      fr: 'Carte du centre-ville de Granby, avec un repère au 3, rue Court, près de la rue Principale',
      en: 'Map of downtown Granby with a pin at 3 rue Court, near rue Principale',
      es: 'Mapa del centro de Granby con un marcador en el 3 de la rue Court, cerca de la rue Principale',
    },
    credit: {
      author: 'les contributeurs d’OpenStreetMap',
      profile: 'https://www.openstreetmap.org/copyright',
      source: 'https://www.openstreetmap.org/#map=17/45.39958/-72.72508',
      license: 'ODbL et CC BY-SA 2.0',
    },
  },
}

// A 4:5 product illustration and a 4:3 page picture (Unsplash License).
function product(alt, credit) {
  return { widths: [400, 640, 960], width: 960, height: 1200, alt, credit: { ...credit, license: 'Unsplash License' } }
}
function wide(alt, credit) {
  return { widths: [480, 800, 1200], width: 1200, height: 900, alt, credit: { ...credit, license: 'Unsplash License' } }
}

// Which illustration a product shows while it has no photo of its own: its own picture when there is one (by its
// French or English slug), otherwise its family's. A product the owner adds later falls back to its family.
const PRODUCT_PHOTO = {
  'croissant-aux-amandes': 'croissant-aux-amandes',
  'almond-croissant': 'croissant-aux-amandes',
  'paris-brest': 'paris-brest',
  'vol-au-vent': 'vol-au-vent',
  'shortcake-aux-fraises': 'shortcake-aux-fraises',
  'strawberry-shortcake': 'shortcake-aux-fraises',
  baguette: 'pains',
  'gateau-aux-framboises': 'gateaux',
  'raspberry-cake': 'gateaux',
  croissant: 'croissant-au-beurre',
  chocolatine: 'viennoiseries',
  'gateau-royal': 'gateau-au-chocolat',
  'mousse-au-chocolat': 'parts',
  'chocolate-mousse': 'parts',
  // Savoury food and Moroccan specialties: no stock picture of the dish itself, so the kitchen rather than another product.
  msemmen: 'boulangerie',
  harcha: 'boulangerie',
  'feuillete-sale': 'boulangerie',
  'savoury-puff-pastry': 'boulangerie',
  'mini-pizza': 'boulangerie',
  'pastilla-au-poulet': 'boulangerie',
  'chicken-pastilla': 'boulangerie',
  'sandwich-au-thon': 'boulangerie',
  'tuna-sandwich': 'boulangerie',
  'sandwich-au-cachir': 'boulangerie',
  'cachir-sandwich': 'boulangerie',
  'plateau-de-bouchees-salees': 'boulangerie',
  'savoury-bites-platter': 'boulangerie',
}
const FAMILIES = ['viennoiseries', 'pains', 'gateaux', 'patisseries']
export function productPhotoKey(product) {
  const own = Object.hasOwn(PRODUCT_PHOTO, product?.slug || '') ? PRODUCT_PHOTO[product.slug] : null
  if (own && Object.hasOwn(PHOTOS, own)) return own
  const family = product?.productionCategory
  return FAMILIES.includes(family) && Object.hasOwn(PHOTOS, family) ? family : 'hero'
}

// The picture at the top of each page (registry key → photo key), under the h1 and the answer, until the owner
// gives the page a photo of its own (the page's « hero » field). Legal and utility pages have none.
const PAGE_PHOTO = {
  carte: 'vitrine',
  commander: 'boite',
  'nous-trouver': 'carte-granby',
  'zoo-de-granby': 'zoo',
  // Pages about the real business and a real person: a picture of the kind of pastry, never a stock workspace or a
  // stranger's hands that could pass for the shop's kitchen or its chef.
  'a-propos': 'paris-brest',
  chef: 'patisseries',
  prix: 'croissant-au-beurre',
  'gateau-pour-demain': 'gateau-au-chocolat',
  'gateaux-personnalises': 'gateau-fete',
  buches: 'buche',
  allergenes: 'ingredients',
  faq: 'pause',
  // The Journal index; each post shows its own illustration (lib/journal.js POST_PHOTO_KEYS).
  journal: 'cafe',
  calculateur: 'parts',
  viennoiseries: 'viennoiseries',
  pains: 'pains',
  gateaux: 'gateaux',
  patisseries: 'patisseries',
}
export function pagePhotoKey(pageKey) {
  const key = Object.hasOwn(PAGE_PHOTO, pageKey || '') ? PAGE_PHOTO[pageKey] : null
  return key && Object.hasOwn(PHOTOS, key) ? key : null
}

// srcset helper: photoSources('hero') → { avif: '/photos/hero-640.avif 640w, …', webp: '…', src: '/photos/hero-960.webp' }
// src is the middle width (WebP fallback for the <img>); an unknown key gives null.
export function photoSources(key) {
  const photo = Object.hasOwn(PHOTOS, key) ? PHOTOS[key] : null
  if (!photo) return null
  const set = (ext) => photo.widths.map((w) => `/photos/${key}-${w}.${ext} ${w}w`).join(', ')
  const middle = photo.widths[Math.floor(photo.widths.length / 2)]
  return { avif: set('avif'), webp: set('webp'), src: `/photos/${key}-${middle}.webp` }
}

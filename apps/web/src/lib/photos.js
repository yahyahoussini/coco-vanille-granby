// Ambiance photos (Unsplash License) used until the shop's own photos replace them (research/sessions/04 #12).
// Generic illustrations only: never shown as a specific product; the site labels them « Photo d'illustration ».
// Files: public/photos/<key>-<width>.avif and .webp, metadata stripped; hero cropped 4:5, the others 4:3.
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
  ateliers: {
    widths: [480, 800, 1200],
    width: 1200,
    height: 900,
    alt: {
      fr: 'Mains qui garnissent des coques de macarons verts à la poche à douille',
      en: 'Hands piping filling onto green macaron shells',
      es: 'Manos que rellenan tapas de macarons verdes con una manga pastelera',
    },
    credit: {
      author: 'Holly Stratton',
      profile: 'https://unsplash.com/@holly_buildalifeyoulove',
      source: 'https://unsplash.com/photos/selective-focus-photography-of-woman-putting-icing-on-cupcakes-XTHa-47HjjI',
      license: 'Unsplash License',
    },
  },
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

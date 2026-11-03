// The shop's cakes, from the owner's own photos (nimages/ → cut out and cleaned → src/seed/client-photos/, 2026-11-02).
// Each description says only what the photo shows: no recipe or allergen here; formats and prices are in seed/launch-data.js.
// The names are read from the pictures and the owner can change them in Studio › Produits. Customers' names written on the cakes were
// taken off the photos (Loi 25); cakes showing a licensed character (Lego, Sonic) were left out.

// The sentences the seed wrote when prices were not set yet: seed/launch.js replaces them in a description nobody edited.
const OLD = {
  CAKE: { fr: 'Un gâteau sur commande de la Pâtisserie Coco Vanille, à Granby : le format, le décor et le prix se confirment avec la boutique, par téléphone ou au comptoir.', en: 'A made-to-order cake from Pâtisserie Coco Vanille in Granby: size, decoration and price are confirmed with the shop, by phone or at the counter.' },
  LOG: { fr: 'Une bûche sur commande de la Pâtisserie Coco Vanille, à Granby : le format, le décor et le prix se confirment avec la boutique, par téléphone ou au comptoir.', en: 'A made-to-order Yule log from Pâtisserie Coco Vanille in Granby: size, decoration and price are confirmed with the shop, by phone or at the counter.' },
  BOUQUET: { fr: 'Un bouquet sur commande de la Pâtisserie Coco Vanille, à Granby : le format, les couleurs et le prix se confirment avec la boutique, par téléphone ou au comptoir.', en: 'A made-to-order bouquet from Pâtisserie Coco Vanille in Granby: size, colours and price are confirmed with the shop, by phone or at the counter.' },
  SHOP: { fr: 'En vente à la Pâtisserie Coco Vanille, à Granby : le prix et la disponibilité du jour se confirment avec la boutique, par téléphone ou au comptoir.', en: 'Sold at Pâtisserie Coco Vanille in Granby: the price and what is available today are confirmed with the shop, by phone or at the counter.' },
}
export const OLD_TAILS = Object.values(OLD)

const CAKE = {
  fr: 'Un gâteau sur commande de la Pâtisserie Coco Vanille, à Granby, à réserver en ligne ou par téléphone et à récupérer au 3, rue Court.',
  en: 'A made-to-order cake from Pâtisserie Coco Vanille in Granby, to reserve online or by phone and pick up at 3 rue Court.',
  old: OLD.CAKE.fr,
}
const LOG = {
  fr: 'Une bûche à précommander à la Pâtisserie Coco Vanille, à Granby, à récupérer au 3, rue Court.',
  en: 'A Yule log to pre-order from Pâtisserie Coco Vanille in Granby, to pick up at 3 rue Court.',
  old: OLD.LOG.fr,
}
const BOUQUET = {
  fr: 'Un bouquet sur commande de la Pâtisserie Coco Vanille, à Granby, à réserver en ligne ou par téléphone et à récupérer au 3, rue Court.',
  en: 'A made-to-order bouquet from Pâtisserie Coco Vanille in Granby, to reserve online or by phone and pick up at 3 rue Court.',
  old: OLD.BOUQUET.fr,
}
const SHOP = {
  fr: 'À la Pâtisserie Coco Vanille, à Granby, à réserver en ligne ou à prendre au comptoir du 3, rue Court.',
  en: 'At Pâtisserie Coco Vanille in Granby, to reserve online or pick up at the counter, 3 rue Court.',
  old: OLD.SHOP.fr,
}

// title (its French slug is the product's key: never rename one that is live) · en · family · photos (file names in
// src/seed/client-photos/, without the extension) · tail · fr, enText: what the photo shows (also its alt text)
export const NEW_PRODUCTS = [
  { title: 'Gâteau thème plage', en: 'Beach theme cake', family: 'gateaux', photos: ['plage-1'], tail: CAKE, fr: 'Un gâteau aux vagues de glaçage bleu, dont le dessus de sable porte un parasol, des chaises longues, un palmier et une petite barque.', enText: 'A cake with waves of blue icing, its sandy top holding an umbrella, sun loungers, a palm tree and a small boat.' },
  { title: 'Gâteau couronne de perles', en: 'Pearl crown cake', family: 'gateaux', photos: ['perles-1'], tail: CAKE, fr: 'Un gâteau blanc au motif gaufré, bordé de rosaces de crème et coiffé d’une couronne de fils dorés et de perles.', enText: 'A white cake with an embossed pattern, edged with cream rosettes and topped with a crown of gold wire and pearls.' },
  { title: 'Gâteau éventails noir et or', en: 'Black and gold fan cake', family: 'gateaux', photos: ['eventails-1'], tail: CAKE, fr: 'Un gâteau blanc décoré de formes noires, de boules noires et dorées et de deux éventails, l’un doré, l’autre noir.', enText: 'A white cake decorated with black shapes, black and gold balls and two fans, one gold, one black.' },
  { title: 'Gâteau de finissants', en: 'Graduation cake', family: 'gateaux', photos: ['finissants-1'], tail: CAKE, fr: 'Un gâteau blanc à la surface texturée, décoré de boules dorées et d’un décor « Happy Graduation » avec un mortier.', enText: 'A white cake with a textured surface, decorated with gold balls and a "Happy Graduation" topper with a mortarboard.' },
  { title: 'Gâteau marbré aux amandes', en: 'Marbled almond cake', family: 'gateaux', photos: ['marbre-amandes-1'], tail: CAKE, fr: 'Un gâteau rond au dessus blanc marbré de lignes de chocolat, les côtés couverts d’amandes effilées.', enText: 'A round cake with a white top marbled with chocolate lines, its sides covered in flaked almonds.' },
  { title: 'Bouquet de cupcakes', en: 'Cupcake bouquet', family: 'gateaux', photos: ['bouquet-1'], tail: BOUQUET, fr: 'Des cupcakes en fleurs de crème rose, bleue et blanche, avec des feuilles vertes, emballés comme un bouquet.', enText: 'Cupcakes piped as pink, blue and white cream flowers with green leaves, wrapped like a bouquet.' },
  { title: 'Gâteau crème et copeaux blancs', en: 'Cream and white shavings cake', family: 'gateaux', photos: ['copeaux-blancs-1'], tail: CAKE, fr: 'Un gâteau rond couvert de rosaces de crème et de copeaux de chocolat blanc, avec un message « Bonne fête » écrit à la main.', enText: 'A round cake covered in cream rosettes and white chocolate shavings, with a hand-written birthday message.' },
  { title: 'Gâteau rectangulaire en couches', en: 'Rectangular layered cake', family: 'gateaux', photos: ['opera-1'], tail: CAKE, fr: 'Un gâteau rectangulaire en couches : un glaçage brun brillant, une couche brune, puis deux biscuits, l’un vert, l’autre orangé, avec des perles croustillantes dans un coin.', enText: 'A rectangular layered cake: a glossy brown glaze, a brown layer, then two sponges, one green, one orange, with crunchy pearls in one corner.' },
  { title: 'Gâteau croustillant au chocolat', en: 'Crunchy chocolate cake', family: 'gateaux', photos: ['croustillant-1'], tail: CAKE, fr: 'Un gâteau rond à l’enrobage brun parsemé d’éclats croustillants, avec une noisette au centre.', enText: 'A round cake under a brown coating dotted with crunchy pieces, with a hazelnut in the centre.' },
  { title: 'Gâteau carré noisettes et chocolat', en: 'Square hazelnut chocolate cake', family: 'gateaux', photos: ['croustillant-3'], tail: CAKE, fr: 'Un gâteau carré à l’enrobage de chocolat et de noisettes, décoré de deux boules croustillantes.', enText: 'A square cake with a chocolate and hazelnut coating, decorated with two crunchy balls.' },
  { title: 'Gâteau d’Halloween', en: 'Halloween cake', family: 'gateaux', photos: ['halloween-1'], tail: CAKE, fr: 'Un gâteau brun décoré de toiles d’araignée, de gros yeux, d’une main noire, de petits décors orange et d’un fantôme.', enText: 'A brown cake decorated with spider webs, big eyes, a black hand, small orange decorations and a ghost.' },
  { title: 'Gâteau couronne de fraises', en: 'Strawberry crown cake', family: 'gateaux', photos: ['couronne-fraises-1'], tail: CAKE, fr: 'Un petit gâteau rond à la couronne de fraises fraîches, au centre rouge brillant et au pourtour garni de crème et de pépites de chocolat.', enText: 'A small round cake with a crown of fresh strawberries, a glossy red centre and a border of cream and chocolate chips.' },
  { title: 'Gâteau aux macarons', en: 'Macaron cake', family: 'gateaux', photos: ['macarons-1'], tail: CAKE, fr: 'Un gâteau crème décoré de macarons de couleur, de petites fleurs et d’une plaquette de message.', enText: 'A cream-coloured cake decorated with coloured macarons, small flowers and a message plaque.' },
  { title: 'Gâteau dégradé bleu', en: 'Blue ombre cake', family: 'gateaux', photos: ['degrade-bleu-1'], tail: CAKE, fr: 'Un gâteau d’anniversaire en dégradé de bleu et de blanc, avec un chiffre 4 doré et des boules bleues et blanches.', enText: 'A birthday cake in a blue and white ombre, with a gold number 4 and blue and white balls.' },
  { title: 'Gâteau red velvet', en: 'Red velvet cake', family: 'gateaux', photos: ['red-velvet-1'], tail: CAKE, fr: 'Un gâteau à étages à la mie rouge, garni de rosaces de crème et parsemé de miettes.', enText: 'A layered cake with a red crumb, topped with cream rosettes and sprinkled with crumbs.' },
  { title: 'Gâteau papillons', en: 'Butterfly cake', family: 'gateaux', photos: ['papillons-1'], tail: CAKE, fr: 'Un gâteau blanc décoré de deux papillons, de rosaces et de petites perles, avec un message « Bonne fête » écrit à la main.', enText: 'A white cake decorated with two butterflies, rosettes and small pearls, with a hand-written birthday message.' },
  { title: 'Gâteau perles et boules disco', en: 'Pearl and disco ball cake', family: 'gateaux', photos: ['disco-1'], tail: CAKE, fr: 'Un gâteau crème parsemé de perles, avec les chiffres 18 dorés et des boules disco argentées.', enText: 'A cream-coloured cake dotted with pearls, with gold number 18 candles and silver disco balls.' },
  { title: 'Gâteau ganache et crème', en: 'Ganache and cream cake', family: 'gateaux', photos: ['ganache-1'], tail: CAKE, fr: 'Deux étages de gâteau et une crème jaune au centre, sous une ganache brune en spirale.', enText: 'Two layers of cake with yellow cream in the middle, under a swirl of brown ganache.' },
  { title: 'Gâteau deux étages aux nœuds rouges', en: 'Two-tier cake with red bows', family: 'gateaux', photos: ['deux-etages-1'], tail: CAKE, fr: 'Un gâteau rond à deux étages, lisse et blanc crème, avec de petits nœuds rouges, des cœurs et un message « Bonne fête ».', enText: 'A smooth, cream-white round cake in two tiers, with small red bows, hearts and a "Bonne fête" message.' },
  { title: 'Gâteau aux roses', en: 'Rose cake', family: 'gateaux', photos: ['roses-1'], tail: CAKE, fr: 'Un gâteau rectangulaire à deux niveaux, lisse et crème, décoré de roses rouges et de chiffres écrits à la main.', enText: 'A smooth, cream-coloured rectangular cake on two levels, with red roses and hand-written numbers.' },
  { title: 'Gâteau au fromage basque', en: 'Basque cheesecake', family: 'gateaux', photos: ['basque-1'], tail: CAKE, fr: 'Un gâteau rond au dessus bien doré, dont une part est découpée pour montrer son cœur crémeux.', enText: 'A round cake with a deeply browned top, one slice cut out to show its creamy centre.' },
  { title: 'Gâteau cœur à la crème', en: 'Cream heart cake', family: 'gateaux', photos: ['coeur-1'], tail: CAKE, fr: 'Un gâteau rectangulaire entièrement décoré à la poche, avec un grand cœur blanc portant le chiffre 60 doré.', enText: 'A rectangular cake fully piped with cream, with a large white heart bearing a gold number 60.' },
  { title: 'Gâteau rectangulaire aux fraises', en: 'Rectangular strawberry cake', family: 'gateaux', photos: ['rectangle-fraises-1'], tail: CAKE, fr: 'Un gâteau rectangulaire blanc bordé de crème et de chocolat, avec des fraises et un message « Bonne fête! » écrit à la main.', enText: 'A white rectangular cake edged with cream and chocolate, with strawberries and a hand-written birthday message.' },
  { title: 'Bûche au sapin', en: 'Yule log with a fir tree', family: 'gateaux', photos: ['buche-sapin-1'], tail: LOG, fr: 'Une bûche lisse couleur crème, avec un rondin en spirale, un petit sapin et un décor rouge et vert.', enText: 'A smooth cream-coloured log with a spiral cut end, a small fir tree and red and green decoration.' },
  { title: 'Bûche aux spirales', en: 'Spiral Yule log', family: 'gateaux', photos: ['buche-spirales-1'], tail: LOG, fr: 'Une longue bûche dorée aux rondins en spirale, avec de petites touches rouges et vertes et un petit sapin.', enText: 'A long golden log with spiral cut ends, small touches of red and green and a small fir tree.' },
  { title: 'Bûche blanche striée', en: 'White striped Yule log', family: 'gateaux', photos: ['buche-striee-1'], tail: LOG, fr: 'Une bûche blanche et lisse, striée de lignes de chocolat, avec un décor rouge sur le dessus.', enText: 'A smooth white log striped with chocolate lines, with a red decoration on top.' },
  { title: 'Bûche forestière', en: 'Forest Yule log', family: 'gateaux', photos: ['buche-foret-1'], tail: LOG, fr: 'Une longue bûche façon écorce, avec des rondins blancs en spirale, des sapins et un décor vert et rouge.', enText: 'A long bark-style log with white spiral rounds, fir trees and green and red decoration.' },
  { title: 'Bûche aux rosaces', en: 'Rosette Yule log', family: 'gateaux', photos: ['buche-meringue-1'], tail: LOG, fr: 'Une bûche en forme d’éclair, garnie de crème en rosaces sur toute sa longueur, avec une petite plaque rouge de Noël sur le dessus.', enText: 'An éclair-shaped log, topped with cream rosettes along its whole length, with a small red Christmas plaque on top.' },
  // Cakes that are only in the second series of photos.
  { title: 'Gâteau soleil et lune dorés', en: 'Gold sun and moon cake', family: 'gateaux', photos: ['soleil-lune-1'], tail: CAKE, fr: 'Un gâteau à la crème blanche, décoré de rosaces, d’un soleil, d’une lune et d’étoiles dorés et d’une année en chiffres dorés.', enText: 'A white cream cake decorated with rosettes, a gold sun, moon and stars and a year in gold numbers.' },
  { title: 'Gâteau blanc et or aux papillons', en: 'White and gold butterfly cake', family: 'gateaux', photos: ['blanc-or-1'], tail: CAKE, fr: 'Un gâteau blanc orné de disques dorés, de boules dorées, d’une rose blanche, de papillons dorés et d’un décor « Happy Birthday ».', enText: 'A white cake decorated with gold discs, gold balls, a white rose, gold butterflies and a "Happy Birthday" topper.' },
  { title: 'Gâteau fraises et amandes effilées', en: 'Strawberry and flaked almond cake', family: 'gateaux', photos: ['fraises-amandes-1'], tail: CAKE, fr: 'Un gâteau rond à la crème fouettée, garni de fraises fraîches, avec des amandes effilées sur le dessus et les côtés.', enText: 'A round whipped cream cake topped with fresh strawberries, with flaked almonds on top and around the sides.' },
  { title: 'Gâteau rose aux confettis', en: 'Pink sprinkle cake', family: 'gateaux', photos: ['rose-confettis-1'], tail: CAKE, fr: 'Un gâteau rose aux bordures de crème, couvert de confettis de sucre de toutes les couleurs et orné de rubans.', enText: 'A pink cake with cream borders, covered in multicoloured sugar sprinkles and decorated with ribbons.' },
  { title: 'Couronne de choux aux rosaces', en: 'Choux crown with rosettes', family: 'patisseries', photos: ['couronne-choux-1'], tail: SHOP, fr: 'Une couronne de pâte à choux garnie de rosaces de crème coiffées de petites boules brunes, parsemée d’amandes effilées.', enText: 'A crown of choux pastry topped with cream rosettes crowned with small brown balls, sprinkled with flaked almonds.' },
]

// The products already on the site, by French slug: the owner's photo where she gave one, and a summary until she
// writes her own (never replaces what someone typed in Studio).
export const EXISTING_PRODUCTS = [
  { slug: 'paris-brest', photos: ['paris-brest-1'], tail: SHOP, fr: 'Une couronne de pâte à choux poudrée de sucre glace, garnie de crème.', enText: 'A ring of choux pastry dusted with icing sugar and filled with cream.' },
  { slug: 'gateau-aux-framboises', photos: ['framboises-1'], tail: CAKE, fr: 'Un gâteau rond couvert de rosaces de crème et de copeaux blancs, couronné de framboises, avec un message « Bonne fête ».', enText: 'A round cake covered in cream rosettes and white shavings, crowned with raspberries, with a "Bonne fête" message.' },
  { slug: 'shortcake-aux-fraises', photos: [], tail: CAKE, fr: 'Un gâteau rond bordé de crème fouettée, le dessus couvert de fraises.', enText: 'A round cake edged with whipped cream, its top covered in strawberries.' },
  { slug: 'croissant-aux-amandes', photos: [], tail: SHOP, fr: 'Un croissant aux amandes.', enText: 'An almond croissant.' },
  { slug: 'baguette', photos: [], tail: SHOP, fr: 'Une baguette.', enText: 'A baguette.' },
  { slug: 'vol-au-vent', photos: [], tail: SHOP, fr: 'Un vol-au-vent.', enText: 'A vol-au-vent.' },
]

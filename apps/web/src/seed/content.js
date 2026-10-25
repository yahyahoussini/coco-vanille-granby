// Page copy per registry key (src/lib/routes.js). French is the source; EN/ES adapt it.
// Rules: answer block 40–60 words with brand + place + a dated fact; question-phrased h2s;
// every owner fact not yet supplied stays a [[FACT NEEDED: …]] marker (never a guess).
export const pages = [
  {
    key: 'home',
    status: 'core',
    locales: {
      fr: {
        title: 'Pâtisserie Coco Vanille · Pâtisserie-boulangerie à Granby',
        description: 'Pâtisserie Coco Vanille, 3, rue Court à Granby : viennoiseries, pains et gâteaux sur commande. Heures, carte et commande en ligne pour la cueillette en boutique.',
        h1: 'Pâtisserie-boulangerie à Granby',
        answer:
          'La Pâtisserie Coco Vanille est une pâtisserie-boulangerie du centre-ville de Granby, au 3, rue Court. On y trouve des viennoiseries, des pains et des gâteaux sur commande, à récupérer en boutique. Heures d’ouverture : [[FACT NEEDED: heures confirmées par le propriétaire]].',
        sections: [],
        faq: [],
        changeNote: 'Première version du site.',
      },
      en: {
        title: 'Pâtisserie Coco Vanille · Pastry shop and bakery in Granby',
        description: 'Pâtisserie Coco Vanille, 3 rue Court in Granby, Québec: viennoiseries, bread and cakes to order. Hours, menu and online ordering for in-store pickup.',
        h1: 'Pastry shop and bakery in Granby',
        answer:
          'Pâtisserie Coco Vanille is a pastry shop and bakery in downtown Granby, Québec, at 3 rue Court. It makes viennoiseries, bread and cakes to order for in-store pickup. Opening hours: [[FACT NEEDED: hours confirmed by the owner]].',
        sections: [],
        faq: [],
        changeNote: 'First version of the site.',
      },
    },
  },
  {
    key: 'nous-trouver',
    status: 'core',
    locales: {
      fr: {
        title: 'Nous trouver · 3, rue Court, Granby · Coco Vanille',
        description: 'Adresse, heures et stationnement de la Pâtisserie Coco Vanille au 3, rue Court, au centre-ville de Granby. Itinéraire Google Maps et numéro de téléphone.',
        h1: 'Nous trouver au 3, rue Court, à Granby',
        answer:
          'La Pâtisserie Coco Vanille est au 3, rue Court, à Granby (Québec) J2G 4Y6, au centre-ville. Téléphone : 450-372-7177. Les heures d’ouverture et le stationnement sont indiqués ci-dessous : [[FACT NEEDED: heures et stationnement confirmés]].',
        sections: [],
        faq: [],
      },
      en: {
        title: 'Visit us · 3 rue Court, Granby · Coco Vanille',
        description: 'Address, hours and parking for Pâtisserie Coco Vanille at 3 rue Court in downtown Granby, Québec. Google Maps directions and phone number.',
        h1: 'Visit us at 3 rue Court, Granby',
        answer:
          'Pâtisserie Coco Vanille is at 3 rue Court, Granby, Québec J2G 4Y6, downtown. Phone: 450-372-7177. Opening hours and parking are listed below: [[FACT NEEDED: confirmed hours and parking]].',
        sections: [],
        faq: [],
      },
    },
  },
]

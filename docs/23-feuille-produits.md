# La feuille des produits — comment la remplir

| | |
|---|---|
| Fichier | `data/produits-a-remplir.csv` (s'ouvre dans Excel, Numbers ou Google Sheets) |
| Pour | La propriétaire, ou l'Agence d'après une photo du menu et des prix |
| Ensuite | L'Agence l'enregistre sous `data/produits.csv` et lance `npm run products:import` (essai à blanc d'abord, puis `APPLY=1`) |

**Une ligne par format.** Un gâteau offert en 6 po et en 8 po prend deux lignes, avec le même nom. Les trois lignes « EXEMPLE » se remplacent ou s'effacent : elles ne sont jamais importées.

| Colonne | Ce qu'on y écrit | Exemple de forme |
|---|---|---|
| famille | `viennoiseries`, `pains`, `gateaux` ou `patisseries` | gateaux |
| nom_fr / nom_en | Le nom affiché, en français puis en anglais (l'anglais peut rester vide) | Gâteau aux framboises / Raspberry cake |
| format / format_en | Le format en mots | 6 po / 6-inch; À l'unité / Each |
| prix | Le prix avant taxes, en dollars | 32,50 |
| portions_min / portions_max | Le nombre de portions de ce format | 6 / 8 |
| poids_g | Pour une portion individuelle seulement : son poids en grammes (il sert à la règle de taxe des produits de boulangerie) | 120 |
| delai_heures | Le délai minimum pour le commander, en heures (0 = en vitrine) | 48 |
| contient / peut_contenir | Les allergènes, avec ces codes séparés par des espaces : `oeufs lait moutarde arachides crustaces-mollusques poisson sesame soya sulfites noix ble-triticale gluten` | ble-triticale oeufs lait |
| en_ligne | `oui` si le produit pourra se commander en ligne, sinon `non` | non |
| description_fr | Facultatif : deux phrases sur le produit, en vos mots | |
| notes | Pour vous; ignoré par l'import | |

**Ce que l'import fait, et ne fait pas.** Il crée ou met à jour chaque produit (par son nom français), avec ses formats, ses prix, ses portions et son délai. Il ne retire aucun produit absent de la feuille : il les nomme, c'est tout. Les allergènes sont inscrits mais **pas marqués comme vérifiés** : une personne de la boutique les confirme dans Coco Studio › Plus › Produits. Tant que ce n'est pas fait, la fiche du produit affiche « allergènes vérifiés par une personne » à fournir et reste hors de Google. Une feuille avec une erreur (un code d'allergène inconnu, un prix illisible) n'écrit rien et dit quelle ligne corriger.

**La taxe** de chaque produit se choisit ensuite dans Coco Studio (classe de taxe, avec l'explication à côté); la commande en ligne d'un produit reste bloquée tant qu'elle n'est pas choisie.

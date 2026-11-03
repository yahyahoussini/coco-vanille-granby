# Votre site et Coco Studio : accès et premiers pas

| | |
|---|---|
| Pour | La propriétaire de la Pâtisserie Coco Vanille inc. |
| Par | L'Agence (Yahya, BrandHub.ma) |
| Date | 3 novembre 2026, veille du lancement |
| Votre site (adresse temporaire) | https://cocovanille.brandhubos.cloud |
| Coco Studio (votre tableau de bord) | https://admin-cocovanille.brandhubos.cloud/connexion/ |
| Votre connexion | votre courriel et un mot de passe, remis à part (jamais par écrit dans ce document) |

## Ce qu'il faut savoir

Le site est complet : aucune case « À confirmer » n'apparaît plus aux clients. Pour y arriver, **l'Agence a rempli ce qu'elle ne savait pas avec des réponses approximatives** : les prix, les formats, les délais, la carte, les conditions de réservation. Tout attend votre vérification dans Studio, et tout se change en quelques secondes.

Trois choses à retenir :

1. **Un prix réservé est un prix promis.** Le site affiche « prix indicatif » tant que vous n'avez pas vérifié un produit. Mais le prix écrit dans le récapitulatif d'un client est celui qu'il paie, et la loi québécoise interdit d'exiger plus que le prix annoncé. Vérifiez les prix en premier.
2. **La réservation est ouverte dès maintenant.** Un client choisit ses produits, sa journée et son heure, et paie à la cueillette. Aucune carte n'est demandée. Pour la fermer : Boutique & heures › Réservation en ligne.
3. **Aucun courriel ni texto ne part encore.** Studio vous dit quand appeler le client. Gardez Studio ouvert sur la tablette de la boutique : il sonne à chaque nouvelle commande.

## Par où commencer (dans cet ordre)

### 1. Les prix : Plus › Produits › Prix à vérifier

Ouvrez chaque produit. Si les prix sont bons, touchez **Ces prix sont les bons**. Sinon, **Changer les formats et les prix**. Studio vous demande de confirmer que c'est vous, cinq minutes à la fois.

Sur la même page : le nom, la description, le délai, les photos, et **Retirer de la carte** pour un produit que vous ne vendez pas. **Ajouter un produit** est en haut de la liste.

La carte de départ vient de vos photos, de vos publications de 2026 et d'avis publics. Les noms des gâteaux ont été lus sur les photos : changez ceux qui ne vous ressemblent pas.

### 2. Les allergènes : Plus › Produits › Allergènes à cocher

C'est la seule chose que l'Agence **n'a pas** approximée. Tant qu'un produit n'est pas coché par une personne qui a vérifié sa recette, le site dit au client de vous appeler avant de commander, et qu'aucun produit n'est garanti sans allergène.

### 3. Les réponses du site : Plus › Faits du site

Chaque phrase du site qui dépend de vous y est, rangée par sujet : délais, gâteaux, bûches, paiement, accès. Lisez la réponse proposée, puis touchez **C'est bon** ou **Changer**. Le site suit aussitôt. Une réponse effacée revient à la proposition.

Quand vous changez une réponse, changez aussi sa version anglaise : Studio l'indique « Anglais à revoir » tant que ce n'est pas fait.

Certaines phrases répètent un prix ou un délai de Produits : Studio le signale sur la réponse. Si vous changez l'un, relisez l'autre.

### 4. La réservation : Boutique & heures › Réservation en ligne

Heure limite pour le lendemain (proposée : 14 h), durée des plages (30 minutes), commandes par plage (4), jours d'avance (60), et ce que la boutique peut préparer par jour : 8 gâteaux, 60 viennoiseries, 40 pains, 40 pâtisseries. Ce sont aussi des approximations. Juste en dessous : les dates des bûches.

Une courte pause? **Pause en ligne**, plus haut sur la même page.

### 5. Les heures des Fêtes : Boutique & heures › Jours spéciaux

## Quand une commande arrive

- **Une réservation** paraît dans Aujourd'hui et Commandes, avec le code de cueillette du client et « À payer à la cueillette ». Au comptoir : **Remettre la commande**, le client donne son code.
- **Une demande de gâteau** paraît dans Demandes. Appelez le client, convenez du prix, puis **Confirmer le prix** : la commande s'ajoute à sa journée. Pour refuser ou proposer une autre date, dites-le au téléphone, puis notez-le dans Studio.
- **Un message « Écrivez-nous »** paraît dans Plus › Messages.

## Pas encore actif, et pourquoi

| Quoi | Ce qu'il faut |
|---|---|
| Paiement en ligne et acompte | Le compte Stripe au nom de l'entreprise |
| Textos et courriels aux clients | Les comptes d'envoi (Twilio, Amazon SES) |
| Le vrai domaine, et le mot de passe oublié par courriel | L'enregistrement de cocovanillegranby.com et sa boîte courriel |
| Google et Bing | Le vrai domaine : l'adresse temporaire reste « ne pas indexer » |
| La page du chef | Vos réponses dans Faits du site (Équipe et histoire), avec l'accord de la personne |

Le site n'affiche aucun courriel tant qu'une boîte n'existe pas : il donne le téléphone et « Écrivez-nous ».

## À regarder avec vos conseillers

- **Hébergement hors du Québec.** Le serveur est à Paris, chez Hostinger, et la politique de confidentialité le dit. La Loi 25 demande une évaluation des facteurs relatifs à la vie privée avant de sortir des renseignements du Québec : l'Agence en a préparé un brouillon à votre nom (docs/26). Un hébergement au Canada réglerait la question : à décider avec le vrai domaine.
- **Taxes.** Les classes de taxe suivent la règle écrite dans Studio › Produits, sans avis d'un comptable. Vos numéros de TPS et de TVQ ne sont pas publiés : le site dit qu'ils sont sur vos reçus.
- **Conditions de vente.** Écrites par l'Agence pour la réservation payée à la cueillette, sans revue par un avocat.

## Sécurité

- Votre mot de passe est à vous seule; l'Agence a son propre compte et ne vous le demandera jamais.
- Un compte par personne : ajoutez votre équipe dans Studio, avec un rôle et un NIP pour la tablette.

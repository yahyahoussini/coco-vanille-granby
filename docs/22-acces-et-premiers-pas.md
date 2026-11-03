# Votre site et Coco Studio : accès et premiers pas

| | |
|---|---|
| Pour | La direction de la Pâtisserie Coco Vanille inc. |
| Par | L'Agence (Yahya, BrandHub.ma) |
| Date | 3 novembre 2026, veille du lancement |
| Votre site (adresse temporaire) | https://cocovanille.brandhubos.cloud |
| Coco Studio (votre tableau de bord) | https://admin-cocovanille.brandhubos.cloud/connexion/ |
| Votre connexion | votre courriel et un mot de passe, remis à part (jamais par écrit dans ce document) |

## Ce qu'il faut savoir

Le site est complet : aucune case « À confirmer » n'apparaît plus aux clients. Pour y arriver, **l'Agence a rempli ce qu'elle ne savait pas avec des réponses approximatives** : les prix, les formats, les délais, la carte, les conditions de réservation. Tout attend votre vérification dans Studio, et tout se change en quelques secondes.

Trois choses à retenir :

1. **Un prix réservé est un prix promis.** Le site affiche « prix indicatif » tant que vous n'avez pas vérifié un produit. Mais le prix écrit dans le récapitulatif d'un client est celui qu'il paie, et la loi québécoise interdit d'exiger plus que le prix annoncé. Vérifiez les prix en premier.
2. **La commande en ligne est ouverte dès maintenant.** Un client choisit ses produits, sa journée et son heure, et paie à la cueillette. Pour la fermer : Boutique & heures › Commande en ligne. Pour offrir aussi le paiement par carte : Plus › Paiement (voir plus bas).
3. **Aucun courriel ni texto ne part encore.** Studio vous dit quand appeler le client. **Activez donc les alertes sur votre téléphone** : Plus › Réglages › Alertes de commandes (sur iPhone, ajoutez d'abord Studio à l'écran d'accueil). Gardez aussi Studio ouvert sur la tablette de la boutique : il sonne à chaque nouvelle commande.

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

### 4. La commande en ligne : Boutique & heures › Commande en ligne

Heure limite pour le lendemain (proposée : 14 h), durée des plages (30 minutes), commandes par plage (4), jours d'avance (60), et ce que la boutique peut préparer par jour : 8 gâteaux, 60 viennoiseries, 40 pains, 40 pâtisseries. Ce sont aussi des approximations. Juste en dessous : les dates des bûches.

Une courte pause? **Pause en ligne**, plus haut sur la même page.

### 5. Les heures des Fêtes : Boutique & heures › Jours spéciaux

## Offrir le paiement en ligne : Plus › Paiement

Vous pouvez le faire seule ou seul, quand vous voulez, en 10 minutes une fois le compte Stripe ouvert :

1. Ouvrez le compte Stripe au nom de l'entreprise : le lien est sur l'écran. Stripe demande le NEQ, le compte de banque et une pièce d'identité.
2. Copiez vos deux clés de Stripe : la clé publiable (`pk_live_…`) et la clé secrète (`sk_live_…`). Le lien est sur l'écran.
3. Collez-les dans **Plus › Paiement**, puis **Vérifier et activer**. Le site vérifie le compte auprès de Stripe et règle le reste tout seul. La clé secrète est gardée chiffrée et ne s'affiche plus jamais.

Dès lors, le client choisit dans son récapitulatif : **à la cueillette (comptant)** ou **en ligne, par carte**. Le prix est le même. Les conditions de vente, la politique de confidentialité et la FAQ suivent aussitôt.

Sur le même écran : décochez une des deux façons de payer pour ne garder que l'autre, ou **Déconnecter Stripe**. Stripe prend environ 2,9 % + 0,30 $ par vente, sans frais mensuels.

Pour essayer d'abord, collez les clés du mode essai (`pk_test_…`, `sk_test_…`) : aucune vraie carte n'est débitée, et le site le dit. Remplacez-les par les clés réelles avant d'ouvrir au public. Quand le site changera d'adresse, touchez **Vérifier la connexion**.

Cet écran est réservé au compte propriétaire et demande de confirmer que c'est vous.

## Quand une commande arrive

- **Une commande** paraît dans Aujourd'hui et Commandes, avec le code de cueillette du client : « À payer à la cueillette » s'il paie au comptoir, payée s'il a payé en ligne. Au comptoir : **Remettre la commande**, le client donne son code.
- **Une demande de gâteau** paraît dans Demandes. Appelez le client, convenez du prix, puis **Confirmer le prix** : la commande s'ajoute à sa journée. Pour refuser ou proposer une autre date, dites-le au téléphone, puis notez-le dans Studio.
- **Un message « Écrivez-nous »** paraît dans Plus › Messages.

## Pas encore actif, et pourquoi

| Quoi | Ce qu'il faut |
|---|---|
| Paiement en ligne | Votre compte Stripe, connecté dans Plus › Paiement (voir plus haut) |
| Acompte par lien sur un gâteau personnalisé | Stripe connecté, et les textos ou les courriels en service |
| Textos et courriels aux clients | Les comptes d'envoi (Twilio, Amazon SES) |
| Le vrai domaine, et le mot de passe oublié par courriel | L'enregistrement de cocovanillegranby.com et sa boîte courriel |
| Google et Bing | Le vrai domaine : l'adresse temporaire reste « ne pas indexer » |
| La page du chef | Vos réponses dans Faits du site (Équipe et histoire), avec l'accord de la personne |

Le site n'affiche aucun courriel tant qu'une boîte n'existe pas : il donne le téléphone et « Écrivez-nous ».

## À regarder avec vos conseillers

- **Paiement en ligne.** Quand Stripe est connecté, le prénom, le courriel, la carte et le montant passent par Stripe (Canada et États-Unis), et la politique de confidentialité le dit. L'évaluation de la Loi 25 (docs/26) couvre ce transfert : à relire avant de l'activer.
- **Hébergement hors du Québec.** Le serveur est à Paris, chez Hostinger, et la politique de confidentialité le dit. La Loi 25 demande une évaluation des facteurs relatifs à la vie privée avant de sortir des renseignements du Québec : l'Agence en a préparé un brouillon à votre nom (docs/26). Un hébergement au Canada réglerait la question : à décider avec le vrai domaine.
- **Taxes.** Les classes de taxe suivent la règle écrite dans Studio › Produits, sans avis d'un comptable. Vos numéros de TPS et de TVQ ne sont pas publiés : le site dit qu'ils sont sur vos reçus.
- **Conditions de vente.** Écrites par l'Agence pour la réservation payée à la cueillette, sans revue par un avocat.

## Sécurité

- Votre mot de passe n'appartient qu'à vous; l'Agence a son propre compte et ne vous le demandera jamais.
- Un compte par personne : ajoutez votre équipe dans Studio, avec un rôle et un NIP pour la tablette.

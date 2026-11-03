# Évaluation des facteurs relatifs à la vie privée : hébergement du site (brouillon)

| | |
|---|---|
| Pour | La personne responsable de la protection des renseignements personnels, Pâtisserie Coco Vanille inc. |
| Par | L'Agence (Yahya, BrandHub.ma), le 3 novembre 2026 |
| État | **Brouillon à relire et à signer.** Préparé sans revue par un avocat, à la demande de l'exploitant |
| Base | Loi 25, article 17 de la Loi sur la protection des renseignements personnels dans le secteur privé |

## Le projet

Le site et Coco Studio sont hébergés chez **Hostinger International Ltd**, sur un serveur privé virtuel situé à **Paris, en France** (adresse 72.60.92.29, relevée le 3 novembre 2026). Les renseignements des clients sortent donc du Québec. La politique de confidentialité du site le dit.

## Les renseignements concernés

| Renseignement | Pourquoi | Durée |
|---|---|---|
| Prénom, nom, téléphone, courriel facultatif | Préparer la commande, joindre le client | 6 ans après l'année d'imposition (commandes) |
| Produits, date et plage de cueillette | Préparer et remettre la commande | 6 ans après l'année d'imposition |
| Note d'allergie, facultative | Préparer la commande. **Renseignement sensible** | 30 jours après la cueillette, puis effacée |
| Photo d'inspiration d'un gâteau | Préparer le prix et le gâteau | Avec la demande |
| Messages « Écrivez-nous » | Répondre | 90 jours après le dernier message |
| Journaux du serveur (adresse IP, pages) | Sécurité | 90 jours |

Aucun numéro de carte : le paiement se fait au comptoir.

## Les facteurs de l'article 17

1. **Sensibilité** : surtout des coordonnées et des commandes. La note d'allergie est sensible : elle reste facultative, courte, jamais copiée dans un message, et s'efface après 30 jours.
2. **Finalité** : préparer et remettre les commandes, répondre aux clients. Aucune vente ni location de renseignements.
3. **Mesures de protection** :
   - connexions chiffrées (HTTPS);
   - base de données sur un réseau privé du serveur, jamais exposée à Internet;
   - accès à Studio par compte personnel, avec un rôle par personne, et la clientèle cachée au compte de l'agence par défaut;
   - journal de chaque changement dans Studio;
   - sauvegardes chiffrées, gardées sur le même serveur pour l'instant.
4. **Régime juridique du lieu** : la France applique le Règlement général sur la protection des données (RGPD) de l'Union européenne. Sa protection paraît adéquate au regard des principes généralement reconnus. **À confirmer par un conseiller.**
5. **Entente écrite** : l'article 17 demande une entente qui encadre la communication. Le contrat et l'annexe de traitement des données de Hostinger sont à lire et à conserver dans le coffre de la boutique. **À faire par l'Agence avant la mise en ligne sur le vrai domaine.**

## Les risques qui restent

| Risque | Ce qui le réduit | Ce qui le réglerait |
|---|---|---|
| Un serveur partagé avec d'autres sites de l'agence | Conteneurs et réseau séparés, comptes distincts | Un serveur réservé à la boutique |
| Sauvegardes sur le même serveur : une panne les emporterait | Sauvegardes chiffrées et quotidiennes | Une copie hors du serveur (`BACKUP_REMOTES`) |
| Renseignements hors du Québec | Cette évaluation, l'entente, le RGPD | Un hébergement au Canada, à décider avec le vrai domaine |

## Conclusion proposée

La communication peut se faire pendant le lancement sur l'adresse temporaire, si la personne responsable accepte les risques ci-dessus. **Recommandation de l'Agence** : passer à un serveur au Canada au moment du vrai domaine, et ajouter une copie des sauvegardes hors du serveur.

Décision de la personne responsable : ______________________  Date : ______________  Signature : ______________________

**Stripe (paiement en ligne)** : en service seulement si la propriétaire le connecte dans Coco Studio › Plus › Paiement. Le client qui choisit de payer en ligne donne sa carte directement à Stripe, dans ses formulaires; le site n'en voit jamais le numéro. Stripe reçoit aussi le courriel, le montant et le numéro de commande, et les traite au Canada et aux États-Unis. Le client qui paie à la cueillette ne donne rien à Stripe. La politique de confidentialité le nomme automatiquement dès la connexion. Cette partie reste à relire par la propriétaire avant d'activer le paiement, comme le reste de cette évaluation.

Fournisseurs à ajouter ici avant leur mise en service : Twilio (textos), Amazon SES (courriels).

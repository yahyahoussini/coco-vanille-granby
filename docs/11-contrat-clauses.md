# Clauses pour le contrat de référencement (SEO, AEO, GEO) — Pâtisserie Coco Vanille

> **À FAIRE VALIDER PAR UN JURISTE AVANT TOUTE SIGNATURE.** Ce document est un modèle de clauses, pas un contrat, et **pas un avis juridique**. Les articles de loi cités viennent de la recherche ([research/07](../research/07-legal-quebec-compliance.md)) ou du texte de loi reproduit par un cabinet (document sans valeur officielle) : le juriste les confirme sur Légis Québec et adapte chaque clause.

Rédigé le jeudi 29 octobre 2026. Les clauses fixent trois choses : **ce qui est promis**, **qui possède quoi**, **comment on mesure**. Liens : [docs/00 §2](00-intake.md) (les comptes), [docs/10](10-handover.md) (la transmission), [docs/01 §5](01-plan-90-jours.md) (la définition de « premier »).

## 0. Les parties

- **Le client** : Pâtisserie Coco Vanille inc., NEQ 1177082220, 3, rue Court, Granby (Québec) J2G 4Y6 ([data/facts.json](../data/facts.json)). Signataire : `[[FACT NEEDED: nom et titre du signataire]]`.
- **Le prestataire** : Yahya, BrandHub.ma (« l'agence ») : `[[FACT NEEDED: raison sociale, adresse, numéro d'entreprise de l'agence]]`.

## 1. Objet et phases

Le site, Coco Studio et la commande en ligne sont déjà construits (non déployés au 29 octobre 2026, [README.md](../README.md)). Les phases suivent donc l'état réel du projet :

| Phase | Contenu | Mode | Honoraires |
|---|---|---|---|
| **1. Mise en place** | Déploiement sur le serveur de la boutique ; mesure de départ (33 questions, Google et cinq moteurs d'IA) ; consoles (Search Console, Bing Webmaster Tools), GA4 avec consentement ; fiche Google, Apple Business, Bing Places et annuaires alignés ; premières pages publiques ; coordination avec le juriste et le comptable ; ouverture de la commande en ligne après les tests ([docs/01](01-plan-90-jours.md)) | Forfait, livrables datés | `[[FACT NEEDED: montant]]` |
| **2. Croissance** | Le rythme hebdomadaire ([docs/02](02-rythme-hebdo.md)) : une page par semaine après le lancement, demandes d'avis et réponses, mentions (annuaires, listes, médias, partenaires), boucle des extraits, mesure chaque lundi, rapport chaque mois | Mensuel | `[[FACT NEEDED: montant]]` |
| **3. Maintien** | Mesure, fraîcheur des faits, exploitation du serveur (vérifications du vendredi, sauvegardes, tests de restauration, mises à jour de sécurité), incidents ([docs/09](09-runbook-incident.md)) | Mensuel, tarif réduit | `[[FACT NEEDED: montant]]` |

## 2. Ce qui n'est pas promis

« Le prestataire ne garantit aucune position dans Google, Bing ou les moteurs d'intelligence artificielle, qui ne garantissent eux-mêmes ni l'exploration, ni l'indexation, ni l'affichage d'une page. Le prestataire s'engage sur le processus décrit à l'annexe B, sur la mesure hebdomadaire et sur la remise du rapport mensuel. Les objectifs de visibilité s'expriment selon la définition de « premier » de l'annexe B. »

Pourquoi cette clause : Google l'écrit lui-même : « No one can guarantee a #1 ranking on Google » ([Google Search Central, « Do you need an SEO? »](https://developers.google.com/search/docs/fundamentals/do-i-need-seo), mise à jour le 5 juin 2026, consultée le 29 octobre 2026). Une agence qui garantit la première place ment, ou prévoit des tactiques interdites (référence rank-first 13 §1).

## 3. Propriété des actifs, du code et des contenus

« Le domaine, le serveur, les comptes de sauvegarde, la propriété Search Console, le Profil d'entreprise Google, la propriété GA4, Bing Webmaster Tools, Apple Business, Bing Places, la chaîne YouTube, les comptes sociaux, la messagerie du domaine et les comptes Stripe, Twilio et AWS sont créés, ou transférés, au nom du client, avec des coordonnées de récupération qu'il contrôle. Le prestataire y accède comme gestionnaire, éditeur ou utilisateur. Le registre des accès ([docs/10 §1](10-handover.md)) est remis le premier jour et le dernier jour du mandat. Le prestataire n'enregistre jamais un de ces comptes à son nom et ne retient jamais un accès, même en cas de différend. »

« Le code du site et de Coco Studio développé pour le client, les textes, les photos fournies par le client, les données et les rapports appartiennent au client `[[FACT NEEDED: à la livraison ou au paiement de quelle facture — à décider avec le juriste]]`. Le dépôt de code est hébergé dans une organisation GitHub au nom du client `[[FACT NEEDED: date du transfert ; aujourd'hui, le dépôt est sous le compte de l'agence]]`. Les composants libres gardent leurs licences. Les outils génériques de mesure de l'agence (dossier `tools/`) sont concédés au client sous une licence perpétuelle et non exclusive, pour ses propres sites `[[FACT NEEDED: validation du juriste]]`. »

Les photos d'ambiance libres de droits utilisées en attendant les vôtres sont sous licence Unsplash et restent étiquetées « Photo d'illustration » ([research/sessions/04-design-direction.md](../research/sessions/04-design-direction.md)).

## 4. Contenus et faits

« Le client fournit et confirme les faits publiés : heures, prix, portions, délais, produits, allergènes, conditions de vente. Le prestataire n'invente aucun chiffre, aucun avis, aucune citation ; il signale les faits manquants, qui restent marqués et bloquent la publication de la page concernée. Les allergènes sont vérifiés et signés par le client dans Coco Studio, jamais rédigés par une intelligence artificielle. Le client approuve chaque page avant sa publication. Le contenu publié appartient au client. »

## 5. Pratiques exclues (« chapeau blanc » seulement)

« Le prestataire refuse, même à la demande du client, toute pratique contraire aux règles anti-pourriel de Google, aux politiques des plateformes ou à la loi, notamment celles de l'annexe A. Le client s'engage à ne pas commander ces pratiques à un tiers pendant le mandat. Le prestataire peut suspendre ses services si une telle pratique est mise en place malgré tout. »

Pourquoi : une action manuelle de Google coûte les mois nécessaires pour la voir, nettoyer, demander un réexamen et remonter, plus la confiance de chaque moteur qui l'a observée ; le domaine est le seul actif qui s'accumule (référence rank-first 09 §5). Les faux avis et les frais cachés relèvent aussi de la Loi sur la concurrence ([research/07 1D](../research/07-legal-quebec-compliance.md)).

## 6. Renseignements personnels (Loi 25)

**Les rôles**

- **Le client est l'entreprise responsable** des renseignements personnels qu'il détient. Article 3.1 : « Toute personne qui exploite une entreprise est responsable de la protection des renseignements personnels qu'elle détient. » La personne ayant la plus haute autorité exerce la fonction de responsable de la protection des renseignements personnels et « peut déléguer cette fonction par écrit » ; « le titre et les coordonnées du responsable […] sont publiés sur le site Internet de l'entreprise ». Responsable : `[[FACT NEEDED: nom, titre, courriel (research/14 A4)]]`.
- **Le prestataire est un mandataire** à qui le client confie des renseignements pour l'exécution du contrat. Article 18.3 : l'entreprise doit « confier le mandat ou le contrat par écrit » et y « indiquer […] les mesures que le mandataire […] doit prendre pour assurer la protection du caractère confidentiel du renseignement personnel communiqué, pour que ce renseignement ne soit utilisé que dans l'exercice de son mandat […] et pour qu'il ne le conserve pas après son expiration » ; le mandataire « doit aviser sans délai le responsable de la protection des renseignements personnels de toute violation ou tentative de violation » et lui « permettre […] d'effectuer toute vérification relative à cette confidentialité ».

Texte de loi tel que reproduit par le cabinet Lavery (« Ce document n'a pas de valeur officielle », [PDF](https://www.lavery.ca/upload/pdf/Publications/Amendee-LPRPSP-FR.pdf), consulté le 29 octobre 2026 ; Légis Québec n'a pas pu être ouvert). Résumés concordants : [Lavery](https://www.lavery.ca/fr/publications/4276-afficher-PDF-publication.html), [BLG](https://www.blg.com/-/media/insights/documents/blg-privacy-bill-64-key-requirements-fr.pdf), consultés le 29 octobre 2026.

**La clause proposée**

« Le prestataire traite les renseignements personnels du client uniquement pour exécuter le présent contrat. Il applique les mesures suivantes : accès limité au strict nécessaire (le rôle « Agence » de Coco Studio ne voit ni les noms ni les téléphones des clients par défaut, ni les messages « Écrivez-nous ») ; double authentification sur chaque compte ; clés de chiffrement des sauvegardes conservées hors du serveur ; aucune copie de la base de données sur un poste de travail, dans le dépôt de code ou dans un courriel. Il avise sans délai la personne responsable de toute violation ou tentative de violation, aide le client à tenir son registre des incidents de confidentialité (article 3.8) et à évaluer si un incident présente un risque de préjudice sérieux, auquel cas le client avise la Commission d'accès à l'information et les personnes concernées (article 3.5). À la fin du mandat, il détruit les renseignements qu'il détient et le confirme par écrit. Le client peut vérifier le respect de ces mesures. »

**Où vivent les données**

| Élément | Lieu | Conséquence |
|---|---|---|
| Serveur et sauvegardes | Cible : centres de données **au Québec** ; sauvegardes chez deux fournisseurs différents, dans des centres de données au Québec `[[FACT NEEDED: fournisseur et ville (research/14 T1)]]` | Pas d'évaluation au titre de l'article 17 pour la base principale si tout reste au Québec ([research/17 §7](../research/17-vps-self-hosting-and-domain.md)) |
| Fournisseurs hors du Québec : paiements (Stripe), textos (Twilio), mesure d'audience (GA4), erreurs (Sentry), messagerie, et l'interface Claude si les brouillons de réponses par IA sont activés plus tard | Hors du Québec (les autres provinces comptent, [research/07 §2](../research/07-legal-quebec-compliance.md)) | Article 17 : une évaluation des facteurs relatifs à la vie privée **avant** de communiquer, puis une entente écrite. Le client les fait, avec l'aide du prestataire |
| **L'agence elle-même** | `[[FACT NEEDED: lieu d'où l'agence, ses sous-traitants et leurs outils accèdent au serveur et aux données]]` | Si l'accès se fait hors du Québec, l'article 17 s'applique aussi à ce mandat : évaluation et entente écrite avant le premier accès aux renseignements personnels |

**Consentement et conservation** : les outils de mesure qui suivent la navigation restent éteints tant que le visiteur ne les active pas (article 8.1 ; article 9.1 : les paramètres assurent « par défaut » le plus haut niveau de confidentialité) ; la politique de confidentialité est publiée sur le site (article 8.2). Durées proposées, à confirmer par le juriste : notes d'allergie effacées 30 jours après la cueillette ; conversations « Écrivez-nous » supprimées 90 jours après le dernier message ; journaux bruts du serveur gardés 90 jours ([research/07](../research/07-legal-quebec-compliance.md), [research/17 §7.2](../research/17-vps-self-hosting-and-domain.md)).

## 7. Messages aux clients (LCAP) et publicité

« Les messages électroniques commerciaux (promotions, rappels saisonniers, demandes d'avis par courriel ou texto) ne sont envoyés qu'aux personnes qui y ont consenti, avec l'identification de l'expéditeur et un moyen de se désabonner ; les messages qui confirment une transaction (commande confirmée, « C'est prêt! ») restent exempts de consentement. Toute collaboration rémunérée (influenceur, liste payante) est divulguée et tout lien payé porte l'attribut `rel="sponsored"`. »

Source : [research/07 1E et 1D](../research/07-legal-quebec-compliance.md) ; le statut exact d'une demande d'avis au regard de la LCAP reste une question pour le juriste (question 10 de research/07 §8).

## 8. Mesure, rapports, durée, fin du mandat

« Un tableau de bord (33 questions suivies, positions, extraits, citations par moteur, mentions, avis, commandes et demandes) est mis à jour chaque semaine, et un rapport ([docs/07](07-rapport-mensuel.md)) est remis chaque mois. Un changement est considéré comme réel après quatre semaines dans la même direction. Le client a un accès en lecture à toutes les sources. »

« Le contrat a une durée initiale de `[[FACT NEEDED: durée]]`, avec un préavis de résiliation de `[[FACT NEEDED: préavis]]`. À la fin du mandat, quelle qu'en soit la cause, le prestataire remet le dossier de transmission ([docs/10](10-handover.md)) : le code et son historique, les données exportées (copie de la base, fichiers téléversés, fichiers de mesure), les rapports, les documents ; il retire ses accès, fait changer les clés qu'il a connues et détruit les renseignements personnels qu'il détient (§6). Une aide à la transition de `[[FACT NEEDED: nombre d'heures]]` heures est incluse. »

## 9. Autres clauses à faire rédiger par le juriste

| Sujet | Point à régler |
|---|---|
| Sous-traitants de l'agence | Liste remise au client, mêmes obligations de confidentialité que l'agence : `[[FACT NEEDED: liste]]` |
| Responsabilité et assurance | Plafond de responsabilité ; assurance responsabilité professionnelle : `[[FACT NEEDED]]` |
| Langue du contrat | Rédigé en français ; le juriste confirme les exigences de la Charte de la langue française pour ce type de contrat |
| Droit applicable et tribunal | Québec : `[[FACT NEEDED: validation du juriste]]` |

---

## Annexe A — Entente d'une page sur les tactiques refusées (à signer en semaine 0)

Cette entente est demandée dans le message au propriétaire ([research/14 §14](../research/14-owner-questions.md), question S6). Liste tirée du plan-v1 §10 et du registre des risques du skill rank-first (référence 09 §5), adaptée au Québec.

**Pâtisserie Coco Vanille inc. et l'agence s'engagent à ne jamais :**

1. publier, acheter ou faire publier de faux avis, ni des avis de l'équipe, de la famille ou d'amis qui se présentent comme des clients ;
2. offrir quoi que ce soit (rabais, tirage, cadeau) en échange d'un avis, d'une modification ou d'un retrait d'avis ;
3. trier les demandes d'avis (les envoyer seulement aux clients contents) ;
4. fixer des quotas d'avis à l'équipe, compter les avis par employé ou demander aux clients de nommer un employé, un produit ou un nombre d'étoiles ;
5. ajouter des mots-clés ou une deuxième langue au nom de la fiche Google, ni créer une deuxième fiche ou une adresse fictive (par exemple une « Coco Vanille Bromont » sans personnel sur place) ;
6. acheter des liens ou des mentions, ou en échanger à grande échelle ; rediriger des domaines expirés ; publier des pages sur des sites tiers pour profiter de leur réputation ;
7. publier des pages en série presque identiques, ou des pages par ville qui ne changent que le nom de la ville ;
8. cacher du texte, montrer aux robots un contenu différent de celui des visiteurs, ou écrire du texte destiné aux IA ;
9. ajouter des données structurées pour ce qui n'est pas visible sur la page, ou afficher nos propres avis en étoiles dans ces données ;
10. publier un contenu payé ou une collaboration d'influenceur sans le dire, ni créer de faux comptes dans des groupes ou des forums ;
11. annoncer des prix qui ne comprennent pas tous les frais obligatoires (seules la TPS et la TVQ s'ajoutent) ;
12. nuire à un concurrent (faux avis, signalements abusifs, référencement négatif), ni copier ses textes ou ses photos ;
13. utiliser des robots de clics ou toute manipulation du trafic.

Ce qui reste permis, et qu'on fera vite : une page utile par semaine, la demande d'avis à chaque client, des études de prix datées, la présence sur chaque annuaire et chaque liste qui compte, des partenaires réels, des vidéos, une page comparative honnête après avis juridique.

Signé à Granby, le `…` 2026 : pour Pâtisserie Coco Vanille inc. `…` · pour l'agence `…`

## Annexe B — Le processus et la définition de « premier »

Le processus : [docs/01-plan-90-jours.md](01-plan-90-jours.md) et [docs/02-rythme-hebdo.md](02-rythme-hebdo.md). La définition de « premier » : [docs/01 §5](01-plan-90-jours.md) (version corrigée de [research/12 §4](../research/12-plan-review.md)), mesurée sur quatre lundis de suite, sur l'ensemble des questions **et** sur les seules questions en français.

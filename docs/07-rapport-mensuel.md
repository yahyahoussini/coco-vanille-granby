# Rapport mensuel — Pâtisserie Coco Vanille — `[[FACT NEEDED: mois et année, par exemple « novembre 2026 »]]`

Modèle rédigé le jeudi 29 octobre 2026. Chaque mois, l'agence le remplit et vous l'envoie ; vous l'approuvez en 15 minutes ([research/16 §1.3](../research/16-admin-dashboard-spec.md)). Premiers envois prévus : le vendredi 4 décembre 2026 (novembre), le vendredi 8 janvier 2027 (décembre) et le vendredi 5 février 2027 (janvier) ([docs/01 §4](01-plan-90-jours.md)).

- Préparé par l'agence le : `[[FACT NEEDED: date]]` · Approuvé par le propriétaire le : `[[FACT NEEDED: date]]`
- Mise à jour majeure de Google pendant le mois? `[[FACT NEEDED: oui ou non, et dates (status.search.google.com)]]`. Si oui, les conclusions sont gelées jusqu'à la fin du déploiement.

**Comment lire ce rapport.** Deux sortes de chiffres :

- les **indicateurs avancés** bougent en jours ou en semaines (pages indexées, impressions, citations par les IA, avis) : ils disent si on est sur la bonne voie ;
- les **indicateurs retardés** bougent en semaines ou en mois (commandes, demandes, appels, itinéraires) : ils disent si ça rapporte.

On lit des tendances sur quatre semaines, jamais une journée. Le cap (l'« étoile du nord », [research/00 §12.3](../research/00-master-concept.md)) : **commandes en ligne en dollars + soumissions acceptées en dollars + appels + demandes d'itinéraire**, pas les visites.

En novembre et en décembre 2026, la commande en ligne n'est pas encore ouverte (ouverture prévue du lundi 11 au dimanche 24 janvier 2027) : plusieurs lignes de la section 1 resteront « pas encore ouvert ». C'est normal.

Les lignes marquées **(P)** sont relevées par vous (ou avec vous, par téléphone) : le rôle « Agence » de Coco Studio ne voit ni les demandes de gâteaux ni les messages « Écrivez-nous », et seulement le nombre des commandes, jamais les clients (Loi 25, minimisation).

## 0. En bref (3 lignes au plus)

- Ce qui a bougé : `…`
- Pourquoi, selon nous (avec la preuve) : `…`
- Ce qu'on fait le mois prochain : `…`

## 1. Résultats pour la boutique (indicateurs retardés)

| Indicateur | Ce mois | Mois précédent | Tendance sur 4 semaines | Source |
|---|---|---|---|---|
| Commandes en ligne : nombre et montant | | | | Coco Studio › Commandes (à partir de l'ouverture) |
| Commandes par téléphone saisies dans Studio | | | | Coco Studio › Commandes |
| Demandes de gâteaux : reçues · chiffrées · acompte payé **(P)** | | | | Coco Studio › Demandes |
| Demandes répondues en moins de 24 heures **(P)** | | | | Coco Studio › Demandes |
| Annulations, et remboursements faits dans les 15 jours | | | | Coco Studio › Commandes (carte « Remboursement à faire » avec sa date limite) |
| Appels depuis la fiche Google | | | | Profil d'entreprise Google › Performances (chiffres arrondis par Google) |
| Demandes d'itinéraire depuis la fiche | | | | Profil d'entreprise Google › Performances |
| Clics vers le site depuis la fiche | | | | Profil d'entreprise Google ; GA4 (lien avec étiquette de suivi) |
| Clics « Appeler », « Itinéraire », « Commander » sur le site | | | | GA4, visiteurs consentants seulement : un **plancher**. Pas encore installé |
| Messages « Écrivez-nous » : reçus · répondus pendant les heures d'ouverture **(P)** | | | | Coco Studio › Messages |
| Recherches du nom de la boutique (« coco vanille », « cocovanille ») | | | | Search Console, filtre sur les requêtes de marque |
| Réponses à « Comment nous avez-vous connus? » | | | | Prévu : le champ existe dans les commandes, la question n'est pas encore posée au paiement |

## 2. Réputation

| Indicateur | Ce mois | Mois précédent | Cible | Source |
|---|---|---|---|---|
| Nouveaux avis Google | | | Deux fois le rythme des 8 semaines précédentes, pour la boutique ([research/15 R24](../research/15-decisions-and-risks.md)) | Coco Studio › Avis (notés à la main) ; fiche Google |
| Note moyenne des 90 derniers jours | | | — | Coco Studio › Avis |
| Avis répondus en moins de 24 heures | | | Tous (décision M1) | Coco Studio › Cette semaine |
| Avis de 1 à 3 étoiles, et la suite donnée (appel, correction) | | | Chacun traité | Coco Studio › Avis |

Jamais de chiffre par employé, jamais de classement de l'équipe (décision M2 ; règles de Google sur la manipulation des notes, [research/18](../research/18-dated-claims-verification.md)).

## 3. Visibilité (indicateurs avancés)

**Les 33 questions suivies**, moteur par moteur ([scoreboard/prompts.csv](../scoreboard/prompts.csv)). Une ligne de moteur d'IA venue de l'outil automatique ne compte qu'une fois corrigé son réglage de pays ([scoreboard/README §6](../scoreboard/README.md)) :

| Moteur | Questions où la boutique est **nommée** | Questions où notre site est **lié** | 1re place / 3 premières (Google) | Variation sur 4 semaines |
|---|---|---|---|---|
| Google : résultats, extrait en vedette, « Autres questions posées », bloc local | | | | |
| Google : Aperçu IA et Mode IA | | | | |
| ChatGPT | | | | |
| Perplexity | | | | |
| Gemini | | | | |
| Claude | | | | |
| Copilot | | | | |

**Où on en est de la définition de « premier »** ([docs/01 §5](01-plan-90-jours.md)) :

| Tableau | Ensemble des questions | Questions en français seulement | Lundis de suite réussis (sur 4) |
|---|---|---|---|
| SEO | ☐ | ☐ | |
| AEO | ☐ | ☐ | |
| GEO | ☐ | ☐ | |

Si chaque question n'a pas passé trois fois par semaine dans chaque moteur, écrire **« mesure partielle »** à côté du tableau.

**Autres signaux avancés**

- Pages indexées : Google (Search Console › Pages) ___ sur ___ · Bing ___
- Impressions sur les questions suivies (Search Console, filtrées) : ___ · rapport « IA générative » de Search Console (impressions seulement, ni clics ni requêtes) : ___
- Bing Webmaster Tools › AI Performance (un échantillon de Microsoft, donc un minimum) : ___ citations
- Signaux Web essentiels sur cellulaire : ___ % des adresses jugées « bonnes »
- Robots vus sur les pages clés ce mois (journaux du serveur) : Googlebot ☐ Bingbot ☐ OAI-SearchBot ☐ GPTBot ☐ PerplexityBot ☐ Claude-SearchBot ☐ ClaudeBot ☐ Applebot ☐
- Contrôle « IA générative » de Search Console réglé sur « Inclure » : ☐
- Faits faux repérés dans les réponses des IA (heures, téléphone, produits) et corrections envoyées : `…`

## 4. Présence et mentions

| Indicateur | Ce mois | Total | Source |
|---|---|---|---|
| Fiches identiques à la fiche Google (nom, adresse, téléphone, heures) | | ___ sur ___ | [data/directories.csv](../data/directories.csv) ; [docs/06](06-annuaires-listicles.md) |
| Nouvelles mentions par d'autres sites avec les mots de la catégorie (pâtisserie, boulangerie, Granby) | | | Alertes Google ; recherche de « "Coco Vanille" Granby » |
| Listes « meilleures pâtisseries » ou « boulangeries » de Granby qui se classent, et où nous figurons | | ___ sur ___ | Rapport du lundi |
| Liens obtenus (nouveaux sites qui pointent vers nous) | | | Search Console › Liens |
| Propositions envoyées aux médias · réponses | | | [docs/04](04-pitch-media.md) |
| Publications : fiche Google · Facebook · Instagram | | | Trois par semaine au plus en tout |

But fixé par le plan-v1 (couche 15) : les mentions sont comptées chaque mois et **montent trois mois de suite**.

## 5. Pages livrées ce mois

| Page | Langue(s) | Question visée | Position, extrait ou citation | Mise en ligne le |
|---|---|---|---|---|
| | | | | |

## 6. Ce qui a bougé, et ce qu'on ne conclut pas

- Ce qui a bougé et pourquoi (3 lignes au plus, une preuve par ligne) : `…`
- Ce qu'on ne conclut pas ce mois-ci (mise à jour de Google, saison, trop peu de données) : `…`

## 7. Le mois prochain

- Pages : `…`
- Hors du site : `…`
- **Ce dont on a besoin de vous** (trois au plus, les plus bloquants d'abord : faits, photos, accès, approbations) : `[[FACT NEEDED: …]]`

## 8. Rappels

- Aucune position n'est garantie : « No one can guarantee a #1 ranking on Google » ([Google Search Central](https://developers.google.com/search/docs/fundamentals/do-i-need-seo), page mise à jour le 5 juin 2026, consultée le 29 octobre 2026). Ce qui est garanti : la mesure, chaque semaine, et ce rapport, chaque mois.
- Un changement est réel après quatre semaines dans la même direction.
- La première année, il n'y a pas de « même mois l'an dernier » : on compare avec les semaines de départ et avec la saison (Fêtes, Saint-Valentin, Pâques, saison du Zoo, rentrée).
- Les chiffres de GA4 sont un minimum (seuls les visiteurs qui acceptent la mesure sont comptés) ; ceux de Bing AI Performance sont un échantillon ; le rapport « IA générative » de Search Console ne donne que des impressions ([research/06 (e)(f)(g)](../research/06-seo-aeo-geo-2026-verified.md)).

## 9. Ce que ce rapport ne montre pas, exprès

| Chiffre absent | Pourquoi |
|---|---|
| Les visites (sessions) comme résultat | Elles baissent même quand on est cité davantage ; ce qui compte, ce sont les commandes, les demandes, les appels et les itinéraires |
| Le nombre d'abonnés | Il ne dit rien sur les ventes |
| La position moyenne de tout le site | Elle mélange des recherches sans rapport ; on la lit seulement filtrée sur les questions suivies |
| Les impressions sans contexte | Elles montent avant les clics ; on les lit en tendance |
| Un score global unique | Des poids arbitraires cachent ce qui a vraiment bougé ([research/12 G9](../research/12-plan-review.md)) |
| Des chiffres par employé | Interdits (décision M2) |

## 10. D'où viennent les chiffres (pour l'agence)

| Chiffre | Outil ou commande |
|---|---|
| Commandes, demandes, avis, messages | Coco Studio (la base de données de la boutique : la source de vérité, [research/12 G8](../research/12-plan-review.md)) |
| Appels, itinéraires, clics de la fiche | Profil d'entreprise Google › Performances |
| Positions, impressions, pages indexées, recherches de marque | Search Console ; `node tools/gsc-api.mjs positions --to-runs` si le compte de service existe ([docs/12](12-setup-mesure.md)) |
| Questions suivies, citations par moteur, définition de « premier » | `node tools/citation-share.mjs` sur `scoreboard/runs/` (mesure du lundi, [docs/02](02-rythme-hebdo.md)) |
| Clics « Appeler », « Itinéraire », « Commander » ; visites venant des IA | GA4 ; `node tools/ga4-api.mjs leads --weeks` et `node tools/ga4-api.mjs ai` |
| Robots sur les pages clés | `node tools/log-bots.mjs <journal> --verify --week` |
| Page de tableau de bord à joindre au courriel | `node tools/dashboard.mjs` → `reports/dashboard.html` (une page autonome) |

# Dossier de transmission — Pâtisserie Coco Vanille

Rédigé le jeudi 29 octobre 2026. **Remis le premier jour du mandat et le dernier jour**, mis à jour à chaque changement d'accès.

La boutique possède tout ; l'agence (Yahya, BrandHub.ma) gère. Ce dossier dit, pour chaque compte, chaque fichier et chaque procédure, où il se trouve et comment s'en servir, pour qu'une autre personne puisse reprendre sans nous. **Aucun mot de passe ici** : ils sont dans un gestionnaire de mots de passe partagé `[[FACT NEEDED: lequel, et qui en est propriétaire]]`.

Sources : [README.md](../README.md) (« The app »), [infra/README.md](../infra/README.md), [research/17](../research/17-vps-self-hosting-and-domain.md), [research/19](../research/19-build-workflow-and-requirements.md). Liens : [docs/00 §2](00-intake.md) (la liste des comptes et leur statut), [docs/09](09-runbook-incident.md) (incidents), [docs/11 §8](11-contrat-clauses.md) (fin du mandat).

## 1. Comptes, propriété et récupération

| Actif | Compte propriétaire (la boutique) | Accès de l'agence | Récupération (courriel, téléphone) | Double authentification |
|---|---|---|---|---|
| Domaine `cocovanillegranby.com` | `[[FACT NEEDED: registraire et titulaire]]` | DNS délégué | `[[FACT NEEDED]]` | ☐ |
| Domaines défensifs (`cocovanillegranby.ca`, autres) | Décision du propriétaire, au nom légal | — | `[[FACT NEEDED]]` | ☐ |
| Serveur (VPS) | `[[FACT NEEDED: fournisseur, ville du centre de données]]` | Utilisateur `deploy` (clés SSH : la clé personnelle de l'agence et la clé de déploiement de GitHub) | `[[FACT NEEDED]]` | ☐ |
| Stockage des sauvegardes (deux fournisseurs au Québec) | Comptes de la boutique | Une clé limitée à chaque compartiment | `[[FACT NEEDED]]` | ☐ |
| Clé privée de chiffrement des sauvegardes (`age`) | Gestionnaire de mots de passe + copie imprimée dans le coffre de la boutique | Seulement le temps d'un exercice de restauration | — | — |
| GitHub (code, déploiements, images) | **Aujourd'hui : compte de l'agence `yahyahoussini`.** À transférer à une organisation au nom de la boutique (décision à prendre, [docs/11 §3](11-contrat-clauses.md)) | Administrateur | `[[FACT NEEDED]]` | ☐ |
| Google Search Console (propriété « Domaine ») | Compte Google de l'entreprise | Utilisateur complet | `[[FACT NEEDED]]` | ☐ |
| Bing Webmaster Tools + clé IndexNow (`INDEXNOW_KEY`, dans le `.env` de production) | Compte de l'entreprise | Utilisateur | `[[FACT NEEDED]]` | ☐ |
| Profil d'entreprise Google | `[[FACT NEEDED: qui détient l'accès propriétaire]]` | Gestionnaire | `[[FACT NEEDED]]` | ☐ |
| Apple Business, Bing Places | Compte de l'entreprise | Gestionnaire | `[[FACT NEEDED]]` | ☐ |
| GA4 (identifiant de mesure : `[[FACT NEEDED]]`) | Compte Google de l'entreprise | Éditeur ; le compte de service des scripts : lecteur | `[[FACT NEEDED]]` | ☐ |
| Facebook, Meta Business, Instagram | `[[FACT NEEDED: administrateurs]]` | Accès partenaire | `[[FACT NEEDED]]` | ☐ |
| YouTube (quand la chaîne sera créée) | Compte Google de l'entreprise | Gestionnaire | — | ☐ |
| Courriel sur le domaine | `[[FACT NEEDED: Microsoft 365 ou Google Workspace]]` | Alias `dmarc@` | `[[FACT NEEDED]]` | ☐ |
| Stripe | Compte de la boutique | Clés d'API dans le `.env` | `[[FACT NEEDED]]` | ☐ |
| Twilio | Compte de la boutique | Clés d'API dans le `.env` | `[[FACT NEEDED]]` | ☐ |
| AWS (Amazon SES, région ca-central-1) | Compte de la boutique | Utilisateur limité à l'envoi de courriels | `[[FACT NEEDED]]` | ☐ |
| Surveillance (disponibilité, signaux de vie) et Sentry | `[[FACT NEEDED: au nom de qui]]` | Reçoit les alertes | — | ☐ |
| Coco Studio | Propriétaire : clé d'accès (passkey) et code de secours ; gérant et comptoir : NIP | Rôle « Agence » (sans noms ni téléphones de clients par défaut) | Le propriétaire recrée les accès de l'équipe dans Plus › Réglages | Passkey |

## 2. Où vivent les choses

| Quoi | Où | À savoir |
|---|---|---|
| Le code | Dépôt GitHub `yahyahoussini/coco-vanille-granby` : `apps/web` (Next.js 16 et Payload 3, en JavaScript), `infra/`, `tools/`, `.github/workflows/`, `data/`, `research/`, `docs/` | Un seul dépôt ; aucun mot de passe ni copie de base de données n'y est jamais versé |
| Les images de l'application | `ghcr.io/yahyahoussini/coco-vanille-granby:<empreinte git>` | Une image, trois processus : `web` (site public), `studio` (Coco Studio), `worker` (tâches de fond) |
| Le serveur | `/opt/coco/production` et `/opt/coco/staging` : fichier `.env` (droits 600) et `state.env` (couleur active, versions, date du déploiement ; ne jamais le modifier pendant un déploiement) ; `/opt/coco/releases/<empreinte>` | Configuration nginx sous `/etc/nginx/coco/` ; journaux du site public dans `/var/log/nginx/` ([research/17 §1](../research/17-vps-self-hosting-and-domain.md)) |
| La base de données | Postgres 16 dans Docker, sur un réseau privé, jamais exposée | Les changements de structure passent par des migrations versionnées, qui ajoutent sans jamais retirer dans la même version |
| Les fichiers téléversés (photos) | `/opt/coco/production/media`, servis à `/media/<fichier>` | Les photos des demandes de clients (`/media/demandes/`) ne sont visibles que dans Coco Studio |
| Les sauvegardes | Chaque nuit à 2 h 15 : copie de la base vérifiée, chiffrée, envoyée dans deux compartiments (quotidiennes 30 jours, mensuelles 12 mois, avant déploiement 30 jours) ; copies locales : 7 de nuit et 5 d'avant déploiement ; test de restauration automatique le premier lundi du mois à 3 h 30, résultat dans `/opt/coco/production/reports/restore-test.json` | [infra/README.md](../infra/README.md), « Backups and the restore test » |
| Les faits de l'entreprise | [data/facts.json](../data/facts.json) (le contrat des faits), puis Coco Studio (boutique, heures, produits) | Un fait n'est entré qu'une fois ; le site, les données structurées et les annuaires le reprennent |
| Les pages | Le registre des pages : [apps/web/src/lib/routes.js](../apps/web/src/lib/routes.js). Le texte de départ : `apps/web/src/seed/content.js`, chargé dans Payload ; les modifications se font dans Coco Studio › Plus › Avancé | Une page avec un `[[FACT NEEDED]]` ne se publie pas en production (`PUBLISH_GUARD=strict`) |
| La liste des faits qui manquent par page | Le résumé de chaque déploiement en préproduction (`owner-todo.md`) ; la dernière copie locale : `apps/web/reports/gate/owner-todo.md` (28 octobre 2026) | À renvoyer au propriétaire quand elle change |
| La mesure du lundi | [.github/workflows/weekly.yml](../.github/workflows/weekly.yml) et `tools/*.mjs` ; questions lues par l'exécution automatique : [data/prompts.csv](../data/prompts.csv) ; concurrents : [data/competitors.csv](../data/competitors.csv) ; historique : l'artefact « rank-first-history » de GitHub Actions, gardé 90 jours et reporté chaque semaine. Les requêtes suivies, les relevés à la main et les limites connues des outils : [scoreboard/](../scoreboard/README.md) | Proposition : en archiver une copie chaque mois (dépôt ou compartiment), pour ne rien perdre si la mesure s'arrête plus de 90 jours ; faire lire `scoreboard/` par l'exécution automatique ([scoreboard/README §6](../scoreboard/README.md)) |
| Les redirections | La collection `redirects` existe dans Payload, mais rien ne la sert encore ([infra/README.md](../infra/README.md), « Open points ») ; l'historique : [docs/18-redirections.md](18-redirections.md) | Aucun ancien site n'a été trouvé ; anciens liens éventuels (Linktree, boutique Facebook…) : `[[FACT NEEDED: anciennes adresses à rediriger (research/14 T7)]]` |
| Photos et vidéos originales | `[[FACT NEEDED: emplacement des originaux]]` | Droits : la boutique ; consentement écrit de toute personne visible |
| Les documents de travail | `docs/00` à `docs/19`, `research/`, `data/` | Ce dossier-ci : `docs/10-handover.md` |

## 3. Comment faire tourner le site

**Sur un poste de travail** (Node 22, Postgres 16 ; [README.md](../README.md)) :

```bash
cd apps/web
cp .env.example .env            # DATABASE_URI et PAYLOAD_SECRET
npm ci
npm run migrate && npm run seed
npm run build && npm start      # site : http://localhost:3000 · Studio : http://admin.localhost:3000
npm test                        # tests unitaires
node scripts/gate.mjs           # vérification rank-first : 0 échec sauf les faits manquants
```

**Mettre en ligne** ([infra/README.md](../infra/README.md)) :

| Étape | Comment | Qui |
|---|---|---|
| Préproduction | Fusion dans `main` → construction de l'image → déploiement sur `staging.cocovanillegranby.com` → vérification rank-first sur la préproduction | Automatique |
| Production | GitHub › Actions › « Deploy production » › coller l'empreinte qui tourne en préproduction › approuver | Agence (approbation exigée) |
| Après chaque déploiement | `check-urls` et `crawler-access` lancés de l'extérieur | Automatique |
| Retour arrière | `bash /opt/coco/production/infra/scripts/rollback.sh production` | Agence |
| Déroulement d'un déploiement | Vérifications → image → copie de la base → migration → démarrage de l'autre couleur → contrôle de santé → réchauffement de chaque page du plan du site → bascule de nginx → la couleur précédente reste prête 10 minutes | Automatique |

**Premier déploiement sur un serveur neuf** : les 14 étapes de [infra/README.md](../infra/README.md) (« First deploy, step by step ») : clés SSH, DNS, sécurisation (`harden-vps.sh`), accès au registre d'images, fichiers `.env`, certificats, sauvegardes, environnements GitHub, migrations, préproduction, production, minuteries de sauvegarde, surveillance, montée graduelle de HSTS. **Le premier test de restauration doit réussir avant la mise en ligne.**

**Les procédures courantes**

| Procédure | Document |
|---|---|
| Publier ou modifier une page | [docs/02 §4](02-rythme-hebdo.md) |
| La semaine type, le mois, le trimestre | [docs/02](02-rythme-hebdo.md) |
| Un incident | [docs/09](09-runbook-incident.md) |
| Demander des avis et y répondre | [docs/03-messages-avis.md](03-messages-avis.md) |
| La fiche Google, champ par champ | [docs/05-gbp-checklist.md](05-gbp-checklist.md) |
| La mesure (consoles, GA4, journaux) | [docs/12](12-setup-mesure.md) |
| Rotation des clés (chaque trimestre) | Clé SSH de déploiement, clé des Server Actions (`NEXT_SERVER_ACTIONS_ENCRYPTION_KEY`, même valeur dans GitHub et dans les deux `.env`), secret de rafraîchissement, clés des fournisseurs ([infra/README.md](../infra/README.md)) |

## 4. Ce qui ne se fait jamais

Liens achetés ; avis faux, achetés, récompensés ou triés ; quotas d'avis pour l'équipe ; mots-clés ou deuxième langue dans le nom de la fiche Google ; fausse adresse ou deuxième fiche ; pages en double par ville ; texte caché ou écrit pour les robots ; données structurées pour ce qui n'est pas sur la page ; publications payées sans le dire. La liste complète : [docs/11 §5](11-contrat-clauses.md).

## 5. État à la remise (à remplir le jour de la remise)

| Point | Valeur |
|---|---|
| Date de la remise | `…` |
| Pages indexées : Google · Bing | `… · …` |
| Signaux Web essentiels sur cellulaire : adresses « bonnes » | `… %` |
| Actions manuelles : aucune ☐ · Problèmes de sécurité : aucun ☐ | |
| Dernière mesure (semaine `…`) : SEO · AEO · GEO (questions réussies sur 30) | `… · … · …` |
| Avis Google (nombre, note) à la date de la remise | `…` |
| Faits encore manquants (`owner-todo.md`) | `…` |
| Dernier test de restauration : date, réussite, durée | `…` |
| Certificat : jours restants · domaine : date de renouvellement | `… · …` |
| Incidents ouverts | `…` |

## 6. Contacts utiles

| Pour | Contact |
|---|---|
| Registraire et fournisseur du serveur | `[[FACT NEEDED: soutien du registraire et de l'hébergeur]]` |
| Pannes des fournisseurs | Stripe : [status.stripe.com](https://status.stripe.com) · Twilio : [status.twilio.com](https://status.twilio.com) · AWS : [health.aws.amazon.com](https://health.aws.amazon.com) |
| Juriste (Loi 25, protection du consommateur, Charte de la langue française) | `[[FACT NEEDED: nom et coordonnées (research/14 A5)]]` |
| Comptable (TPS et TVQ) | `[[FACT NEEDED: nom et coordonnées (research/14 A5)]]` |
| Personne responsable des renseignements personnels (Loi 25) | `[[FACT NEEDED: nom, titre, courriel (research/14 A4)]]` |
| Agence | Yahya, BrandHub.ma — `[[FACT NEEDED: téléphone et courriel professionnels de l'agence]]` |

## 7. Le dernier jour du mandat : la liste de fin

1. Transférer le dépôt GitHub et le registre d'images à l'organisation de la boutique (si ce n'est pas déjà fait).
2. Remettre l'historique de mesure, les rapports et les documents à jour ; remplir la section 5.
3. Retirer les accès de l'agence : clés SSH de l'utilisateur `deploy` (la clé personnelle et celle de GitHub, si la boutique reprend les déploiements), Search Console, Bing, GA4, fiche Google, Meta, Apple, comptes des fournisseurs.
4. Changer ensuite toutes les clés et tous les secrets que l'agence a connus (liste de la section 3).
5. Confirmer avec le propriétaire que la clé privée des sauvegardes est dans son gestionnaire et dans le coffre ; faire un dernier test de restauration.
6. Détruire les copies de renseignements personnels que l'agence détient et le confirmer par écrit : à la fin du mandat, le mandataire ne les conserve pas (Loi 25, article 18.3, [docs/11 §6](11-contrat-clauses.md)).

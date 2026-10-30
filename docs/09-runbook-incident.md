# Guide d'incident — Pâtisserie Coco Vanille : trouver la cause en une heure, et quoi faire

Rédigé le jeudi 29 octobre 2026. Six situations, chacune avec ses signes, les 15 premières minutes, l'heure qui suit et ce qu'on ne fait jamais : le site en panne, une baisse dans Google, une vague de mauvais avis, un fait faux dans une réponse d'IA, une fiche Google suspendue, une panne de paiement. Plus les incidents de confidentialité (Loi 25), qui ont leurs propres obligations.

Sources : le protocole d'une heure du skill rank-first (références 11, « diagnostics »), adapté au serveur décrit dans [infra/README.md](../infra/README.md) et dans [research/17 §8](../research/17-vps-self-hosting-and-domain.md).

**Accès nécessaires** (tenus à jour dans [docs/10-handover.md](10-handover.md)) : le serveur (clé SSH de l'utilisateur `deploy`), GitHub Actions, Search Console, Bing Webmaster Tools, la fiche Google, Stripe, Twilio, Amazon SES, les outils de surveillance, Coco Studio (rôle Agence ; le propriétaire pour les décisions).

## 0. Avant tout incident : être prêt

| Préparation | Où | État au 29 octobre 2026 |
|---|---|---|
| Surveillance de disponibilité **hors du serveur** : la page d'accueil, `/svc/health/` (base de données comprise), la page de connexion de Coco Studio, l'expiration du certificat | Better Stack ou Healthchecks.io ([infra/README.md](../infra/README.md), étape 13) | À créer. Alerte à l'agence tout de suite, au propriétaire après 10 minutes de panne. `[[FACT NEEDED: qui reçoit les alertes, sur quel téléphone (research/14 T8)]]` |
| Signaux de vie des tâches de nuit (sauvegarde de 2 h 15, test de restauration du premier lundi à 3 h 30) | Variables `HEARTBEAT_BACKUP_URL` et `HEARTBEAT_RESTORE_TEST_URL` | À créer |
| Erreurs de l'application, sans renseignements personnels | Sentry (`SENTRY_DSN`), données personnelles masquées | À créer |
| Alertes de Google par courriel : actions manuelles, problèmes de sécurité | Search Console : préférences de courriel du propriétaire et de l'agence, toutes les catégories activées | À activer avec la propriété ([docs/12](12-setup-mesure.md)) |
| Registre des incidents (tous) et registre des incidents de confidentialité (Loi 25) | Un document daté tenu par l'agence ; le registre de confidentialité appartient à la boutique | À créer avant la mise en ligne |
| Cibles après une panne, à approuver : au plus 15 minutes de commandes perdues, site rétabli en 2 heures | [research/14 T10](../research/14-owner-questions.md), [research/17 §8.4](../research/17-vps-self-hosting-and-domain.md) | `[[FACT NEEDED: approbation du propriétaire (14 T10)]]` |

**Qui fait quoi pendant un incident**

| Rôle | Fait | Décide |
|---|---|---|
| Agence (Yahya) | Reçoit l'alerte, diagnostique, corrige, consigne | Les gestes techniques (retour à la version précédente, pause d'un service) |
| Propriétaire | Est averti après 10 minutes de panne ; parle aux clients | Les remboursements, les messages publics, la mise en pause des commandes au-delà d'une heure, les avis à la Commission d'accès à l'information |
| Juriste | Conseille | La qualification d'un incident de confidentialité, le contenu d'un avis |

Le texto prévu pour le propriétaire en cas de panne : « Coco Studio : le site ne répond plus depuis 3 min. L'agence est avertie. Les commandes reçues sont en sécurité. » ([research/17 §8.2](../research/17-vps-self-hosting-and-domain.md)).

## 1. Les cinq causes d'une baisse, et le premier contrôle

| Cause | Ce qu'on voit | Premier contrôle |
|---|---|---|
| **Technique** | Chute brutale, souvent proche de zéro, sur beaucoup de pages en même temps | Search Console › Pages ; `robots.txt` ; erreurs du serveur ; un déploiement qui a changé les adresses canoniques, un « noindex » ou une redirection ; une page cachée par la garde de publication |
| **Sécurité** | Avertissements dans les résultats ; pages inconnues indexées ; recherches de pourriel | Search Console › Problèmes de sécurité ; code source des pages clés (liens injectés) |
| **Action manuelle** | Un avis de Google ; une section ou tout le site chute à une date sans mise à jour | Search Console › Actions manuelles |
| **Algorithme** | Baisse progressive ou par paliers à partir d'une date de mise à jour annoncée ; les concurrents changent de place | La page d'état des mises à jour de Google (status.search.google.com) |
| **Demande** | Moins d'impressions, position stable ; saison, actualité, nouvelle présentation des résultats | La saison ([research/04 §6](../research/04-keywords-demand.md)) ; Google Trends ; le rapport « IA générative » |

## 2. Le protocole d'une heure (toute baisse)

1. **Périmètre (15 minutes).** Exporter de Search Console les pages et les requêtes des 28 jours avant et des 28 jours après, puis : `node tools/gsc-diff.mjs avant.csv apres.csv --metric impressions`. Une page, une section, un type de question, ou tout?
2. **Date (10 minutes).** La baisse correspond-elle à un déploiement (historique de GitHub Actions ; `DEPLOYED_AT` dans `state.env` sur le serveur), à une modification de contenu (journal de Coco Studio), à une mise à jour de Google, à une action manuelle, à un changement de saison?
3. **Technique (15 minutes).** Search Console › Inspection de l'URL sur les pages touchées ; `node tools/check-urls.mjs https://cocovanillegranby.com/sitemap.xml` (réponses, redirections, adresses canoniques, « noindex ») ; `node tools/crawler-access.mjs --sitemap https://cocovanillegranby.com/sitemap.xml --max 5` (robots bloqués : vérifier aussi les bannissements automatiques du serveur avec `sudo fail2ban-client status nginx-limit-req`). **Cause propre au site :** un prix effacé, un allergène à revérifier ou un texte qui retrouve un `[[FACT NEEDED]]` fait retirer la page par la garde de publication ; la liste des faits manquants le montre.
4. **Page de résultats (10 minutes).** Chercher les questions touchées depuis un cellulaire à Granby : nouvelle présentation, nouveau concurrent, notre page est-elle encore là?
5. **Décider (10 minutes).** Technique : corriger. Sécurité ou action manuelle : nettoyer, puis une seule demande de réexamen complète. Algorithme : améliorer et attendre. Demande : accepter et recibler.

**Côté Bing et IA** (référence rank-first 11 §5) : cité le mois dernier, absent ce mois-ci → un concurrent a publié des chiffres plus récents, ou Bing a désindexé la page (Copilot s'appuie sur Bing ; ChatGPT passe par des fournisseurs de recherche qu'OpenAI ne nomme pas, [research/18](../research/18-dated-claims-verification.md)), ou on a perdu les sous-questions. Cité par Perplexity mais jamais par ChatGPT → un problème du côté de Bing, ou un manque de mentions par d'autres sites.

**À ne jamais faire pendant une mise à jour de Google** : supprimer des pages sous le coup de la panique, changer des adresses, tout réécrire. On améliore la page touchée selon les questions de Google sur le contenu utile (expérience de première main, information originale, exactitude) et on attend.

## 3. Les six situations

### 3.1 Le site est en panne

- **Signes :** alerte de disponibilité ; des clients appellent ; Coco Studio ne répond plus.
- **Les 15 premières minutes (agence)** :
  ```sh
  ssh deploy@<adresse du serveur>
  cd /opt/coco/production
  docker compose -p coco-production --env-file .env --env-file state.env ps
  bash /opt/coco/production/infra/scripts/rollback.sh production   # si la nouvelle version est en cause
  df -h /                                                          # disque plein?
  dmesg | grep -i oom                                              # mémoire épuisée?
  sudo certbot certificates                                        # certificat expiré?
  ```
  Le retour à la version précédente prend quelques secondes tant qu'elle tourne encore, environ 15 secondes après ([infra/README.md](../infra/README.md), « Rollback »).
- **Pour les clients, pendant ce temps (propriétaire)** : le 450-372-7177 et la fiche Google restent la porte d'entrée. Si la commande en ligne est ouverte et que la panne dure, « Pause des commandes en ligne » dans Coco Studio › Boutique & heures (si Studio répond) ; si tout est en panne plus d'une heure, une publication sur la fiche Google et sur Facebook : « Commandes par téléphone aujourd'hui ».
- **Dans l'heure :** trouver la cause (déploiement, disque, base de données, panne du fournisseur) et la corriger. Disque plein : `docker image prune -a --filter until=336h`, vieux journaux, vieilles copies locales. Migration ratée, en dernier recours : arrêter les processus qui écrivent, restaurer la copie faite avant le déploiement ; les commandes prises depuis disparaissent de la base et se ressaisissent à partir de Stripe ([infra/README.md](../infra/README.md)).
- **Ensuite :** consigner l'incident ; relancer `check-urls` et `crawler-access` ; surveiller Search Console › Pages les jours suivants.
- **Jamais :** déployer une correction sans passer par les vérifications automatiques ; changer des adresses de pages.

### 3.2 Baisse dans Google (positions, clics, appels de la fiche)

- **Signes :** rapport du lundi en baisse ; Search Console ; moins d'appels ou d'itinéraires sur la fiche Google.
- **Avant de réagir :** est-ce réel? Quatre semaines dans la même direction, sinon on attend. Est-ce la saison? Une mise à jour de Google en cours?
- **Puis :** le protocole d'une heure (§2).
- **Pour la fiche Google en particulier :** les heures, la catégorie, le nom et l'adresse n'ont-ils pas été changés (par vous, par un tiers, par une « suggestion » de Google acceptée)? Les avis récents? La fiche est-elle toujours active (§3.5)?

### 3.3 Une vague de mauvais avis

- **Signes :** plusieurs avis de 1 à 3 étoiles en peu de temps. Google vous avertit (application ou courriel de la fiche) ; une fois notés dans Coco Studio (à la main tant que l'accès à l'interface de la fiche n'est pas approuvé), ils remontent parmi les premières cartes d'Aujourd'hui.
- **Deux cas :**
  1. **Un vrai problème** (produit, commande, service) : vous lisez, vous répondez à chacun en moins de 24 heures avec les faits, sans argumenter, et vous réglez en privé. Modèle ([research/11 §4.5](../research/11-offsite-local-citations.md)) : « Bonjour [Prénom], merci de nous l'avoir dit, et désolés : ce n'est pas ce que vous aviez commandé. Pouvez-vous nous joindre au 450-372-7177 avec votre numéro de commande? On veut comprendre et corriger. — L'équipe Coco Vanille ». Coco Studio propose d'appeler le client quand une commande correspond.
  2. **Une vague suspecte** (faux avis, avis hors sujet, attaque) : on signale chaque avis à Google avec les preuves, selon la page d'aide officielle « Remove reviews from your Business Profile » ([support.google.com/business/answer/4596773](https://support.google.com/business/answer/4596773), consultée le 29 octobre 2026 : signaler l'avis ; l'outil de gestion des avis permet de suivre le signalement et, selon Google, une seule contestation). On répond publiquement quand même, calmement.
- **Ensuite :** si c'est une erreur de commande, appliquer la règle du récapitulatif écrit et de la photo de référence avant la production. Deux plaintes « gâteau mal fait » dans un trimestre : la prise des demandes de gâteaux revient au téléphone avec récapitulatif écrit jusqu'à correction ([research/00 §14](../research/00-master-concept.md)).
- **Jamais :** offrir quoi que ce soit pour qu'un avis soit modifié ou retiré ; demander à l'équipe, à la famille ou à des amis de publier des avis ; acheter des avis ; trier qui reçoit la demande d'avis ; répliquer contre un concurrent (Loi sur la concurrence ; règles de Google ; [docs/11 §5](11-contrat-clauses.md)).

### 3.4 Un fait faux dans une réponse d'IA

- **Signes :** la mesure du lundi signale un fait faux ; un client dit « ChatGPT dit que vous êtes ouverts le lundi ». C'est déjà arrivé : le 29 octobre 2026, la réponse à « Coco Vanille Granby heures » donnait les heures et le téléphone de Pain-Pain, une boulangerie fermée, le (450) 770-7246 (déduit), en citant Three Best Rated ; d'autres répétaient « peut-être temporairement fermée » ([research/05 W44.5](../research/05-serp-baseline.md)).
- **Les 15 premières minutes :** capturer le moteur, la date, la question, la réponse et les sources citées.
- **Dans l'heure :** corriger **à la source** : la fiche Google d'abord (c'est l'original que les annuaires copient), puis l'annuaire cité (RestoMontreal, Three Best Rated, Wanderlog, MapQuest…), puis le site (À propos, faits clés, FAQ, données structurées) ; avertir Bing par IndexNow et Google par une demande d'indexation. Les moteurs finissent par répéter la version la plus cohérente (référence rank-first 11 §5).
- **Ensuite :** reposer la même question chaque lundi. Même fait faux dans deux moteurs pendant quatre semaines après la correction : on corrige chaque copie de la liste de [research/11 §1.1](../research/11-offsite-local-citations.md) ([research/00 §14](../research/00-master-concept.md)). Si une IA confond la boutique avec choco.vanille ou le parfum « Coco Vanille », on ajoute une ligne « À ne pas confondre avec… » sur `/a-propos/`.
- **Jamais :** du texte caché ou écrit « pour les IA » sur le site (interdit par les règles de Google : [docs/11 §5](11-contrat-clauses.md)).

### 3.5 La fiche Google est suspendue

- **Signes :** la fiche disparaît de Maps ou de la recherche ; un courriel de Google ; « suspendue » ou « désactivée » dans le tableau de bord ; les appels de la fiche tombent à zéro.
- **Les 15 premières minutes :** ne **pas** créer une nouvelle fiche (un doublon aggrave tout) ; ne pas modifier la fiche à répétition ; lire le motif ; noter les changements récents (nom, catégorie, adresse, site). Un changement de nom pour suivre l'enseigne pourrait déclencher une nouvelle validation : non vérifié ([research/12 §7](../research/12-plan-review.md)).
- **Dans l'heure :** réunir les preuves avant de commencer la contestation : photo de l'enseigne avec le numéro civique, photos de l'intérieur, immatriculation au registre (NEQ 1177082220), permis du MAPAQ, une facture ou le bail au nom de l'entreprise (fournis par le propriétaire), le site qui affiche le même nom, la même adresse et le même téléphone. Puis suivre la page d'aide officielle « Fix suspended or disabled profiles » ([support.google.com/business/answer/4569145](https://support.google.com/business/answer/4569145), consultée le 29 octobre 2026) : une contestation à la fois ; une demande refusée peut obtenir un second examen. Les délais publiés par des sites tiers se contredisent : on n'en promet aucun.
- **Pendant ce temps :** Apple Business, Bing Places, Facebook, `/nous-trouver/` et le téléphone restent exacts ; Facebook et Instagram informent les clients si nécessaire.
- **Prévention :** le nom exact de l'enseigne, sans mot-clé ; une seule fiche ; aucune adresse fictive ; des heures exactes ; l'entente sur les tactiques refusées.

### 3.6 Panne de paiement (et textos ou courriels qui ne partent plus)

- **Signes :** des clients signalent une erreur au paiement ; des commandes restent « en attente de paiement » ; une alerte de Sentry ; la tuile « Système » de Coco Studio.
- **Les 15 premières minutes :** la page d'état de Stripe ([status.stripe.com](https://status.stripe.com)) ; le tableau de bord Stripe (événements et notifications en échec) ; les journaux de l'application : `docker compose -p coco-production --env-file .env --env-file state.env logs --tail 100 web-<couleur>`.
- **Décider :** si le paiement ne fonctionne pas, « Pause des commandes en ligne » dans Coco Studio › Boutique & heures (un geste) ; les commandes par téléphone continuent (Coco Studio › Commandes › téléphone) ; on retarde l'envoi des liens d'acompte.
- **Chaque commande au paiement douteux :** vérifier dans Stripe avant de la préparer. Jamais de commande préparée sans paiement confirmé, jamais de double débit. Les réservations de capacité et les soumissions expirent toutes seules (le processus de fond du serveur s'en charge).
- **Si la boutique annule :** remboursement complet dans les 15 jours (Loi sur la protection du consommateur ; [research/07 1C et §4](../research/07-legal-quebec-compliance.md)) ; Coco Studio affiche une carte « Remboursement à faire » avec la date limite, en tête des cartes d'Aujourd'hui.
- **Textos ou courriels :** la tuile « Système » affiche « Les textos ne partent pas » ; vérifier [status.twilio.com](https://status.twilio.com) ou le tableau de santé d'AWS ([health.aws.amazon.com](https://health.aws.amazon.com)) pour les courriels ; appeler les clients qui ont une cueillette aujourd'hui.
- **Ensuite :** réconcilier chaque paiement de la période avec les commandes ; consigner l'incident.

## 4. Incidents de confidentialité (Loi 25) : fuite de clé, accès non autorisé, site piraté

Ce que dit la loi (texte de la Loi sur la protection des renseignements personnels dans le secteur privé, tel que reproduit par le cabinet Lavery, document sans valeur officielle, [PDF](https://www.lavery.ca/upload/pdf/Publications/Amendee-LPRPSP-FR.pdf) consulté le 29 octobre 2026 ; à confirmer sur Légis Québec par le juriste) :

- **Article 3.5** : l'entreprise qui a des motifs de croire qu'un incident de confidentialité s'est produit « doit prendre les mesures raisonnables pour diminuer les risques qu'un préjudice soit causé et éviter que de nouveaux incidents de même nature ne se produisent ». « Si l'incident présente un risque qu'un préjudice sérieux soit causé, elle doit, avec diligence, aviser la Commission d'accès à l'information » et « toute personne dont un renseignement personnel est concerné par l'incident ».
- **Article 3.8** : « La personne qui exploite une entreprise doit tenir un registre des incidents de confidentialité. »
- **Article 18.3** : le mandataire (ici, l'agence) « doit aviser sans délai le responsable de la protection des renseignements personnels de toute violation ou tentative de violation » des obligations de confidentialité.

| Situation | Premier geste | Ensuite |
|---|---|---|
| Clé ou mot de passe exposé | Changer la clé chez le fournisseur → mettre à jour le fichier `.env` → redéployer ([infra/README.md](../infra/README.md)) | Si des renseignements personnels ont pu être vus : inscrire l'incident au registre, évaluer le risque de préjudice sérieux avec la personne responsable et le juriste ; s'il y a risque, aviser la Commission et les personnes concernées |
| Site piraté | Page de maintenance ; restaurer une sauvegarde saine ; changer tous les mots de passe et toutes les clés ; mettre à jour | Retirer les pages et les liens injectés ; Search Console › Problèmes de sécurité › demander un examen ; surveiller l'index pendant des semaines |
| Accès d'un ancien employé encore actif | Coco Studio › Plus › Réglages : désactiver le compte | Revue des accès le premier vendredi du mois |

## 5. Les commandes utiles, en un coup d'œil (agence)

| Pour | Commande |
|---|---|
| État des services | `docker compose -p coco-production --env-file .env --env-file state.env ps` |
| Revenir à la version précédente | `bash /opt/coco/production/infra/scripts/rollback.sh production` |
| Sauvegarde et test de restauration à la main | `bash /opt/coco/production/infra/scripts/backup.sh production` · `bash /opt/coco/production/infra/scripts/restore-test.sh production` |
| Adresses et redirections | `node tools/check-urls.mjs https://cocovanillegranby.com/sitemap.xml` |
| Accès des robots | `node tools/crawler-access.mjs --sitemap https://cocovanillegranby.com/sitemap.xml --max 5` |
| Avant / après dans Search Console | `node tools/gsc-diff.mjs avant.csv apres.csv --metric impressions` |
| Passages des robots dans les journaux | `node tools/log-bots.mjs access.log --verify --week` |
| Avertir Bing après une correction (une fois le fichier de clé IndexNow servi, [docs/12 §2](12-setup-mesure.md)) | `node tools/indexnow.mjs https://cocovanillegranby.com/<page>/` |

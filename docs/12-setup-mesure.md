# Mise en place de la mesure — Pâtisserie Coco Vanille (une après-midi, couche 17)

Rédigé le jeudi 29 octobre 2026. Ce document liste les réglages exacts : Search Console, Bing Webmaster Tools et IndexNow, GA4 (avec le groupe de canaux « IA » et les événements clés), la fiche Google, les journaux du serveur, la mesure des 33 questions et les accès pour les scripts. Sources : [research/06 (e)(f)(g)](../research/06-seo-aeo-geo-2026-verified.md), [research/plan-v1-ranking-stack.md §11](../research/plan-v1-ranking-stack.md), la référence « mesure » du skill rank-first (10), [research/07](../research/07-legal-quebec-compliance.md), [infra/README.md](../infra/README.md).

**Ce qui fait foi.** La vérité, c'est la base de données de la boutique (commandes, demandes, avis dans Coco Studio), les appels, les gestes sur la fiche Google et les journaux du serveur. GA4 donne une direction, pas un total : avec le consentement obligatoire, il ne voit qu'une partie des visites ([research/12 G8](../research/12-plan-review.md)).

Liens : [docs/02](02-rythme-hebdo.md) (quand on lit quoi), [docs/07](07-rapport-mensuel.md) (le rapport), [docs/13 A20 et A37 à A40](13-taches-humaines.md) (les tâches à faire à la main).

## 0. La règle du consentement (Loi 25), avant tout outil de mesure

| Règle | Détail | Source |
|---|---|---|
| Éteint par défaut | Aucun outil qui suit la navigation (GA4, enregistrement de sessions, pixel publicitaire) ne se charge avant que le visiteur l'accepte. Seuls les témoins essentiels fonctionnent d'office (« Ma boîte », sécurité, mémoire du choix) | Loi 25, art. 8.1 et 9.1 ; [research/07 P2, S6](../research/07-legal-quebec-compliance.md) |
| Mode de consentement de Google « de base » | La balise de Google n'est **pas chargée** avant l'accord. Le mode « avancé » (des signaux envoyés même sans accord) seulement si le juriste l'approuve (question 1 de [research/07 §8](../research/07-legal-quebec-compliance.md)) | [Google, Consent mode](https://developers.google.com/tag-platform/security/concepts/consent-mode) via research/07 L13 |
| La bannière | « Tout refuser » et « Tout accepter » **de même taille et de même style**, plus « Choisir » ; le lien « Témoins » en bas de chaque page rouvre le choix ; l'espace est réservé pour que la page ne saute pas ; la bannière est marquée pour que les moteurs ne la citent pas comme une réponse (`data-nosnippet`) | [research/07 S6](../research/07-legal-quebec-compliance.md) ; plan-v1 couche 2 |
| Rien sur la page de paiement | Aucune balise de mesure sur `/commander/paiement/` (ni `/en/order/checkout/`) : la politique de sécurité de ces pages n'autorise que Stripe | [infra/README.md](../infra/README.md), « Checkout CSP » ; [research/15 D18](../research/15-decisions-and-risks.md) |
| Évaluation avant d'activer | GA4 traite des données hors du Québec : évaluation des facteurs relatifs à la vie privée et entente écrite avant l'activation (art. 17) | [research/07 §2](../research/07-legal-quebec-compliance.md) |
| La page « Témoins » | Elle dit aujourd'hui qu'aucun outil de mesure n'est actif. Le jour où GA4 s'active, on remplit le marqueur « outils de mesure retenus et leurs témoins » | `apps/web/src/seed/content.js` |

Texte de bannière proposé (adapté de [research/07 §7](../research/07-legal-quebec-compliance.md), sans Clarity, qui n'est pas prévu au lancement ; à faire valider par le juriste) :

> « Nous utilisons des témoins essentiels au fonctionnement du site (Ma boîte, sécurité). Avec votre accord, nous utiliserions aussi un outil de mesure d'audience (Google Analytics) qui peut suivre votre navigation. Il reste désactivé tant que vous ne l'activez pas. » [Tout refuser] [Tout accepter] [Choisir]

**État au 29 octobre 2026 :** la bannière et GA4 ne sont **pas encore construits** (prévu). Les liens du site portent déjà leurs étiquettes d'événement : `phone_click` (appeler), `directions_click` (itinéraire), `order_click` (commander).

## 1. Google Search Console

1. **Ajouter la propriété « Domaine »** `cocovanillegranby.com` (elle couvre http, https, www et les sous-domaines). Vérification par un enregistrement TXT chez l'hébergeur DNS (la ligne est prévue dans le tableau DNS de [infra/README.md](../infra/README.md)).
2. **Utilisateurs** : le compte Google de l'entreprise est propriétaire ; l'agence est utilisateur complet ; le compte de service des scripts aussi (§7).
3. **Plan du site** : soumettre `https://cocovanillegranby.com/sitemap.xml`. Il ne contient que les pages publiées : il est vide tant que la garde de publication ne laisse passer aucune page.
4. **Paramètres › contrôle de l'IA générative de la recherche** : laisser « Inclure ». « Exclure » coupe tout trafic et toute impression venant des fonctions d'IA de Google ([research/06 (e)](../research/06-seo-aeo-geo-2026-verified.md)). Contrôle chaque premier vendredi du mois.
5. **Performances › IA générative** : lancé le 3 juin 2026 ; des **impressions seulement** dans l'Aperçu IA, le Mode IA et Discover, par page, pays, appareil et date ; ni clics ni requêtes ([Google Search Central](https://developers.google.com/search/blog/2026/06/gen-ai-performance-reports), via research/06). Noter la valeur de départ. Sa disponibilité pour tous les sites est contestée : l'autotest T4 tranche ([research/06 §4](../research/06-seo-aeo-geo-2026-verified.md)).
6. **Inspection de l'URL › « Demander l'indexation »** : l'accueil, puis chaque nouvelle page.
7. **Préférences de courriel** : toutes les alertes activées (actions manuelles, problèmes de sécurité), pour le propriétaire et pour l'agence.
8. **Propriétés de plateforme** : Instagram (et YouTube quand la chaîne existera), annoncées le 7 juillet 2026 selon des sources secondaires ([research/12 D6](../research/12-plan-review.md)) : à confirmer dans la console.

À lire sans se tromper : on filtre toujours sur `https://cocovanillegranby.com/` (la préproduction et Coco Studio sont exclus de l'index) et sur les questions suivies avant de lire une position moyenne (référence rank-first 10 §5).

## 2. Bing Webmaster Tools, IndexNow et Bing Places

Bing compte pour environ une recherche sur dix au Canada (StatCounter, mai à septembre 2026, [research/06 (b)](../research/06-seo-aeo-geo-2026-verified.md)) et sert Copilot.

1. **Ajouter le site** en l'**important depuis Search Console** (vérification en un clic).
2. **Soumettre le plan du site.**
3. **IndexNow** (un signal qui avertit Bing, Yandex, Naver, Seznam et Yep qu'une page a changé ; Google ne l'utilise pas, [research/06 (h)](../research/06-seo-aeo-geo-2026-verified.md)) : la clé est la variable `INDEXNOW_KEY` du `.env` de production (vide en préproduction, qui n'avertit jamais personne). **À brancher :** le site ne sert pas encore le fichier `https://cocovanillegranby.com/<clé>.txt`, sans lequel IndexNow répond 403, et n'avertit pas encore à la publication. D'ici là : soumission des adresses dans Bing Webmaster Tools. Ensuite : `node tools/indexnow.mjs --key <clé> https://cocovanillegranby.com/<page>/` (réponse attendue : 200 ou 202).
4. **Vérifier** `site:cocovanillegranby.com` dans Bing quelques jours après la mise en ligne.
5. **AI Performance** (aperçu public annoncé le 10 février 2026) : les citations dans Copilot, les résumés d'IA de Bing et certains partenaires ; les requêtes d'ancrage (« grounding queries ») ; **un échantillon**, exportable en CSV seulement ([Microsoft Bing Webmaster blog](https://blogs.bing.com/webmaster/February-2026/Introducing-AI-Performance-in-Bing-Webmaster-Tools-Public-Preview), via research/06 (f)). Lecture chaque lundi, export chaque mois. Autotest T5.
6. **Bing Places** (bing.com/forbusiness) : importé depuis la fiche Google **une fois celle-ci finale** ([research/06 (c)](../research/06-seo-aeo-geo-2026-verified.md)).

## 3. GA4 (prévu, après la bannière de consentement)

1. **Une propriété** dans le compte Google de l'entreprise ; **un flux Web** pour `https://cocovanillegranby.com/` seulement (ni Coco Studio, ni la préproduction).
2. **Chargement** seulement après l'accord du visiteur (mode de base, §0) ; jamais sur les pages de paiement.
3. **Événements clés** (Administration › Événements › marquer comme événement clé) :

| Événement | Quand | État |
|---|---|---|
| `phone_click` | Clic sur un numéro de téléphone | Étiquette déjà présente sur les liens |
| `directions_click` | Clic sur « Itinéraire » (Google Maps, Apple Plans) | Étiquette déjà présente |
| `order_click` | Clic sur « Commander » | Étiquette déjà présente |
| `generate_lead` | Demande de gâteau envoyée | À ajouter |
| `purchase` | Commande payée, **envoyée par le serveur** depuis la confirmation de Stripe, seulement si le consentement enregistré le permet | Prévu, pas encore construit ([research/00 §10.5](../research/00-master-concept.md)) |

   Pas de `whatsapp_click` : pas de WhatsApp au lancement (décision M11).
4. **Le canal « IA »** : GA4 a un canal natif « AI Assistant » (annoncé le 13 mai 2026 selon des sources secondaires). Il **n'inclut pas** l'Aperçu IA ni le Mode IA de Google (qui restent dans la recherche organique) et Perplexity y manque peut-être ([research/06 (g)](../research/06-seo-aeo-geo-2026-verified.md)). On ajoute donc un groupe de canaux personnalisé « IA » (Administration › Paramètres des données › Groupes de canaux), règle « Source de la session » correspond à l'expression régulière (référence rank-first 10 §2) :

   ```
   chatgpt\.com|chat\.openai\.com|openai\.com|perplexity\.ai|pplx\.ai|copilot\.microsoft\.com|bing\.com/chat|gemini\.google\.com|bard\.google\.com|claude\.ai|anthropic\.com|meta\.ai|grok\.com|x\.ai|deepseek\.com|chat\.mistral\.ai|you\.com|duckduckgo\.com/\?.*ia=chat|poe\.com|chatgpt|perplexity
   ```

   Les deux chiffres sont **des minimums** : une visite venue d'une IA sans référent apparaît en « Direct ». Que ChatGPT ajoute `utm_source=chatgpt.com` à ses liens reste à vérifier (autotest 11b de [research/18 §2](../research/18-dated-claims-verification.md)).
5. **Exploration** : les sessions par page d'arrivée pour le canal « IA » (les pages que les moteurs recommandent).
6. **Réglages de confidentialité** : fonctions publicitaires et partage pour la publicité désactivés (aucune publicité au lancement, décision D18) ; durée de conservation des données choisie avec le juriste.

## 4. La fiche Google (et Apple Business)

- **Lien du site**, mot pour mot (plan-v1 §11) : `https://cocovanillegranby.com/?utm_source=google&utm_medium=organic&utm_campaign=business_profile`. Il sépare les visites venues de la fiche de la recherche classique.
- **Dans les commandes** : chaque commande enregistre déjà sa langue et le fait qu'elle vienne du navigateur intégré d'Instagram ou de Facebook. Les étiquettes de suivi (`utm_*`) et la réponse à « Comment nous avez-vous connus? » sont prévues (décision D18, [research/15](../research/15-decisions-and-risks.md)), pas encore enregistrées.
- **Performances de la fiche** : noter le jour 1 (recherches, appels, itinéraires, clics vers le site). Google arrondit ces chiffres et garde un historique limité (référence rank-first 10 §1) : on les recopie chaque mois dans le rapport.
- **Lien d'avis** : copier le lien « demander des avis » de la fiche, puis le coller dans Coco Studio › Plus › Réglages (lien d'avis). C'est la cible de `cocovanillegranby.com/avis`, l'adresse imprimée sous le code QR : la carte ne change jamais, même si le lien change.
- **Section « Commander »** : après l'ouverture de la commande en ligne, un lien personnalisé vers `https://cocovanillegranby.com/commander/`, marqué « préféré pour la cueillette », si Google offre la section pour votre catégorie (autotest T2 ; [research/06 (d)](../research/06-seo-aeo-geo-2026-verified.md)).
- **Apple Business** : action « Commander » vers `https://cocovanillegranby.com/commander/?utm_source=apple&utm_medium=organic` si le formulaire accepte l'étiquette de suivi, sinon l'adresse simple (autotest T3).

## 5. Les journaux du serveur : la preuve que les moteurs lisent le site

- **Le journal du site public** est écrit par nginx sur le serveur (`/var/log/nginx/`, format lisible par `log-bots.mjs`), tourné chaque jour et compressé. Durée proposée : 90 jours bruts, puis seulement des agrégats (à confirmer par le juriste : une adresse IP peut être un renseignement personnel, [research/07 P8](../research/07-legal-quebec-compliance.md)).
- **Chaque premier vendredi du mois** : décompresser les anciens journaux, puis
  `node tools/log-bots.mjs public.access.log --paths /,/carte/,/commander/ --verify --week`.
  Attendu : Googlebot et Bingbot (vérifiés par DNS inverse) chaque semaine sur les pages clés ; au moins deux robots d'IA (OAI-SearchBot, GPTBot, PerplexityBot, Claude-SearchBot, ClaudeBot) au moins une fois. Zéro robot d'IA sur un site qui les autorise, c'est une règle du serveur à corriger.
- **Rien ne bloque les robots** : pas de réseau de diffusion (CDN) au lancement, donc rien n'impose « ai-train=no » à notre insu ; `robots.txt` autorise tous les robots et déclare `Content-Signal: search=yes, ai-input=yes, ai-train=yes`, une préférence qu'aucun moteur ne s'est engagé à respecter ([research/06 (i)](../research/06-seo-aeo-geo-2026-verified.md)). Le choix sur l'entraînement des IA vous appartient (research/14 T9). Les limites de débit du serveur ne doivent jamais bloquer un robot vérifié : `crawler-access.mjs` le contrôle après chaque déploiement.
- **Signaux Web essentiels** (vitesse et stabilité, mesurées au 75e centile des vraies visites : chargement ≤ 2,5 s, réactivité ≤ 200 ms, stabilité ≤ 0,1, [research/06 (p)](../research/06-seo-aeo-geo-2026-verified.md)) : `node tools/cwv.mjs --sitemap https://cocovanillegranby.com/sitemap.xml --max 6` (les données réelles apparaissent quand le site a assez de visites). La mesure sur les visites réelles par le site lui-même est prévue, pas encore construite.

## 6. La mesure des 33 questions

| Moyen | Coût | Ce qu'il mesure |
|---|---|---|
| Search Console (filtrée sur les questions) | 0 $ | Positions moyennes, impressions, clics |
| La vérification sur cellulaire à Granby, chaque lundi (`[[FACT NEEDED: qui (research/14 D1)]]`) | Du temps : ≈ 20 à 30 minutes (est.) | Bloc local, résultats, extrait, « Autres questions posées », Aperçu IA, avec des captures datées |
| Les moteurs d'IA, à la main | Du temps | Marque nommée, site lié, sources citées, faits faux |
| SerpApi réglé sur Granby (`SERPAPI_KEY`) | Formule gratuite de 250 recherches par mois, ou ≈ 25 $ US pour 1 000 (sources secondaires) ; une mesure hebdomadaire d'environ 36 questions demande ≈ 156 recherches par mois (calcul de [research/00 §10.5](../research/00-master-concept.md)) | Positions réelles, extraits, « Autres questions posées », Aperçus IA, bloc local. Toujours avec `--gl ca --domain google.ca --location "Granby,Quebec,Canada"` (sans ces options, l'outil cherche dans google.co.ma : [scoreboard/README §6](../scoreboard/README.md), point 10) |
| Les interfaces des IA (`OPENAI_API_KEY`, `PERPLEXITY_API_KEY`, `GEMINI_API_KEY`, `ANTHROPIC_API_KEY`) | Payé à l'appel : ≈ 495 appels par semaine pour 3 passages (calcul de [research/12 G6](../research/12-plan-review.md)) ; prix : `[[FACT NEEDED: coût par appel]]` | Sources citées, marque nommée, requêtes dérivées, faits repris ou faux. **À corriger avant tout achat de clé** : `ai-runs.mjs` règle sa recherche sur le Maroc ; ses lignes ne comptent pas tant que ce n'est pas corrigé ([scoreboard/README §6](../scoreboard/README.md), point 9) |
| Copilot et le Mode IA de Google | Pas d'interface de programmation : à la main | — |

Les clés vont **seulement** dans les secrets de GitHub (Settings › Secrets and variables › Actions) ; la variable `SITE_LIVE=true` s'ajoute le jour où le site est public. Aucune dépense avant le plafond du budget (research/14 M1) et l'autotest 16 de [research/18 §2](../research/18-dated-claims-verification.md).

## 7. Les accès pour les scripts (compte de service Google, gratuit)

1. console.cloud.google.com : un projet au nom de l'entreprise → « IAM et administration » → Comptes de service → créer → clé JSON.
2. Activer « Google Search Console API » et « Google Analytics Data API » sur le projet.
3. Search Console › Paramètres › Utilisateurs : ajouter l'adresse du compte de service (`…@….iam.gserviceaccount.com`) en accès complet. GA4 › Administration › Gestion des accès : la même adresse en lecteur. Noter l'identifiant numérique de la propriété GA4.
4. La clé JSON devient le secret GitHub `GOOGLE_SERVICE_ACCOUNT_JSON`, et l'identifiant le secret `GA4_PROPERTY_ID`. **Jamais** dans le dépôt, un courriel ou le clavardage.
5. Test : le rapport du lundi suivant contient les sections Search Console et GA4. Le rapport « IA générative » n'est pas dans l'interface de programmation : il se lit dans la console.

## 8. Ce que Coco Studio montre de tout ça

- **Agence › Intégrations** : Stripe, Twilio, Amazon SES, alertes poussées ; la fiche Google y figure comme « API pas encore approuvée : avis et heures à la main », GA4 comme « pas encore relié ».
- **Plus › Cette semaine** : « Appels + itinéraires (site) » attend GA4 ; « Cité par l'IA » attend que les rapports soient déposés sur le serveur.

## 9. C'est fait quand…

- [ ] Search Console et Bing Webmaster Tools vérifiés, plan du site soumis, alertes par courriel activées
- [ ] Contrôle de l'IA générative sur « Inclure » ; valeur de départ du rapport « IA générative » notée
- [ ] Le fichier de clé IndexNow est servi et `indexnow.mjs` répond 200 ou 202
- [ ] La bannière fonctionne : aucune requête vers Google avant l'accord (vérifié dans l'onglet Réseau du navigateur)
- [ ] GA4 : les quatre événements clés marqués ; le groupe de canaux « IA » existe
- [ ] Le lien de la fiche Google porte son étiquette de suivi ; le lien d'avis est dans Coco Studio
- [ ] Quatre mesures hebdomadaires de suite au tableau de bord
- [ ] Le contrôle mensuel des journaux montre Googlebot, Bingbot et au moins deux robots d'IA sur les pages clés
- [ ] Le rapport mensuel sépare les indicateurs avancés et retardés ([docs/07](07-rapport-mensuel.md))

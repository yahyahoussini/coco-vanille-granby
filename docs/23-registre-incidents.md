# Registre des incidents — Pâtisserie Coco Vanille (site, Coco Studio, serveur, fiches)

Gabarit créé le dimanche 1er novembre 2026 par l'Agence (Yahya, BrandHub.ma), le jour où le site devient joignable à une adresse temporaire sur le serveur partagé de l'agence ([docs/09 §6](09-runbook-incident.md)). **Tenu par l'agence.** Aucune ligne au 1er novembre 2026.

Ce registre garde la trace de **tous** les incidents : pannes, déploiements ratés, robots bloqués, fiche Google suspendue, fait faux dans une IA, paiement en panne, et tout écart trouvé par `snapshot.sh` sur le serveur partagé. Un incident qui touche des renseignements personnels s'inscrit **aussi** au registre de confidentialité de la boutique ([docs/24](24-registre-incidents-confidentialite.md)), et l'agence avise sans délai la personne responsable des renseignements personnels (Loi 25, article 18.3, tel que cité dans [docs/09 §4](09-runbook-incident.md)).

Les règles d'écriture :

- une ligne par incident, ouverte dès qu'on le constate, fermée quand la cause est corrigée et la prévention décidée;
- les heures à l'heure du Québec (heure de l'Est);
- des faits, sans nom ni téléphone de client (Loi 25, minimisation) : « 3 commandes en attente », jamais « Mme X »;
- jamais de mot de passe, de clé ou de copie de journal brut ici : un renvoi vers l'endroit où la preuve est gardée.

## Le registre

| N° | Ouvert le (date, heure) | Constaté par, comment | Situation ([docs/09 §3](09-runbook-incident.md)) | Serveur (partagé de l'agence ou de la boutique) | Ce qui a été touché, et combien de temps | Cause | Gestes faits (avec l'heure) | Renseignements personnels touchés? (oui : ligne au [registre de confidentialité](24-registre-incidents-confidentialite.md) et avis à la personne responsable) | Prévention décidée | Fermé le |
|---|---|---|---|---|---|---|---|---|---|---|
| | | | | | | | | | | |

## Ce qu'on en tire chaque mois

Le premier vendredi du mois ([docs/02 §7](02-rythme-hebdo.md)), l'agence relit les lignes du mois : nombre d'incidents, durée totale des pannes, causes qui reviennent. Le rapport mensuel ([docs/07](07-rapport-mensuel.md)) en donne le résumé, sans détail technique inutile. Les cibles après une panne (au plus 15 minutes de commandes perdues, site rétabli en 2 heures) attendent l'approbation de la boutique : `[[FACT NEEDED: approbation du propriétaire (research/14 T10)]]`.

## À la fin du mandat

Le registre fait partie du dossier de transmission ([docs/10 §7](10-handover.md)) : il est remis à la boutique avec le reste, à jour.

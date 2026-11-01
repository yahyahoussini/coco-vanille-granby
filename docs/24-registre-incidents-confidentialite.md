# Registre des incidents de confidentialité (Loi 25) — Pâtisserie Coco Vanille inc.

Gabarit créé le dimanche 1er novembre 2026 par l'Agence, pour la boutique. **Ce registre appartient à la boutique** : « La personne qui exploite une entreprise doit tenir un registre des incidents de confidentialité » (Loi sur la protection des renseignements personnels dans le secteur privé, article 3.8, tel que reproduit par le cabinet Lavery, cité dans [docs/09 §4](09-runbook-incident.md); à confirmer sur Légis Québec par le juriste). La personne responsable des renseignements personnels le tient à jour; l'agence l'aide à le remplir (contrat, [docs/11 §6](11-contrat-clauses.md)). Aucune ligne au 1er novembre 2026.

> **Où le garder.** Ce fichier est le **modèle**. Le registre rempli se garde dans le coffre de la boutique (le gestionnaire de mots de passe partagé, [docs/10](10-handover.md) : `[[FACT NEEDED: lequel, et qui en est propriétaire]]`), **jamais dans le dépôt de code** : une ligne peut décrire des renseignements personnels.

## Ce qui est un incident de confidentialité

L'accès, l'utilisation ou la communication non autorisés d'un renseignement personnel, sa perte, ou toute autre atteinte à sa protection (définition de l'article 3.6, à confirmer par le juriste). Exemples possibles ici : une clé d'accès exposée qui permettait de lire les commandes; une demande de gâteau envoyée à la mauvaise personne; un ancien employé qui garde un accès à Coco Studio; une sauvegarde perdue; un piratage du site ou du serveur partagé de l'agence.

## Ce qu'il faut faire, dans l'ordre ([docs/09 §4](09-runbook-incident.md))

1. **Diminuer le risque tout de suite** (article 3.5) : couper l'accès, changer la clé, retirer la page.
2. **Inscrire la ligne ci-dessous**, même si le risque paraît faible.
3. **Évaluer le risque de préjudice sérieux**, avec la personne responsable et le juriste : quels renseignements, combien de personnes, ce qu'on peut en faire, la probabilité qu'on en fasse un mauvais usage.
4. **S'il y a un risque de préjudice sérieux** : aviser avec diligence la Commission d'accès à l'information et chaque personne concernée (article 3.5). Le juriste rédige les avis.

## Le registre

Les colonnes suivent la proposition de [research/07](../research/07-legal-quebec-compliance.md) (A3 : date, nature, renseignements touchés, personnes touchées, risque de préjudice sérieux oui ou non, Commission avisée oui ou non, mesures). Le contenu exact que la réglementation exige et la durée pendant laquelle chaque ligne doit être gardée : `[[FACT NEEDED: contenu exigé du registre et durée de conservation de chaque ligne, à confirmer par le juriste sur Légis Québec (règlement sur les incidents de confidentialité), le site n'ayant pas pu être lu le 1er novembre 2026]]`.

| N° | Date ou période de l'incident | Date où la boutique l'a appris, et comment | Ce qui s'est passé (circonstances) | Renseignements personnels touchés (sortes, jamais les renseignements eux-mêmes) | Nombre de personnes touchées (ou estimation) | Risque de préjudice sérieux : oui ou non, et pourquoi | Commission avisée : date (ou « non » et pourquoi) | Personnes avisées : date et moyen (ou « non » et pourquoi) | Mesures prises pour diminuer le risque et éviter la répétition | Ligne liée du [registre des incidents](23-registre-incidents.md) | Inscrit par, le |
|---|---|---|---|---|---|---|---|---|---|---|---|
| | | | | | | | | | | | |

## Pendant l'adresse temporaire

Du 1er novembre 2026 au passage au vrai domaine, les renseignements de la boutique (comptes de Coco Studio; demandes de gâteaux et messages « Écrivez-nous » si des clients les envoient à l'adresse temporaire) sont sur le **serveur partagé de l'agence** ([docs/10 §1](10-handover.md), [docs/11 §6](11-contrat-clauses.md)). Un incident sur ce serveur, même causé par une autre application qui y tourne, s'évalue ici s'il a pu toucher les données de Coco Vanille.

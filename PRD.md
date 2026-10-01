# PRD : outil d'aide à la décision sur les formes graphiques

Nom provisoire : à définir Statut : brouillon v0.1, plusieurs points à valider (voir section 10)

## 1. Contexte

Projet de master en design graphique. L'objectif est de concevoir un outil utilisable professionnellement autour des formes graphiques (carré, arrondi, cercle, etc.), y compris leur application aux composants d'interface comme les boutons.

## 2. Problème (à valider)

Choisir une forme (par exemple un bouton carré ou arrondi) se fait souvent à l'instinct ou par imitation, et se justifie mal devant un client ou une équipe. Les outils existants (Figma, etc.) permettent de dessiner une forme, mais pas de savoir laquelle choisir, pourquoi, ni si le résultat est cohérent et accessible.

Reformulation à confirmer : l'outil aide à choisir, comparer et justifier un système de formes.

## 3. Utilisateurs cibles

- Designers UI qui construisent ou font évoluer un design system
- Graphistes qui travaillent une identité de marque

Les deux profils ont le même poids. Le vocabulaire et les exemples de l'outil doivent parler aux deux.

## 4. Objectifs et non-objectifs

Objectifs

- Proposer des familles de formes adaptées à un contexte, avec une justification sourcée
- Vérifier la cohérence d'un système de formes
- Permettre de comparer deux systèmes côte à côte pour argumenter un choix
- Signaler les problèmes d'accessibilité liés aux formes

Non-objectifs

- Remplacer Figma ou un outil de dessin vectoriel
- Proposer un export vers Figma
- Couvrir tous les types de formes existants

## 5. Fonctionnalités

Priorité 0 (cœur de l'outil)

1. Recommandation : l'utilisateur décrit un contexte (secteur, ton de marque, public), l'outil propose des familles de formes avec justification, contextes favorables et contre-indications.
2. Cohérence : vérification des rayons, proportions et imbrications entre éléments (par exemple rayon intérieur = rayon extérieur moins padding).
3. Comparaison A/B : deux systèmes de formes appliqués à une même interface (boutons, cartes, champs), affichés côte à côte.
4. Aperçu en direct : support visuel minimal pour les trois fonctions ci-dessus, pas une fonction mise en avant.

Priorité 1 5. Accessibilité : taille minimale des zones cliquables, lisibilité, contrastes.

Priorité 2 6. Favoris et moodboard pour constituer une grammaire de formes.

Reporté à plus tard

- Wiki des formes (la structure de données ci-dessous doit permettre de l'ajouter sans refonte)

## 6. Périmètre des formes (proposition)

Le catalogue couvre désormais 30 formes en sept catégories : quadrilatères, contours arrondis, formes circulaires, triangles et polygones, lignes et courbes, signes et directions, formes organiques. Les variantes sont décrites dans les fiches ; les arrondis sont identifiés comme styles de contour. Chaque entrée présente ses usages, limites et pistes d’interprétation. Recherche et regroupement préservent la lisibilité ; toutes les formes sont visibles par défaut.

Pour chaque famille, les données incluent : variantes, effets perçus (avec sources), contextes favorables, contre-indications, exemples réels, points d'attention (accessibilité, cohérence).

Les effets perçus seront formulés comme des tendances et non comme des règles, en s'appuyant sur des sources académiques.

## 7. Parcours principaux

1. Je décris mon contexte, je reçois des recommandations justifiées, j'en sélectionne deux à comparer.
2. Je compare deux systèmes de formes sur une interface type, je repère les incohérences, j'ajuste.
3. Je vérifie l'accessibilité de mon choix avant de le présenter.

## 8. Stack technique

- Vite, React, TypeScript
- Tailwind CSS et shadcn/ui
- Pas de backend
- Données des formes dans des fichiers JSON
- Sauvegarde éventuelle via localStorage ou export JSON
- Lib de calcul de couleur et contraste : culori ou colord
- Formes complexes en SVG, rayons pilotés par variables CSS
- Livrable : démo en local

## 9. Direction visuelle

Style minimaliste proche de shadcn, dans la continuité de DA Gen.

- Palette neutre (zinc ou slate), un seul accent utilisé rarement. Les couleurs vives n'apparaissent que dans les contenus manipulés.
- Une seule famille typographique (Inter ou Geist), corps en 14px, titres en font-medium ou semibold, taille maximale raisonnable
- Bordures de 1px discrètes, rayon cohérent, ombres très légères
- Icônes Lucide uniquement
- Textes courts en casse normale, pas de surtitres en majuscules fines et espacées, pas de tiret long, pas d'emoji, pas de formules creuses
- Les tokens shadcn (rayon, bordures, ombres) sont personnalisés à partir de la logique de formes de l'outil pour éviter un rendu générique

## 10. Questions ouvertes

- Le problème exact en une phrase (section 2)
- Le nom de l'outil
- Les critères d'évaluation du master (poids de la recherche par rapport à l'outil)
- Le délai disponible et la taille de l'équipe
- Les variantes et éventuelles extensions du catalogue de 30 formes
- Les sources académiques à utiliser pour les effets perçus

## 11. Critères de succès

- Un utilisateur arrive à une recommandation argumentée en moins de 2 minutes
- La comparaison A/B permet de montrer clairement la différence entre deux systèmes
- Chaque recommandation est justifiée par au moins une source
- L'interface respecte les règles de la section 9 sans écart
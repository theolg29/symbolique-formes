# Forme

Démo locale de l’outil décrit dans [PRD.md](PRD.md), pour choisir, comparer et justifier un système de formes graphiques.

## Lancer la démo

Node.js 22.12 ou supérieur.

```sh
npm ci
npm run dev
```

Ouvrir l’adresse indiquée par Vite, généralement http://localhost:5173.

```sh
npm run build
npm run preview
```

Aucun backend, aucune clé API. Satoshi est chargée directement depuis Fontshare. Les références externes s’ouvrent à la demande.

## Parcours

Les outils sont accessibles indépendamment dans la barre latérale : Recommander, Familles, Comparer, Créer un bouton, Référentiels et Favoris.

1. Commencer par l’écran de contexte : décrire l’usage prévu, le secteur, le ton de marque et le public.
2. Cliquer sur « Recommander une forme » pour afficher sur place la forme la plus adaptée au contexte et sa justification et un aperçu adapté à l’usage (bouton, carte, badge, identité, séparateur, motif ou pictogramme). L’onglet Familles présente séparément le catalogue de 30 formes réparties en sept catégories, sans classement, avec recherche par nom, variante ou évocation, avec leurs effets perçus, limites, variantes et références.
3. Ajouter jusqu’à deux familles à la comparaison. Un compteur dans la navigation indique la sélection ; le bouton devient noir une fois la famille sélectionnée et permet de la retirer. Les explications et références s’ouvrent dans une popup.
4. Retenir une option en comparant la même interface ou la même composition d’identité ; ajuster les rayons, espacements, cibles et couleurs.
5. Créer un bouton à partir d’une famille ou de l’option comparée : modifier le texte, la taille et la graisse, les paddings, l’arrondi, les couleurs et la bordure. Régler les couleurs au repos, au survol, au focus et à l’état désactivé. Les contrôles suivent le bouton et l’état réellement affichés. L’aperçu teste les interactions réelles par défaut ; « Afficher l’état sélectionné » permet de figer la simulation. Les panneaux défilants affichent une barre et un indice tant qu’il reste du contenu à lire. Annuler et rétablir les réglages avec les boutons ou Ctrl/Cmd + Z et Ctrl/Cmd + Maj + Z (les champs gardent leurs raccourcis natifs). L’historique conserve les 50 dernières interactions, sans enregistrer chaque cran d’un même glissement. Exporter le HTML/CSS depuis l’aperçu et copier le code.
6. Constituer une collection de favoris : formes et boutons sont séparés. Enregistrer via la disquette, puis modifier, mettre à jour, renommer ou dupliquer un bouton. La suppression peut être annulée depuis le message pendant sept secondes. La sauvegarde est automatique sur cet appareil. Exporter et importer l’exploration en JSON. Le menu Fichier propose aussi un export PDF via la fenêtre d’impression : choisir « Enregistrer au format PDF ». La synthèse contient le contexte, les systèmes comparés, le bouton personnalisé, leurs contrôles et les références.

Le score de qualité est une pondération éditoriale sur 100 : lisibilité de la taille et de la graisse (20), contraste du texte des trois états actifs (30), repérage du fond ou de la bordure (15), cible minimale (15), cible renforcée (5), présence du libellé (5), contour de focus (10). Les repères typographiques Forme visent 16 px et une graisse de 500 ou plus, sans les présenter comme des exigences RGAA. Le score est plafonné pour un texte inférieur à 10/12/14/16 px à respectivement 25/45/65/90, une graisse inférieure à 400 à 70, un contraste du texte insuffisant à 59, une cible minimale insuffisante à 49, un libellé absent à 20 et un contour de focus insuffisant à 79. Le plus bas plafond s’applique ; des points forts ne compensent pas ces limites. Le détail et les pistes de correction sont accessibles depuis la pastille « Qualité ». Le score ne mesure ni la conversion, ni la performance technique, ni la conformité complète.

Chaque modale de famille propose une carte circulaire des évocations : forme au centre, trois associations cliquables, explication et exemple. Les associations sont éditoriales, sans intensité chiffrée ni émotion garantie ; les références distinguent recherches sur les contours et transpositions de design. Les liens texte externes sont soulignés dès leur affichage ; les liens présentés comme des boutons restent sans soulignement.

## Choix de périmètre

Le nom « Forme » reste provisoire. Le classement est une heuristique éditoriale (usage : 8, ton : 3, secteur : 2, public : 1), pas une mesure scientifique. Les ex æquo suivent l’ordre du catalogue. Chaque famille expose ses références et le niveau d’interprétation.

Les triangles et contours organiques sont appliqués aux signes et motifs. Les composants fonctionnels gardent une géométrie régulière. Pour le cercle, les boutons textuels deviennent des capsules ; les actions iconographiques restent circulaires.

Le contrôle d’imbrication est applicable aux formes carré, rectangle et arrondi léger. Il vérifie un repère de contours concentriques : rayon intérieur = max(0, rayon extérieur − espacement). Les autres familles nécessitent une appréciation visuelle.

Le RGAA 4.1.2 est la dernière version publiée, vérifiée sur le site officiel le 30 septembre 2026. L’atelier référence les critères de contraste 3.2 et 3.3. Les contrastes des états et du contour de focus sont calculés sur le fond choisi. Les composants désactivés sont exemptés des exigences de contraste ; leurs ratios restent informatifs. La navigation clavier, la visibilité du focus dans la page, le sens du libellé et le texte agrandi demandent une vérification manuelle. Les repères WCAG 2.2 de taille sont complémentaires au RGAA.

Les contrôles examinent le texte des actions (4,5:1, ou 3:1 pour le grand texte), le repérage du fond ou de la bordure sur le fond choisi (3:1), et les repères de cibles de 24 × 24 px (AA) et 44 × 44 px (AAA). Les dimensions sont mesurées dans le navigateur avec ResizeObserver après chargement de Satoshi, en tenant compte des angles arrondis. Les exceptions de taille restent à vérifier en contexte. Ils ne remplacent pas un audit WCAG complet. La lisibilité s’évalue visuellement et par des essais utilisateurs.

Les favoris conservent les familles et des snapshots indépendants des boutons, avec leurs états. Les anciens exports JSON restent compatibles. Le wiki et l’export Figma sont hors périmètre, conformément au PRD. Les questions de recherche et critères du master restent à valider.

## Structure

- `src/data/shapes.json` : 30 formes, catégories, usages, variantes, contextes, limites et exemples.
- `src/data/sources.json` : références académiques et WCAG.
- `src/lib/model.ts` : recommandations, contrastes, diagnostics et validation des imports.
- `src/components/system-preview.tsx` : compositions communes aux systèmes A/B.
- `src/components/ui/` : composants shadcn/ui personnalisables.
- `src/App.tsx` : navigation et parcours.
- `src/components/button-workshop.tsx` : éditeur, états, export du code, aperçu interactif et mesures réelles du bouton.
- `src/lib/button-history.ts` : historique borné et regroupement des interactions.
- `src/components/saved-button-card.tsx` : gestion de la bibliothèque de boutons.
- `src/components/recommendation-preview.tsx` : aperçus correspondant à l’usage.
- `docs/design.md` : choix visuels.

## Vérification

```sh
npm test
npx playwright install chromium
npm run test:e2e
```

Les tests unitaires couvrent les contrastes de référence, seuils de taille, imbrications, recommandations et imports invalides. Les tests navigateur couvrent les parcours, la persistance, import/export, clavier, accessibilité automatique et absence de débordement à 375, 768, 1024 et 1440 px.

Les logos des éditeurs de référentiels sont stockés localement dans `public/logos/`, avec leurs URL d’origine. Les états des contrôles utilisent des pastilles pleines et des descriptions accessibles, sans badges de statut visibles.

Les réglages du bouton sont sauvegardés dans le navigateur et inclus dans les exports JSON et PDF. Les anciens fichiers JSON sans bouton restent importables.

L’usage prévu est prioritaire dans la recommandation (8 points, puis ton 3, secteur 2, public 1). Les justifications détaillent les choix correspondants, sans score de confiance artificiel. Les styles de boutons peuvent être enregistrés sous un nom et réappliqués ; ils sont conservés dans l’export JSON. Les anciens exports sans usage ou styles sont importables. Les références comprennent les recommandations Orange. Les émotions et associations des formes sont des interprétations à valider en contexte, distinctes des tendances étudiées.

## Catalogue étendu

Les sept catégories distinguent quadrilatères, contours arrondis, formes circulaires, triangles et polygones, lignes et courbes, signes et directions, formes organiques. Toutes les entrées sont visibles par défaut ; recherche et catégorie permettent de retrouver une forme. Les variantes (orientations, pointillés, nombre de branches…) sont décrites dans la popup.

Les lignes et signes ont un aperçu propre dans les cartes, la comparaison, la roue des évocations et le PDF. Leur ajout à la comparaison ouvre l’aperçu d’identité ; l’aperçu d’interface garde des contrôles réguliers. Le créateur de bouton propose carré, rectangle, arrondi léger et pilule. Si une forme décorative est retenue, il reprend ses couleurs avec un contour régulier, sans simuler un bouton en forme de ligne ou d’étoile. Les anciens favoris et styles restent importables.

Le vocabulaire des nouveaux éléments s’appuie sur le guide pédagogique du Getty Museum, présent dans les référentiels. Les associations émotionnelles sont des pistes éditoriales, pas des résultats scientifiques spécifiques à chaque silhouette.

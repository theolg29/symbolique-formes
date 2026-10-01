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

1. Commencer par l’écran de contexte : décrire le secteur, le ton de marque et le public.
2. Cliquer sur « Recommander une forme » pour afficher sur place la forme la plus adaptée au contexte et sa justification. L’onglet Familles présente séparément le catalogue des six formes, sans classement, avec leurs effets perçus, limites, variantes et références.
3. Ajouter jusqu’à deux familles à la comparaison. Un compteur dans la navigation indique la sélection ; le bouton devient noir une fois la famille sélectionnée et permet de la retirer. Les explications et références s’ouvrent dans une popup.
4. Retenir une option en comparant la même interface ou la même composition d’identité ; ajuster les rayons, espacements, cibles et couleurs.
5. Créer un bouton à partir d’une famille ou de l’option comparée : modifier le texte, la taille et la graisse, les paddings, l’arrondi, les couleurs et la bordure. Les contrôles suivent le bouton réellement affiché.
6. Constituer une collection de favoris. La sauvegarde est automatique sur cet appareil. Exporter et importer l’exploration en JSON. Le menu Fichier propose aussi un export PDF via la fenêtre d’impression : choisir « Enregistrer au format PDF ». La synthèse contient le contexte, les systèmes comparés, le bouton personnalisé, leurs contrôles et les références.

## Choix de périmètre

Le nom « Forme » reste provisoire. Le classement est une heuristique éditoriale (ton : 3, secteur : 2, public : 1), pas une mesure scientifique. Les ex æquo suivent l’ordre du catalogue. Chaque famille expose ses références et le niveau d’interprétation.

Les triangles et contours organiques sont appliqués aux signes et motifs. Les composants fonctionnels gardent une géométrie régulière. Pour le cercle, les boutons textuels deviennent des capsules ; les actions iconographiques restent circulaires.

Le contrôle d’imbrication est applicable aux familles carré et arrondi léger. Il vérifie un repère de contours concentriques : rayon intérieur = max(0, rayon extérieur − espacement). Les autres familles nécessitent une appréciation visuelle.

Le RGAA 4.1.2 est la dernière version publiée, vérifiée sur le site officiel le 30 septembre 2026. L’atelier référence les critères de contraste 3.2 et 3.3. Clavier, focus, états, sens du libellé et texte agrandi demandent une vérification manuelle. Les repères WCAG 2.2 de taille sont complémentaires au RGAA.

Les contrôles examinent le texte des actions (4,5:1, ou 3:1 pour le grand texte), le repérage du fond ou de la bordure sur le fond choisi (3:1), et les repères de cibles de 24 × 24 px (AA) et 44 × 44 px (AAA). Les dimensions sont mesurées dans le navigateur avec ResizeObserver après chargement de Satoshi, en tenant compte des angles arrondis. Les exceptions de taille restent à vérifier en contexte. Ils ne remplacent pas un audit WCAG complet. La lisibilité s’évalue visuellement et par des essais utilisateurs.

Les favoris constituent un moodboard de familles. Le wiki et l’export Figma sont hors périmètre, conformément au PRD. Les questions de recherche et critères du master restent à valider.

## Structure

- `src/data/shapes.json` : six familles, variantes, contextes, limites et exemples.
- `src/data/sources.json` : références académiques et WCAG.
- `src/lib/model.ts` : recommandations, contrastes, diagnostics et validation des imports.
- `src/components/system-preview.tsx` : compositions communes aux systèmes A/B.
- `src/components/ui/` : composants shadcn/ui personnalisables.
- `src/App.tsx` : navigation et parcours.
- `src/components/button-workshop.tsx` : éditeur, aperçu interactif et mesures réelles du bouton.
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

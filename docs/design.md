# Direction de la démo

Le PRD prime sur les recommandations génériques des guides de design.

- Palette neutre : surface #ffffff, navigation #FAFAFA, surfaces secondaires #f5f5f6, texte #27272a, texte secondaire #68686f, bordures #e8e8eb.
- Actions principales noires ; couleurs réservées aux états des contrôles et au compteur de comparaison.
- Une seule famille : Satoshi, chargée par URL Fontshare. Corps de base 14 px, titres plus gras (650 à 700). Informations auxiliaires plus compactes.
- Rayons de l’atelier : contrôles 12 px, panneaux 18 px. L’aperçu utilise les rayons de chaque système.
- Ombres limitées aux contrôles et messages.
- Signature : des silhouettes hachurées sur une surface claire, évoquant un atelier de construction graphique.
- Mise en page : boîte à outils avec une barre latérale de 268 px avec libellés, repliable à 64 px (52 px sur mobile), dans l’esprit de DA. Outils indépendants : recommandations, familles, comparaison, création de bouton, référentiels, favoris. Aucun fil d’Ariane ni étapes numérotées. Le formulaire initial est aligné à gauche, sans panneau autour. Les six familles sont visibles dans l’onglet Familles. Seuls les réglages détaillés de comparaison sont repliés.
- Boutons principaux noirs, actions outline / secondary également noires ; boutons ghost discrets pour la navigation. Dans les familles, les boutons d’ajout sont blancs et passent au noir lorsque la famille est sélectionnée. Mentions de sauvegarde, slogans, logo décoratif et badge de démo supprimés. Nom : Forme.
- États des contrôles : vert (vérifié), orange (à ajuster), bleu (évaluation manuelle), avec une icône blanche sur pastille pleine et une description accessible ; sans badge de statut visible. Les référentiels RGAA / WCAG et les sources académiques sont présentés séparément.
- Vérification : critères ciblés RGAA 4.1.2 ; tailles WCAG 2.2 dans une section complémentaire.
- Explications des familles dans une fenêtre modale avec références, défilement interne et retour du focus à la fermeture.
- Comparaison : même exemple de réservation d’un atelier de céramique dans les deux systèmes ; carte, séance, champ e-mail et bouton. Alternative identité : affiche du même atelier. Les réservations sont fictives. Le survol de suppression colore la croix en rouge sur un fond rouge à 5 %.
- Icônes Lucide ; formes du contenu en SVG.
- Navigation clavier, focus visible, libellés explicites et respect de prefers-reduced-motion.

Transitions : largeur de navigation, arrivée des panneaux, ouverture des réglages et interaction des boutons. Les animations sont désactivées avec prefers-reduced-motion.

Arrondis généraux : boutons et contrôles 12 px, cartes et panneaux 18 px. Graisse des boutons et libellés de navigation : 650. Référentiels d’accessibilité : trois cartes en colonnes avec logos officiels des éditeurs.

Référence visuelle : navigation gris clair, contenu blanc, surfaces arrondies et séparateurs fins. Titres 32 px / 700, navigation 15 px / 650, texte des cartes 13–14 px. Les silhouettes des familles restent la signature de Forme. Mise en page : navigation persistante, titres puis contenu ; aucune décoration de navigateur ni section de tableau de bord. Ombres réservées aux fenêtres et aux interactions discrètes.

Proportions du menu : onglets de 36 px avec 12 px de padding horizontal, icônes 20 px, deux groupes Outils et Ressources dans la même navigation clavier. Accès Fichier en surface blanche en bas. Contenu aligné à gauche avec 80 px de retrait et 88 px en haut sur grand écran ; paddings réduits sur tablette et mobile.

Fond actif et au survol des onglets de navigation : #EDEDED.

Recommander affiche sur place une seule forme issue du contexte, avec justification, références en popup et ajout à la comparaison. Le résultat suit les changements du formulaire. Familles est un catalogue à ordre fixe : aucun classement, badge de premier choix ni justification liée au contexte.

Créer un bouton remplace Contrôler : réglages à gauche, aperçu et contrôles à droite ; empilement sur tablette/mobile. Typographie, padding horizontal/vertical, rayon, couleurs du texte/fond/surface/bordure et épaisseur de bordure sont persistés dans le projet. Les dimensions proviennent du bouton réel (ResizeObserver + chargement des fontes) ; le repère de taille tient compte de l’arrondi. L’option retenue dans Comparer peut amorcer l’atelier. Aucune validation globale de conformité n’est affichée. Les états colorés portent uniquement sur les contrôles ciblés ; les vérifications contextuelles restent manuelles.

Réglages numériques du bouton : six sliders en lignes compactes, avec fond de progression, graduations discrètes et valeur éditable directement. Entrée confirme, Échap annule la saisie ; valeurs bornées aux limites du réglage. Explications de familles soulignées et noires au survol ; références de la popup noires au survol.

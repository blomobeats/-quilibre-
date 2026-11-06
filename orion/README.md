# Orion — application installable

Orion est la carte 3D de tes connaissances. Elle regroupe aussi tes objectifs et projets, le suivi des échecs, de la course et du piano, et un journal. Cette version s'installe sur le téléphone comme Aequo : elle a sa propre icône, s'ouvre en plein écran et fonctionne hors réseau.

Adresse, une fois GitHub Pages activé sur le dépôt : `https://blomobeats.github.io/-quilibre-/orion/`

## Tes données ne sont pas dans ce dépôt

Le dépôt est public, il ne contient donc **aucune donnée personnelle**. L'appli démarre vide. Tes données sont importées sur l'appareil et y restent, dans le stockage du navigateur ; elles ne sont envoyées nulle part.

| Étape | Où | Action |
|---|---|---|
| 1 | Orion sur claude.ai, onglet **Données** | « Exporter pour l'appli téléphone » : un fichier `orion-export-AAAA-MM-JJ.json` |
| 2 | Appli Orion installée | « Importer un export Orion ». Refais-le pour rafraîchir après le bilan du soir. |
| 3 | Appli Orion installée, onglet **Données** | « Exporter mes saisies » : un fichier `orion-saisies-AAAA-MM-JJ.json` |
| 4 | Orion sur claude.ai, onglet **Données** | « Importer des saisies de l'appli » : elles rejoignent la base et le bilan du soir les intègre. |

Chaque saisie a un identifiant unique et peut être rejouée sans créer de doublon. Tu peux donc importer deux fois le même fichier sans risque.

## Installer

- **iPhone** : ouvre l'adresse dans Safari → Partager → **Sur l'écran d'accueil**.
- **Android** : Chrome → menu ⋮ → **Installer l'application**.

La carte 3D a besoin du réseau la première fois, pour charger Three.js. Elle est ensuite gardée en cache.

## Fichiers

| Fichier | Rôle |
|---|---|
| `index.html` | L'application complète : carte 3D, Explorer, Objectifs, Suivi, Journal, Données |
| `manifest.webmanifest` | Nom, icônes et couleurs de l'appli installée |
| `sw.js` | Cache hors réseau, limité au dossier `orion/` pour ne pas toucher à celui d'Aequo |
| `icons/` | Icônes (SVG et PNG 32, 180, 192 et 512 px) |

Si tu changes `index.html`, augmente `VERSION` dans `sw.js` (`orion-v2`, …) pour que les téléphones prennent la nouvelle version.

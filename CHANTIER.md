# Équilibre · BTP — Suivi de chantier TCE

Application web en un seul fichier (`chantier.html`), sans serveur ni abonnement. Elle sert au suivi de chantiers tous corps d'état et se connecte à Outlook / Microsoft 365.

## Fonctions

| Module | Contenu |
|---|---|
| **Chantiers** | Référence (ex. `CH-2026-001`), client/MOA, adresse, dates. Les 20 lots TCE sont générés à la création. |
| **Phases** | Préparation → Installation → Gros œuvre → Clos/couvert → Second œuvre → Finitions → OPR → Réception → Levée des réserves → GPA |
| **Lots & étapes** | Chaque lot a ses étapes (VISA, appro, exécution 50/100 %, autocontrôle, OPR, levée des réserves, DOE). L'avancement se calcule à partir des étapes validées et il est pondéré par le montant du marché. |
| **Planning** | Gantt des lots avec l'avancement réel, le retard en rouge, la ligne « aujourd'hui » et les RDV. |
| **Tâches** | Lot, responsable, échéance, priorité. Relance par e-mail en un clic. |
| **Réunions & CR** | RDV (récurrence hebdomadaire possible), convocations. CR numérotés avec présences, observations par lot (info / action / réserve / décision), avancement et prochaine réunion. Export PDF. |
| **Réserves** | Localisation, échéance de levée, statut. |
| **Intervenants** | Annuaire par chantier : MOA, MOE, entreprises, bureau de contrôle, CSPS… |
| **Journal** | Historique automatique : saisies, automatisations, e-mails importés d'Outlook. |

## Automatisations

Elles s'exécutent à l'ouverture de l'application, puis toutes les 15 minutes tant qu'elle reste ouverte. Le bouton « Exécuter maintenant » les lance à la demande.

1. **Rappel avant réunion** (J-n) : e-mail aux convoqués avec l'ordre du jour et les points ouverts.
2. **Brouillon de CR automatique** après chaque réunion. Les points non soldés du CR précédent et les tâches ouvertes y sont reportés.
3. **Diffusion du CR** à tous les intervenants dès sa validation.
4. **Tâches générées depuis le CR** : chaque observation « Action » devient une tâche, et chaque « Réserve » entre dans la liste des réserves.
5. **Réunion suivante** : créée automatiquement, avec l'invitation Outlook.
6. **Relance des tâches en retard**, à la fréquence choisie.
7. **Alerte de retard de lot** : l'écart entre l'avancement réel et le théorique dépasse le seuil.
8. **Relance des réserves non levées** auprès de l'entreprise du lot.
9. **Rapport hebdomadaire d'avancement** au MOA ou au client.
10. **Synchronisation Outlook** : voir ci-dessous.

## Connexion Outlook (Microsoft Graph)

| Sens | Ce qui est synchronisé |
|---|---|
| App → Outlook | RDV créés dans le calendrier avec invitations aux convoqués ; modification et annulation répercutées. |
| Outlook → App | Les RDV dont le sujet contient la référence du chantier (ex. `[CH-2026-001]`) sont importés, et un déplacement dans Outlook met à jour l'app. |
| App ⇄ To Do | Les tâches vont dans une liste Microsoft To Do « Chantiers ». Une tâche cochée dans Outlook/To Do est soldée dans l'app. |
| Outlook → Journal | Les e-mails reçus qui contiennent la référence du chantier sont ajoutés au journal. |
| Envoi | Rappels, relances, CR et rapports partent depuis votre boîte Outlook (copie dans « Éléments envoyés »). |

### Mise en place (une seule fois)

1. **Héberger l'application en https.** Le plus simple est GitHub Pages : Settings → Pages → branche → `/root`. L'URL sera `https://<compte>.github.io/-quilibre-/chantier.html`. Microsoft refuse l'ouverture locale `file://`.
2. Sur [Microsoft Entra → Inscriptions d'applications](https://entra.microsoft.com/#view/Microsoft_AAD_RegisteredApps/ApplicationsListBlade), cliquez **Nouvelle inscription** :
   - Comptes : « tout annuaire + comptes Microsoft personnels » (ou votre seule organisation)
   - URI de redirection : **Application monopage (SPA)**, avec l'URL exacte de l'application
3. Copiez l'**ID d'application (client)** dans l'onglet *Connexions*, puis cliquez **Se connecter à Microsoft**.
4. Autorisations déléguées demandées : `User.Read`, `Calendars.ReadWrite`, `Mail.Send`, `Mail.Read`, `Tasks.ReadWrite`. En entreprise, l'administrateur doit parfois donner son consentement.

## Autres applications

Dans l'onglet *Connexions*, renseignez une **URL de webhook** (Power Automate, Make, Zapier, n8n). Chaque événement y est envoyé en JSON :

```json
{ "source": "equilibre-chantier", "event": "cr_diffuse", "date": "…", "data": { "chantier": "CH-2026-001", "numero": 4 } }
```

Événements disponibles : `rdv_cree`, `avancement`, `phase`, `tache_creee`, `tache_statut`, `cr_diffuse`, `reserve_levee`, `alerte_retard`, `email`, `test`.

Vous pouvez ainsi relayer vers Teams, Slack, Google Agenda, SharePoint/Excel, un ERP, des SMS, etc.

Sans connexion, deux solutions de repli :
- l'export `.ics`, compatible Outlook, Google et Apple ;
- la **boîte d'envoi** : les e-mails automatiques y attendent, et un clic les ouvre dans votre messagerie.

## Limites

- **Les automatisations ne tournent que lorsque l'application est ouverte** (sur PC ou téléphone), faute de serveur. À la réouverture, l'app rattrape tout ce qui était dû : rappels, CR, relances. Pour des envois garantis même app fermée, il faut soit un flux Power Automate planifié branché sur le webhook, soit un petit backend. C'est l'évolution possible.
- **Les données restent dans le navigateur** (localStorage). Il n'y a pas de synchronisation multi-appareils ni multi-utilisateurs native. Exportez-les régulièrement en JSON (onglet Paramètres) pour les sauvegarder ou les transférer.
- **Les photos ne sont pas stockées** : le stockage du navigateur est limité.

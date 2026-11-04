# Clearfolio Review Hub

SESAME62 — Plateforme B2B de centralisation et validation des documents KYC

1. Présentation du projet

Créer une plateforme SaaS appelée SESAME62, spécialisée dans la centralisation, la collecte, l'organisation et la validation des documents KYC (Know Your Customer).

La plateforme s'adresse aux entreprises qui souhaitent collecter les justificatifs de leurs clients, les examiner et valider ou refuser chaque document depuis une interface administrateur.

L'application doit comporter deux espaces distincts :

Un espace CLIENT permettant de déposer ses documents et de suivre leur validation.

Un espace ADMINISTRATEUR permettant aux entreprises et à leurs collaborateurs de consulter, contrôler, accepter ou refuser les documents transmis.

IMPORTANT : Il s'agit d'un prototype frontend uniquement, sans backend ni base de données distante. Toutes les interactions doivent néanmoins être simulées et fonctionnelles dans le navigateur.

2. Identité visuelle et direction artistique

Créer une identité visuelle professionnelle et reconnaissable pour SESAME62.

L'univers graphique doit évoquer la Fintech, la conformité réglementaire, la confiance et la gestion documentaire.

Espace client : design technologique

Le design client doit être moderne, premium et légèrement futuriste.

Inspirations :

Linear

Stripe

Vercel

Raycast

Interfaces SaaS nouvelle génération.

Palette :

Noir profond.

Bleu nuit.

Blanc cassé.

Gris graphite.

Bleu électrique en accent.

Quelques touches de violet très discrètes.

Utiliser :

Des cartes élégantes.

Des dégradés subtils.

Des animations fluides.

Des icônes modernes.

Des effets de transparence maîtrisés.

Une typographie contemporaine.

Espace administrateur : design bureautique professionnel

ATTENTION : l'interface administrateur doit être visuellement différente de l'espace client.

Elle doit être :

Plus verticale et structurée.

Plus sobre et fonctionnelle.

Plus proche d'un logiciel professionnel de gestion documentaire.

Orientée productivité et traitement de dossiers.

Très lisible, même avec beaucoup de données.

Inspirations :

Logiciels bancaires professionnels.

Interfaces CRM et ERP.

Outils de gestion de conformité.

Tableaux de gestion documentaire.

Palette :

Blanc.

Gris clair.

Bleu marine.

Bleu professionnel.

Vert pour les validations.

Rouge pour les refus.

Orange pour les documents en attente.

Privilégier les tableaux, les listes, les filtres, les panneaux latéraux et les formulaires.

Éviter les effets futuristes et les animations excessives dans cet espace.

3. Landing page

Créer une page d'accueil professionnelle présentant SESAME62.

Header :

Logo SESAME62.

Accueil.

Fonctionnalités.

Solutions entreprises.

À propos.

Bouton « Se connecter ».

Hero section :

Titre :
« Simplifiez la gestion de vos vérifications KYC. »

Sous-titre :
« SESAME62 centralise vos documents administratifs et facilite leur validation grâce à une plateforme unique dédiée aux entreprises et à leurs clients. »

Boutons :

« Accéder à mon espace »

« Découvrir la solution »

Ajouter une illustration de la plateforme avec des documents, des statuts de validation et un aperçu du dashboard.

Ajouter des sections :

Centralisation documentaire.

Gestion simplifiée des justificatifs.

Validation des documents.

Suivi en temps réel.

Une solution pensée pour les entreprises.

4. Connexion

Créer une page de connexion permettant d'accéder à deux environnements :

Espace client.

Espace administrateur.

Pour le prototype, prévoir deux accès de démonstration distincts, sans authentification réelle.

Ajouter :

Adresse e-mail.

Mot de passe.

Bouton de connexion.

Mot de passe oublié.

Navigation de retour à l'accueil.

5. ESPACE CLIENT

Créer un dashboard moderne permettant aux clients de transmettre leurs justificatifs et de suivre leur traitement.

Sidebar

Overview.

My Documents.

Identity.

Professional.

Financial.

Personal.

Other Documents.

Settings.

Logout.

Vue d'ensemble

Afficher :

Message de bienvenue.

Nombre total de documents.

Documents validés.

Documents en attente.

Documents refusés.

Derniers documents ajoutés.

Progression globale du dossier KYC.

Ajouter une barre de progression visuelle.

Gestion des documents

Créer un système d'upload fonctionnel dans le navigateur.

L'utilisateur doit pouvoir :

Glisser-déposer ses documents.

Sélectionner plusieurs fichiers.

Ajouter des PDF, JPG, JPEG et PNG.

Voir le nom du fichier.

Voir une icône correspondant au format.

Voir la date de dépôt.

Voir le statut de validation.

Supprimer un document si son statut le permet.

Catégories :

IDENTITY :

Passport.

National ID.

Driving License.

Residence Permit.

PROFESSIONAL :

Payslip.

Employment Contract.

Employer Certificate.

CV.

FINANCIAL :

Bank Statement.

Tax Notice.

Proof of Income.

PERSONAL :

Proof of Address.

Utility Bill.

Insurance.

Medical Documents.

OTHER :

Miscellaneous Documents.

Statuts des documents côté client

Chaque document doit avoir un statut visible :

🟠 Pending : document transmis et en attente de vérification.

🟢 Approved : document validé par l'administrateur.

🔴 Rejected : document refusé par l'administrateur.

Lorsqu'un document est refusé, afficher également le motif du refus communiqué par l'administrateur.

Lorsqu'un document est validé, afficher une coche verte bien visible sur sa carte.

Lorsqu'un document est refusé, afficher une croix rouge bien visible sur sa carte.

Ces statuts doivent être cohérents avec les décisions prises dans l'espace administrateur.

6. ESPACE ADMINISTRATEUR — PRIORITÉ IMPORTANTE

Créer un véritable espace de gestion professionnelle destiné aux entreprises qui utilisent SESAME62 pour examiner les dossiers de leurs clients.

Cet espace doit être indépendant visuellement du dashboard client.

6.1 Tableau de bord administrateur

Créer une page d'accueil avec des indicateurs :

Total des dossiers clients.

Dossiers en attente de traitement.

Dossiers validés.

Dossiers refusés.

Documents à examiner.

Taux de validation.

Ajouter un tableau des dernières activités.

Ajouter des graphiques simples et professionnels pour visualiser :

Le volume de dossiers traités.

Le nombre de validations.

Le nombre de refus.

Les dossiers en attente.

6.2 Gestion des clients

Créer une rubrique « Clients » avec un tableau professionnel comprenant :

Nom et prénom.

Adresse e-mail.

Identifiant client.

Date d'inscription.

Nombre de documents transmis.

Statut global du dossier KYC.

Prévoir des filtres :

Tous les clients.

Dossiers en attente.

Dossiers validés.

Dossiers incomplets.

Dossiers refusés.

Ajouter une barre de recherche.

Chaque ligne doit être cliquable et permettre d'ouvrir le dossier complet du client.

6.3 Gestion des documents KYC

Créer une rubrique « Documents à vérifier ».

Afficher les documents dans un tableau comprenant :

Nom du client.

Type de document.

Nom du fichier.

Date de transmission.

Statut.

Action.

Ajouter des filtres par catégorie et par statut.

6.4 Interface de vérification d'un document

C'est une fonctionnalité centrale de la plateforme.

Lorsqu'un administrateur clique sur un document, ouvrir une interface de contrôle professionnelle.

Présenter :

Les informations du client.

La catégorie du document.

Le nom du fichier.

Sa date de dépôt.

Son format.

Son statut actuel.

Prévoir une zone centrale affichant une représentation du document.

Si le fichier est un PDF ou une image, permettre un aperçu local dans le navigateur. Sinon, afficher une représentation visuelle avec une icône de fichier.

L'administrateur doit disposer de deux actions principales :

BOUTON VERT : APPROUVER

Lorsqu'il clique sur « Approve Document » :

Le statut passe à Approved.

Une coche verte apparaît sur le document.

La date de validation est enregistrée.

Le dashboard client est automatiquement actualisé.

Le client voit que son document a été validé.

BOUTON ROUGE : REJETER

Lorsqu'il clique sur « Reject Document » :

Ouvrir une fenêtre demandant le motif du refus.

Proposer quelques motifs prédéfinis :

Document illisible.

Document expiré.

Document incomplet.

Informations incohérentes.

Mauvais document transmis.

Autre motif.

Permettre d'ajouter un commentaire personnalisé.

Confirmer le refus.

Le statut passe à Rejected.

Une croix rouge apparaît sur le document.

Le motif du refus devient visible côté client.

6.5 Gestion des dossiers clients

Créer une fiche détaillée par client.

La fiche doit contenir :

Informations générales du client.

Liste complète des documents transmis.

Catégories documentaires.

Statut individuel de chaque document.

Historique des validations et refus.

Commentaires des administrateurs.

Progression globale du dossier.

L'administrateur doit pouvoir visualiser rapidement quels documents sont manquants, validés ou refusés.

6.6 Sidebar administrateur

Créer une navigation verticale professionnelle comprenant :

Dashboard.

Clients.

All KYC Files.

Pending Reviews.

Approved Documents.

Rejected Documents.

Activity Log.

Settings.

Logout.

7. Fonctionnement des interactions entre les deux espaces

C'est un point essentiel.

Même sans backend, les deux espaces doivent communiquer dans le prototype.

Utiliser une simulation frontend avec un état partagé et localStorage.

Exemple de fonctionnement :

Un client se connecte.

Il dépose son passeport.

Le passeport apparaît dans son dashboard avec le statut Pending.

L'administrateur se connecte.

Il retrouve le passeport dans « Pending Reviews ».

Il ouvre le document.

Il clique sur Approve ou Reject.

Le statut est modifié.

Le client retrouve la décision dans son espace personnel.

Les décisions prises par l'administrateur doivent être immédiatement visibles dans l'espace client lors de son actualisation.

Prévoir également des données de démonstration pour avoir plusieurs clients et documents dès la première ouverture.

8. Structure technique

Frontend uniquement.

Ne pas créer de backend distant ni de base de données.

Utiliser :

React.

TypeScript.

Tailwind CSS.

LocalStorage pour les métadonnées et les statuts.

IndexedDB si nécessaire pour conserver temporairement les fichiers locaux.

Toutes les données de démonstration doivent être cohérentes entre les espaces client et administrateur.

Prévoir un système de rôles simulé :

Client.

Administrateur.

Ne pas envoyer les documents vers un serveur.

Ne pas prétendre fournir une véritable vérification d'identité ou un stockage sécurisé.

9. Responsive design

Adapter les deux interfaces :

Ordinateur.

Tablette.

Mobile.

L'espace administrateur doit privilégier l'utilisation sur ordinateur, avec des tableaux lisibles et une navigation verticale.

10. Résultat final attendu

Je veux une plateforme SESAME62 complète et interactive, composée de deux univers complémentaires :

ESPACE CLIENT :
Une interface moderne, premium et technologique, permettant de déposer et de suivre ses documents.

ESPACE ADMINISTRATEUR :
Une interface professionnelle, verticale, sobre et bureautique, permettant aux entreprises de consulter les dossiers clients, vérifier les justificatifs et accepter ou refuser chaque document.

La fonctionnalité la plus importante est la synchronisation simulée des statuts entre les deux espaces.

Un document approuvé doit afficher une coche verte chez le client.

Un document rejeté doit afficher une croix rouge accompagnée du motif du refus.

Ne pas produire une simple maquette statique : toutes les interactions principales doivent fonctionner dans le navigateur.

Le résultat doit être suffisamment abouti pour être présenté à une entreprise comme prototype de solution SaaS B2B.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://clearfolio-review-hub.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/f863041b-0056-54a7-8512-9439b7c6d22f).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```

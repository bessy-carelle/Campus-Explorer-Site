# Campus-Explorer-Site
Projet Jeu de Piste Photo - Organisation des Branches
Ce dépôt GitHub contient le projet de jeu de piste photo, qui permet aux utilisateurs de parcourir un campus et de trouver des endroits spécifiques à partir de photos publiées par des administrateurs. Le projet est structuré en différentes branches pour faciliter le développement et l'intégration de nouvelles fonctionnalités.

# Branches Principales
### 1. main
    • La branche principale contenant la version stable et en production du projet. 
    • Toutes les branches filles seront fusionnées ici après vérification et validation. 
### 2. develop
    • Branche fille de main dédiée aux nouvelles fonctionnalités en cours de développement. 
    • Toutes les sous-branches de develop seront fusionnées ici après vérification et validation.

Stratégie de Merge et Développement
    • Branches filles : Chaque branche fille (par exemple, develop/admin) est dédiée à une fonctionnalité ou à une amélioration spécifique. Une fois la fonctionnalité terminée, elle doit être testée (tests boîte noire et blanche), puis fusionnée dans la branche develop. 
    • Branche principale (main) : Une fois que toutes les fonctionnalités d'une version sont développées et testées, elles sont fusionnées dans main. 

# Tests : Boîte Noire et Boîte Blanche
## Tests Boîte Noire (Black Box Testing)
Ces tests vérifient que les fonctionnalités sont conformes aux spécifications sans analyser le code interne.
### 1. Test : Création d’un compte utilisateur
    • Objectif : Vérifier que l'utilisateur peut créer un compte avec succès. 
    • Résultat attendu : Un message de confirmation est affiché après la création du compte, et l'utilisateur peut se connecter. 
### 2. Test : Navigation entre les pages
    • Objectif : Vérifier que l'utilisateur peut naviguer correctement entre les différentes pages de l'application. 
    • Résultat attendu : L'utilisateur peut passer d'une page à une autre sans erreur. 
### 3. Test : Dépôt d'une photo
    • Objectif : Tester la fonctionnalité de dépôt d'une photo par un utilisateur. 
    • Résultat attendu : La photo est correctement déposée, suit les normes,est validée par l’administrateur, et un message de succès s'affiche. 
### 4. Test : Déconnexion
    • Objectif : Vérifier que l'utilisateur peut se déconnecter de son compte. 
    • Résultat attendu : L'utilisateur est redirigé vers la page d'accueil après la déconnexion, et sa session est terminée. 
### 5. Test : Mise en forme sur chaque écran
    • Objectif : S'assurer que l'interface utilisateur est correctement mise en forme sur chaque écran (desktop, mobile, tablette). 
    • Résultat attendu : Les éléments s'adaptent à toutes les tailles d'écran sans déformation. 

## Tests Boîte Blanche (White Box Testing)
Ces tests vérifient la logique interne du code et la couverture des unités fonctionnelles du système.
### 1. Tests unitaires
    • Objectif : Vérifier le bon fonctionnement des unités de code (fonctions, modules) indépendamment. 
    • Résultat attendu : Chaque fonction et module doit passer les tests unitaires sans erreur. 
### 2. Tests sur la qualité de la photo
    • Objectif : Vérifier que les photos soumises répondent aux critères de qualité (format, taille, résolution). 
    • Résultat attendu : Les photos au mauvais format ou de qualité inférieure sont rejetées avec un message d'erreur explicatif. 


# Technologies utilisées
### 1. Frontend
    • Le frontend de l'application sera développé en HMTL,CSS,JS. React permet de créer une interface utilisateur dynamique et réactive. 
### 2. Backend
    • Le backend est géré avec PHP,MariaDB, offrant un environnement serveur rapide et extensible pour la gestion des requêtes et la logique métier. 
### 3. Polices utilisées
    • Poppins : Utilisée pour les gros titres et les en-têtes importants. 
    • Monospace : Utilisée pour les sous-titres et les éléments textuels secondaires. 


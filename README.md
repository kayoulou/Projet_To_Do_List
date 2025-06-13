Projet : Application Web de Gestion de Tâches (ToDo List)


DESCRIPTION

Cette application web permet de gérer des tâches à travers une interface conviviale. Elle a été développée dans un cadre pédagogique et utilise une architecture fullstack conteneurisée avec Docker.

TECHNOLOGIES UTILISEES
Composant         | Technologie                
|----------------------------------------
| Frontend ------ -> React + Tailwind CSS     
| Backend ---------> Node.js + Express        
| Base de données--> PostgreSQL               
| Déploiement -----> Docker + Docker Compose  



 FONCTIONNALITES DE L'APPLICATION

-  Ajout de tache
-  Modification de tache
-  Suppression de tache
-  Visualisation des taches
-  Sauvegarde en base PostgreSQL



STRUCTURE DU PROJET GIT

- `main` : branche de production contenant le code final validé.
- `develop` : développement de l’application (issue de la branche infrastructure)
- `infrastructure` : contient les fichiers Docker et la configuration.


GESTION AVEC GIT
 Création du dépôt
Le dépôt Git a été créé manuellement sur GitHub via l’interface web à l’adresse suivante :
https://github.com/kayoulou/Projet_To_Do_List.git

# Clonage du dépôt en local
Après création sur GitHub, le projet a été cloné en local pour commencer le développement :

# Cloner le dépôt GitHub
git clone https://github.com/kayoulou/Projet_To_Do_List.git

# Se déplacer dans le dossier du projet
cd Projet_To_Do_List
- Création de la branche infrastructure
Une branche infrastructure a été créée pour isoler la configuration des conteneurs (Docker, docker-compose, NGINX, PostgreSQL) :

# Créer et passer sur la branche infrastructure
git checkout -b infrastructure


# Pousser la branche sur GitHub
git push -u origin infrastructure
- Création de la branche develop
Une fois l’infrastructure en place, une branche develop a été créée à partir de infrastructure pour travailler sur le développement applicatif (frontend et backend) :


# Fusion vers main
 Fusion vers main
Après finalisation et validation des fonctionnalités, la branche develop a été fusionnée dans main :


# Fusionner les changements depuis develop
git merge develop

# Pousser la version stable sur GitHub
git push origin main


INSTALLATION ET CONFIGURATION DES TECHNOLOGIES

  ---FRONTEND------
# Depuis le dossier PROJET_TO_DO_LIST 
  cd PROJET_TO_DO_LIST

 # Créer le projet React avec Vite dans le dossier frontend
  npm create vite@latest frontend -- --template react

# Aller dans le dossier frontend
  cd frontend

# Installer les dépendances React
  npm install axios react-router-dom react-spinners

# Installer Tailwind CSS et ses dépendances
  npm install -D tailwindcss postcss autoprefixer

# Initialiser la configuration Tailwind
  npx tailwindcss init -p

----BACKEND--------
# Se déplacer dans le dossier backend
  cd backend

# Initialiser un projet Node.js
 npm init -y

# Installer les dépendances
 npm install express pg dotenv cors

# Installer nodemon pour le développement
 npm install --save-dev nodemon

-----PostgreSQL--------
# Télécharger l’image officielle PostgreSQL (version 15)

 docker pull postgres:15

# Lancer les conteneurs Docker (dans le dossier du projet)
 docker-compose up --build

# Tester la connexion à PostgreSQL
 docker exec -it db psql -U postgres -c "\l"

# Se connecter manuellement a la DB
 docker exec -it db psql -U postgres

Le fichier init.sql présent dans le dossier backend est automatiquement exécuté au démarrage du conteneur PostgreSQL grâce à la configuration dans docker-compose.yml.
Il crée la  table T_todo nécessaire à l’application 

CREATE TABLE IF NOT EXISTS "T_todo" (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  statut TEXT DEFAULT 'à faire',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

---DOCKER----------

L’infrastructure repose sur Docker et Docker Compose pour faciliter le déploiement et l’isolation des services (frontend, backend, base de données, nginx).


----NGINX----------
Le serveur NGINX permet de centraliser les accès à l’application.
Le fichier de configuration nginx/nginx.conf est utilisé au moment du build 


LANCEMENT DE L'APPLICATION

# Lancer tous les conteneurs depuis le dossier racine du projet :

    docker-compose up --build
# Acceder a l'application via le navigateur : 
        http://localhost:3001


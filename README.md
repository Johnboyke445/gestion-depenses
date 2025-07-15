# Gestionnaire de Dépenses

Une application web simple pour **ajouter**, **visualiser** et **gérer** ses dépenses avec catégories.

---

## Fonctionnalités

-  Ajouter une **catégorie**
-  Ajouter une **dépense** (montant, date, catégorie)
-  Afficher toutes les dépenses
-  Voir les **dépenses par mois**
-  Visualiser les dépenses dans un **graphique**
-  Exporter les dépenses en **PDF**

---

## Technologies utilisées

### Frontend
- NextJS(React) + TypeScript
- Recharts (pour les graphiques)
- jsPDF + jspdf-autotable (pour PDF)

### Backend 
- NestJS
- TypeORM
- PostgreSQL

---

## Prérequis

- Node.js (version 14 ou supérieure)
- npm ou yarn
- PostgreSQL installé et en fonctionnement

---

## Configuration : `.env`

Dans le dossier `backend`, crée un fichier `.env` avec la configuration de ta base PostgreSQL :

DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=ton_utilisateur
DB_PASSWORD=ton_mot_de_passe
DB_DATABASE=nom_de_ta_base

---

## Installation et lancement

### 1. Cloner le dépôt

```bash
git clone https://github.com/Johnboyke445/gestion-depenses.git
cd gestion-depenses
```
---

## Installer les dépendances ( dans le terminal ) 

### Backend 

cd backend
npm install

### Frontend 

cd frontend
npm install

---
###démarrer le Backend

cd backend
npm run start:dev
L’API tourne sur : http://localhost:3001

###démarrer le Frontend

cd Frontend
npm run dev
L’application tourne sur : http://localhost:3000

http://localhost:3000/categories
http://localhost:3000/expenses

 

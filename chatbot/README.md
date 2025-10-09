# 🤖 Chatbot Fiscal – eContribuable

## 🇫🇷 Description (Français)

Ce dossier contient le module **Chatbot** du projet eContribuable.  
Il s’agit d’une application Flask permettant aux contribuables d’interagir avec un chatbot afin d’obtenir des informations fiscales, basées sur un dataset contenant des questions/réponses courantes.

Le chatbot utilise un modèle d’**embeddings** pour rechercher les réponses les plus pertinentes selon la similarité sémantique entre la question de l’utilisateur et les entrées du dataset.

### 📁 Contenu:
- **app.py** → Script principal du chatbot (Flask API)  
- **question.csv** → Dataset original contenant les questions/réponses  
- **question_clean.csv** → Version nettoyée du dataset  
- **embeddings.npy** → Fichier contenant les vecteurs d’embeddings  
- **requirements.txt** → Liste des dépendances Python  

### ⚙️ Exécution:

1. Se déplacer dans le dossier du chatbot :
   
   ```bash
   cd chatbot
   
3. Installer les dépendances :

   ```bash
   pip install -r requirements.txt
   
3. Lancer le serveur Flask :

   ```bash
   python app.py
  
4. L’API sera accessible sur :
http://127.0.0.1:5000

### 🧠 Fonctionnement:

1. Charge le dataset et les embeddings.
2. Reçoit une question utilisateur via une requête HTTP.
3.Calcule la similarité entre la question et le dataset.
4. Retourne la réponse la plus pertinente.



## 🇬🇧 Description (English)

This folder contains the **Chatbot** module of the eContribuable project.
It is a Flask-based application that allows taxpayers to interact with a chatbot to obtain tax-related information, based on a dataset of common questions and answers.

The chatbot uses **embeddings** to find the most relevant answer according to the semantic similarity between the user’s question and the dataset entries.

### 📁 Contents
- **app.py** → Main Flask script for the chatbot
- **questions.csv** → Original dataset with questions and answers
- **questions_clean.csv** → Cleaned dataset
- **embeddings.npy** → File containing the embedding vectors
- **requirements.txt** → Python dependency list

### ⚙️ How to Run

1. Navigate to the chatbot folder :
   
   ```bash
   cd chatbot
   
3. Install dependencies :

   ```bash
   pip install -r requirements.txt
   
3. Run the Flask server :

   ```bash
   python app.py
  
4. The API will be available at :
http://127.0.0.1:5000

### 🧠 How It Works:

1. Loads the dataset and embeddings.
2. Receives a user question through an HTTP request.
3. Computes similarity between the input and stored questions.
4. Returns the most relevant answer.

# 🤖 eContribuable:

## 🇫🇷 Description (Français)

Notre application web fiscale, e-Contribuable, une plateforme permettant aux contribuables de soumettre leurs réclamations, donc instaurer un échange fluide entre les agents fiscaux et les citoyens.

C’est crucial d’avoir et de bien traiter ces réclamations, pour qu’elles sont une alternative modernes aux démarches présentielles, qui sont souvent sources de perte de document, de délais de traitement et de surcharge pour les agents, puisqu’ils posent une difficulté en traitement pour ces agents fiscaux, en comparaison avec des données extraites d’une plateforme bien organisée.

Grâce à e-Contribuable, un contribuable peut soumettre une réclamation à tout moment, en y joignant les documents nécessaire. Il est également capable d’interagir avec un Chatbot, afin d’obtenir des informations fiscales, sans être obligé à effectuer des longues recherches ou contacter directement un responsable.

De leur côté, les agents fiscaux peuvent consulter ces données soumis dans un autre temps, lui donnant un moyen plus moderne et facile pour approuver des réclamations et réviser des documents. Enfin, toutes les conversations entre le Chatbot et les utilisateurs sont tous enregistrées dans la base de données pour être consulter, utiliser et exploiter par les administrateurs à diverses fins.

### 📁 Structure du projet:

frontend/ → Angular app (interfaces utilisateurs)
backend/ → Spring Boot RESTful API
chatbot/ → Flask chatbot avec dataset et embeddings

### 👥 Fonctionnalités principales:

- Soumission de réclamations avec pièces jointes.
- Chatbot fiscal interactif basé sur GPT-2 et un dataset d’exemples de lois.
- Espace administrateur pour la gestion et la validation des réclamations.
- Historique complet des conversations avec le chatbot.

### ⚙️ Comment exécuter:

1. Cloner le projet:
`git clone https://github.com/islemKH3/eContribuable.git`
`cd eContribuable`
3. Exécuter backend: `mvn spring-boot:run`
4. Exécuter frontend: `ng serve`
5. Exécuter chatbot:  
`cd chatbot`
`pip install -r requirements.txt`
`python app.py`

### Dataset:

Contient FAQs et réponse concernant des lois et procédures de fiscalité.  
(Le fichier des embeddings est généré après l'exécusion `app.py`.)

### 🧩 Technologies utilisées:

- Frontend : Angular, TypeScript, HTML, CSS
- Backend : Spring Boot, Java, JPA, MySQL
- Chatbot : Flask, Python, Transformers (GPT-2), NumPy, Pandas
- Base de données : MySQL

### 👩‍💻 Auteur:
Développée par *Islem Khelifi* dans le cadre d’un stage Projet Fin d'Etude au sein de la société Arab Soft.


## 🇪🇳 Description (English)

Our fiscal web application, e-Contribuable, is a platform that allows taxpayers to submit their claims, establishing smooth communication between tax agents and citizens.

It is crucial to handle these claims properly, as they serve as a modern alternative to in-person procedures, which are often sources of document loss, processing delays, and excessive workload for tax agents. Compared to paper-based processes, a well-organized digital platform provides a much easier and more reliable way to manage data.

Thanks to e-Contribuable, a taxpayer can submit a claim at any time and attach the necessary documents. They can also interact with a chatbot to obtain tax-related information without having to perform long searches or directly contact an agent.

On the other hand, tax agents can review these submitted claims later, giving them a modern and efficient way to approve claims and verify documents. Finally, all conversations between the chatbot and users are stored in the database, allowing administrators to consult, analyze, and make use of them for various purposes.

### 📁 Project Structure:

frontend/ → Angular app (user interfaces)
backend/ → Spring Boot RESTful API
chatbot/ → Flask chatbot with dataset and embeddings

### 👥 Key Features:

- Submit claims with document attachments.
- Intelligent tax chatbot (GPT-2 based).
- Admin dashboard for claim management and approval.
- Chatbot conversation history stored in database.

### ⚙️ How to Run:

1. Clone the project:
`git clone https://github.com/your-username/eContribuable.git`
`cd eContribuable`
3. Run backend: `mvn spring-boot:run`
4. Run frontend: `ng serve`
5. Run chatbot:
`cd chatbot`
`pip install -r requirements.txt`
`python app.py`

### Dataset:

Contains FAQs and answers related to tax laws and procedures.
(The embeddings file is generated after running app.py.)

### 🧩 Technologies Used

- Frontend: Angular, TypeScript, HTML, CSS
- Backend: Spring Boot, Java, JPA, MySQL
- Chatbot: Flask, Python, Transformers (GPT-2), NumPy, Pandas
- Database: MySQL

### 👩‍💻 Author:
Developed by *Islem Khelifi* as part of a Final Year Project intership at Arab Soft.

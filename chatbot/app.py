import pandas as pd
from sentence_transformers import SentenceTransformer
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
from flask import Flask, request, jsonify
from flask_cors import CORS

try:
    from transformers import pipeline
    generator = pipeline("text-generation", model="distilgpt2")
except:
    generator = None
    print("⚠️ Transformers non installé ou modèle absent. Génération désactivé.")

df = pd.read_csv("questions.csv", sep=";")

model = SentenceTransformer('paraphrase-multilingual-mpnet-base-v2')

embeddings = model.encode(df['question'].tolist(), convert_to_numpy = True)
np.save("embeddings.npy", embeddings)

df.to_csv("questions_clean.csv", sep=";", index = False)

def find_answer(user_question, threshold=0.6, top_k=3):
    user_embedding = model.encode([user_question], convert_to_numpy=True)
    sims = cosine_similarity(user_embedding, embeddings)[0]
    
    top_indices = sims.argsort()[-top_k:][::-1]
    context = []
    for idx in top_indices:
        if sims[idx] >= threshold:
            context.append(df.iloc[idx]['answer'])

    if context:
        return ". ".join(context)

    if generator:
        prompt = f"""Voici des réponses possible à partir de notre base de données :
        {context}

        Question de l'utilisateur : {user_question}
        Rédige une réponse claire et synthétique, combinant ces information : """

        output = generator(prompt, max_length=200, num_return_sequences=1, temperature=0.7, truncation=True)
        generated = output[0]["generated_text"]

        answer_only = generated.replace(prompt, "").strip()

        if answer_only:
            return answer_only
        
        else:
            return "Désolé, nous ne pouvons pas vous fournir une réponse."


app = Flask(__name__)

CORS(app, resources={r"/*": {"origins": "*"}})

@app.route("/ask", methods=["POST"])
def ask():
    data = request.json
    question = data.get("question", "")
    answer = find_answer(question)
    return jsonify ({"answer": answer})

if __name__ == "__main__":
    app.run(port=5000, debug = True)

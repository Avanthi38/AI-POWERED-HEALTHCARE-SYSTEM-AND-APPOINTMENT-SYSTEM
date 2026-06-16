"""
MediCare AI - ML Symptom Analysis Model
Training script for doctor specialization prediction
"""

import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.naive_bayes import MultinomialNB
from sklearn.pipeline import Pipeline
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, accuracy_score
import pickle
import os

# Training data: symptoms -> specialization
symptom_data = [
    # General Physician
    ("fever and cough", "General Physician"),
    ("high temperature and sore throat", "General Physician"),
    ("cold and runny nose", "General Physician"),
    ("flu symptoms body ache", "General Physician"),
    ("headache and fatigue", "General Physician"),
    ("mild fever and weakness", "General Physician"),
    ("seasonal flu", "General Physician"),
    ("viral infection", "General Physician"),
    ("fever for 3 days", "General Physician"),
    ("cough and cold for a week", "General Physician"),
    
    # Cardiologist
    ("chest pain and shortness of breath", "Cardiologist"),
    ("heart palpitations", "Cardiologist"),
    ("high blood pressure", "Cardiologist"),
    ("chest tightness", "Cardiologist"),
    ("irregular heartbeat", "Cardiologist"),
    ("pain in left arm chest", "Cardiologist"),
    ("heart beating fast", "Cardiologist"),
    ("cardiac symptoms", "Cardiologist"),
    ("heartburn and chest pain", "Cardiologist"),
    ("shortness of breath climbing stairs", "Cardiologist"),
    
    # Dermatologist
    ("skin rash and itching", "Dermatologist"),
    ("acne on face", "Dermatologist"),
    ("red patches on skin", "Dermatologist"),
    ("eczema symptoms", "Dermatologist"),
    ("psoriasis patches", "Dermatologist"),
    ("skin allergy", "Dermatologist"),
    ("hives and bumps", "Dermatologist"),
    ("fungal infection skin", "Dermatologist"),
    ("dry itchy skin", "Dermatologist"),
    ("ringworm infection", "Dermatologist"),
    
    # Ophthalmologist
    ("eye pain and redness", "Ophthalmologist"),
    ("blurry vision", "Ophthalmologist"),
    ("watery eyes", "Ophthalmologist"),
    ("difficulty seeing", "Ophthalmologist"),
    ("eye strain headache", "Ophthalmologist"),
    ("dry eyes irritation", "Ophthalmologist"),
    ("need glasses checkup", "Ophthalmologist"),
    ("cataract symptoms", "Ophthalmologist"),
    ("eye infection", "Ophthalmologist"),
    ("vision problems", "Ophthalmologist"),
    
    # Dentist
    ("tooth pain and sensitivity", "Dentist"),
    ("toothache", "Dentist"),
    ("gum bleeding", "Dentist"),
    ("cavity filling", "Dentist"),
    ("wisdom tooth pain", "Dentist"),
    ("bad breath", "Dentist"),
    ("teeth cleaning", "Dentist"),
    ("mouth ulcer", "Dentist"),
    ("jaw pain", "Dentist"),
    ("dental checkup", "Dentist"),
    
    # Gastroenterologist
    ("stomach pain and nausea", "Gastroenterologist"),
    ("abdominal pain", "Gastroenterologist"),
    ("acid reflux", "Gastroenterologist"),
    ("digestive problems", "Gastroenterologist"),
    ("constipation", "Gastroenterologist"),
    ("diarrhea", "Gastroenterologist"),
    ("food poisoning", "Gastroenterologist"),
    ("vomiting and nausea", "Gastroenterologist"),
    ("loss of appetite", "Gastroenterologist"),
    ("stomach bloating", "Gastroenterologist"),
]

def train_model():
    """Train the symptom classification model"""
    # Prepare data
    X = [item[0] for item in symptom_data]
    y = [item[1] for item in symptom_data]
    
    # Split data
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )
    
    # Create pipeline
    pipeline = Pipeline([
        ('tfidf', TfidfVectorizer(
            ngram_range=(1, 2),
            max_features=1000,
            stop_words='english'
        )),
        ('classifier', MultinomialNB(alpha=0.1))
    ])
    
    # Train model
    pipeline.fit(X_train, y_train)
    
    # Evaluate
    y_pred = pipeline.predict(X_test)
    accuracy = accuracy_score(y_test, y_pred)
    print(f"\nModel Accuracy: {accuracy * 100:.2f}%")
    print("\nClassification Report:")
    print(classification_report(y_test, y_pred))
    
    # Save model
    model_path = os.path.join('backend', 'models', 'symptom_model.pkl')
    os.makedirs(os.path.dirname(model_path), exist_ok=True)
    
    with open(model_path, 'wb') as f:
        pickle.dump(pipeline, f)
    
    print(f"\nModel saved to: {model_path}")
    return pipeline

def load_model():
    """Load the trained model"""
    model_path = os.path.join('backend', 'models', 'symptom_model.pkl')
    
    if os.path.exists(model_path):
        with open(model_path, 'rb') as f:
            return pickle.load(f)
    else:
        print("Model not found. Training new model...")
        return train_model()

def predict_specialization(symptoms: str):
    """Predict doctor specialization from symptoms"""
    model = load_model()
    prediction = model.predict([symptoms.lower()])
    probabilities = model.predict_proba([symptoms.lower()])[0]
    classes = model.classes_
    
    # Get top prediction with confidence
    top_idx = np.argmax(probabilities)
    
    return {
        'specialization': prediction[0],
        'confidence': float(probabilities[top_idx]),
        'all_predictions': [
            {'specialization': classes[i], 'confidence': float(probabilities[i])}
            for i in range(len(classes))
        ]
    }

if __name__ == '__main__':
    print("=" * 50)
    print("MediCare AI - Symptom Analysis Model Training")
    print("=" * 50)
    
    # Train and save model
    model = train_model()
    
    # Test predictions
    print("\n" + "=" * 50)
    print("Testing Predictions:")
    print("=" * 50)
    
    test_cases = [
        "fever and cough",
        "chest pain and shortness of breath",
        "skin rash with itching",
        "eye pain and blurry vision",
        "tooth pain",
        "stomach pain and nausea"
    ]
    
    for symptom in test_cases:
        result = predict_specialization(symptom)
        print(f"\nSymptom: {symptom}")
        print(f"Predicted: {result['specialization']} (confidence: {result['confidence']:.2f})")
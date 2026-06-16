"""
MediCare AI - Flask Backend
Healthcare Appointment System with AI-Powered Symptom Analysis
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager, create_access_token, jwt_required
import os

# Initialize Flask app
app = Flask(__name__)
CORS(app)

# Configuration
app.config['SECRET_KEY'] = 'medicare-ai-secret-key-2024'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///medicare.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Initialize extensions
db = SQLAlchemy(app)
bcrypt = Bcrypt(app)
jwt = JWTManager(app)

# ==================== MODELS ====================

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    phone = db.Column(db.String(20), nullable=False)
    password = db.Column(db.String(200), nullable=False)
    role = db.Column(db.String(20), default='patient')
    created_at = db.Column(db.DateTime, default=db.func.now())

class Doctor(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    specialization = db.Column(db.String(100), nullable=False)
    experience = db.Column(db.Integer, default=0)
    rating = db.Column(db.Float, default=0.0)
    fee = db.Column(db.Integer, default=0)
    image = db.Column(db.String(200))
    about = db.Column(db.Text)
    available = db.Column(db.Boolean, default=True)

class Appointment(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    patient_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    doctor_id = db.Column(db.Integer, db.ForeignKey('doctor.id'))
    date = db.Column(db.String(20), nullable=False)
    time = db.Column(db.String(20), nullable=False)
    status = db.Column(db.String(20), default='pending')
    symptoms = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=db.func.now())

# ==================== ROUTES ====================

# Health check
@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'healthy', 'message': 'MediCare AI API is running'})

# Auth routes
@app.route('/api/auth/register', methods=['POST'])
def register():
    data = request.get_json()
    
    if User.query.filter_by(email=data['email']).first():
        return jsonify({'error': 'Email already registered'}), 400
    
    hashed_password = bcrypt.generate_password_hash(data['password']).decode('utf-8')
    user = User(
        name=data['name'],
        email=data['email'],
        phone=data['phone'],
        password=hashed_password,
        role='patient'
    )
    
    db.session.add(user)
    db.session.commit()
    
    return jsonify({'message': 'User registered successfully'}), 201

@app.route('/api/auth/login', methods=['POST'])
def login():
    data = request.get_json()
    user = User.query.filter_by(email=data['email']).first()
    
    if user and bcrypt.check_password_hash(user.password, data['password']):
        access_token = create_access_token(identity={'id': user.id, 'role': user.role})
        return jsonify({
            'access_token': access_token,
            'user': {
                'id': user.id,
                'name': user.name,
                'email': user.email,
                'role': user.role
            }
        })
    
    return jsonify({'error': 'Invalid credentials'}), 401

# Doctor routes
@app.route('/api/doctors', methods=['GET'])
def get_doctors():
    specialization = request.args.get('specialization')
    
    if specialization:
        doctors = Doctor.query.filter_by(specialization=specialization).all()
    else:
        doctors = Doctor.query.all()
    
    return jsonify([{
        'id': d.id,
        'name': d.name,
        'specialization': d.specialization,
        'experience': d.experience,
        'rating': d.rating,
        'fee': d.fee,
        'image': d.image,
        'about': d.about,
        'available': d.available
    } for d in doctors])

@app.route('/api/doctors/<int:id>', methods=['GET'])
def get_doctor(id):
    doctor = Doctor.query.get_or_404(id)
    return jsonify({
        'id': doctor.id,
        'name': doctor.name,
        'specialization': doctor.specialization,
        'experience': doctor.experience,
        'rating': doctor.rating,
        'fee': doctor.fee,
        'image': doctor.image,
        'about': doctor.about,
        'available': doctor.available
    })

# Appointment routes
@app.route('/api/appointments', methods=['POST'])
@jwt_required()
def create_appointment():
    data = request.get_json()
    appointment = Appointment(
        patient_id=data['patient_id'],
        doctor_id=data['doctor_id'],
        date=data['date'],
        time=data['time'],
        symptoms=data.get('symptoms', ''),
        status='confirmed'
    )
    
    db.session.add(appointment)
    db.session.commit()
    
    return jsonify({'message': 'Appointment created successfully'}), 201

@app.route('/api/appointments/<int:id>', methods=['PUT'])
@jwt_required()
def update_appointment(id):
    appointment = Appointment.query.get_or_404(id)
    data = request.get_json()
    
    if 'status' in data:
        appointment.status = data['status']
    if 'date' in data:
        appointment.date = data['date']
    if 'time' in data:
        appointment.time = data['time']
    
    db.session.commit()
    return jsonify({'message': 'Appointment updated successfully'})

@app.route('/api/appointments/patient/<int:patient_id>', methods=['GET'])
@jwt_required()
def get_patient_appointments(patient_id):
    appointments = Appointment.query.filter_by(patient_id=patient_id).all()
    return jsonify([{
        'id': a.id,
        'doctor_id': a.doctor_id,
        'date': a.date,
        'time': a.time,
        'status': a.status,
        'symptoms': a.symptoms
    } for a in appointments])

# AI Symptom Analysis
@app.route('/api/ml/predict', methods=['POST'])
def predict_specialization():
    data = request.get_json()
    symptoms = data.get('symptoms', '').lower()
    
    # Symptom to specialization mapping
    symptom_map = {
        'fever': 'General Physician',
        'cold': 'General Physician',
        'cough': 'General Physician',
        'flu': 'General Physician',
        'headache': 'General Physician',
        'chest pain': 'Cardiologist',
        'heart': 'Cardiologist',
        'cardiac': 'Cardiologist',
        'skin': 'Dermatologist',
        'rash': 'Dermatologist',
        'acne': 'Dermatologist',
        'eye': 'Ophthalmologist',
        'vision': 'Ophthalmologist',
        'tooth': 'Dentist',
        'teeth': 'Dentist',
        'stomach': 'Gastroenterologist',
        'abdominal': 'Gastroenterologist',
        'nausea': 'Gastroenterologist'
    }
    
    for keyword, specialization in symptom_map.items():
        if keyword in symptoms:
            return jsonify({
                'specialization': specialization,
                'confidence': 0.95,
                'symptoms': symptoms
            })
    
    return jsonify({
        'specialization': 'General Physician',
        'confidence': 0.5,
        'symptoms': symptoms
    })

# ==================== ADMIN ROUTES ====================

@app.route('/api/admin/doctors', methods=['POST'])
@jwt_required()
def add_doctor():
    data = request.get_json()
    doctor = Doctor(
        name=data['name'],
        specialization=data['specialization'],
        experience=data.get('experience', 0),
        rating=data.get('rating', 0.0),
        fee=data.get('fee', 0),
        image=data.get('image'),
        about=data.get('about'),
        available=True
    )
    
    db.session.add(doctor)
    db.session.commit()
    
    return jsonify({'message': 'Doctor added successfully'}), 201

@app.route('/api/admin/doctors/<int:id>', methods=['PUT'])
@jwt_required()
def update_doctor(id):
    doctor = Doctor.query.get_or_404(id)
    data = request.get_json()
    
    for key in ['name', 'specialization', 'experience', 'rating', 'fee', 'image', 'about', 'available']:
        if key in data:
            setattr(doctor, key, data[key])
    
    db.session.commit()
    return jsonify({'message': 'Doctor updated successfully'})

@app.route('/api/admin/doctors/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_doctor(id):
    doctor = Doctor.query.get_or_404(id)
    db.session.delete(doctor)
    db.session.commit()
    return jsonify({'message': 'Doctor deleted successfully'})

@app.route('/api/admin/stats', methods=['GET'])
@jwt_required()
def get_stats():
    return jsonify({
        'total_users': User.query.count(),
        'total_doctors': Doctor.query.count(),
        'total_appointments': Appointment.query.count(),
        'pending_appointments': Appointment.query.filter_by(status='pending').count()
    })

# ==================== INIT DATABASE ====================

def init_db():
    with app.app_context():
        db.create_all()
        
        # Add sample doctors if none exist
        if Doctor.query.count() == 0:
            sample_doctors = [
                Doctor(name='Dr. Sarah Johnson', specialization='General Physician', 
                       experience=15, rating=4.9, fee=500, 
                       image='https://randomuser.me/api/portraits/women/44.jpg',
                       about='Experienced general physician'),
                Doctor(name='Dr. Michael Chen', specialization='Cardiologist',
                       experience=20, rating=4.8, fee=800,
                       image='https://randomuser.me/api/portraits/men/32.jpg',
                       about='Board-certified cardiologist'),
                Doctor(name='Dr. Emily Watson', specialization='Dermatologist',
                       experience=12, rating=4.7, fee=600,
                       image='https://randomuser.me/api/portraits/women/65.jpg',
                       about='Specialized in medical dermatology'),
                Doctor(name='Dr. James Wilson', specialization='Ophthalmologist',
                       experience=18, rating=4.9, fee=700,
                       image='https://randomuser.me/api/portraits/men/45.jpg',
                       about='Expert in cataract surgery'),
                Doctor(name='Dr. Lisa Brown', specialization='Dentist',
                       experience=10, rating=4.6, fee=400,
                       image='https://randomuser.me/api/portraits/women/33.jpg',
                       about='General dentist'),
                Doctor(name='Dr. Robert Martinez', specialization='Gastroenterologist',
                       experience=14, rating=4.8, fee=750,
                       image='https://randomuser.me/api/portraits/men/22.jpg',
                       about='Specialist in digestive disorders')
            ]
            
            for doctor in sample_doctors:
                db.session.add(doctor)
            
            db.session.commit()
            print("Sample doctors added to database")

if __name__ == '__main__':
    init_db()
    app.run(debug=True, port=5000)
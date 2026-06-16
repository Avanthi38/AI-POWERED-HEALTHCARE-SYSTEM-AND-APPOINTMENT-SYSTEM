# MediCare AI - Healthcare Appointment System

A comprehensive AI-powered healthcare appointment system with intelligent symptom analysis, doctor recommendations, and seamless appointment booking.

## Features

### 🎯 Role-Based Access
- **Patient Portal**: Book appointments, view history, manage health
- **Doctor Portal**: Manage schedules, accept/reject appointments, update availability
- **Admin Portal**: System management, analytics, doctor/patient management

### 🤖 AI-Powered Features
- Intelligent symptom analysis using machine learning
- Automatic doctor specialization recommendation
- Smart appointment scheduling

### 📋 Patient Features
- User registration and login
- Symptom input with AI analysis
- Browse and filter doctors by specialization
- View doctor profiles, ratings, fees, and availability
- Book appointments with date/time selection
- View and manage appointments (cancel/reschedule)
- Profile management

### 🩺 Doctor Features
- Dashboard with today's schedule
- Appointment requests management
- Accept/reject appointments
- Update availability
- Patient history view

### ⚙️ Admin Features
- Dashboard with system analytics
- Doctor management (add/edit/delete)
- Patient management
- Appointment overview
- Reports and statistics

## Tech Stack

### Frontend
- React 18 with TypeScript
- Vite for fast development
- Tailwind CSS for styling
- React Router for navigation
- Lucide React for icons

### Backend (Optional)
- Python Flask
- SQLAlchemy ORM
- Flask-JWT for authentication
- Flask-CORS for cross-origin support
- SQLite database

### ML
- Scikit-learn for symptom classification
- TF-IDF vectorization
- Naive Bayes classifier

## Getting Started

### Frontend Only (React)
```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

### Full Stack (With Flask Backend)
```bash
# Navigate to backend
cd backend

# Install Python dependencies
pip install flask flask-cors flask-sqlalchemy flask-bcrypt flask-jwt-extended scikit-learn

# Run Flask server
python app.py

# In another terminal, run React
npm run dev
```

## Project Structure

```
├── src/
│   ├── App.tsx          # Main application with all pages
│   └── main.tsx         # React entry point
├── backend/
│   ├── app.py           # Flask API server
│   └── train_model.py   # ML model training
├── index.html           # HTML entry point
├── SPEC.md              # Project specification
└── README.md            # This file
```

## Demo Credentials

| Role   | Email                  | Password |
|--------|------------------------|----------|
| Admin  | admin@medicare.ai      | admin123 |
| Patient| any@email.com          | (any)    |
| Doctor | any@email.com          | (any)    |

## AI Symptom Mapping

| Symptoms | Recommended Specialist |
|----------|----------------------|
| Fever, Cold, Cough | General Physician |
| Chest Pain, Heart Issues | Cardiologist |
| Skin Rash, Acne | Dermatologist |
| Eye Problems, Vision | Ophthalmologist |
| Tooth Problems | Dentist |
| Stomach Pain, Digestion | Gastroenterologist |

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Doctors
- `GET /api/doctors` - List all doctors
- `GET /api/doctors/:id` - Get doctor details

### Appointments
- `POST /api/appointments` - Create appointment
- `PUT /api/appointments/:id` - Update appointment
- `GET /api/appointments/patient/:id` - Get patient appointments

### AI/ML
- `POST /api/ml/predict` - Predict specialization from symptoms

### Admin
- `POST /api/admin/doctors` - Add doctor
- `PUT /api/admin/doctors/:id` - Update doctor
- `DELETE /api/admin/doctors/:id` - Delete doctor
- `GET /api/admin/stats` - Get system statistics

## Design Features

- Modern healthcare-themed UI with blue/white color scheme
- Responsive design for all screen sizes
- Smooth animations and transitions
- Professional doctor cards with ratings
- Step-by-step booking wizard
- Dashboard analytics cards
- Sidebar navigation

## License

MIT License - Feel free to use this project for educational purposes.
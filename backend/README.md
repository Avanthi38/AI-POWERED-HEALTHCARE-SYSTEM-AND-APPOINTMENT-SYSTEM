# MediCare AI - Backend API Documentation

## Setup Instructions

### 1. Create Virtual Environment (Recommended)
```bash
cd backend
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate
```

### 2. Install Dependencies
```bash
pip install -r requirements.txt
```

### 3. Run the Server
```bash
python app.py
```

The server will start at `http://localhost:5000`

### 4. Initialize Database
The database will be automatically created on first run with sample doctors.

## API Reference

### Base URL
```
http://localhost:5000/api
```

### Authentication

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "1234567890",
    "password": "password123"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
    "email": "john@example.com",
    "password": "password123"
}
```

Response:
```json
{
    "access_token": "eyJhbGciOiJIUzI1NiIs...",
    "user": {
        "id": 1,
        "name": "John Doe",
        "email": "john@example.com",
        "role": "patient"
    }
}
```

### Doctors

#### Get All Doctors
```http
GET /api/doctors
```

Optional query parameter: `?specialization=Cardiologist`

#### Get Single Doctor
```http
GET /api/doctors/:id
```

### Appointments

#### Create Appointment
```http
POST /api/appointments
Authorization: Bearer <token>
Content-Type: application/json

{
    "patient_id": 1,
    "doctor_id": 1,
    "date": "2024-12-20",
    "time": "10:00 AM",
    "symptoms": "Fever and cough"
}
```

#### Update Appointment
```http
PUT /api/appointments/:id
Authorization: Bearer <token>
Content-Type: application/json

{
    "status": "confirmed"
}
```

#### Get Patient Appointments
```http
GET /api/appointments/patient/:patient_id
Authorization: Bearer <token>
```

### AI/ML

#### Predict Specialization
```http
POST /api/ml/predict
Content-Type: application/json

{
    "symptoms": "fever and cough for 3 days"
}
```

Response:
```json
{
    "specialization": "General Physician",
    "confidence": 0.95,
    "symptoms": "fever and cough for 3 days"
}
```

### Admin

#### Add Doctor
```http
POST /api/admin/doctors
Authorization: Bearer <token>
Content-Type: application/json

{
    "name": "Dr. New Doctor",
    "specialization": "Cardiologist",
    "experience": 10,
    "rating": 4.5,
    "fee": 800,
    "image": "https://example.com/photo.jpg",
    "about": "Experienced cardiologist"
}
```

#### Update Doctor
```http
PUT /api/admin/doctors/:id
Authorization: Bearer <token>
Content-Type: application/json

{
    "fee": 900,
    "available": true
}
```

#### Delete Doctor
```http
DELETE /api/admin/doctors/:id
Authorization: Bearer <token>
```

#### Get Statistics
```http
GET /api/admin/stats
Authorization: Bearer <token>
```

## Database Schema

### User
| Field | Type | Description |
|-------|------|-------------|
| id | Integer | Primary key |
| name | String | Full name |
| email | String | Unique email |
| phone | String | Phone number |
| password | String | Hashed password |
| role | String | patient/doctor/admin |
| created_at | DateTime | Registration date |

### Doctor
| Field | Type | Description |
|-------|------|-------------|
| id | Integer | Primary key |
| name | String | Doctor name |
| specialization | String | Medical specialization |
| experience | Integer | Years of experience |
| rating | Float | Average rating |
| fee | Integer | Consultation fee |
| image | String | Profile image URL |
| about | Text | Bio description |
| available | Boolean | Availability status |

### Appointment
| Field | Type | Description |
|-------|------|-------------|
| id | Integer | Primary key |
| patient_id | Integer | Foreign key to User |
| doctor_id | Integer | Foreign key to Doctor |
| date | String | Appointment date |
| time | String | Appointment time |
| status | String | pending/confirmed/completed/cancelled |
| symptoms | Text | Patient symptoms |
| created_at | DateTime | Booking date |

## Error Handling

All errors return JSON in format:
```json
{
    "error": "Error message description"
}
```

HTTP Status Codes:
- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 404: Not Found
- 500: Internal Server Error

## Security

- Passwords are hashed using bcrypt
- JWT tokens are required for protected routes
- CORS is enabled for cross-origin requests
- Input validation on all endpoints

## Demo Admin Credentials

Email: admin@medicare.ai
Password: admin123

## Running ML Model Training

```bash
python train_model.py
```

This will train the symptom classification model and save it to `models/symptom_model.pkl`
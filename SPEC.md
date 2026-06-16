# AI Healthcare Appointment System - Specification

## 1. Concept & Vision

A comprehensive, professional healthcare appointment system that leverages AI for symptom analysis and doctor recommendations. The platform provides a seamless experience for patients to book appointments, doctors to manage their schedules, and administrators to oversee the entire system. The design embodies trust, professionalism, and medical excellence with a calming healthcare aesthetic.

## 2. Design Language

### Aesthetic Direction
Modern hospital-style interface with clean lines, professional imagery, and a calming blue-white color scheme that evokes trust and medical professionalism.

### Color Palette
- **Primary Blue**: #2563EB (trust, medical)
- **Secondary Blue**: #1E40AF (depth)
- **Accent Teal**: #0D9488 (health, freshness)
- **Success Green**: #10B981 (confirmations)
- **Warning Orange**: #F59E0B (alerts)
- **Error Red**: #EF4444 (errors)
- **Background Light**: #F8FAFC
- **Background White**: #FFFFFF
- **Text Primary**: #1E293B
- **Text Secondary**: #64748B

### Typography
- **Headings**: Inter (600-700 weight)
- **Body**: Inter (400-500 weight)
- **Fallback**: system-ui, sans-serif

### Spatial System
- Base unit: 4px
- Spacing scale: 4, 8, 12, 16, 24, 32, 48, 64px
- Border radius: 8px (cards), 12px (buttons), 16px (modals)
- Shadow: soft shadows for elevation

### Motion Philosophy
- Smooth transitions (200-300ms ease)
- Page transitions with fade-in
- Card hover lift effects
- Button press feedback
- Loading spinners and skeleton states

## 3. Layout & Structure

### Page Structure
1. **Role Selection Page** - Clean landing with three prominent role cards
2. **Login/Register Pages** - Centered forms with healthcare branding
3. **Dashboards** - Sidebar navigation + main content area
4. **Booking Flow** - Step-by-step wizard with progress indicator

### Responsive Strategy
- Mobile-first approach
- Breakpoints: 640px (sm), 768px (md), 1024px (lg), 1280px (xl)
- Collapsible sidebar on mobile
- Stack cards vertically on small screens

## 4. Features & Interactions

### Patient Module
- **Registration**: Name, email, phone, password, confirm password
- **Login**: Email/password with remember me
- **Forgot Password**: Email-based reset flow
- **Dashboard**: Welcome message, stats cards, quick actions
- **Symptom Input**: Text area with suggested symptoms
- **AI Recommendation**: Show matched specialization
- **Doctor Selection**: Filterable doctor cards with availability
- **Booking**: Date/time selection with confirmation
- **My Appointments**: View, cancel, reschedule

### Doctor Module
- **Login**: Email/password
- **Dashboard**: Today's schedule, pending requests
- **Appointment Management**: Accept/reject with time slots
- **Availability**: Set working hours and break times
- **Profile**: Update specialization, fees, about

### Admin Module
- **Login**: Admin credentials
- **Dashboard**: System analytics, recent activity
- **Doctor Management**: CRUD operations
- **Patient Management**: View and manage users
- **Appointments**: Overview and filtering
- **Reports**: Statistics and visualizations

## 5. Component Inventory

### Buttons
- Primary: Blue background, white text, hover darken
- Secondary: White background, blue border, hover fill
- Danger: Red background for destructive actions
- Disabled: Gray, reduced opacity, no pointer

### Cards
- Doctor Card: Image, info, rating stars, fee, book button
- Appointment Card: Date/time, doctor info, status badge
- Stats Card: Icon, number, label, trend indicator

### Forms
- Input fields with floating labels
- Validation states (success/error)
- Select dropdowns with custom styling
- Textarea for symptom description

### Navigation
- Sidebar: Logo, nav items with icons, user menu
- Top bar: Page title, breadcrumbs, notifications

### Modals
- Confirmation dialogs
- Form modals for quick actions
- Alert modals for important messages

## 6. Technical Approach

### Frontend (React + Vite + Tailwind)
- Component-based architecture
- React Router for navigation
- Context API for state management
- LocalStorage for data persistence (simulated backend)

### ML Model (Scikit-learn)
- TF-IDF vectorization for symptom text
- Classification model for doctor specialization
- Trained on symptom-specialization mapping
- Real-time prediction on user input

### Data Model
- Users: id, name, email, phone, password, role
- Doctors: id, name, specialization, experience, rating, fee, availability
- Appointments: id, patient_id, doctor_id, date, time, status, symptoms
- TimeSlots: doctor_id, date, time, available

### API Endpoints (Flask)
- POST /api/auth/register
- POST /api/auth/login
- GET /api/doctors
- POST /api/appointments
- GET /api/appointments/:user_id
- PUT /api/appointments/:id
- GET /api/ml/predict
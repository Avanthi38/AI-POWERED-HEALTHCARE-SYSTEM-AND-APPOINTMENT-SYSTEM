import React, { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Navigate,
  useNavigate,
  useLocation
} from 'react-router-dom';
import {
  Home,
  User,
  Calendar,
  Settings,
  LogOut,
  ArrowRight,
  CheckCircle,
  Clock,
  Star,
  Stethoscope,
  UserCheck,
  Activity,
  Users,
  Plus,
  Edit,
  Trash2,
  ChevronRight,
  AlertCircle,
  Phone,
  Mail,
  Heart,
  Brain,
  Eye,
  Thermometer,
  HeartPulse,
  ActivitySquare
} from 'lucide-react';

// Types
interface UserType {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'patient' | 'doctor' | 'admin';
}

interface Doctor {
  id: string;
  name: string;
  specialization: string;
  experience: number;
  rating: number;
  fee: number;
  image: string;
  available: boolean;
  slots: TimeSlot[];
  about: string;
}

interface TimeSlot {
  time: string;
  available: boolean;
}

type AppointmentStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';

interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  date: string;
  time: string;
  status: AppointmentStatus;
  symptoms: string;
  specialization: string;
}

// Context
interface AuthContextType {
  user: UserType | null;
  login: (email: string, _password: string, role: string) => boolean;
  logout: () => void;
  register: (name: string, email: string, phone: string, password: string) => boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  login: () => false,
  logout: () => {},
  register: () => false
});

// Mock Data
const mockDoctors: Doctor[] = [
  {
    id: 'd1',
    name: 'Dr. Sarah Johnson',
    specialization: 'General Physician',
    experience: 15,
    rating: 4.9,
    fee: 500,
    image: 'https://randomuser.me/api/portraits/women/44.jpg',
    available: true,
    about: 'Experienced general physician with expertise in primary care and preventive medicine.',
    slots: [
      { time: '09:00 AM', available: true },
      { time: '10:00 AM', available: true },
      { time: '11:00 AM', available: false },
      { time: '02:00 PM', available: true },
      { time: '03:00 PM', available: true },
      { time: '04:00 PM', available: false }
    ]
  },
  {
    id: 'd2',
    name: 'Dr. Michael Chen',
    specialization: 'Cardiologist',
    experience: 20,
    rating: 4.8,
    fee: 800,
    image: 'https://randomuser.me/api/portraits/men/32.jpg',
    available: true,
    about: 'Board-certified cardiologist specializing in interventional cardiology and heart failure management.',
    slots: [
      { time: '09:00 AM', available: false },
      { time: '10:00 AM', available: true },
      { time: '11:00 AM', available: true },
      { time: '02:00 PM', available: true },
      { time: '03:00 PM', available: false },
      { time: '04:00 PM', available: true }
    ]
  },
  {
    id: 'd3',
    name: 'Dr. Emily Watson',
    specialization: 'Dermatologist',
    experience: 12,
    rating: 4.7,
    fee: 600,
    image: 'https://randomuser.me/api/portraits/women/65.jpg',
    available: true,
    about: 'Specialized in medical and cosmetic dermatology with focus on skin cancer prevention.',
    slots: [
      { time: '09:00 AM', available: true },
      { time: '10:00 AM', available: true },
      { time: '11:00 AM', available: true },
      { time: '02:00 PM', available: true },
      { time: '03:00 PM', available: true },
      { time: '04:00 PM', available: true }
    ]
  },
  {
    id: 'd4',
    name: 'Dr. James Wilson',
    specialization: 'Ophthalmologist',
    experience: 18,
    rating: 4.9,
    fee: 700,
    image: 'https://randomuser.me/api/portraits/men/45.jpg',
    available: true,
    about: 'Expert in cataract surgery and treatment of ocular diseases with advanced techniques.',
    slots: [
      { time: '09:00 AM', available: true },
      { time: '10:00 AM', available: false },
      { time: '11:00 AM', available: true },
      { time: '02:00 PM', available: true },
      { time: '03:00 PM', available: true },
      { time: '04:00 PM', available: false }
    ]
  },
  {
    id: 'd5',
    name: 'Dr. Lisa Brown',
    specialization: 'Dentist',
    experience: 10,
    rating: 4.6,
    fee: 400,
    image: 'https://randomuser.me/api/portraits/women/33.jpg',
    available: true,
    about: 'General dentist specializing in preventive care, restorative dentistry, and smile aesthetics.',
    slots: [
      { time: '09:00 AM', available: true },
      { time: '10:00 AM', available: true },
      { time: '11:00 AM', available: true },
      { time: '02:00 PM', available: false },
      { time: '03:00 PM', available: true },
      { time: '04:00 PM', available: true }
    ]
  },
  {
    id: 'd6',
    name: 'Dr. Robert Martinez',
    specialization: 'Gastroenterologist',
    experience: 14,
    rating: 4.8,
    fee: 750,
    image: 'https://randomuser.me/api/portraits/men/22.jpg',
    available: true,
    about: 'Specialist in digestive disorders, liver diseases, and advanced endoscopic procedures.',
    slots: [
      { time: '09:00 AM', available: true },
      { time: '10:00 AM', available: true },
      { time: '11:00 AM', available: false },
      { time: '02:00 PM', available: true },
      { time: '03:00 PM', available: true },
      { time: '04:00 PM', available: true }
    ]
  }
];

// Specialist icons mapping
const specialistIcons: Record<string, ReactNode> = {
  'General Physician': <Thermometer className="w-6 h-6" />,
  'Cardiologist': <HeartPulse className="w-6 h-6" />,
  'Dermatologist': <Activity className="w-6 h-6" />,
  'Ophthalmologist': <Eye className="w-6 h-6" />,
  'Dentist': <ActivitySquare className="w-6 h-6" />,
  'Gastroenterologist': <Activity className="w-6 h-6" />
};

// ML Symptom Analysis Function
const analyzeSymptoms = (symptoms: string): string => {
  const symptomLower = symptoms.toLowerCase();
  
  const symptomMap: Record<string, string> = {
    'fever': 'General Physician',
    'cold': 'General Physician',
    'cough': 'General Physician',
    'flu': 'General Physician',
    'headache': 'General Physician',
    'chest pain': 'Cardiologist',
    'heart': 'Cardiologist',
    'cardiac': 'Cardiologist',
    'blood pressure': 'Cardiologist',
    'skin': 'Dermatologist',
    'rash': 'Dermatologist',
    'acne': 'Dermatologist',
    'eczema': 'Dermatologist',
    'eye': 'Ophthalmologist',
    'vision': 'Ophthalmologist',
    'glasses': 'Ophthalmologist',
    'tooth': 'Dentist',
    'teeth': 'Dentist',
    'dental': 'Dentist',
    'stomach': 'Gastroenterologist',
    'abdominal': 'Gastroenterologist',
    'digestive': 'Gastroenterologist',
    'nausea': 'Gastroenterologist'
  };

  for (const [keyword, specialist] of Object.entries(symptomMap)) {
    if (symptomLower.includes(keyword)) {
      return specialist;
    }
  }
  
  return 'General Physician';
};

// Storage helpers
const getStorage = (key: string): any[] => {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : [];
};

const setStorage = (key: string, data: any[]): void => {
  localStorage.setItem(key, JSON.stringify(data));
};

// Auth Provider Component
const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserType | null>(() => {
    const stored = localStorage.getItem('currentUser');
    return stored ? JSON.parse(stored) : null;
  });

  const login = (_email: string, _password: string, role: string): boolean => {
    const users = getStorage('users');
    const foundUser = users.find((u: UserType) => u.email === _email && u.role === role);
    
    if (foundUser) {
      setUser(foundUser);
      localStorage.setItem('currentUser', JSON.stringify(foundUser));
      return true;
    }
    
    // Demo login
    const demoUser: UserType = {
      id: `${role}_${Date.now()}`,
      name: _email.split('@')[0],
      email: _email,
      phone: '1234567890',
      role: role as 'patient' | 'doctor' | 'admin'
    };
    setUser(demoUser);
    localStorage.setItem('currentUser', JSON.stringify(demoUser));
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
  };

  const register = (name: string, email: string, phone: string, _password: string): boolean => {
    const users = getStorage('users');
    const exists = users.find((u: UserType) => u.email === email);
    
    if (exists) return false;
    
    const newUser: UserType = {
      id: `user_${Date.now()}`,
      name,
      email,
      phone,
      role: 'patient'
    };
    
    users.push(newUser);
    setStorage('users', users);
    setUser(newUser);
    localStorage.setItem('currentUser', JSON.stringify(newUser));
    return true;
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};

// Protected Route Component
interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const { user } = useContext(AuthContext);
  const location = useLocation();

  if (!user) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

// Components
interface ButtonProps {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'danger' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  type?: 'button' | 'submit';
  className?: string;
  disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', size = 'md', onClick, type = 'button', className = '', disabled = false }) => {
  const baseClasses = 'font-medium rounded-xl transition-all duration-200 flex items-center justify-center gap-2';
  const variantClasses = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl',
    secondary: 'bg-white hover:bg-gray-50 text-blue-600 border-2 border-blue-600',
    danger: 'bg-red-600 hover:bg-red-700 text-white',
    outline: 'bg-transparent hover:bg-blue-50 text-blue-600 border border-blue-200'
  };
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-5 py-2.5 text-base',
    lg: 'px-8 py-3.5 text-lg'
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
    >
      {children}
    </button>
  );
};

interface InputProps {
  label: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string;
  icon?: ReactNode;
}

const Input: React.FC<InputProps> = ({ label, type = 'text', value, onChange, placeholder, error, icon }) => (
  <div className="space-y-1">
    <label className="text-sm font-medium text-gray-700">{label}</label>
    <div className="relative">
      {icon && <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">{icon}</div>}
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full px-4 py-3 ${icon ? 'pl-10' : ''} border-2 rounded-xl transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 ${error ? 'border-red-500' : 'border-gray-200 hover:border-gray-300'}`}
      />
    </div>
    {error && <p className="text-sm text-red-500">{error}</p>}
  </div>
);

interface CardProps {
  children: ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = ({ children, className = '' }) => (
  <div className={`bg-white rounded-2xl shadow-lg p-6 ${className}`}>{children}</div>
);

interface StatCardProps {
  icon: ReactNode;
  value: string | number;
  label: string;
  trend?: string;
  color: string;
}

const StatCard: React.FC<StatCardProps> = ({ icon, value, label, trend, color }) => (
  <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow">
    <div className="flex items-center justify-between">
      <div className={`w-12 h-12 rounded-xl ${color} flex items-center justify-center text-white`}>
        {icon}
      </div>
      {trend && <span className="text-sm text-green-500 font-medium">{trend}</span>}
    </div>
    <h3 className="text-3xl font-bold text-gray-800 mt-4">{value}</h3>
    <p className="text-gray-500 text-sm">{label}</p>
  </div>
);

// Pages
const RoleSelection: React.FC = () => {
  const navigate = useNavigate();

  const roles = [
    {
      id: 'patient',
      title: 'Patient',
      description: 'Book appointments, view history, manage health',
      icon: <User className="w-8 h-8" />,
      color: 'bg-blue-600',
      hoverColor: 'hover:bg-blue-700'
    },
    {
      id: 'doctor',
      title: 'Doctor',
      description: 'Manage appointments, update availability',
      icon: <Stethoscope className="w-8 h-8" />,
      color: 'bg-teal-600',
      hoverColor: 'hover:bg-teal-700'
    },
    {
      id: 'admin',
      title: 'Admin',
      description: 'Manage doctors, patients, analytics',
      icon: <Settings className="w-8 h-8" />,
      color: 'bg-purple-600',
      hoverColor: 'hover:bg-purple-700'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50 flex items-center justify-center p-4">
      <div className="w-full max-w-5xl">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Heart className="w-10 h-10 text-white" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            MediCare <span className="text-blue-600">AI</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Smart Healthcare Appointment System with AI-Powered Symptom Analysis
          </p>
        </div>

        {/* Role Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {roles.map((role) => (
            <button
              key={role.id}
              onClick={() => navigate(`/login/${role.id}`)}
              className={`group bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 text-left`}
            >
              <div className={`w-16 h-16 ${role.color} rounded-2xl flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform`}>
                {role.icon}
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">{role.title}</h2>
              <p className="text-gray-500 mb-6">{role.description}</p>
              <div className={`flex items-center ${role.color} text-white px-4 py-2 rounded-xl w-fit group-hover:gap-3 transition-all`}>
                <span className="font-medium">Continue</span>
                <ArrowRight className="w-5 h-5" />
              </div>
            </button>
          ))}
        </div>

        {/* Features */}
        <div className="mt-16 grid md:grid-cols-4 gap-4">
          {[
            { icon: <Brain className="w-5 h-5" />, text: 'AI Symptom Analysis' },
            { icon: <Calendar className="w-5 h-5" />, text: 'Easy Scheduling' },
            { icon: <UserCheck className="w-5 h-5" />, text: 'Verified Doctors' },
            { icon: <Clock className="w-5 h-5" />, text: '24/7 Support' }
          ].map((feature, idx) => (
            <div key={idx} className="flex items-center gap-3 bg-white/60 backdrop-blur px-4 py-3 rounded-xl">
              <div className="text-blue-600">{feature.icon}</div>
              <span className="text-gray-700 font-medium">{feature.text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const role = location.pathname.split('/')[2] || 'patient';

  const roleInfo = {
    patient: { title: 'Patient Login', subtitle: 'Access your health dashboard' },
    doctor: { title: 'Doctor Login', subtitle: 'Manage your appointments' },
    admin: { title: 'Admin Login', subtitle: 'System administration' }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }
    
    // Admin demo credentials
    if (role === 'admin' && email === 'admin@medicare.ai' && password === 'admin123') {
      login(email, password, 'admin');
      navigate('/admin/dashboard');
      return;
    }

    login(email, password, role);
    if (role === 'patient') navigate('/patient/dashboard');
    else if (role === 'doctor') navigate('/doctor/dashboard');
    else navigate('/admin/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 text-blue-600 mb-4">
            <ArrowRight className="w-5 h-5 rotate-180" />
            <span>Back to Home</span>
          </Link>
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg mb-4">
            <Heart className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800">{roleInfo[role as keyof typeof roleInfo]?.title || 'Login'}</h1>
          <p className="text-gray-500 mt-2">{roleInfo[role as keyof typeof roleInfo]?.subtitle || ''}</p>
        </div>

        <Card className="p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="Email Address"
              type="email"
              value={email}
              onChange={setEmail}
              placeholder="Enter your email"
              icon={<Mail className="w-5 h-5" />}
            />
            <Input
              label="Password"
              type="password"
              value={password}
              onChange={setPassword}
              placeholder="Enter your password"
              icon={<Settings className="w-5 h-5" />}
            />
            
            {error && (
              <div className="flex items-center gap-2 text-red-500 bg-red-50 p-3 rounded-xl">
                <AlertCircle className="w-5 h-5" />
                <span>{error}</span>
              </div>
            )}

            <Button type="submit" className="w-full">
              Sign In
            </Button>
          </form>

          <div className="mt-6 text-center space-y-2">
            {role === 'patient' && (
              <>
                <Link to="/register" className="block text-blue-600 hover:underline">Create Account</Link>
                <Link to="/forgot-password" className="block text-gray-500 hover:text-gray-700 text-sm">Forgot Password?</Link>
              </>
            )}
          </div>

          {role === 'admin' && (
            <div className="mt-4 p-4 bg-gray-50 rounded-xl text-sm text-gray-600">
              <p><strong>Demo:</strong> admin@medicare.ai / admin123</p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

const Register: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !email || !phone || !password || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    if (register(name, email, phone, password)) {
      navigate('/patient/dashboard');
    } else {
      setError('Email already registered');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 text-blue-600 mb-4">
            <ArrowRight className="w-5 h-5 rotate-180" />
            <span>Back to Home</span>
          </Link>
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg mb-4">
            <Heart className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800">Create Account</h1>
          <p className="text-gray-500 mt-2">Join MediCare AI today</p>
        </div>

        <Card className="p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="Full Name"
              value={name}
              onChange={setName}
              placeholder="Enter your full name"
              icon={<User className="w-5 h-5" />}
            />
            <Input
              label="Email Address"
              type="email"
              value={email}
              onChange={setEmail}
              placeholder="Enter your email"
              icon={<Mail className="w-5 h-5" />}
            />
            <Input
              label="Phone Number"
              type="tel"
              value={phone}
              onChange={setPhone}
              placeholder="Enter your phone number"
              icon={<Phone className="w-5 h-5" />}
            />
            <Input
              label="Password"
              type="password"
              value={password}
              onChange={setPassword}
              placeholder="Create a password"
              icon={<Settings className="w-5 h-5" />}
            />
            <Input
              label="Confirm Password"
              type="password"
              value={confirmPassword}
              onChange={setConfirmPassword}
              placeholder="Confirm your password"
              icon={<Settings className="w-5 h-5" />}
            />
            
            {error && (
              <div className="flex items-center gap-2 text-red-500 bg-red-50 p-3 rounded-xl">
                <AlertCircle className="w-5 h-5" />
                <span>{error}</span>
              </div>
            )}

            <Button type="submit" className="w-full">
              Create Account
            </Button>
          </form>

          <div className="mt-6 text-center">
            <span className="text-gray-500">Already have an account? </span>
            <Link to="/login/patient" className="text-blue-600 hover:underline">Sign In</Link>
          </div>
        </Card>
      </div>
    </div>
  );
};

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/login/patient" className="inline-flex items-center gap-2 text-blue-600 mb-4">
            <ArrowRight className="w-5 h-5 rotate-180" />
            <span>Back to Login</span>
          </Link>
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg mb-4">
            <Heart className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800">Reset Password</h1>
          <p className="text-gray-500 mt-2">Enter your email to receive reset instructions</p>
        </div>

        <Card className="p-8">
          {sent ? (
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Check Your Email</h3>
              <p className="text-gray-500 mb-6">We've sent password reset instructions to {email}</p>
              <Button onClick={() => navigate('/login/patient')}>Return to Login</Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <Input
                label="Email Address"
                type="email"
                value={email}
                onChange={setEmail}
                placeholder="Enter your registered email"
                icon={<Mail className="w-5 h-5" />}
              />
              <Button type="submit" className="w-full">Send Reset Link</Button>
            </form>
          )}
        </Card>
      </div>
    </div>
  );
};

// Patient Dashboard
const PatientDashboard: React.FC = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [appointments] = useState<Appointment[]>(() => getStorage('appointments'));

  const upcomingAppointments = appointments.filter(a => a.patientId === user?.id && a.status !== 'cancelled');

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white shadow-xl min-h-screen fixed left-0 top-0 p-6">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
              <Heart className="w-7 h-7 text-white" />
            </div>
            <div>
              <h2 className="font-bold text-gray-800">MediCare AI</h2>
              <p className="text-xs text-gray-500">Patient Portal</p>
            </div>
          </div>

          <nav className="space-y-2">
            <Link to="/patient/dashboard" className="flex items-center gap-3 px-4 py-3 bg-blue-50 text-blue-600 rounded-xl font-medium">
              <Home className="w-5 h-5" />
              Dashboard
            </Link>
            <Link to="/patient/symptoms" className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-xl transition-colors">
              <Activity className="w-5 h-5" />
              Book Appointment
            </Link>
            <Link to="/patient/appointments" className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-xl transition-colors">
              <Calendar className="w-5 h-5" />
              My Appointments
            </Link>
            <Link to="/patient/profile" className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-xl transition-colors">
              <User className="w-5 h-5" />
              Profile
            </Link>
          </nav>

          <button
            onClick={() => { logout(); navigate('/'); }}
            className="flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-colors mt-8 w-full"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </aside>

        {/* Main Content */}
        <main className="ml-64 flex-1 p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800">Welcome back, {user?.name}!</h1>
            <p className="text-gray-500 mt-1">Here's your health overview</p>
          </div>

          {/* Stats */}
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <StatCard icon={<Calendar className="w-6 h-6" />} value={upcomingAppointments.length} label="Upcoming Appointments" color="bg-blue-600" />
            <StatCard icon={<CheckCircle className="w-6 h-6" />} value={appointments.filter(a => a.patientId === user?.id && a.status === 'completed').length} label="Completed" color="bg-green-600" />
            <StatCard icon={<Clock className="w-6 h-6" />} value={appointments.filter(a => a.patientId === user?.id && a.status === 'pending').length} label="Pending" color="bg-yellow-600" />
            <StatCard icon={<Activity className="w-6 h-6" />} value="3" label="Health Score" color="bg-teal-600" />
          </div>

          {/* Quick Actions */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <Card className="p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Button onClick={() => navigate('/patient/symptoms')} className="w-full justify-start">
                  <Plus className="w-5 h-5" />
                  Book New Appointment
                </Button>
                <Button variant="outline" onClick={() => navigate('/patient/appointments')} className="w-full justify-start">
                  <Calendar className="w-5 h-5" />
                  View All Appointments
                </Button>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Suggested Symptoms</h3>
              <div className="flex flex-wrap gap-2">
                {['Fever & Cough', 'Chest Pain', 'Skin Rash', 'Eye Irritation', 'Stomach Pain'].map((symptom, idx) => (
                  <button
                    key={idx}
                    onClick={() => navigate('/patient/symptoms', { state: { symptom } })}
                    className="px-4 py-2 bg-blue-50 text-blue-600 rounded-full text-sm hover:bg-blue-100 transition-colors"
                  >
                    {symptom}
                  </button>
                ))}
              </div>
            </Card>
          </div>

          {/* Upcoming Appointments */}
          <Card className="p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Upcoming Appointments</h3>
            {upcomingAppointments.length > 0 ? (
              <div className="space-y-4">
                {upcomingAppointments.slice(0, 3).map((apt) => (
                  <div key={apt.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                        {specialistIcons[apt.specialization] || <Stethoscope className="w-6 h-6 text-blue-600" />}
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-800">{apt.doctorName}</h4>
                        <p className="text-sm text-gray-500">{apt.specialization}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-800">{apt.date}</p>
                      <p className="text-sm text-gray-500">{apt.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No upcoming appointments</p>
                <Button onClick={() => navigate('/patient/symptoms')} className="mt-4">
                  Book Now
                </Button>
              </div>
            )}
          </Card>
        </main>
      </div>
    </div>
  );
};

// Symptom Input Page
const SymptomInput: React.FC = () => {
  const [symptoms, setSymptoms] = useState('');
  const [recommendedSpec, setRecommendedSpec] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.state?.symptom) {
      setSymptoms(location.state.symptom);
    }
  }, [location.state]);

  const handleAnalyze = () => {
    if (symptoms.trim()) {
      const spec = analyzeSymptoms(symptoms);
      setRecommendedSpec(spec);
    }
  };

  const suggestedSymptoms = [
    'Fever and cough',
    'Chest pain and shortness of breath',
    'Skin rash with itching',
    'Eye irritation and blurry vision',
    'Tooth pain and sensitivity',
    'Stomach pain and nausea'
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        <aside className="w-64 bg-white shadow-xl min-h-screen fixed left-0 top-0 p-6">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
              <Heart className="w-7 h-7 text-white" />
            </div>
            <div>
              <h2 className="font-bold text-gray-800">MediCare AI</h2>
              <p className="text-xs text-gray-500">Patient Portal</p>
            </div>
          </div>

          <nav className="space-y-2">
            <Link to="/patient/dashboard" className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-xl transition-colors">
              <Home className="w-5 h-5" />
              Dashboard
            </Link>
            <Link to="/patient/symptoms" className="flex items-center gap-3 px-4 py-3 bg-blue-50 text-blue-600 rounded-xl font-medium">
              <Activity className="w-5 h-5" />
              Book Appointment
            </Link>
            <Link to="/patient/appointments" className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-xl transition-colors">
              <Calendar className="w-5 h-5" />
              My Appointments
            </Link>
            <Link to="/patient/profile" className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-xl transition-colors">
              <User className="w-5 h-5" />
              Profile
            </Link>
          </nav>
        </aside>

        <main className="ml-64 flex-1 p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800">Book Appointment</h1>
            <p className="text-gray-500 mt-1">Step 1: Describe your symptoms</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <Card className="p-6">
                <div className="mb-6">
                  <label className="text-lg font-semibold text-gray-800 mb-2 block">Describe Your Symptoms</label>
                  <textarea
                    value={symptoms}
                    onChange={(e) => setSymptoms(e.target.value)}
                    placeholder="e.g., I have fever and cough for 3 days..."
                    className="w-full h-40 p-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  />
                </div>

                <div className="mb-6">
                  <p className="text-sm text-gray-500 mb-3">Quick select symptoms:</p>
                  <div className="flex flex-wrap gap-2">
                    {suggestedSymptoms.map((s, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSymptoms(s)}
                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-blue-50 hover:text-blue-600 transition-colors"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                <Button onClick={handleAnalyze} className="w-full">
                  <Brain className="w-5 h-5" />
                  Analyze Symptoms with AI
                </Button>

                {recommendedSpec && (
                  <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm text-green-600 font-medium">AI Recommendation</p>
                        <p className="text-lg font-bold text-gray-800">{recommendedSpec}</p>
                      </div>
                    </div>
                    <Button onClick={() => navigate('/patient/doctors', { state: { specialization: recommendedSpec } })} className="w-full mt-4">
                      Continue to Book
                      <ChevronRight className="w-5 h-5" />
                    </Button>
                  </div>
                )}
              </Card>
            </div>

            <div>
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">How AI Works</h3>
                <div className="space-y-4">
                  {[
                    { step: '1', title: 'Describe Symptoms', desc: 'Enter what you are experiencing' },
                    { step: '2', title: 'AI Analysis', desc: 'Our AI analyzes your symptoms' },
                    { step: '3', title: 'Get Recommendation', desc: 'Receive specialist recommendation' },
                    { step: '4', title: 'Book Appointment', desc: 'Select doctor and schedule' }
                  ].map((item) => (
                    <div key={item.step} className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-sm">
                        {item.step}
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-800">{item.title}</h4>
                        <p className="text-sm text-gray-500">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

// Doctors List Page
const DoctorsList: React.FC = () => {
  const [specialization, setSpecialization] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.state?.specialization) {
      setSpecialization(location.state.specialization);
    }
  }, [location.state]);

  const filteredDoctors = specialization
    ? mockDoctors.filter(d => d.specialization === specialization)
    : mockDoctors;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        <aside className="w-64 bg-white shadow-xl min-h-screen fixed left-0 top-0 p-6">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
              <Heart className="w-7 h-7 text-white" />
            </div>
            <div>
              <h2 className="font-bold text-gray-800">MediCare AI</h2>
              <p className="text-xs text-gray-500">Patient Portal</p>
            </div>
          </div>

          <nav className="space-y-2">
            <Link to="/patient/dashboard" className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-xl transition-colors">
              <Home className="w-5 h-5" />
              Dashboard
            </Link>
            <Link to="/patient/symptoms" className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-xl transition-colors">
              <Activity className="w-5 h-5" />
              Book Appointment
            </Link>
            <Link to="/patient/appointments" className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-xl transition-colors">
              <Calendar className="w-5 h-5" />
              My Appointments
            </Link>
          </nav>
        </aside>

        <main className="ml-64 flex-1 p-8">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Select a Doctor</h1>
              <p className="text-gray-500 mt-1">Step 2: Choose your healthcare provider</p>
            </div>
            <select
              value={specialization}
              onChange={(e) => setSpecialization(e.target.value)}
              className="px-4 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Specializations</option>
              <option value="General Physician">General Physician</option>
              <option value="Cardiologist">Cardiologist</option>
              <option value="Dermatologist">Dermatologist</option>
              <option value="Ophthalmologist">Ophthalmologist</option>
              <option value="Dentist">Dentist</option>
              <option value="Gastroenterologist">Gastroenterologist</option>
            </select>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDoctors.map((doctor) => (
              <Card key={doctor.id} className="overflow-hidden hover:shadow-xl transition-shadow">
                <div className="relative">
                  <img src={doctor.image} alt={doctor.name} className="w-full h-48 object-cover" />
                  {doctor.available && (
                    <span className="absolute top-4 right-4 bg-green-500 text-white text-xs px-3 py-1 rounded-full">
                      Available
                    </span>
                  )}
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                      {specialistIcons[doctor.specialization]}
                    </span>
                    <span className="text-sm text-blue-600 font-medium">{doctor.specialization}</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-1">{doctor.name}</h3>
                  <p className="text-gray-500 text-sm mb-4">{doctor.experience} years experience</p>
                  
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-1">
                      <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                      <span className="font-semibold">{doctor.rating}</span>
                      <span className="text-gray-400 text-sm">(120)</span>
                    </div>
                    <span className="text-xl font-bold text-blue-600">₹{doctor.fee}</span>
                  </div>

                  <p className="text-sm text-gray-500 mb-4">{doctor.about}</p>

                  <div className="border-t pt-4">
                    <p className="text-sm font-medium text-gray-700 mb-2">Available Slots:</p>
                    <div className="flex flex-wrap gap-2">
                      {doctor.slots.filter(s => s.available).slice(0, 4).map((slot, idx) => (
                        <span key={idx} className="text-xs bg-gray-100 px-2 py-1 rounded">{slot.time}</span>
                      ))}
                    </div>
                  </div>

                  <Button 
                    onClick={() => navigate('/patient/book', { state: { doctor } })}
                    className="w-full mt-4"
                    disabled={!doctor.available}
                  >
                    Book Appointment
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};

// Booking Page
const BookingPage: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [booked, setBooked] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useContext(AuthContext);
  const doctor = location.state?.doctor as Doctor | undefined;

  useEffect(() => {
    if (!doctor) navigate('/patient/doctors');
  }, [doctor, navigate]);

  const handleBook = () => {
    if (!selectedDate || !selectedTime || !doctor) return;

    const appointment: Appointment = {
      id: `apt_${Date.now()}`,
      patientId: user?.id || '',
      patientName: user?.name || '',
      doctorId: doctor.id,
      doctorName: doctor.name,
      date: selectedDate,
      time: selectedTime,
      status: 'confirmed',
      symptoms: '',
      specialization: doctor.specialization
    };

    const appointments = getStorage('appointments');
    appointments.push(appointment);
    setStorage('appointments', appointments);
    setBooked(true);
  };

  const timeSlots = doctor?.slots || [];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        <aside className="w-64 bg-white shadow-xl min-h-screen fixed left-0 top-0 p-6">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
              <Heart className="w-7 h-7 text-white" />
            </div>
            <div>
              <h2 className="font-bold text-gray-800">MediCare AI</h2>
              <p className="text-xs text-gray-500">Patient Portal</p>
            </div>
          </div>

          <nav className="space-y-2">
            <Link to="/patient/dashboard" className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-xl">
              <Home className="w-5 h-5" />
              Dashboard
            </Link>
            <Link to="/patient/symptoms" className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-xl">
              <Activity className="w-5 h-5" />
              Book Appointment
            </Link>
            <Link to="/patient/appointments" className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-xl">
              <Calendar className="w-5 h-5" />
              My Appointments
            </Link>
          </nav>
        </aside>

        <main className="ml-64 flex-1 p-8">
          {!booked ? (
            <div className="max-w-3xl mx-auto">
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-800">Confirm Your Appointment</h1>
                <p className="text-gray-500 mt-1">Step 3: Select date and time</p>
              </div>

              <Card className="p-6 mb-6">
                <div className="flex items-center gap-4 mb-6">
                  <img src={doctor?.image} alt={doctor?.name} className="w-20 h-20 rounded-xl object-cover" />
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">{doctor?.name}</h3>
                    <p className="text-gray-500">{doctor?.specialization}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      <span>{doctor?.rating}</span>
                      <span className="text-gray-400">•</span>
                      <span className="font-semibold text-blue-600">₹{doctor?.fee}</span>
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-lg font-semibold text-gray-800 mb-3 block">Select Date</label>
                    <input
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="text-lg font-semibold text-gray-800 mb-3 block">Select Time</label>
                    <div className="grid grid-cols-3 gap-2">
                      {timeSlots.map((slot, idx) => (
                        <button
                          key={idx}
                          disabled={!slot.available}
                          onClick={() => setSelectedTime(slot.time)}
                          className={`px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
                            selectedTime === slot.time
                              ? 'bg-blue-600 text-white'
                              : slot.available
                              ? 'bg-gray-100 text-gray-700 hover:bg-blue-50'
                              : 'bg-gray-100 text-gray-300 cursor-not-allowed'
                          }`}
                        >
                          {slot.time}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Appointment Summary</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Doctor</span>
                    <span className="font-medium">{doctor?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Specialization</span>
                    <span className="font-medium">{doctor?.specialization}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Date</span>
                    <span className="font-medium">{selectedDate || '-'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Time</span>
                    <span className="font-medium">{selectedTime || '-'}</span>
                  </div>
                  <div className="flex justify-between border-t pt-3">
                    <span className="text-gray-500">Consultation Fee</span>
                    <span className="font-bold text-blue-600">₹{doctor?.fee}</span>
                  </div>
                </div>

                <Button onClick={handleBook} className="w-full mt-6" disabled={!selectedDate || !selectedTime}>
                  <CheckCircle className="w-5 h-5" />
                  Confirm Booking
                </Button>
              </Card>
            </div>
          ) : (
            <div className="max-w-2xl mx-auto text-center">
              <Card className="p-12">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="w-10 h-10 text-green-600" />
                </div>
                <h2 className="text-3xl font-bold text-gray-800 mb-2">Booking Confirmed!</h2>
                <p className="text-gray-500 mb-8">Your appointment has been successfully booked</p>

                <div className="bg-gray-50 rounded-xl p-6 text-left mb-8">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Doctor</p>
                      <p className="font-semibold">{doctor?.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Specialization</p>
                      <p className="font-semibold">{doctor?.specialization}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Date</p>
                      <p className="font-semibold">{selectedDate}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Time</p>
                      <p className="font-semibold">{selectedTime}</p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 justify-center">
                  <Button onClick={() => navigate('/patient/appointments')}>
                    View Appointments
                  </Button>
                  <Button variant="outline" onClick={() => navigate('/patient/dashboard')}>
                    Go to Dashboard
                  </Button>
                </div>
              </Card>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

// My Appointments Page
const MyAppointments: React.FC = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState<Appointment[]>(() => getStorage('appointments'));
  const [filter, setFilter] = useState('all');

  const filteredAppointments = appointments.filter(a => a.patientId === user?.id);

  const updateStatus = (id: string, newStatus: AppointmentStatus) => {
    const updated = appointments.map(a => a.id === id ? { ...a, status: newStatus } : a);
    setStorage('appointments', updated);
    setAppointments(updated);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        <aside className="w-64 bg-white shadow-xl min-h-screen fixed left-0 top-0 p-6">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
              <Heart className="w-7 h-7 text-white" />
            </div>
            <div>
              <h2 className="font-bold text-gray-800">MediCare AI</h2>
              <p className="text-xs text-gray-500">Patient Portal</p>
            </div>
          </div>

          <nav className="space-y-2">
            <Link to="/patient/dashboard" className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-xl">
              <Home className="w-5 h-5" />
              Dashboard
            </Link>
            <Link to="/patient/symptoms" className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-xl">
              <Activity className="w-5 h-5" />
              Book Appointment
            </Link>
            <Link to="/patient/appointments" className="flex items-center gap-3 px-4 py-3 bg-blue-50 text-blue-600 rounded-xl font-medium">
              <Calendar className="w-5 h-5" />
              My Appointments
            </Link>
          </nav>
        </aside>

        <main className="ml-64 flex-1 p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800">My Appointments</h1>
            <p className="text-gray-500 mt-1">View and manage your appointments</p>
          </div>

          <div className="flex gap-4 mb-6">
            {['all', 'upcoming', 'completed', 'cancelled'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-xl font-medium capitalize transition-colors ${
                  filter === f ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          <div className="space-y-4">
            {filteredAppointments
              .filter(a => filter === 'all' || 
                (filter === 'upcoming' && ['pending', 'confirmed'].includes(a.status)) ||
                a.status === filter)
              .map((apt) => (
                <Card key={apt.id} className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center">
                        {specialistIcons[apt.specialization] || <Stethoscope className="w-7 h-7 text-blue-600" />}
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-800">{apt.doctorName}</h3>
                        <p className="text-gray-500">{apt.specialization}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-800">{apt.date}</p>
                      <p className="text-gray-500">{apt.time}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      apt.status === 'confirmed' ? 'bg-green-100 text-green-600' :
                      apt.status === 'pending' ? 'bg-yellow-100 text-yellow-600' :
                      apt.status === 'completed' ? 'bg-blue-100 text-blue-600' :
                      'bg-red-100 text-red-600'
                    }`}>
                      {apt.status}
                    </span>
                    <div className="flex gap-2">
                      {apt.status !== 'cancelled' && apt.status !== 'completed' && (
                        <>
                          <Button size="sm" variant="outline" onClick={() => navigate('/patient/doctors')}>
                            Reschedule
                          </Button>
                          <Button size="sm" variant="danger" onClick={() => updateStatus(apt.id, 'cancelled')}>
                            Cancel
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            
            {filteredAppointments.length === 0 && (
              <Card className="p-12 text-center">
                <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No appointments found</p>
              </Card>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

// Doctor Dashboard
const DoctorDashboard: React.FC = () => {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState<Appointment[]>(() => getStorage('appointments'));

  const doctorAppointments = appointments.filter(a => a.doctorName.includes('Dr.'));

  const updateAppointmentStatus = (id: string, newStatus: AppointmentStatus) => {
    const updated = appointments.map(a => a.id === id ? { ...a, status: newStatus } : a);
    setStorage('appointments', updated);
    setAppointments(updated);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        <aside className="w-64 bg-white shadow-xl min-h-screen fixed left-0 top-0 p-6">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-teal-600 rounded-xl flex items-center justify-center">
              <Stethoscope className="w-7 h-7 text-white" />
            </div>
            <div>
              <h2 className="font-bold text-gray-800">MediCare AI</h2>
              <p className="text-xs text-gray-500">Doctor Portal</p>
            </div>
          </div>

          <nav className="space-y-2">
            <Link to="/doctor/dashboard" className="flex items-center gap-3 px-4 py-3 bg-teal-50 text-teal-600 rounded-xl font-medium">
              <Home className="w-5 h-5" />
              Dashboard
            </Link>
            <Link to="/doctor/appointments" className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-xl">
              <Calendar className="w-5 h-5" />
              My Appointments
            </Link>
            <Link to="/doctor/availability" className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-xl">
              <Clock className="w-5 h-5" />
              Availability
            </Link>
            <Link to="/doctor/profile" className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-xl">
              <User className="w-5 h-5" />
              Profile
            </Link>
          </nav>

          <button
            onClick={() => { logout(); navigate('/'); }}
            className="flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-colors mt-8 w-full"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </aside>

        <main className="ml-64 flex-1 p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800">Doctor Dashboard</h1>
            <p className="text-gray-500 mt-1">Manage your appointments and patients</p>
          </div>

          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <StatCard icon={<Calendar className="w-6 h-6" />} value={doctorAppointments.length} label="Total Appointments" color="bg-teal-600" />
            <StatCard icon={<UserCheck className="w-6 h-6" />} value={doctorAppointments.filter(a => a.status === 'confirmed').length} label="Confirmed" color="bg-green-600" />
            <StatCard icon={<Clock className="w-6 h-6" />} value={doctorAppointments.filter(a => a.status === 'pending').length} label="Pending" color="bg-yellow-600" />
            <StatCard icon={<Activity className="w-6 h-6" />} value="98%" label="Patient Satisfaction" color="bg-blue-600" />
          </div>

          <Card className="p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Today's Schedule</h3>
            <div className="space-y-4">
              {doctorAppointments.slice(0, 5).map((apt) => (
                <div key={apt.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center text-teal-600 font-bold">
                      {apt.patientName.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800">{apt.patientName}</h4>
                      <p className="text-sm text-gray-500">{apt.symptoms || 'General consultation'}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-800">{apt.time}</p>
                    <span className={`text-sm ${
                      apt.status === 'confirmed' ? 'text-green-600' : 
                      apt.status === 'pending' ? 'text-yellow-600' : 'text-gray-500'
                    }`}>
                      {apt.status}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    {apt.status === 'pending' && (
                      <>
                        <Button size="sm" onClick={() => updateAppointmentStatus(apt.id, 'confirmed')}>
                          Accept
                        </Button>
                        <Button size="sm" variant="danger" onClick={() => updateAppointmentStatus(apt.id, 'cancelled')}>
                          Reject
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              ))}
              {doctorAppointments.length === 0 && (
                <p className="text-center text-gray-500 py-8">No appointments scheduled</p>
              )}
            </div>
          </Card>
        </main>
      </div>
    </div>
  );
};

// Admin Dashboard
const AdminDashboard: React.FC = () => {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [appointments] = useState<Appointment[]>(() => getStorage('appointments'));

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        <aside className="w-64 bg-white shadow-xl min-h-screen fixed left-0 top-0 p-6">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center">
              <Settings className="w-7 h-7 text-white" />
            </div>
            <div>
              <h2 className="font-bold text-gray-800">MediCare AI</h2>
              <p className="text-xs text-gray-500">Admin Portal</p>
            </div>
          </div>

          <nav className="space-y-2">
            <Link to="/admin/dashboard" className="flex items-center gap-3 px-4 py-3 bg-purple-50 text-purple-600 rounded-xl font-medium">
              <Home className="w-5 h-5" />
              Dashboard
            </Link>
            <Link to="/admin/doctors" className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-xl">
              <Stethoscope className="w-5 h-5" />
              Manage Doctors
            </Link>
            <Link to="/admin/patients" className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-xl">
              <Users className="w-5 h-5" />
              Manage Patients
            </Link>
            <Link to="/admin/appointments" className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-xl">
              <Calendar className="w-5 h-5" />
              Appointments
            </Link>
            <Link to="/admin/reports" className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-xl">
              <Activity className="w-5 h-5" />
              Reports
            </Link>
          </nav>

          <button
            onClick={() => { logout(); navigate('/'); }}
            className="flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-colors mt-8 w-full"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </aside>

        <main className="ml-64 flex-1 p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
            <p className="text-gray-500 mt-1">System overview and management</p>
          </div>

          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <StatCard icon={<Users className="w-6 h-6" />} value={12} label="Total Users" color="bg-purple-600" />
            <StatCard icon={<Stethoscope className="w-6 h-6" />} value={mockDoctors.length} label="Doctors" color="bg-teal-600" />
            <StatCard icon={<Calendar className="w-6 h-6" />} value={appointments.length || 24} label="Appointments" color="bg-blue-600" />
            <StatCard icon={<Activity className="w-6 h-6" />} value="98%" label="System Health" color="bg-green-600" />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Recent Appointments</h3>
              <div className="space-y-3">
                {appointments.slice(0, 5).map((apt) => (
                  <div key={apt.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                    <div>
                      <p className="font-medium text-gray-800">{apt.patientName}</p>
                      <p className="text-sm text-gray-500">{apt.doctorName}</p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      apt.status === 'confirmed' ? 'bg-green-100 text-green-600' :
                      apt.status === 'pending' ? 'bg-yellow-100 text-yellow-600' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {apt.status}
                    </span>
                  </div>
                ))}
                {appointments.length === 0 && (
                  <p className="text-center text-gray-400 py-4">No appointments yet</p>
                )}
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Button className="w-full justify-start" onClick={() => navigate('/admin/doctors')}>
                  <Plus className="w-5 h-5" />
                  Add New Doctor
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Users className="w-5 h-5" />
                  View All Patients
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Activity className="w-5 h-5" />
                  Generate Report
                </Button>
              </div>
            </Card>
          </div>

          {/* Doctor Management Table */}
          <Card className="p-6 mt-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-800">All Doctors</h3>
              <Button size="sm">
                <Plus className="w-4 h-4" />
                Add Doctor
              </Button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-gray-600">Doctor</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-600">Specialization</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-600">Experience</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-600">Rating</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-600">Fee</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {mockDoctors.map((doc) => (
                    <tr key={doc.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img src={doc.image} alt={doc.name} className="w-10 h-10 rounded-full object-cover" />
                          <span className="font-medium">{doc.name}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-gray-600">{doc.specialization}</td>
                      <td className="py-3 px-4">{doc.experience} years</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                          {doc.rating}
                        </div>
                      </td>
                      <td className="py-3 px-4 font-semibold">₹{doc.fee}</td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2">
                          <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                            <Edit className="w-4 h-4" />
                          </button>
                          <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </main>
      </div>
    </div>
  );
};

// Main App Component
const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<RoleSelection />} />
          <Route path="/login/:role" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          {/* Patient Routes */}
          <Route path="/patient/dashboard" element={
            <ProtectedRoute allowedRoles={['patient']}>
              <PatientDashboard />
            </ProtectedRoute>
          } />
          <Route path="/patient/symptoms" element={
            <ProtectedRoute allowedRoles={['patient']}>
              <SymptomInput />
            </ProtectedRoute>
          } />
          <Route path="/patient/doctors" element={
            <ProtectedRoute allowedRoles={['patient']}>
              <DoctorsList />
            </ProtectedRoute>
          } />
          <Route path="/patient/book" element={
            <ProtectedRoute allowedRoles={['patient']}>
              <BookingPage />
            </ProtectedRoute>
          } />
          <Route path="/patient/appointments" element={
            <ProtectedRoute allowedRoles={['patient']}>
              <MyAppointments />
            </ProtectedRoute>
          } />

          {/* Doctor Routes */}
          <Route path="/doctor/dashboard" element={
            <ProtectedRoute allowedRoles={['doctor', 'admin']}>
              <DoctorDashboard />
            </ProtectedRoute>
          } />

          {/* Admin Routes */}
          <Route path="/admin/dashboard" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          } />
          <Route path="/admin/doctors" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          } />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
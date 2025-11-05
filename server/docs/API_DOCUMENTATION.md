# GAU-ID-View Backend API Documentation

## Overview

The GAU-ID-View Backend API is a production-ready Flask application that powers the Garissa University Student ID Management System. It provides secure endpoints for student registration, ID application management, and administrative functions.

## 🚀 Quick Start

### Prerequisites
- Python 3.8+
- pip
- Virtual environment (recommended)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Gau-id-view/server
   ```

2. **Create virtual environment**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

5. **Initialize database**
   ```bash
   python seed_db.py
   ```

6. **Run the application**
   ```bash
   python app.py
   ```

The API will be available at `http://localhost:5000`

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `SECRET_KEY` | Flask secret key | Generated |
| `JWT_SECRET_KEY` | JWT token secret | Generated |
| `FLASK_ENV` | Environment (development/production) | development |
| `DATABASE_URL` | Database connection string | SQLite local |
| `UPLOAD_FOLDER` | File upload directory | uploads |
| `MAIL_SERVER` | SMTP server for emails | smtp.gmail.com |
| `MAIL_PORT` | SMTP port | 587 |
| `MAIL_USERNAME` | SMTP username | - |
| `MAIL_PASSWORD` | SMTP password | - |

### Database Configuration

The application uses SQLite by default for development. For production, configure a PostgreSQL or MySQL database:

```bash
DATABASE_URL=postgresql://username:password@host:port/database
```

## 📚 API Endpoints

### Authentication (`/auth`)

#### POST `/auth/register`
Register a new student account.

**Request Body:**
```json
{
  "name": "John Doe",
  "reg_number": "S110/2024/001",
  "email": "john.doe@student.gau.ac.ke",
  "password": "SecurePassword123",
  "department": "Computer Science",
  "course": "Bachelor of Computer Science",
  "year_of_study": "Year 1"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Registration successful",
  "data": {
    "user": { ... },
    "profile": { ... }
  }
}
```

#### POST `/auth/login`
Authenticate user and get JWT token.

**Request Body:**
```json
{
  "email": "john.doe@student.gau.ac.ke",
  "password": "SecurePassword123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "access_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
    "refresh_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
    "user": { ... }
  }
}
```

#### GET `/auth/verify`
Verify JWT token and get user info.

**Headers:**
```
Authorization: Bearer <access_token>
```

#### PUT `/auth/change-password`
Change user password.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Request Body:**
```json
{
  "current_password": "OldPassword123",
  "new_password": "NewPassword456"
}
```

### Student Endpoints (`/student`)

#### GET `/student/profile`
Get student profile information.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response:**
```json
{
  "success": true,
  "message": "Profile retrieved successfully",
  "data": {
    "user": { ... },
    "profile": { ... }
  }
}
```

#### PUT `/student/update`
Update student profile information.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Request Body:**
```json
{
  "phone": "+254712345678",
  "address": "P.O. Box 1234, Nairobi",
  "next_of_kin": "Jane Doe",
  "next_of_kin_phone": "+254722987654"
}
```

#### POST `/student/upload-photo`
Upload student photo.

**Headers:**
```
Authorization: Bearer <access_token>
Content-Type: multipart/form-data
```

**Form Data:**
- `photo`: Image file (PNG, JPG, JPEG, GIF)

#### GET `/student/status`
Get ID application status.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "current_status": "approved",
    "progress_percentage": 60,
    "id_number": "GAU202400001",
    "status_history": [...],
    "next_steps": "Your ID card has been approved..."
  }
}
```

#### GET `/student/notifications`
Get student notifications.

**Headers:**
```
Authorization: Bearer <access_token>
```

### Admin Endpoints (`/admin`)

All admin endpoints require `admin` or `staff` role.

#### GET `/admin/dashboard`
Get admin dashboard statistics.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "summary": {
      "total_students": 1247,
      "pending_applications": 23,
      "today_registrations": 5
    },
    "status_breakdown": {...},
    "department_stats": [...],
    "monthly_registrations": [...]
  }
}
```

#### GET `/admin/students`
Get paginated list of students.

**Query Parameters:**
- `page`: Page number (default: 1)
- `per_page`: Items per page (default: 20, max: 100)
- `department`: Filter by department
- `status`: Filter by application status
- `search`: Search by name, email, or registration number

#### PUT `/admin/approve/{student_id}`
Approve student ID application.

**Request Body:**
```json
{
  "notes": "Application approved - all documents verified"
}
```

#### PUT `/admin/reject/{student_id}`
Reject student ID application.

**Request Body:**
```json
{
  "reason": "Missing passport photo",
  "notes": "Please resubmit with proper documentation"
}
```

#### POST `/admin/bulk-approve`
Bulk approve multiple applications.

**Request Body:**
```json
{
  "student_ids": [1, 2, 3, 4, 5],
  "notes": "Bulk approved after verification"
}
```

#### POST `/admin/announcement`
Create system announcement.

**Request Body:**
```json
{
  "title": "System Maintenance Notice",
  "message": "The system will be down for maintenance...",
  "priority": "high",
  "target_role": "all",
  "expires_at": "2024-12-31T23:59:59Z"
}
```

#### GET `/admin/analytics`
Get detailed analytics and statistics.

**Query Parameters:**
- `days`: Number of days for analytics (default: 30)

#### GET `/admin/export/students`
Export students data as CSV.

**Query Parameters:**
- Same filters as `/admin/students`

## 🔐 Authentication & Authorization

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <access_token>
```

### Roles
- `student`: Can manage their own profile and view application status
- `staff`: Can review applications and manage students
- `admin`: Full access to all endpoints and system management

### Token Expiry
- Access tokens: 24 hours
- Refresh tokens: 30 days

## 📊 Database Schema

### User
- `id`: Primary key
- `name`: Full name
- `reg_number`: Registration number (unique)
- `email`: Email address (unique)
- `password_hash`: Hashed password
- `department`: Academic department
- `role`: User role (student, staff, admin)
- `is_active`: Account status
- `created_at`: Creation timestamp

### StudentProfile
- `id`: Primary key
- `user_id`: Foreign key to User
- `phone`: Phone number
- `date_of_birth`: Date of birth
- `address`: Physical address
- `next_of_kin`: Emergency contact name
- `next_of_kin_phone`: Emergency contact phone
- `id_number`: Generated GAU ID number
- `photo_url`: Profile photo path
- `course`: Academic course
- `year_of_study`: Current year
- `status`: Application status (pending, approved, etc.)
- `submitted_at`: Application submission date
- `approved_at`: Approval date
- `expiry_date`: ID card expiry date

### AdminActivity
- `id`: Primary key
- `admin_id`: Foreign key to User (admin)
- `action`: Action performed
- `target_user_id`: Target user (if applicable)
- `details`: Action details
- `timestamp`: Action timestamp
- `ip_address`: Admin IP address

### Announcement
- `id`: Primary key
- `title`: Announcement title
- `message`: Announcement content
- `priority`: Priority level
- `target_role`: Target audience
- `created_by`: Creator user ID
- `created_at`: Creation timestamp
- `expires_at`: Expiry timestamp

## 🔒 Security Features

1. **Password Hashing**: Using bcrypt for secure password storage
2. **JWT Authentication**: Stateless token-based authentication
3. **Role-Based Access Control**: Different permission levels
4. **Input Validation**: Comprehensive data validation
5. **CORS Protection**: Configured for specific origins
6. **Rate Limiting**: Protection against abuse
7. **SQL Injection Prevention**: Using SQLAlchemy ORM
8. **File Upload Security**: Validated file types and sizes
9. **Audit Logging**: All admin actions are logged

## 🚀 Deployment

### Development
```bash
python app.py
```

### Production with Gunicorn
```bash
gunicorn --config gunicorn.conf.py wsgi:app
```

### Docker
```bash
docker build -t gau-id-view-backend .
docker run -p 5000:5000 gau-id-view-backend
```

### Docker Compose
```bash
docker-compose up -d
```

## 🧪 Testing

Run the test suite:
```bash
pytest tests/ -v
```

Run specific test file:
```bash
pytest tests/test_api.py -v
```

Run with coverage:
```bash
pytest --cov=. tests/
```

## 📝 API Response Format

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description",
  "errors": ["Specific error details"]
}
```

## 🔧 Troubleshooting

### Common Issues

1. **Database Connection Error**
   - Check DATABASE_URL in .env
   - Ensure database server is running

2. **JWT Token Errors**
   - Verify JWT_SECRET_KEY is set
   - Check token expiration

3. **File Upload Issues**
   - Verify UPLOAD_FOLDER permissions
   - Check file size limits

4. **Email Configuration**
   - Verify SMTP settings
   - Check firewall rules

### Logs

Application logs are stored in:
- Development: Console output
- Production: `logs/gau_id_view.log`

## 📞 Support

For technical support or questions:
- Email: admin@gau.ac.ke
- Documentation: [API Docs URL]
- Issues: [GitHub Issues URL]

## 📄 License

This project is licensed under the MIT License.
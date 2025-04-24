# Events App

A modern event management application built with Angular and Node.js.

## Features

### Admin Dashboard
- Secure admin login with role-based authentication
- Dashboard statistics:
  - Total users count
  - Active users (last 30 days)
  - Total venues
  - Total events
- Recent activity feed showing:
  - New user registrations
  - New event creations
  - New venue additions
- Quick action buttons for:
  - User management
  - Analytics
  - Venue management
  - Event management

### User Management
- User registration with role selection
- Secure login system
- Role-based access control
- User profile management

### Venue Management
- Venue registration and details
- Venue listing and search
- Venue statistics and analytics

### Event Management
- Event creation and management
- Event listing and search
- Event statistics and analytics

## Tech Stack

### Frontend
- Angular 17
- Angular Material UI
- TypeScript
- SCSS for styling
- RxJS for state management
- Standalone components architecture

### Backend
- Node.js
- Express.js
- MySQL database
- bcrypt for password hashing
- JWT for authentication

## Project Structure

```
events-app/
├── src/
│   ├── app/
│   │   ├── admin/
│   │   │   ├── components/
│   │   │   │   ├── admin-dashboard/
│   │   │   │   └── admin-login/
│   │   │   ├── guards/
│   │   │   ├── services/
│   │   │   └── admin.module.ts
│   │   ├── app.component.ts
│   │   ├── app.module.ts
│   │   └── app-routing.module.ts
│   └── environments/
├── backend/
│   ├── routes/
│   │   ├── admin.js
│   │   └── auth.js
│   ├── db.js
│   └── index.js
└── README.md
```

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MySQL database
- Angular CLI

### Installation

1. Clone the repository:
```bash
git clone [repository-url]
cd events-app
```

2. Install frontend dependencies:
```bash
npm install
```

3. Install backend dependencies:
```bash
cd backend
npm install
```

4. Set up the database:
- Create a MySQL database
- Update the database configuration in `backend/db.js`

5. Start the backend server:
```bash
cd backend
npm run dev
```

6. Start the frontend development server:
```bash
ng serve
```

7. Access the application:
- Frontend: http://localhost:4200
- Backend API: http://localhost:3001

## API Endpoints

### Admin Endpoints
- `POST /api/admin/login` - Admin login
- `GET /api/admin/dashboard/stats` - Get dashboard statistics
- `GET /api/admin/activity/recent` - Get recent activity

### Auth Endpoints
- `POST /auth/register` - User registration
- `POST /auth/login` - User login

### Venue Endpoints
- `PUT /api/venue` - Update venue details

## Security Features
- Password hashing with bcrypt
- Role-based access control
- Protected admin routes
- Secure token-based authentication

## Development

### Running Tests
```bash
ng test
```

### Building for Production
```bash
ng build --configuration production
```

## Development Notes

### Admin Access
During development, you can access the admin dashboard using these credentials:
- Username: `admin`
- Password: `admin123`

### Important Development Considerations
1. **Database Setup**:
   - Ensure MySQL is running locally
   - Create a database named `events_db` (or update the connection string in `backend/db.js`)
   - The application will create necessary tables on first run

2. **Environment Variables**:
   - Frontend: Update `src/environments/environment.ts` with your API URL
   - Backend: Create a `.env` file in the backend directory with:
     ```
     DB_HOST=localhost
     DB_USER=your_mysql_username
     DB_PASSWORD=your_mysql_password
     DB_NAME=events_db
     JWT_SECRET=your_jwt_secret
     ```

3. **Default Admin User**:
   - The first admin user needs to be created manually in the database
   - Use the following SQL to create the default admin:
     ```sql
     INSERT INTO users (username, password, role) 
     VALUES ('admin', '$2b$10$your_hashed_password', 'admin');
     ```

## Production Considerations

### Security Updates Required
1. **Change Default Credentials**:
   - Update the default admin credentials
   - Implement a proper admin registration system
   - Remove hardcoded credentials from the codebase

2. **Environment Configuration**:
   - Move all sensitive data to environment variables
   - Use different database credentials for production
   - Implement proper JWT secret rotation

3. **API Security**:
   - Implement rate limiting
   - Add CORS restrictions for production domains
   - Enable HTTPS
   - Add request validation middleware

4. **Database Security**:
   - Use production-grade database credentials
   - Implement database backup strategy
   - Set up proper database indexes
   - Configure connection pooling

5. **Error Handling**:
   - Implement proper error logging
   - Set up monitoring and alerts
   - Remove detailed error messages from production responses

### Performance Optimizations
1. **Frontend**:
   - Enable production mode
   - Implement lazy loading for routes
   - Optimize bundle size
   - Set up proper caching strategies

2. **Backend**:
   - Implement caching for frequently accessed data
   - Optimize database queries
   - Set up proper connection pooling
   - Configure load balancing if needed

### Deployment Checklist
1. **Infrastructure**:
   - Set up production server
   - Configure SSL certificates
   - Set up proper domain names
   - Configure firewall rules

2. **Monitoring**:
   - Set up application monitoring
   - Configure error tracking
   - Set up performance monitoring
   - Implement logging system

3. **Backup**:
   - Set up database backups
   - Configure automated backup schedules
   - Test backup restoration process

## Contributing
1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License
This project is licensed under the MIT License - see the LICENSE file for details.

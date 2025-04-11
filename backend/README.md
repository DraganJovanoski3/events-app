# Events App Backend

This is the backend for the Events App, providing API endpoints for user authentication, event management, and venue management.

## Database Setup

The application uses MySQL as its database. Follow these steps to set up the database:

1. Make sure you have MySQL installed and running on your system.

2. Create a `.env` file in the root directory with the following variables:
   ```
   DB_HOST=localhost
   DB_USER=your_mysql_username
   DB_PASSWORD=your_mysql_password
   DB_NAME=event_management
   ```

3. Install the dependencies:
   ```
   npm install
   ```

4. Run the database setup script:
   ```
   npm run setup-db
   ```

   This will create the database and all necessary tables.

## Database Schema

The database includes the following tables:

- **users**: Stores user account information
- **venues**: Stores venue information for bar owners
- **events**: Stores event information
- **event_attendees**: Tracks which users are attending which events
- **categories**: Stores event categories

## API Endpoints

The API provides the following endpoints:

### Authentication
- `POST /api/auth/register`: Register a new user
- `POST /api/auth/login`: Login a user

### Users
- `GET /api/users/profile`: Get the current user's profile
- `PUT /api/users/profile`: Update the current user's profile

### Events
- `GET /api/events`: Get all events (with optional filters)
- `GET /api/events/:id`: Get a specific event
- `POST /api/events`: Create a new event
- `PUT /api/events/:id`: Update an event
- `DELETE /api/events/:id`: Delete an event
- `POST /api/events/:id/attend`: Attend an event
- `DELETE /api/events/:id/attend`: Cancel attendance to an event

### Venues
- `GET /api/venues`: Get all venues
- `GET /api/venues/:id`: Get a specific venue
- `POST /api/venues`: Create a new venue
- `PUT /api/venues/:id`: Update a venue
- `DELETE /api/venues/:id`: Delete a venue

## Running the Server

To start the server in development mode with auto-restart:
```
npm run dev
```

To start the server in production mode:
```
npm start
``` 
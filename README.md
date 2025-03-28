# Events App

## Overview
This project is an Angular application that allows users to view events based on their location and register as users. It utilizes geolocation to fetch events relevant to the user's city.

## Components
- **Event List Component**: Displays a list of events based on the user's location. It uses the Geolocation API to determine the user's city and fetch events accordingly.
- **Login Component**: Allows users to log in to their accounts.
- **Register Component**: Provides a form for new users to register. It includes validation for user input.

## Services
- **Event Service**: Handles API calls to fetch events from the backend. It includes a method to get events filtered by city.
- **Auth Service**: Manages user authentication, including registration and login processes.

## Event Handling
The application uses the Geolocation API to get the user's current location and fetch events based on the city derived from the coordinates. If geolocation is not supported or the user denies access, default events are loaded.

## User Registration
The registration form includes fields for username, password, role, and optional fields for local owners. It validates input and handles successful registration by navigating to the login page.

## Geolocation
The application uses the browser's Geolocation API to determine the user's location and fetch relevant events. A dummy implementation is provided for city determination, which can be replaced with a proper reverse geocoding API.

## Installation
1. Clone the repository.
2. Run `npm install` to install dependencies.
3. Start the application with `ng serve`.

## License
This project is licensed under the MIT License.

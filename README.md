# Lift Maintenance - Frontend

Angular frontend application for the Lift Maintenance System. This application connects to the Spring Boot backend API.

## Quick Start

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm start
```

The application will be available at `http://localhost:4200`

## Project Structure

```
src/app/
├── components/
│   ├── lift-list/          # List all lifts with CRUD actions
│   ├── lift-form/          # Create/Edit lift form
│   └── lift-detail/        # View lift details + manage reminders
├── models/
│   └── lift.model.ts       # Lift and ReminderSetting interfaces
├── services/
│   ├── lift.service.ts     # HTTP calls for Lift API
│   └── reminder.service.ts # HTTP calls for Reminder API
├── app.component.ts        # Main app shell with navigation
├── app.module.ts         # Main module with imports
└── app-routing.module.ts # Route definitions
```

## Features

- **Lift Management**: Create, read, update, delete lifts
- **Lift Details**: View comprehensive lift information
- **Reminder Settings**: Add and manage maintenance reminders per lift
- **Responsive UI**: Modern, clean interface with Angular

## API Endpoints (Spring Boot Backend)

The frontend expects the backend to be running at `http://localhost:8080` with the following endpoints:

- `GET /api/lifts` - List all lifts
- `GET /api/lifts/{id}` - Get lift by ID
- `POST /api/lifts` - Create new lift
- `PUT /api/lifts/{id}` - Update lift
- `DELETE /api/lifts/{id}` - Delete lift
- `GET /api/lifts/{liftId}/reminders` - Get reminders for lift
- `POST /api/lifts/{liftId}/reminders` - Add reminder
- `PUT /api/lifts/{liftId}/reminders/{id}` - Update reminder
- `DELETE /api/lifts/{liftId}/reminders/{id}` - Delete reminder

## Build

```bash
npm run build
```

Output will be in the `dist/` directory.

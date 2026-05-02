# FemSecure

FemSecure is a MERN-based women safety application designed around fast emergency action, trusted contacts, community reporting, and practical safety guidance. The current implementation pairs a React dashboard with an Express and MongoDB backend using JWT authentication.

## Overview

The codebase supports the following user-facing flows:

- Phone/password registration and login.
- Emergency contact management per authenticated user.
- Safety concern reporting with common incident categories.
- Browser-based location capture.
- A simulated safety score based on coarse location rules.
- A simulated SOS alert and check-in timer experience.
- Static emergency numbers and safety tips.

## Architecture

- Frontend: React, Axios, React Scripts, Lucide React.
- Backend: Express, Mongoose, JWT, bcryptjs, CORS, dotenv.
- Storage: MongoDB.

The active app entrypoint is [frontend/src/index.js](frontend/src/index.js), which renders [frontend/src/App.jsx](frontend/src/App.jsx). The repository also contains a modular component set under [frontend/src/components](frontend/src/components) and a separate auth context in [frontend/src/AuthContext.js](frontend/src/AuthContext.js). Those modules are useful reference implementations, but the live shell is currently driven by `App.jsx`.

## Project Structure

```text
FemSecure/
├── backend/
│   ├── server.js
│   ├── config/
│   ├── middleware/
│   ├── models/
│   └── routes/
└── frontend/
    ├── public/
    └── src/
        ├── App.jsx
        ├── AuthContext.js
        ├── components/
        └── services/
```

## Implemented Features

- Authentication with JWT-based sessions stored in `localStorage`.
- User-scoped contacts and reports backed by MongoDB.
- Contact and report deletion restricted to the authenticated owner.
- Geolocation capture in the browser with a simple location readout.
- Check-in timer UI that simulates an expiry alert.
- SOS modal feedback for emergency-style actions.
- Safety resources with emergency numbers and best-practice tips.

## Backend API

Base URL: `http://localhost:5000/api`

Authentication:

- `POST /auth/register`
- `POST /auth/login`
- `GET /auth/me`

Contacts:

- `GET /contacts`
- `POST /contacts`
- `DELETE /contacts/:id`

Reports:

- `GET /reports`
- `POST /reports`
- `DELETE /reports/:id`

Profile:

- `PUT /profile/location`

## Data Models

- User: `name`, `phone`, optional `email`, hashed `password`, timestamps.
- Contact: `user`, `name`, `phone`, timestamps.
- Report: `user`, `type`, `location`, timestamps.

## Setup

### Prerequisites

- Node.js 18+ recommended.
- MongoDB running locally or a MongoDB Atlas connection string.

### Environment Variables

Create `backend/.env` with:

```env
MONGODB_URI=mongodb://localhost:27017/femsecure
JWT_SECRET=your_secure_jwt_secret
PORT=5000
```

If `MONGODB_URI` is omitted, the backend falls back to the local MongoDB URI shown above. If `JWT_SECRET` is omitted, the app uses a fallback secret, but a custom value is strongly recommended.

The frontend can optionally use `REACT_APP_API_URL` to override the API base URL. If it is not set, the frontend defaults to `http://localhost:5000/api`.

### Install Dependencies

```bash
cd backend
npm install

cd ../frontend
npm install
```

### Run the App

```bash
cd backend
npm run dev
```

```bash
cd frontend
npm start
```

The backend listens on `http://localhost:5000` by default and the frontend runs on `http://localhost:3000`.

## Current Implementation Notes

- The SOS alert, safety score, and missed check-in states are simulated in the UI and do not send real notifications.
- Reports and contacts are fully user-scoped on the backend.
- `PUT /api/profile/location` accepts coordinates but does not persist a full location history.
- `backend/routes/profile.js` currently exposes location updates without authentication middleware.
- The modular profile component expects a `PUT /profile` endpoint, but that route is not implemented in the backend.
- The repository contains both inline dashboard logic in `App.jsx` and modular components in `frontend/src/components`; the inline shell is the active one.

## Known Gaps

- No `.env.example` files are present yet.
- Some frontend modules use the shared Axios client while the main app shell still uses direct `fetch` calls.
- The app currently focuses on a simulated safety experience rather than live emergency integrations.

## Future Improvements

- Add authenticated profile persistence.
- Persist location history and safety state in MongoDB.
- Add SMS, push, or webhook-based emergency notifications.
- Replace simulated risk scoring with real map or incident data.
- Consolidate the frontend around either the inline shell or the modular component set.

## Author & Maintainer

**Darshan P Pawar**

- GitHub: [@DarshanPawar7](https://github.com/DarshanPawar7)
- Email: [darshanpawarworks@email.com](mailto:darshanpawarworks@email.com)
- LinkedIn: [Darshan P Pawar](https://www.linkedin.com/in/darshanpawar7/)

Maintained by Darshan P Pawar.

## License

No license has been specified yet.

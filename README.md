# AI Meeting Prep Assistant

MERN stack application that generates AI-powered meeting preparation briefs using Google Calendar and LinkedIn data.

## Features

- Firebase authentication
- Google Calendar integration
- AI meeting prep generation
- MongoDB caching
- Responsive UI

## Tech Stack

**Backend:** Node.js, Express, MongoDB, Firebase, Google Calendar API, OpenRouter  
**Frontend:** React, Vite, TailwindCSS, Firebase

## Quick Start

### Install Dependencies

```bash
cd Backend && npm install
cd ../frontend && npm install
```

### Configure Environment

**Backend/.env:**
```env
PORT=3000
MONGO_URI=mongodb://localhost:27017/meeting-prep
FIREBASE_SERVICE_ACCOUNT_PATH=firebase-service-account.json
GOOGLE_CLIENT_ID=your-client-id
GOOGLE_CLIENT_SECRET=your-client-secret
GOOGLE_REFRESH_TOKEN=your-refresh-token
RAPIDAPI_KEY=your-rapidapi-key
OPENROUTER_API_KEY=your-openrouter-key
```

**Frontend/.env:**
```env
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id
```

### Start Application

```bash
# Terminal 1 - Backend
cd Backend && npm start

# Terminal 2 - Frontend
cd frontend && npm run dev
```

Open http://localhost:5173

## License

ISC

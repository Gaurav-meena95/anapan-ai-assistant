# AI Meeting Prep Assistant

A full-stack web application that helps you prepare for meetings by automatically fetching upcoming events from Google Calendar and generating AI-powered preparation briefs using LinkedIn profile data.

## Features

- Secure authentication with Firebase
- Google Calendar integration to fetch upcoming meetings
- AI-generated meeting preparation briefs
- LinkedIn profile data extraction
- MongoDB for data persistence
- Responsive design for all devices

## Tech Stack

**Frontend:**
- React with Vite
- TailwindCSS for styling
- Firebase Authentication
- Lucide React for icons

**Backend:**
- Node.js & Express
- MongoDB with Mongoose
- Firebase Admin SDK
- Google Calendar API
- OpenRouter API for AI generation
- RapidAPI for LinkedIn data

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- Firebase project
- Google Cloud project with Calendar API enabled
- RapidAPI account
- OpenRouter API key

### Installation

1. Clone the repository
```bash
git clone <your-repo-url>
cd anapan-ai-assistant
```

2. Install backend dependencies
```bash
cd Backend
npm install
```

3. Install frontend dependencies
```bash
cd ../frontend
npm install
```

### Configuration

#### Backend Environment Variables

Create a `Backend/.env` file:

```env
PORT=3000
MONGO_URI=mongodb://localhost:27017/meeting-prep
NODE_ENV=development

# Firebase Configuration
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=your-service-account@project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour-Private-Key\n-----END PRIVATE KEY-----\n"

# Google Calendar API
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_REFRESH_TOKEN=your-refresh-token

# External APIs
RAPIDAPI_KEY=your-rapidapi-key
OPENROUTER_API_KEY=your-openrouter-api-key
```

#### Frontend Environment Variables

Create a `frontend/.env` file:

```env
VITE_API_URL=http://localhost:3000
VITE_FIREBASE_API_KEY=your-firebase-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id
```

### Running Locally

1. Start the backend server
```bash
cd Backend
npm run dev
```

2. Start the frontend development server
```bash
cd frontend
npm run dev
```

3. Open your browser and navigate to `http://localhost:5173`

## Deployment

### Backend (Render)

1. Create a new Web Service on Render
2. Connect your repository
3. Set root directory to `Backend`
4. Add all environment variables from `.env`
5. Deploy

### Frontend (Vercel)

1. Import your repository to Vercel
2. Set root directory to `frontend`
3. Add environment variables:
   - `VITE_API_URL` = your backend URL (e.g., `https://your-backend.onrender.com`)
   - All Firebase config variables
4. Deploy

## Project Structure

```
├── Backend/
│   ├── src/
│   │   ├── Config/         # Database and API configurations
│   │   ├── controllers/    # Request handlers
│   │   ├── middleware/     # Authentication middleware
│   │   ├── models/         # MongoDB schemas
│   │   ├── routes/         # API routes
│   │   └── services/       # Business logic
│   ├── index.js            # Entry point
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── Auth/           # Login and auth components
    │   ├── Dashboard/      # Main dashboard
    │   ├── firebase.js     # Firebase config
    │   └── main.jsx        # Entry point
    └── package.json
```

## API Endpoints

### Meetings
- `GET /api/meetings/upcoming` - Fetch upcoming meetings from Google Calendar

### Prep
- `POST /api/prep/generate` - Generate AI meeting preparation brief

## How It Works

1. User logs in with Firebase authentication
2. Backend fetches upcoming meetings from Google Calendar
3. User selects a meeting and attendee
4. System searches for attendee's LinkedIn profile
5. AI generates a personalized meeting prep brief
6. User reviews the preparation notes

## Contributing

Feel free to submit issues and pull requests.

## License

ISC

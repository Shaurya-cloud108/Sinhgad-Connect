# Sinhgad Alumni Connect

A comprehensive Next.js-based social networking platform designed specifically for alumni of Sinhgad College. It serves as a hub for connecting graduates, facilitating professional networking, job opportunities, and community engagement.

## 🚀 Features

- **Real-time Social Feed** - Instagram-style stories, posts, likes, and comments
- **Alumni Directory** - Searchable directory by graduation year, field, industry
- **Job Portal** - Post and discover career opportunities
- **Groups & Communities** - Join groups based on interests and departments
- **Events & Reunions** - Create and manage alumni events
- **Success Stories** - AI-powered career achievement tracking
- **Real-time Messaging** - Direct messaging with typing indicators
- **Live Notifications** - Real-time updates for all activities
- **Online Presence** - See who's online and their last activity

## 🛠️ Technology Stack

- **Frontend**: Next.js 15, React 18, TypeScript
- **Styling**: Tailwind CSS with custom design system
- **UI Components**: Radix UI primitives
- **Database**: Firebase Firestore + Realtime Database
- **Authentication**: Firebase Auth (Google & Email)
- **AI Integration**: Google AI Genkit
- **Deployment**: Firebase App Hosting

## 🔥 Firebase Setup

### 1. Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project with ID: `sinhgad-alumni-connect`
3. Enable the following services:
   - **Firestore Database** (for structured data)
   - **Realtime Database** (for chat & live updates)
   - **Authentication** (enable Google & Email providers)
   - **Storage** (for file uploads)

### 2. Get Firebase Configuration

1. Go to Project Settings > General
2. Add a web app and copy the configuration
3. Update `.env.local` with your Firebase config:

```bash
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=sinhgad-alumni-connect.firebaseapp.com
NEXT_PUBLIC_FIREBASE_DATABASE_URL=https://sinhgad-alumni-connect-default-rtdb.firebaseio.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=sinhgad-alumni-connect
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=sinhgad-alumni-connect.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id_here
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id_here
```

### 3. Deploy Security Rules

Deploy the security rules to protect your data:

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login to Firebase
firebase login

# Deploy Firestore rules
firebase deploy --only firestore:rules

# Deploy Realtime Database rules
firebase deploy --only database
```

### 4. Seed the Database

Populate your database with initial mock data:

```bash
npm run seed-db
```

## 🚀 Getting Started

1. **Clone the repository**
```bash
git clone <repository-url>
cd sinhgad-alumni-connect
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp .env.local.example .env.local
# Update with your Firebase configuration
```

4. **Run the development server**
```bash
npm run dev
```

5. **Open your browser**
Navigate to [http://localhost:9002](http://localhost:9002)

## 📱 Real-time Features

### Chat System
- **Real-time messaging** with typing indicators
- **Online presence** tracking
- **Message history** with pagination
- **File sharing** support

### Live Updates
- **Post engagement** (likes, comments) updates in real-time
- **Story views** tracking
- **Push notifications** for all activities
- **Live feed** updates without page refresh

### Offline Support
- **Offline data persistence** with automatic sync when online
- **Optimistic updates** for better UX
- **Background sync** for failed operations

## 🏗️ Architecture

### Database Structure

**Firestore (Complex Queries & Offline Support)**
```
/users/{userId}           - User profiles
/posts/{postId}           - Social media posts
/jobs/{jobId}             - Job listings
/events/{eventId}         - Alumni events
/groups/{groupId}         - Community groups
/successStories/{storyId} - Achievement stories
/notifications/{notifId}  - User notifications
```

**Realtime Database (Live Updates)**
```
/conversations/{convId}   - Chat conversations
/notifications/{userId}   - Real-time notifications
/presence/{userId}        - Online status
/typing/{convId}          - Typing indicators
/postEngagement/{postId}  - Live post stats
/storyViews/{storyId}     - Story view tracking
```

## 🎨 Design System

- **Primary Color**: Deep Crimson (#8B0000) - Sinhgad's heritage
- **Background**: Light Beige (#F5F5DC) - Neutral canvas
- **Accent**: Gold (#FFD700) - Excellence and achievement
- **Typography**: Playfair Display (headlines) + PT Sans (body)

## 🔒 Security

- **Firebase Security Rules** protect all data access
- **User authentication** required for most operations
- **Role-based permissions** for groups and events
- **Data validation** on both client and server
- **Secure file uploads** with size and type restrictions

## 📱 Mobile Support

- **Progressive Web App** (PWA) capabilities
- **Touch-optimized** interactions
- **Responsive design** across all screen sizes
- **Bottom navigation** for mobile users
- **Offline functionality** with service workers

## 🤖 AI Features

- **Success story generation** using Google AI Genkit
- **Career advice** and mentorship suggestions
- **Content recommendations** based on user interests
- **Smart notifications** to reduce noise

## 🚀 Deployment

The app is configured for Firebase App Hosting:

```bash
# Deploy to Firebase
firebase deploy
```

## 📊 Analytics & Monitoring

- **Firebase Analytics** for user behavior tracking
- **Performance Monitoring** for app performance
- **Crashlytics** for error tracking
- **Real-time database monitoring** for system health

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation in `/docs`

---

**Built with ❤️ for the Sinhgad Alumni Community**

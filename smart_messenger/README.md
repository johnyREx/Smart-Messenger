# Smart Messenger

## A Full Stack Chat Application using React and Firebase

### App Preview

Smart Messenger Preview Video

### Features

- Group Chats
- Google Sign In
- Sending Images
- Profile Editing
- View Other Users' Profiles
- Show Unread Messages Count
- Edit / Delete Messages
- Light / Dark mode toggler

### Setup Firebase Project

1. **Create Firebase Project**
   
2. **Enable Authentication (Email and Google Auth)**
   
3. **Enable Firestore DB and Storage**

4. **Create Collections**
   - users
   - userChats
   - chats
   - globalChats

### Installation Process

**Step 1: Clone Repository and Install Packages**
```bash
git clone https://github.com/johnyREX/Webstack-Portfolio-Project && cd Webstack-Portfolio-Project && npm install

Step 2: Create firebaseConfig.ts file inside src/setup/firebase directory.

// firebaseConfig.ts
export const firebaseConfig = {
  apiKey: "",
  authDomain: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: "",
  measurementId: "",
};

Step 3: Start the development server.

npm start

Support
You can support this project by leaving a star. Thank you! 😁

Authors
johnyREX

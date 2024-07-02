Smart Messenger is a robust full-stack chat application built using React and Firebase. It offers a seamless user experience with features such as group chats, Google Sign-In, image sharing, profile editing, and more. Users can interact in real-time, manage messages, toggle between light and dark modes, and look forward to upcoming features like voice messaging, video calling, and advanced message handling capabilities. Smart Messenger is designed to be flexible, scalable, and integrate smoothly with Firebase for authentication, database storage, and more.

## Authors

- [johnyREx](https://github.com/johnyREx)


### App Preview

![Sign In](./public/assets/SignIn.png)
![Sign Up](./public/assets/Signup.png)
![logged In](./public/assets/loggedIn.png)

### SMART MESSENGER
![Review](./public/assets/review.gif)

### Features

- Group Chats
- Google Sign In
- Sending Images
- Profile Editing
- View Other Users' Profiles
- Show Unread Messages Count
- Edit / Delete Messages
- Light / Dark mode toggler

### Upcoming Features

- Voice Messaging
- Video Calling
- Message Reactions
- Message Threads
- Message Search
- Push Notifications
- File Sharing (documents, videos, etc.)
- Location Sharing
- Integration with Other Services (calendar, task management)
- Message Translation
- Customizable Themes (beyond light/dark mode)
- Analytics and Insights
- Read Receipts
- Mentions and Notifications (@mentions)
- Moderation Tools

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


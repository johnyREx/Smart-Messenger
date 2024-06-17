import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { createGlobalChat } from "utils";

const firebaseConfig = {
    apiKey: "AIzaSyCO6BEQH0Amapa__sykKrpkBOJlOVAKEuI",
    authDomain: "smart-student-you-message.firebaseapp.com",
    projectId: "smart-student-you-message",
    storageBucket: "smart-student-you-message.appspot.com",
    messagingSenderId: "195836820630",
    appId: "1:195836820630:web:7bef4527b228319a3d16b7",
    measurementId: "G-N9B67QHK22"
  };
  
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const googleAuthProvider = new GoogleAuthProvider();

// Creates a global test group to play around with once.
createGlobalChat(db);

// Firestore rule

// rules_version = '2';
// service cloud.firestore {
//   match /databases/{database}/documents {
//     match /users/{userId} {
//       allow create
//       allow read, write : if request.auth.uid != null
//     }

//     match /userChats/{userId} {
//       allow read, write : if request.auth.uid != null
//     }

//     match /chats/{chat} {
//       allow read, write : if request.auth.uid != null
//     }

//     match /groupChats/{groupChat} {
//       allow read, write : if request.auth.uid != null
//     }
//   }
// }

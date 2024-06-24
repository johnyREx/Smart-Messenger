import {
  arrayUnion,
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import { User, UserChat } from "interfaces";
import { db } from "setup/firebase";
import { createCombinedId } from "utils";

const useAddContact = () => {
  const addContact = async (currentUser: User, recipient: User) => {
    try {
      const combinedId = createCombinedId(currentUser.uid, recipient.uid);

      const userDocRef = doc(db, "users", currentUser.uid);
      const recipientDocRef = doc(db, "users", recipient.uid);

      const chatDocRef = doc(db, "chats", String(combinedId));
      const chatDocData = await getDoc(chatDocRef);

      const userChatDocRef = doc(db, "userChats", String(currentUser.uid));
      const recipientChatDocRef = doc(db, "userChats", String(recipient.uid));

      if (!chatDocData.exists()) {
        await setDoc(chatDocRef, { messages: [] });

        await updateDoc(userDocRef, {
          contacts: arrayUnion(recipient.uid),
        });

        await updateDoc(recipientDocRef, {
          contacts: arrayUnion(currentUser.uid),
        });

        const userChatInfo: UserChat = {
          isGroup: false,
          active: false,
          unread: false,
          unreadMsgCount: 0,
          userInfo: {
            uid: recipient.uid,
          },
          lastMessage: {
            message: "contacted user.",
            date: serverTimestamp() as Timestamp,
          },
        };

        await updateDoc(userChatDocRef, {
          [combinedId]: userChatInfo,
        });

        const recipientChatInfo: UserChat = {
          ...userChatInfo,
          userInfo: {
            uid: currentUser.uid,
          },
        };

        await updateDoc(recipientChatDocRef, {
          [combinedId]: recipientChatInfo,
        });
      }
    } catch (error) {
      throw error;
    }
  };
  return addContact;
};

export default useAddContact;


// The useAddContact custom hook encapsulates the logic for adding a new contact between two users in the Firestore database.
// It defines an addContact function that manages the asynchronous operation of updating both users' contact lists and creating chat documents if necessary.
// Firestore API methods like setDoc and updateDoc are utilized to update user documents and chat documents atomically.
// The hook ensures that contact addition operations are performed securely and efficiently, handling edge cases such as existing chat documents.
// By abstracting contact addition logic into a reusable hook, it promotes code reusability and maintains separation of concerns within the application's data layer.

import { doc, getDoc, setDoc, Timestamp } from "firebase/firestore";
import { GroupChat } from "interfaces";

const createGlobalChat = async (db: any) => {
  const globalChatID = "HSEgujrHH66JVwXmg7QG";

  const globalChatRef = doc(db, "groupChats", globalChatID);
  const globalChatDoc = await getDoc(globalChatRef);

  if (!globalChatDoc.exists()) {
    const chatsRef = doc(db, "chats", globalChatID);

    const globalChatInfo: GroupChat = {
      isGroup: true,
      ownerUID: "",
      groupID: globalChatID,
      groupName: "Global Chat",
      groupAdmins: [],
      membersID: [],
      dateCreated: Timestamp.now(),
      lastMessage: {
        message: "Group Created.",
        date: Timestamp.now(),
      },
      photoURL:
        "https://media.istockphoto.com/vectors/work-from-anywhere-around-the-world-remote-working-or-freelance-or-vector-id1340230976?b=1&k=20&m=1340230976&s=612x612&w=0&h=xun7tll_qGMQd0pI0HQ4JuXUjWAk_vij24Kcm4qtBQI=",
    };

    setDoc(globalChatRef, globalChatInfo);

    setDoc(chatsRef, {
      messages: [],
    });
  }
};

export default createGlobalChat;

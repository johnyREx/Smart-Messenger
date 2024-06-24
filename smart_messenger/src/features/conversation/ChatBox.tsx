import { memo, SyntheticEvent, useEffect, useRef, useState } from "react";

import { AiOutlineArrowDown } from "react-icons/ai";
import { AnimatePresence, motion } from "framer-motion";
import { ErrorMsg, LoadingSpinner, Modal, TwButton } from "components";

import MessageBox from "./MessageBox";
import ChatHeader from "./ChatHeader";
import ChatForm from "./ChatForm";
import { Message, User } from "interfaces";
import { useAppSelector } from "hooks";
import { getChatState } from "features/inbox/chatReducer";
import { doc, getDoc, onSnapshot, updateDoc } from "firebase/firestore";
import { db } from "setup/firebase";
import { start_chatting } from "assets/images";
import { getUserState } from "features/authentication/userSlice";

interface ChatBoxProps {
  recipient: User;
}

const ChatBox = ({ recipient }: ChatBoxProps) => {
  const [showArrowDown, setShowArrowDown] = useState(false);
  const conversationContainer = useRef<HTMLDivElement>(null);
  const scrollToBottomRef = useRef<HTMLSpanElement>(null);
  const [fetchedMsgs, setFetchedMsgs] = useState<Message[]>([]);

  const [latestDocSlice, setLatestDocSlice] = useState<any>(0);

  const [messages, setMessages] = useState<Message[]>([]);
  const [isPending, setIsPending] = useState<boolean>(false);

  const { chatId, isGroup } = useAppSelector(getChatState);
  const { user: currentUser } = useAppSelector(getUserState);

  const [isEditingMsg, setIsEditingMsg] = useState(false);
  const editingMsgRef = useRef();

  const conversationDocRef = chatId && doc(db, "chats", chatId);
  const userChatDocRef = doc(db, "userChats", currentUser.uid);

  const scrollDown = () => {
    scrollToBottomRef?.current?.scrollIntoView({ behavior: "smooth" });
  };

  const chatBoxScrollHandler = (event: SyntheticEvent) => {
    const target = event.currentTarget;
    if (target.scrollHeight - target.scrollTop > target.clientHeight + 300) {
      setShowArrowDown(true);
    } else {
      setShowArrowDown(false);
    }

    const container = conversationContainer.current;

    if (!container) return;

    let triggerHeight = container.scrollTop === 0;
    if (triggerHeight) {
      setLatestDocSlice((state: number) => (state -= 15));
    }
  };

  const unreadMsg = async () => {
    // handle number of unread messages
    // Seen the conversation
    if (isGroup) return;

    updateDoc(userChatDocRef, {
      [chatId + ".unread"]: false,
      [chatId + ".unreadMsgCount"]: 0,
      [chatId + ".active"]: true,
    });
  };

  const scrollToBottom = () => {
    scrollToBottomRef?.current?.scrollIntoView();
  };

  useEffect(() => {
    if (!chatId) return;

    setLatestDocSlice(-15);

    setIsPending(true);
    setMessages([]);

    unreadMsg();

    const unsub = onSnapshot(conversationDocRef, (doc: any) => {
      if (!doc.exists()) return;

      setFetchedMsgs(doc.data().messages);
      setIsPending(false);
      // Needs to delay abit for it to work properly
      setTimeout(() => scrollToBottom(), 1);
    });

    return () => {
      unsub();

      !isGroup &&
        updateDoc(userChatDocRef, {
          [chatId + ".active"]: false,
        });
    };
  }, [chatId]);

  useEffect(() => {
    if (!fetchedMsgs.length) return;

    if (messages.length === fetchedMsgs.length) return;

    setMessages(fetchedMsgs.slice(latestDocSlice));
  }, [latestDocSlice, fetchedMsgs]);

  return (
    <section className="flex h-full w-full">
      <div className="bg-secondary w-full flex flex-col">
        <ChatHeader recipient={recipient} />

        <div className="flex flex-grow items-center justify-center">
          {isPending && <LoadingSpinner msg="fetching messages..." />}

          {!messages.length && !isPending && (
            <ErrorMsg
              className="w-44 sm:w-64 mb-5 self-center justify-self-center"
              img={start_chatting}
              msg="Your conversation is empty."
              subMsg="start chatting below"
            />
          )}
        </div>

        {messages.length !== 0 && (
          <main
            ref={conversationContainer}
            onScroll={chatBoxScrollHandler}
            className="relative flex flex-col overflow-y-scroll overflow-x-hidden px-4 scrollbar-hide"
          >
            {messages
              .sort((a: any, b: any) => a.date.toDate() - b.date.toDate())
              .map((currentMsg: Message, i: any) => (
                <MessageBox
                  key={currentMsg.id}
                  currentMsg={currentMsg}
                  isEditingMsg={isEditingMsg}
                  editingMsgRef={editingMsgRef}
                  setIsEditingMsg={setIsEditingMsg}
                  scrollToBottom={scrollToBottom}
                />
              ))}
            <span ref={scrollToBottomRef}></span>
          </main>
        )}

        <div className="w-full flex items-center relative gap-2 p-4 pt-0">
          <AnimatePresence>
            {showArrowDown && (
              <motion.div
                animate={{ opacity: 1, x: "-50%" }}
                initial={{ opacity: 0, x: "-50%" }}
                exit={{ opacity: 0, x: "-50%" }}
                className="absolute -top-3/4 left-1/2 z-10"
              >
                <TwButton onClick={scrollDown} className="rounded-full px-2">
                  <AiOutlineArrowDown className="text-xl text-white " />
                </TwButton>
              </motion.div>
            )}
          </AnimatePresence>

          {chatId && (
            <ChatForm
              isEditingMsg={isEditingMsg}
              editingMsgRef={editingMsgRef}
              setIsEditingMsg={setIsEditingMsg}
            />
          )}
        </div>
      </div>
    </section>
  );
};

export default ChatBox;


// The ChatBox component manages the display and interaction of messages within a conversation.
// It utilizes useRef to manage scrolling behavior and state hooks like useState to track message data and loading states.
// The component fetches messages from Firestore using onSnapshot for real-time updates and handles message pagination by loading older messages when the user scrolls to the top.
// User actions such as scrolling, fetching messages, and marking messages as read are handled efficiently to ensure smooth user experience.
// Conditional rendering is used to display loading spinners while fetching messages and error messages for empty conversations.
// It integrates with other components like ChatHeader for displaying recipient information and ChatForm for sending messages.
// Overall, the ChatBox component provides a responsive and interactive messaging interface within the application.

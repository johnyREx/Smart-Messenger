import { getUserState } from "features/authentication/userSlice";
import { motion } from "framer-motion";
import { useAppDispatch, useAppSelector, useGetUser } from "hooks";
import { Message, User } from "interfaces";
import { useFormatDate } from "hooks";
import React, { memo, useEffect, useState } from "react";
import { ProfilePicture, SharedLayout, TwTooltip } from "components";
import { VARIANTS_MANAGER } from "setup/variants-manager";
import { getChatState, resetChat } from "features/inbox/chatReducer";
import { BsFillTrashFill, BsPencilFill } from "react-icons/bs";
import useSendMessage from "./useSendMessage";
import { AiOutlineStop } from "react-icons/ai";
import { showUserProfile } from "reducers/sideContentReducer";

interface MessageBoxProps {
  currentMsg: Message;
  editingMsgRef: any;
  isEditingMsg: boolean;
  setIsEditingMsg: (state: boolean) => void;
  scrollToBottom: () => void;
}

const MessageBox = ({
  currentMsg,
  editingMsgRef,
  isEditingMsg,
  setIsEditingMsg,
  scrollToBottom,
}: MessageBoxProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [msgDate, setMsgDate] = useState("");
  const [senderData, setSenderData] = useState<User>();

  const isEditingThisMsg = isEditingMsg && editingMsgRef.current === currentMsg;

  const { user: currentUser } = useAppSelector(getUserState);
  const { isGroup } = useAppSelector(getChatState);

  const getUserInfo = useGetUser();
  const formatDate = useFormatDate();
  const dispatch = useAppDispatch();

  const { deleteMsg } = useSendMessage();

  const isCurrentUser = currentMsg.senderId === currentUser.uid;

  const deleteBtnHandler = (msg: Message) => {
    deleteMsg(msg);
  };

  const editBtnHandler = () => {
    setIsEditingMsg(true);
    editingMsgRef.current = currentMsg;
  };

  const profileClickHandler = () => {
    // 768px screen width below have the mobile layout
    if (screen.width <= 768) {
      dispatch(resetChat());
    }

    dispatch(showUserProfile({ userProfileData: senderData as User }));
  };

  useEffect(() => {
    if (isGroup) {
      getUserInfo(currentMsg.senderId).then((senderData) => {
        setSenderData(senderData);
      });
    }

    const date = formatDate(currentMsg.date.toDate());
    setMsgDate(date as string);
  }, []);

  return (
    <motion.div
      variants={VARIANTS_MANAGER}
      initial="fade-out"
      animate="fade-in"
      className={`group gap-2 py-1 flex  

      ${isCurrentUser ? "flex-row-reverse" : ""}`}
    >
      <div
        className={`flex flex-col gap-0.5 duration-300
        
        ${isEditingThisMsg && "-translate-x-3"}
        
        ${isCurrentUser ? "items-end" : "items-start"}`}
      >
        {currentMsg.img ? (
          <motion.img
            src={currentMsg.img}
            layoutId={`${currentMsg.id}`}
            onClick={() => {
              setIsExpanded(true);
            }}
            className={`${
              isExpanded && "invisible"
            }  sm:w-64 bg-muted-dark/10 rounded-xl cursor-pointer`}
          />
        ) : (
          ""
        )}

        {currentMsg.img && (
          <SharedLayout
            isExpanded={isExpanded}
            onClick={() => {
              setIsExpanded(false);
            }}
          >
            {isExpanded && (
              <motion.img
                src={currentMsg.img}
                layoutId={`${currentMsg.id}`}
                className="w-96 cursor-pointer  bg-muted-dark/10 rounded-xl"
              />
            )}
          </SharedLayout>
        )}

        {currentMsg.message && (
          <div
            className={`flex gap-2 items-end ${
              isCurrentUser ? "flex-row-reverse" : ""
            }`}
          >
            {isGroup && !isCurrentUser && (
              <button onClick={profileClickHandler}>
                <ProfilePicture
                  size="small"
                  isOnline={false}
                  photoURL={senderData?.photoURL}
                />
              </button>
            )}

            <button
              disabled={isEditingMsg ? true : false}
              className={`
              peer flex rounded-3xl py-1.5 px-3 text-md max-w-xs w-fit h-fit text-start break-words 
              ${
                isCurrentUser
                  ? "focus:bg-primary-tinted  bg-primary-main text-white rounded-br-sm"
                  : "bg-white text-black rounded-bl-sm"
              }
            `}
            >
              {currentMsg.message}
            </button>
            {isEditingThisMsg && (
              <button
                className="relative"
                onClick={() => setIsEditingMsg(false)}
              >
                <AiOutlineStop className="text-2xl text" />
                <TwTooltip tip="cancel" position="top" />
              </button>
            )}
            {isCurrentUser && !isEditingMsg ? (
              <div className="flex translate-y-1/4 invisible group-hover:visible  rounded-full dark:bg-bgmain-dark shadow-md overflow-hidden ">
                <button
                  onClick={() => deleteBtnHandler(currentMsg)}
                  className="relative group text-muted p-2 hover:bg-muted-light/10 dark:hover:bg-muted-light flex justify-center items-center"
                >
                  <BsFillTrashFill className="" />
                </button>
                <button
                  onClick={() => editBtnHandler()}
                  className="relative group text-muted p-2  hover:bg-muted-light/10 dark:hover:bg-muted-light flex justify-center items-center"
                >
                  <BsPencilFill />
                </button>
              </div>
            ) : (
              ""
            )}
          </div>
        )}

        <div className="text-xs flex gap-1 items-center text-muted">
          {currentMsg.isEdited && <span className="text-muted">edited</span>}
          {isGroup && !isCurrentUser && (
            <>
              <p className={`${isCurrentUser ? "text-end" : "text-start"} `}>
                {senderData?.displayName}
              </p>

              <span> • </span>
            </>
          )}
          <time className="ml-auto">{msgDate}</time>
        </div>
      </div>
    </motion.div>
  );
};

export default memo(MessageBox);

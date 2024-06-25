import { AiOutlineArrowLeft } from "react-icons/ai";

import { ProfilePicture, TwButton } from "components";
import { User } from "interfaces";
import { useAppDispatch, useAppSelector } from "hooks";
import { getChatState, resetChat } from "features/inbox/chatReducer";
import { useGetUserStatus } from "hooks";
import { showUserProfile } from "reducers/sideContentReducer";

interface ChatHeaderProps {
  recipient: User;
}

const ChatHeader = ({ recipient }: ChatHeaderProps) => {
  const { isGroup } = useAppSelector(getChatState);
  const online = useGetUserStatus(recipient?.uid);

  const dispatch = useAppDispatch();

  const profileClickHandler = () => {
    // 768px screen width below have the mobile layout
    if (screen.width <= 768) {
      dispatch(resetChat());
    }

    dispatch(showUserProfile({ userProfileData: recipient }));
  };

  const handleBackBtn = () => {
    dispatch(resetChat());
  };

  return (
    <header className="border-b border-main w-full p-4  mb-auto bg-main duration-300 flex gap-2">
      <TwButton
        variant="transparent"
        onClick={handleBackBtn}
        className="md:hidden px-4"
      >
        <AiOutlineArrowLeft className="text-xl" />
      </TwButton>
      <div className="flex items-center gap-4">
        <button disabled={isGroup ? true : false} onClick={profileClickHandler}>
          <ProfilePicture
            isOnline={online}
            photoURL={recipient?.photoURL}
            size="small"
          />
        </button>
        <div className="flex flex-col gap-0">
          <h2 className="text text-xl">
            {recipient.displayName || recipient.groupName}
          </h2>
          {/* Disabled for now */}
          {/* {!isGroup && (
            <p className="text-muted text-sm">
              {online ? "online" : "offline"}
            </p>
          )} */}
        </div>
      </div>
    </header>
  );
};

export default ChatHeader;


// The ChatHeader component displays the header information for a chat conversation.
// It receives recipient data as props and renders their profile picture, display name, and online status.
// The component includes UI elements for additional actions like viewing user profile details or managing group chat settings.
// Conditional rendering handles different chat types, displaying appropriate icons or options based on the conversation context.
// User interactions such as clicking on profile pictures or icons are managed through event handlers to provide intuitive navigation and functionality.
// By encapsulating chat header details, this component enhances the chat experience by providing relevant context and navigation options.

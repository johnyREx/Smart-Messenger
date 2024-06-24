import { ProfilePicture, TwButton } from "components";

import { User } from "interfaces";
import { useState } from "react";
import { useAppDispatch } from "hooks";
import { createToast } from "toastSlice";
import { changeChat } from "features/inbox/chatReducer";
import useAddContact from "./useAddContact";
import { GoLocation } from "react-icons/go";
import { useGetUserStatus } from "hooks";

interface AddContactModalProps {
  setShowModal: (state: boolean) => void;
  setSearchVal: (state: string) => void;
  currentUser: User | undefined;
  recipient: User;
}

const AddContactModal = ({
  setShowModal,
  setSearchVal,
  currentUser,
  recipient,
}: AddContactModalProps) => {
  const [isPending, setIsPending] = useState(false);
  const online = recipient && useGetUserStatus(recipient.uid);

  const dispatch = useAppDispatch();
  const addContact = useAddContact();

  const addContactBtnHandler = async () => {
    try {
      if (!currentUser || !recipient) return;

      setIsPending(true);

      await addContact(currentUser, recipient);

      setSearchVal("");
      setShowModal(false);
      setIsPending(false);

      dispatch(changeChat({ recipient }));
      dispatch(createToast("Contact added successfuly."));
    } catch (error) {
      console.log(error);
    }
  };

  const isContacted = (userID: any) => {
    return currentUser?.contacts.find((contactId) => contactId === userID);
  };

  const cancelBtnHandler = () => setShowModal(false);

  return (
    <aside className="flex flex-col gap-4 py-2 w-44">
      <header className="flex flex-col items-center text-center px-8">
        <ProfilePicture
          isOnline={online || false}
          photoURL={recipient.photoURL}
          size="large"
        />

        <h2 className="text-lg text-black dark:text-white">
          {recipient.displayName}
        </h2>
        <p className="text-muted">{recipient.bio}</p>
        <p className="text-sm text-muted flex items-center gap-1">
          <GoLocation /> {recipient.location}
        </p>
      </header>

      <footer className="flex flex-col gap-2">
        {isContacted(recipient.uid) ? (
          <h1 className="text-green-500 text-center">Already in contact.</h1>
        ) : (
          <TwButton
            onClick={addContactBtnHandler}
            disabled={isPending}
            className="w-full flex justify-center py-1"
          >
            {isPending ? "Adding..." : "Add Contact"}
          </TwButton>
        )}
        <TwButton
          variant="transparent"
          onClick={cancelBtnHandler}
          disabled={isPending}
          className="w-full flex justify-center border border-muted-light/50 dark:border-muted-dark/50 py-1"
        >
          Cancel
        </TwButton>
      </footer>
    </aside>
  );
};

export default AddContactModal;


// The AddContactModal component facilitates the process of adding a new contact between the current user and a recipient user. 
// It presents a modal interface displaying recipient details including profile picture, display name, bio, and location. 
// The component uses useState hook to manage pending state when adding a contact and checks recipient's online status using useGetUserStatus custom hook.
// Redux integration is employed with useAppDispatch to dispatch actions for changing the current chat and creating toasts upon successful contact addition.
// The addContact function from useAddContact custom hook handles the asynchronous operation of adding a contact, updating both users' contact lists and creating a chat document if necessary.
// User interaction is managed through addContactBtnHandler which triggers the contact addition process and cancelBtnHandler to close the modal.
// Conditional rendering within the footer displays an "Add Contact" button if the recipient is not already in contacts, or a message indicating already being a contact if they are.
// Overall, the component enhances user experience by providing a clear interface for managing contacts while integrating seamlessly with application-wide state management and backend operations.

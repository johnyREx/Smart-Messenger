import { no_results } from "assets/images";
import { ErrorMsg, LoadingSpinner, ProfilePicture, TwButton } from "components";
import { getUserState } from "features/authentication/userSlice";
import { useAppSelector, useGetUsers } from "hooks";
import { User } from "interfaces";
import { useEffect, useRef, useState } from "react";
import { AiOutlineArrowLeft } from "react-icons/ai";

const memberBtnClass =
  "border-black text-black dark:border-white dark:text-white";
const nonMemberBtnClass =
  "ml-auto bg-black text-white dark:bg-white dark:text-black text-sm h-fit rounded-full";

interface AddMemberModalProps {
  membersID: string[];
  fetchMembers: any;
  setShowModal: (state: boolean) => void;
  setMembersID: (state: string[] | any) => void;
}

const AddMemberModal = ({
  membersID,
  fetchMembers,
  setMembersID,
  setShowModal,
}: AddMemberModalProps) => {
  const { user: currentUser } = useAppSelector(getUserState);
  const { users, isPending, searchUser, getUsers } = useGetUsers(
    currentUser.uid
  );

  const scrollContainerRef = useRef<any>(null);

  const [searchVal, setSearchVal] = useState<string>("");

  const isMember = (userID: string) => membersID.includes(userID);

  const removeMember = (userID: string) =>
    setMembersID((membersID: string[]) =>
      membersID.filter((id) => id !== userID)
    );

  const addMember = (userID: string) =>
    setMembersID((membersID: string[]) => [...membersID, userID]);

  const addMemberClickHandler = (user: User) => {
    isMember(user.uid) ? removeMember(user.uid) : addMember(user.uid);
  };

  const handleAddMembersBtn = (e: any) => {
    e.target.disabled = true;

    setShowModal(false);
    fetchMembers();
  };

  const searchChangeHandler = (e: any) => {
    const searchVal = e.target.value;
    setSearchVal(searchVal);
    searchUser(searchVal, currentUser);
  };

  const scrollHandler = () => {
    const container = scrollContainerRef.current;

    if (!container) return;

    let triggerHeight = container.scrollTop + container.offsetHeight;
    if (triggerHeight >= container.scrollHeight) {
      getUsers(currentUser.uid);
    }
  };
  const getIsMemberBtnClass = (userID: string) => {
    return isMember(userID) ? memberBtnClass : nonMemberBtnClass;
  };

  return (
    <div className="w-72 h-full flex flex-col gap-4">
      <div className="flex gap-1 items-center">
        <TwButton
          variant="transparent"
          onClick={() => setShowModal(false)}
          className="w-fit flex gap-2"
        >
          <AiOutlineArrowLeft className="text-xl" />
        </TwButton>
        <h1 className="text-xl text-center justify-self-center">Add Members</h1>
      </div>
      <form className="w-full" autoComplete="off">
        <label htmlFor="search-input">
          <input
            type="text"
            id="search-input"
            value={searchVal}
            onChange={searchChangeHandler}
            placeholder="Search"
            className="text p-2 px-4 w-full rounded-full bg-secondary"
          />
        </label>
      </form>

      <ul
        onScroll={scrollHandler}
        ref={scrollContainerRef}
        className="flex flex-col gap-4 h-full w-full overflow-y-scroll overflow-x-hidden scrollbar-hide"
      >
        {users?.length !== 0 &&
          users?.map((user) => (
            <li key={user.uid}>
              <div className="w-full flex items-center gap-4">
                <ProfilePicture
                  isOnline={false}
                  photoURL={user.photoURL}
                  size="small"
                />
                <div className="flex flex-col text-left">
                  <p className="text-md">{user.displayName}</p>
                  <p className="text-muted text-sm ">{user.bio}</p>
                </div>
                <button
                  onClick={() => addMemberClickHandler(user)}
                  className={`${getIsMemberBtnClass(
                    user.uid
                  )}   duration-300 hover:scale-x-105 active:scale-95 ml-auto border text-sm p-1 px-3 h-fit rounded-full`}
                >
                  {isMember(user.uid) ? "added" : "add"}
                </button>
              </div>
            </li>
          ))}

        {isPending && <LoadingSpinner msg={"Fetching users..."} />}

        {!users?.length && searchVal.length !== 0 && (
          <ErrorMsg
            className="w-44 self-center"
            img={no_results}
            msg="no results found."
          />
        )}
      </ul>
      <TwButton onClick={handleAddMembersBtn} className="mt-2">
        Done
      </TwButton>
    </div>
  );
};

export default AddMemberModal;

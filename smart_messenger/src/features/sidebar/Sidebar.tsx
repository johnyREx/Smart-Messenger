import {
  BiLogOut,
  BiUser,
  BiMessageSquareDetail,
  BiMoon,
  BiSun,
} from "react-icons/bi";
import { FiSettings } from "react-icons/fi";
import { RiContactsLine } from "react-icons/ri";

import { TwTooltip, TwButton, ProfilePicture } from "components";

import { useAppDispatch, useAppSelector } from "hooks";
import { getThemeState, toggleDarkmode } from "./themeSlice";
import { logout } from "features/authentication";
import { getUserState } from "features/authentication/userSlice";
import { resetChat } from "features/inbox/chatReducer";
import {
  changeSideContent,
  getSideContent,
  showUserProfile,
} from "reducers/sideContentReducer";

const SIDEBAR_PAGE_BUTTONS = [
  { name: "chats", icon: BiMessageSquareDetail, content: "chats" },
  { name: "add contacts", icon: RiContactsLine, content: "addcontacts" },
  { name: "profile", icon: BiUser, content: "profile" },
  { name: "settings", icon: FiSettings, content: "settings" },
];

interface SidebarProps {}

const Sidebar = () => {
  const { darkmode } = useAppSelector(getThemeState);
  const { user: currentUser } = useAppSelector(getUserState);
  const { content: sidebarContent } = useAppSelector(getSideContent);

  const dispatch = useAppDispatch();

  const sidebarBtnHandler = (content: string) => {
    content = content.replace(" ", "");

    if (content === "profile") {
      dispatch(showUserProfile({ userProfileData: currentUser }));
      return;
    }

    dispatch(changeSideContent({ content }));
  };

  const darkmodeClickHandler = () => dispatch(toggleDarkmode());

  const handleSignOut = () => {
    dispatch(logout());
    dispatch(resetChat());
  };

  return (
    <>
      <nav className="relative hidden p-3 py-4 w-fit bg-secondary md:flex md:flex-col gap-4 pt-10">
        <button
          onClick={() => sidebarBtnHandler("profile")}
          className="text relative group flex justify-center gap-2 items-center px-4 border-b border-main pb-4"
        >
          <ProfilePicture
            isOnline={false}
            photoURL={currentUser?.photoURL}
            size="small"
          />
          <TwTooltip tip="Profile" position="right" />
        </button>
        <div className="flex flex-col gap-1 items-center">
          {SIDEBAR_PAGE_BUTTONS.map((obj) => {
            const Icon = obj.icon;
            return (
              <TwButton
                variant="transparent"
                className={`${
                  sidebarContent === obj.content &&
                  "bg-muted-light/5 dark:bg-muted-dark/5"
                }  relative group z-10 py-3 px-3`}
                key={obj.content}
                onClick={() => sidebarBtnHandler(obj.content)}
              >
                <Icon className={` text-muted text-2xl`} />
                <TwTooltip tip={obj.content} position="right" />
                {sidebarContent === obj.content && (
                  <div className="p-0.5 h-10 w-1 -left-3 top-1/2 -translate-y-1/2 absolute bg-primary-main rounded-full" />
                )}
              </TwButton>
            );
          })}
        </div>

        <div className="absolute bottom-4 flex flex-col gap-1">
          <TwButton
            variant="transparent"
            className="relative group z-10 py-3 px-3"
            onClick={darkmodeClickHandler}
          >
            {darkmode ? (
              <BiSun className="text-muted text-2xl" />
            ) : (
              <BiMoon className="text-muted text-2xl" />
            )}
            <TwTooltip
              tip={darkmode ? "lightmode" : "darkmode"}
              position="right"
            ></TwTooltip>
          </TwButton>

          <TwButton
            variant="transparent"
            className="relative group z-10 py-3 px-3"
            onClick={handleSignOut}
          >
            <BiLogOut className="text-muted text-2xl" />
            <TwTooltip tip="logout" position="right" />
          </TwButton>
        </div>
      </nav>

      <nav className="mt-auto p-2 w-full bg-muted-light/5 dark:bg-muted-dark/5 md:hidden  gap-4 justify-center">
        <div className="flex gap-2 justify-center">
          {SIDEBAR_PAGE_BUTTONS.map((obj) => {
            const Icon = obj.icon;
            return (
              <TwButton
                variant="transparent"
                className={`${
                  sidebarContent === obj.content &&
                  "bg-muted-light/5 dark:bg-muted-dark/5"
                }   relative group z-10 py-3 px-3`}
                key={obj.content}
                onClick={() => sidebarBtnHandler(obj.content)}
              >
                <Icon className={` text-muted text-2xl`} />
                <TwTooltip tip={obj.content} position="top" />
                {sidebarContent === obj.content && (
                  <div className="p-0.5 h-1 w-10 left-1/2 -bottom-2 -translate-x-1/2 absolute bg-primary-main rounded-full" />
                )}
              </TwButton>
            );
          })}
        </div>
      </nav>
    </>
  );
};

export default Sidebar;

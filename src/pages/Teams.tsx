import { useCallback, useEffect, useState } from "react";
import Overlay from "../components/Overlay";
import TeamCreator from "../components/Teams/TeamCreator";
import TeamItem from "../components/Teams/TeamItem";
import Hline from "../components/Hline";
import axios, { AxiosError } from "axios";
import { INotification, ITeam } from "../types/global";
import { TeamBox } from "../components/TeamBox";
import { MdCancel, MdNotifications } from "react-icons/md";
import { FaUserFriends, FaUserTimes } from "react-icons/fa";
import { motion } from "framer-motion";
import {
  BACKEND_URL,
  MEMBER_STATUS,
  NOTIFICATION_TYPES,
} from "../constants/data";
import { useSelector } from "react-redux";
import { RootState } from "../hooks/store";

const Teams = () => {
  const [showTeamCreator, setShowTeamCreator] = useState(false);
  const [teams, setTeams] = useState<ITeam[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<INotification[]>([]);

  const user = useSelector((state: RootState) => state.user);

  const addTeamHandler = (team: ITeam) => {
    console.log("🚀 ~ addTeamHandler ~ team:", team);

    setTeams((prev) => [...prev, team]);
  };
  useEffect(() => {
    const getUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;
      try {
        const response = await axios.get(
          "http://localhost:5050/api/v1/teams",

          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = response.data;
        setTeams(data.data.teams);
      } catch (error) {
        if (error instanceof AxiosError) console.warn(error.response?.data);
      }
    };

    getUser();
  }, []);

  //! Get Notifications
  useEffect(() => {
    const getNotifications = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;
      if (!user._id) return;
      try {
        const response = await axios.get(
          `${BACKEND_URL}/notifications/${user._id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = response.data;
        setNotifications(data.data.notifications);
      } catch (error) {
        if (error instanceof AxiosError) console.warn(error.response?.data);
      }
    };

    getNotifications();
  }, [user._id]);

  const deleteNotificationHandler = useCallback(
    async (notificationId: string) => {
      const token = localStorage.getItem("token");
      if (!token) return;
      try {
        await axios.delete(
          `${BACKEND_URL}/notifications/${notificationId}`,

          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setNotifications((prev) =>
          prev.filter((notification) => notification._id !== notificationId)
        );
      } catch (error) {
        if (error instanceof AxiosError) console.warn(error.response?.data);
      }
    },
    []
  );

  const showTeamCreatorHandler = (showTeamCreator?: boolean) => {
    if (showTeamCreator === undefined) setShowTeamCreator((prev) => !prev);
    else setShowTeamCreator(showTeamCreator);
  };

  return (
    <section className="h-[calc(100vh-90px)] w-screen overflow-hidden z-[10] relative">
      <section className="flex justify-between items-center">
        <header className="my-4">
          <h1 className="text-4xl uppercase indent-4 font-semibold text-slate-700">
            Create Team
          </h1>
          <Hline w="7.7rem" h=".2rem" mt=".4rem" lf="1rem" />
        </header>
        {/* //! Notification */}
        <div className="mr-4">
          {/* //! Notification Icon */}
          <div className="relative">
            <span
              className="text-slate-700 text-[2.4rem] transition-all duration-200  hover:opacity-[90%] active:opacity-[100%] cursor-pointer"
              onClick={() => setShowNotifications((prev) => !prev)}
            >
              <MdNotifications />
            </span>
            <span className="absolute -top-[1rem] right-0 text-red-500 rounded-full grid place-items-center font-bold">
              {notifications.length > 0 ? notifications.length : ""}
            </span>
          </div>

          {/* //! Notification box */}
          <NotificationList
            showNotifications={showNotifications}
            notifications={notifications}
            onDeleteNotification={deleteNotificationHandler}
            teams={teams}
          />
        </div>
      </section>
      <section className="grid grid-1 sm:grid-cols-2 lg:grid-cols-3 items-start gap-4 px-[2rem] sm:px-[1rem] py-[2rem] h-[70vh] overflow-x-hidden scroll-bar-none ">
        <TeamItem showTeamCreatorHandler={showTeamCreatorHandler} />

        {teams
          .filter(
            (team) =>
              team.members?.some(
                (member) =>
                  member.user._id === user._id &&
                  member.status === MEMBER_STATUS.MEMBER
              ) || team.creator?._id === user._id
          )
          .map((team) => {
            return <TeamBox setTeams={setTeams} team={team} key={team._id} />;
          })}
      </section>

      <Overlay
        showOverlay={showTeamCreator}
        overlayClickHandler={showTeamCreatorHandler}
        minHeight="100vh"
      >
        <TeamCreator
          onAddTeam={addTeamHandler}
          showTeamCreator={showTeamCreator}
          showTeamCreatorHandler={showTeamCreatorHandler}
        />
      </Overlay>
    </section>
  );
};

type INotificationList = {
  showNotifications: boolean;
  notifications: INotification[];
  onDeleteNotification: (id: string) => Promise<void>;
  teams: ITeam[];
};

const NotificationList = ({
  showNotifications,
  notifications,
  onDeleteNotification,
  teams,
}: INotificationList) => {
  return (
    <motion.section
      initial={{ x: "35rem" }}
      animate={{ x: showNotifications ? 0 : "35rem" }}
      transition={{ duration: 0.8, type: "spring", damping: 12 }}
      className="absolute z-[999] right-4 mt-2 max-w-[30rem] bg-gray-100 rounded-md flex flex-col gap-2 max-h-[25rem] overflow-y-scroll scroll-bar-none"
    >
      {notifications.map((notification) => {
        if (notification.type === NOTIFICATION_TYPES.MEMBER_REQUEST)
          return (
            <NotificationMemberRequest
              notification={notification}
              key={notification._id}
              onDeleteNotification={onDeleteNotification}
              teams={teams}
            />
          );
        else if (notification.type === NOTIFICATION_TYPES.TODO_COMMENT_ADDED)
          return (
            <NotificationTodoComment
              notification={notification}
              key={notification._id}
              onDeleteNotification={onDeleteNotification}
            />
          );
        else if (notification.type === NOTIFICATION_TYPES.TODO_STATUS_CHANGED)
          return (
            <NotificationTodoStatusChange
              notification={notification}
              key={notification._id}
              onDeleteNotification={onDeleteNotification}
            />
          );
        else if (notification.type === NOTIFICATION_TYPES.TEAM_CHAT_MESSAGE)
          return (
            <NotificationTeamChat
              notification={notification}
              key={notification._id}
              onDeleteNotification={onDeleteNotification}
            />
          );
        else if (notification.type === NOTIFICATION_TYPES.GENERAL) {
          return (
            <NotificationGeneral
              notification={notification}
              key={notification._id}
              onDeleteNotification={onDeleteNotification}
            />
          );
        } else
          return (
            <p className="text-red-500 text-xl" key={notification._id}>
              {notification.content}
            </p>
          );
      })}
    </motion.section>
  );
};
const NotificationMemberRequest = ({
  notification,
  onDeleteNotification,
  teams,
}: {
  notification: INotification;
  onDeleteNotification: (id: string) => Promise<void>;
  teams: ITeam[];
}) => {
  console.log("------>notification: ", notification);
  const [showOptions, setShowOptions] = useState(
    notification.team &&
      teams
        .find((team) => team?._id === notification.team._id)
        ?.members.find(
          (member) => member.user._id === notification.recipient._id
        )?.status === MEMBER_STATUS.PENDING
  );
  const acceptMemberRequestHandler = async (memberStatus: string) => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      await axios.patch(
        `${BACKEND_URL}/teams/members/status`,
        {
          memberStatus,
          teamId: notification.team._id,
          memberId: notification.recipient._id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } catch (error) {
      if (error instanceof AxiosError) console.warn(error.response?.data);
    }
  };
  return (
    <div className="flex justify-between gap-[4rem] border-l-[.2rem] border-l-sky-500 py-3 bg-sky-100 rounded-sm px-2">
      <p className="text-slate-700 font-semibold">{notification.content}</p>
      <div className="flex flex-col gap-2 items-center mr-2">
        {showOptions && (
          <>
            <button
              className="font-semibold tracking-wide text-green-700  text-[1.6rem] "
              onClick={() => {
                acceptMemberRequestHandler(MEMBER_STATUS.MEMBER);
                setShowOptions(false);
              }}
            >
              <FaUserFriends style={{ color: "green" }} />
            </button>
            <button
              className="font-semibold tracking-wide text-orange-700 text-[1.6rem]"
              onClick={() => {
                acceptMemberRequestHandler(MEMBER_STATUS.BLOCK);
                setShowOptions(false);
              }}
            >
              <FaUserTimes style={{ color: "orange" }} />
            </button>
          </>
        )}
        <button
          className="font-semibold tracking-wide text-red-700 py-1 px-2 rounded-md text-[1.6rem]"
          onClick={() => onDeleteNotification(notification._id)}
        >
          <MdCancel />
        </button>
      </div>
    </div>
  );
};

const NotificationTodoComment = ({
  notification,
  onDeleteNotification,
}: {
  notification: INotification;
  onDeleteNotification: (id: string) => Promise<void>;
}) => {
  return (
    <div className="flex justify-between gap-[4rem] border-l-[.2rem] border-l-yellow-500 py-3 bg-yellow-100 rounded-sm px-2">
      <p className="text-slate-700 font-semibold">{notification.content}</p>
      <div className="flex flex-col gap-2 items-center mr-2">
        <button
          className="font-semibold tracking-wide text-red-700 py-1 px-2 rounded-md text-[1.6rem]"
          onClick={() => onDeleteNotification(notification._id)}
        >
          <MdCancel />
        </button>
      </div>
    </div>
  );
};

const NotificationTeamChat = ({
  notification,
  onDeleteNotification,
}: {
  notification: INotification;
  onDeleteNotification: (id: string) => Promise<void>;
}) => {
  return (
    <div className="flex justify-between gap-[4rem] border-l-[.2rem] border-l-blue-500 py-3 bg-blue-100 rounded-sm px-2">
      <p className="text-slate-700 font-semibold">{notification.content}</p>
      <div className="flex flex-col gap-2 items-center mr-2">
        <button
          className="font-semibold tracking-wide text-red-700 py-1 px-2 rounded-md text-[1.6rem]"
          onClick={() => onDeleteNotification(notification._id)}
        >
          <MdCancel />
        </button>
      </div>
    </div>
  );
};

const NotificationTodoStatusChange = ({
  notification,
  onDeleteNotification,
}: {
  notification: INotification;
  onDeleteNotification: (id: string) => Promise<void>;
}) => {
  return (
    <div className="flex justify-between gap-[4rem] border-l-[.2rem] border-l-green-500 py-3 bg-green-100 rounded-sm px-2">
      <p className="text-slate-700 font-semibold">{notification.content}</p>
      <div className="flex flex-col gap-2 items-center mr-2">
        <button
          className="font-semibold tracking-wide text-red-700 py-1 px-2 rounded-md text-[1.6rem]"
          onClick={() => onDeleteNotification(notification._id)}
        >
          <MdCancel />
        </button>
      </div>
    </div>
  );
};

const NotificationGeneral = ({
  notification,
  onDeleteNotification,
}: {
  notification: INotification;
  onDeleteNotification: (id: string) => Promise<void>;
}) => {
  return (
    <div className="flex justify-between gap-[4rem] border-l-[.2rem] border-l-green-500 py-3 bg-green-100 rounded-sm px-2">
      <p className="text-slate-700 font-semibold">{notification.content}</p>
      <div className="flex flex-col gap-2 items-center mr-2">
        <button
          className="font-semibold tracking-wide text-red-700 py-1 px-2 rounded-md text-[1.6rem]"
          onClick={() => onDeleteNotification(notification._id)}
        >
          <MdCancel />
        </button>
      </div>
    </div>
  );
};

export default Teams;

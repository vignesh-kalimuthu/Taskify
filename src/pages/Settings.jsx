import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import {
  FiMoon,
  FiSun,
  FiBell,
  FiEdit,
  FiLogOut,
  FiLock,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import ChangePasswordModal from "../components/ChangePasswordModal.jsx";
import StatCard from "../components/StatCard.jsx";
import API from "../utils/axios";

const Settings = () => {
  const { user } = useContext(AuthContext);
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [passwordOpen, setPasswordOpen] = useState(false);
  const navigate = useNavigate();
  const [taskStats, setTaskStats] = useState({
    total: 0,
    completed: 0,
    pending: 0,
    inProgress: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await API.get("/todos/status/count");

        // res.data example:
        // [
        //   { status: "In Progress", count: 2 },
        //   { status: "Completed", count: 1 }
        // ]

        const formattedStats = {
          total: 0,
          completed: 0,
          pending: 0,
          inProgress: 0,
        };

        res.data.forEach((item) => {
          if (item.status === "Completed")
            formattedStats.completed = item.count;
          if (item.status === "Pending") formattedStats.pending = item.count;
          if (item.status === "In Progress")
            formattedStats.inProgress = item.count;
        });

        formattedStats.total =
          formattedStats.completed +
          formattedStats.pending +
          formattedStats.inProgress;

        setTaskStats(formattedStats);

        console.log("Formatted Task Stats", formattedStats);
      } catch (error) {
        console.error("Failed to fetch task stats", error);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">⚙ Settings</h1>

      {/* Profile Card */}
      <div className="bg-white shadow-md rounded-xl p-5 mb-6 flex items-center gap-4 border border-gray-200">
        <img
          src={`https://ui-avatars.com/api/?name=${user?.name}`}
          alt="Profile"
          className="w-14 h-14 rounded-full"
        />
        <div className="flex-1">
          <h2 className="font-semibold text-lg">{user?.name || "User Name"}</h2>
          <p className="text-gray-500 text-sm">
            {user?.email || "example@email.com"}
          </p>
        </div>
        <button
          className="text-sm px-3 py-2 border rounded-lg flex items-center gap-2 hover:bg-gray-100 transition"
          onClick={() => navigate("/profile")}
        >
          <FiEdit /> Edit Profile
        </button>
      </div>

      {/* Preferences */}
      <div className="bg-white shadow-md rounded-xl p-5 mb-6 border border-gray-200">
        <h2 className="font-semibold text-lg mb-4">Preferences</h2>

        {/* Theme Toggle */}
        <div className="flex justify-between items-center py-2 border-b">
          <span className="flex items-center gap-2">
            {darkMode ? <FiMoon /> : <FiSun />}
            Theme
          </span>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`w-12 h-6 flex items-center rounded-full p-1 transition ${
              darkMode ? "bg-blue-600" : "bg-gray-300"
            }`}
          >
            <div
              className={`bg-white w-4 h-4 rounded-full transition ${
                darkMode ? "translate-x-6" : ""
              }`}
            ></div>
          </button>
        </div>

        {/* Notifications Toggle */}
        <div className="flex justify-between items-center py-2">
          <span className="flex items-center gap-2">
            <FiBell /> Notifications
          </span>
          <button
            onClick={() => setNotifications(!notifications)}
            className={`w-12 h-6 flex items-center rounded-full p-1 transition ${
              notifications ? "bg-green-500" : "bg-gray-300"
            }`}
          >
            <div
              className={`bg-white w-4 h-4 rounded-full transition ${
                notifications ? "translate-x-6" : ""
              }`}
            ></div>
          </button>
        </div>
      </div>

      {/* Task Summary */}
      <div className="bg-white shadow-md rounded-xl p-5 mb-6 border border-gray-200">
        <h2 className="font-semibold text-lg mb-4 ">Task Summary</h2>
        <div className="grid grid-cols-2 gap-3">
          <StatCard label="Total Tasks" value={taskStats.total} color="blue" />
          <StatCard
            label="Completed"
            value={taskStats.completed}
            color="green"
          />
          <StatCard
            label="In Progress"
            value={taskStats.inProgress}
            color="yellow"
          />
          <StatCard label="Pending" value={taskStats.pending} color="orange" />
        </div>
      </div>

      {/* Security */}
      <div className="bg-white shadow-md rounded-xl p-5 border border-gray-200">
        <h2 className="font-semibold text-lg mb-4">Security</h2>
        <div className="flex flex-row gap-2">
          <button
            onClick={() => setPasswordOpen(true)}
            className="flex items-center gap-2 border px-3 py-2 rounded-lg hover:bg-gray-100 w-full text-left"
          >
            <FiLock /> Change Password
          </button>

          <button className="flex items-center gap-2 px-3 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 w-full text-left">
            <FiLogOut /> Logout
          </button>
        </div>
      </div>
      <ChangePasswordModal
        isOpen={passwordOpen}
        onClose={() => setPasswordOpen(false)}
      />
    </div>
  );
};

export default Settings;

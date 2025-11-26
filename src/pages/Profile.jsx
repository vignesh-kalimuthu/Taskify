import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import API from "../utils/axios";
import { FaUserCircle } from "react-icons/fa";
import { FaEdit } from "react-icons/fa";
import EditProfileModal from "../components/EditProfileModal.jsx";
import StatCard from "../components/StatCard.jsx";

export default function Profile() {
  const { user } = useContext(AuthContext);
  const [editOpen, setEditOpen] = useState(false);
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

  if (!user)
    return (
      <p className="text-center text-gray-600 mt-10">Loading profile...</p>
    );

  console.log("User Profile Data:", user);

  return (
    <div className="p-6">
      {/* Header */}

      <div className="bg-white shadow-lg rounded-xl p-6 flex flex-col items-center max-w-lg mx-auto border border-gray-100">
        {/* Profile Avatar */}
        {user.profileImage ? (
          <img
            src={user.profileImage}
            alt="User Avatar"
            className="w-24 h-24 rounded-full border shadow-md object-cover"
          />
        ) : (
          <FaUserCircle className="text-gray-400" size={85} />
        )}

        {/* Name + Email */}
        <h2 className="text-xl font-semibold mt-3 text-gray-900">
          {user?.name || "User Name"}
        </h2>
        <p className="text-gray-500 text-sm">
          {user?.email || "useremail.com"}
        </p>

        {/* Stats Section */}
        <div className="grid grid-cols-2 gap-4 mt-6 w-full">
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

        {/* Edit Button (future feature) */}
        <button
          onClick={() => setEditOpen(true)}
          className="mt-6 flex items-center gap-2 px-4 py-2 text-sm font-medium text-white border border-cyan-600 bg-cyan-600 hover:bg-white hover:border hover:border-cyan-600 hover:text-cyan-600 transition rounded-lg"
        >
          <FaEdit /> Edit Profile
        </button>
        {/* Modals */}
        <EditProfileModal
          isOpen={editOpen}
          onClose={() => setEditOpen(false)}
        />
      </div>
    </div>
  );
}

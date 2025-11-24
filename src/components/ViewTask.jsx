import React, { useEffect, useState } from "react";
import API from "../utils/axios";
import { FiX } from "react-icons/fi";
import { MdOutlineLabelImportant, MdOutlineTitle } from "react-icons/md";
import { FaRegClock } from "react-icons/fa";

const ViewTask = ({ isOpen, onClose, todoId }) => {
  const [todo, setTodo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!todoId) return;

    const fetchTodoDetails = async () => {
      setLoading(true);
      try {
        const res = await API.get(`/todos/${todoId}`);
        setTodo(Array.isArray(res.data) ? res.data[0] : res.data);
      } catch (err) {
        console.error("Failed to fetch task", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTodoDetails();
  }, [todoId]);

  if (!isOpen) return null;

  const getPriorityStyle = (p) =>
    p === "High"
      ? "bg-red-100 text-red-600"
      : p === "Medium"
      ? "bg-yellow-100 text-yellow-600"
      : "bg-green-100 text-green-600";

  const getStatusStyle = (s) =>
    s === "Completed"
      ? "bg-green-100 text-green-600"
      : s === "In Progress"
      ? "bg-blue-100 text-blue-600"
      : "bg-gray-200 text-gray-600";

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black/50 backdrop-blur-sm z-50">
      <div className="bg-white rounded-2xl shadow-lg p-6 w-[90%] max-w-lg animate-[fadeIn_0.3s]">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-700">
            📝 Task Details
          </h2>
          <button
            className="text-gray-400 hover:text-black transition"
            onClick={onClose}
          >
            <FiX size={22} />
          </button>
        </div>

        <hr className="my-3" />

        {/* Loading State */}
        {loading ? (
          <p className="text-center text-gray-500">Loading...</p>
        ) : !todo ? (
          <p className="text-center text-red-500">Task not found</p>
        ) : (
          <div className="space-y-4">
            {/* Title */}
            <div className="flex items-center gap-3">
              <MdOutlineTitle className="text-cyan-600 text-xl" />
              <p className="font-semibold text-lg text-gray-800">
                {todo.title}
              </p>
            </div>

            {/* Description */}
            <div className="border rounded-lg p-3 bg-gray-50 text-gray-600">
              {todo.description || "No description available"}
            </div>

            {/* Category */}
            <div className="flex justify-between text-sm text-gray-600">
              <span>📂 Category:</span>
              <span className="font-semibold">{todo.category}</span>
            </div>

            {/* Priority */}
            <div className="flex justify-between text-sm">
              <span className="flex items-center gap-1">
                <MdOutlineLabelImportant className="text-red-500" />
                Priority:
              </span>
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${getPriorityStyle(
                  todo.priority
                )}`}
              >
                {todo.priority}
              </span>
            </div>

            {/* Status */}
            <div className="flex justify-between text-sm">
              <span>Status:</span>
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusStyle(
                  todo.status
                )}`}
              >
                {todo.status}
              </span>
            </div>

            {/* Created Date */}
            <div className="flex justify-between text-sm text-gray-600">
              <span className="flex items-center gap-1">
                <FaRegClock /> Created:
              </span>
              <span>{new Date(todo.created_at).toLocaleString()}</span>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-5 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-cyan-500 text-white rounded-lg shadow hover:bg-cyan-600 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewTask;

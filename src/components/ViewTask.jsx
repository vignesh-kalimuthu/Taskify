import React, { useEffect } from "react";
import API from "../utils/axios";

const ViewTask = ({ isOpen, onClose, todoId }) => {
  useEffect(() => {
    if (!todoId) return;

    const fetchTodoDetails = async () => {
      const res = await API.get(`/todos/${todoId}`);
      console.log("Todo Details:", res.data);
    };

    fetchTodoDetails();
  }, [todoId]);

  if (!isOpen) return null;
  console.log("Viewing Todo ID:", todoId);

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black/50 backdrop-blur-xs z-50">
      <div
        className="bg-white rounded-lg shadow-lg p-3 sm:p-4 w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl transition-all duration-300
               max-h-[90vh] flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-1">
          <h1 className="font-bold text-md">Task Details</h1>
          <button
            onClick={onClose}
            className="text-md text-gray-500 hover:text-gray-900"
          >
            &#x2715;
          </button>
        </div>

        <hr className="mb-2" />

        <div className="flex-1 overflow-y-auto px-1 ">
          Title:- Task {todoId}
        </div>
      </div>
    </div>
  );
};

export default ViewTask;

import { useState } from "react";
import { FaBars } from "react-icons/fa";
import Modal from "./Modal";

const Header = ({ onMenuClick, onTaskAdded }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div
      className="fixed top-0 right-0 left-0 md:left-[220px] h-[70px] 
      flex justify-between shadow-lg items-center bg-cyan-50/50 px-6 z-30"
    >
      {/* MOBILE MENU BUTTON */}
      <FaBars
        size={24}
        className="md:hidden cursor-pointer"
        onClick={onMenuClick}
      />

      <h1 className="text-3xl font-bold text-cyan-400 text-shadow-lg">
        TASKIFY
      </h1>

      <button
        className="bg-cyan-500 text-sm text-white px-4 py-2 rounded-sm 
        hover:scale-110 transition-all duration-300 border border-transparent 
        hover:bg-white hover:text-cyan-500 hover:border-cyan-500"
        onClick={() => setIsModalOpen(true)}
      >
        Add Task
      </button>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onTaskAdded={onTaskAdded}
      />
    </div>
  );
};

export default Header;

import React from "react";
import { NavLink } from "react-router-dom";
import { FaHome, FaChartBar, FaRegListAlt } from "react-icons/fa";
import { MdAddBox, MdEditSquare } from "react-icons/md";
import { RxUpdate } from "react-icons/rx";
import { IoSettingsOutline } from "react-icons/io5";
import { CgProfile } from "react-icons/cg";

const Sidebar = ({ closeMobile }) => {
  const menu = [
    { icon: <FaHome size={18} />, label: "Home", path: "/" },
    { icon: <FaChartBar size={18} />, label: "Dashboard", path: "/dashboard" },
    { icon: <FaRegListAlt size={18} />, label: "Task List", path: "/tasks" },
    { icon: <MdAddBox size={18} />, label: "Add Task", path: "/add-task" },
    {
      icon: <MdEditSquare size={18} />,
      label: "Edit Task",
      path: "/edit-task",
    },
    {
      icon: <RxUpdate size={18} />,
      label: "Update Status",
      path: "/update-status",
    },
    {
      icon: <IoSettingsOutline size={18} />,
      label: "Settings",
      path: "/settings",
    },
    { icon: <CgProfile size={18} />, label: "Profile", path: "/profile" },
  ];

  return (
    <ul className="flex flex-col gap-4 mt-4">
      {menu.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          className={({ isActive }) =>
            `flex gap-3 items-center text-md font-medium px-3 py-2 rounded-md
            ${
              isActive
                ? "bg-cyan-500 text-white"
                : "text-cyan-900 hover:bg-cyan-300 hover:text-white"
            }`
          }
          onClick={closeMobile} // <-- CLOSE SIDEBAR ON MOBILE CLICK
        >
          {item.icon}
          <span>{item.label}</span>
        </NavLink>
      ))}
    </ul>
  );
};

export default Sidebar;

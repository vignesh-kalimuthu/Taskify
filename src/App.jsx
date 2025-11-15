import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import { useState } from "react";

import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Tasks from "./pages/TodoList";
import AddTask from "./pages/AddTask";
import EditTask from "./pages/EditTask";
import UpdateStatus from "./pages/UpdateStatus";
import Settings from "./pages/Settings";
import Profile from "./pages/Profile";

function App() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <BrowserRouter>
      <Toaster position="top-right" />

      {/* MOBILE BACKGROUND OVERLAY */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-white/70 z-40 md:hidden"
          onClick={() => setMobileOpen(false)}
        ></div>
      )}

      {/* SIDEBAR */}
      <div
        className={`
          fixed left-0 top-0 h-screen p-3 overflow-y-auto bg-cyan-400/40 z-50
          w-[220px] transition-transform duration-300
          ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
        `}
      >
        <Sidebar closeMobile={() => setMobileOpen(false)} />
      </div>

      {/* MAIN CONTENT */}
      <div
        className="
          md:ml-[220px]
        "
      >
        <Header onMenuClick={() => setMobileOpen(true)} />

        <div className="p-4 mt-[70px] overflow-y-auto">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/tasks" element={<Tasks />} />
            <Route path="/add-task" element={<AddTask />} />
            <Route path="/edit-task" element={<EditTask />} />
            <Route path="/update-status" element={<UpdateStatus />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;

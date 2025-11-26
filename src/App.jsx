import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useState } from "react";

import Header from "./components/Header";
import Sidebar from "./components/Sidebar";

import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Tasks from "./pages/TodoList";

import UpdateStatus from "./pages/UpdateStatus";
import Settings from "./pages/Settings";
import Profile from "./pages/Profile";

import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";

import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <BrowserRouter>
      <Toaster position="top-right" />

      <Routes>
        {/* PUBLIC ROUTES */}
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />

        {/* PROTECTED ROUTES */}
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <div>
                {mobileOpen && (
                  <div
                    className="fixed inset-0 bg-black/30 z-40 md:hidden"
                    onClick={() => setMobileOpen(false)}
                  ></div>
                )}

                {/* SIDEBAR */}
                <div
                  className={`fixed left-0 top-0 h-screen p-3 bg-cyan-400/40 
                  w-[220px] z-50 transition-transform duration-300
                  ${
                    mobileOpen
                      ? "translate-x-0 bg-cyan-500"
                      : "-translate-x-full"
                  }
                  md:translate-x-0`}
                >
                  <Sidebar closeMobile={() => setMobileOpen(false)} />
                </div>

                {/* MAIN CONTENT */}
                <div className="md:ml-[220px]">
                  <Header
                    onMenuClick={() => setMobileOpen(true)}
                    onTaskAdded={() =>
                      window.dispatchEvent(new Event("refreshTodos"))
                    }
                  />

                  <div className="p-4 mt-[70px] overflow-y-auto">
                    <Routes>
                      <Route path="/" element={<Home />} />
                      <Route path="/dashboard" element={<Dashboard />} />
                      <Route path="/tasks" element={<Tasks />} />

                      <Route path="/update-status" element={<UpdateStatus />} />
                      <Route path="/settings" element={<Settings />} />
                      <Route path="/profile" element={<Profile />} />
                    </Routes>
                  </div>
                </div>
              </div>
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

import React, { useState } from "react";
import { FiBook, FiUser, FiClock, FiLogOut, FiBell } from "react-icons/fi";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import Modulo from "../modules/Modulo";
import Historial from "../history/Historial";
import Profile from "../profile/profile";
import { getAuth, signOut } from "firebase/auth";

const Dashboard = () => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [activeView, setActiveView] = useState("dashboard");

  const modules = [
    {
      id: 1,
      title: "Introduction to Programming",
      progress: 75,
      deadline: "November 20"
    },
    {
      id: 2,
      title: "Study Techniques",
      progress: 45,
      deadline: "November 25"
    },
    {
      id: 3,
      title: "Data Structures",
      progress: 30,
      deadline: "November 30"
    }
  ];

  const notifications = [
    {
      id: 1,
      message: "Complete 'Introduction to Programming' module by November 20",
      type: "warning"
    },
    {
      id: 2,
      message: "New quiz available in 'Study Techniques' module",
      type: "info"
    }
  ];

  const learningDimensions = [
    { name: "Processing", value: 85, color: "#4A90E2" },
    { name: "Perception", value: 70, color: "#4CAF50" },
    { name: "Information Input", value: 60, color: "#FFC107" },
    { name: "Understanding", value: 75, color: "#FF9800" },
    { name: "Social Interaction", value: 90, color: "#00BCD4" }
  ];

  const handleLogout = async () => {
    const auth = getAuth();
    try {
      await signOut(auth);
      // Redirect to the auth page
      window.location.href = '/auth';
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  if (activeView === "modulo") {
    return (
      <div className="min-h-screen bg-white p-8">
        <h1 className="text-2xl font-bold mb-4">Vista de Módulo</h1>
        <Modulo />
        <button
          onClick={() => setActiveView("dashboard")}
          className="bg-[#4A90E2] text-white px-4 py-2 rounded-md hover:bg-[#4A90E2]/90 mt-4"
        >
          Volver al Dashboard
        </button>
      </div>
    );
  }

  if (activeView === "historial") {
    return (
      <div className="min-h-screen bg-white p-8">
        <h1 className="text-2xl font-bold mb-4">Vista de Historial</h1>
        <Historial />
        <button
          onClick={() => setActiveView("dashboard")}
          className="bg-[#4A90E2] text-white px-4 py-2 rounded-md hover:bg-[#4A90E2]/90 mt-4"
        >
          Volver al Dashboard
        </button>
      </div>
    );
  }

  if (activeView === "perfil") {
    return (
      <div className="min-h-screen bg-white p-8">
        <h1 className="text-2xl font-bold mb-4">Vista de Perfil</h1>
        <Profile />
        <button
          onClick={() => setActiveView("dashboard")}
          className="bg-[#4A90E2] text-white px-4 py-2 rounded-md hover:bg-[#4A90E2]/90 mt-4"
        >
          Volver al Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <header className="bg-[#4A90E2] text-white p-4 shadow-lg">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <img
              src="images.unsplash.com/photo-1546410531-bb4caa6b424d"
              alt="Platform Logo"
              className="h-10 w-10 rounded-full"
            />
            <h1 className="text-2xl font-bold">EduPlatform</h1>
          </div>

          <nav className="hidden md:flex items-center space-x-6">
            <button
              onClick={() => setActiveView("modulo")}
              className="flex items-center space-x-2 hover:text-gray-200"
            >
              <FiBook /> <span>Modulos de aprendizaje</span>
            </button>
            <button
              onClick={() => setActiveView("perfil")}
              className="flex items-center space-x-2 hover:text-gray-200"
            >
              <FiUser /> <span>Perfil</span>
            </button>
            <button
              onClick={() => setActiveView("historial")}
              className="flex items-center space-x-2 hover:text-gray-200"
            >
              <FiClock /> <span>Historico</span>
            </button>
          </nav>

          <div className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center space-x-2"
            >
              <img
                src="images.unsplash.com/photo-1535713875002-d1d0cf377fde"
                alt="Profile"
                className="h-8 w-8 rounded-full"
              />
            </button>
            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1">
                <button 
                  onClick={handleLogout}
                  className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-100 w-full"
                >
                  <FiLogOut />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-[#F5F5F5] p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4">Overall Progress</h2>
            <div className="w-32 h-32 mx-auto">
              <CircularProgressbar
                value={75}
                text={`${75}%`}
                styles={{
                  path: { stroke: "#4A90E2" },
                  text: { fill: "#4A90E2", fontSize: "16px" }
                }}
              />
            </div>
          </div>

          <div className="bg-[#F5F5F5] p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4">Learning Dimensions</h2>
            <div className="space-y-4">
              {learningDimensions.map((dimension) => (
                <div key={dimension.name}>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">{dimension.name}</span>
                    <span className="text-sm font-medium">{dimension.value}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="h-2.5 rounded-full"
                      style={{
                        width: `${dimension.value}%`,
                        backgroundColor: dimension.color
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[#F5F5F5] p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Notifications</h2>
              <FiBell className="text-xl text-[#9E9E9E]" />
            </div>
            <div className="space-y-4">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 rounded-lg ${
                    notification.type === "warning" ? "bg-[#FFC107]/20" : "bg-[#00BCD4]/20"
                  }`}
                >
                  <p className="text-sm">{notification.message}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8">
          <h2 className="text-xl font-bold mb-4">Active Modules</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {modules.map((module) => (
              <div
                key={module.id}
                className="bg-[#F5F5F5] p-6 rounded-lg shadow-md"
              >
                <h3 className="font-bold mb-4">{module.title}</h3>
                <div className="mb-4">
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">Progress</span>
                    <span className="text-sm font-medium">{module.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-[#4CAF50] h-2.5 rounded-full"
                      style={{ width: `${module.progress}%` }}
                    ></div>
                  </div>
                </div>
                <button className="bg-[#4A90E2] text-white px-4 py-2 rounded-md hover:bg-[#4A90E2]/90 w-full">
                  Continue
                </button>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;


import React, { useState, useEffect } from "react";
import { FaBars, FaHome, FaBook, FaUsers, FaChartBar, FaBell, FaEdit, FaTimes } from "react-icons/fa";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell } from "recharts";

const TeacherDashboard = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, message: "Nueva tarea enviada por Juan Pérez", read: false },
    { id: 2, message: "Reunión de personal a las 15:00 hoy", read: false },
    { id: 3, message: "Conferencia de padres y maestros la próxima semana", read: false },
  ]);

  const mockStudentData = [
    { subject: "Matemáticas", students: 85 },
    { subject: "Ciencias", students: 75 },
    { subject: "Español", students: 92 },
    { subject: "Historia", students: 68 },
  ];

  const pieData = [
    { name: "Activo", value: 70 },
    { name: "Inactivo", value: 30 },
  ];

  const COLORS = ["#4F46E5", "#E5E7EB"];

  const [isEditMode, setIsEditMode] = useState(false);
  const [profileData, setProfileData] = useState({
    name: "Sara Jiménez",
    role: "Profesora Senior de Matemáticas",
    email: "sara.jimenez@escuela.edu",
    phone: "(555) 123-4567"
  });

  const handleNotificationDismiss = (id) => {
    setNotifications(notifications.map(notif =>
      notif.id === id ? { ...notif, read: true } : notif
    ));
  };

  const handleProfileUpdate = () => {
    setIsEditMode(false);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-md">
        <nav className="container mx-auto px-4 py-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <img
                src="images.unsplash.com/photo-1550831107-1553da8c8464?auto=format&fit=crop&w=100&q=80"
                alt="Logo de la Escuela"
                className="h-10 w-10 rounded-full"
              />
              <h1 className="text-xl font-bold text-gray-800">Panel del Profesor</h1>
            </div>
            <div className="hidden md:flex items-center space-x-6">
              <NavLink icon={<FaHome />} text="Inicio" />
              <NavLink icon={<FaBook />} text="Cursos" />
              <NavLink icon={<FaUsers />} text="Estudiantes" />
              <NavLink icon={<FaChartBar />} text="Informes" />
            </div>
            <button
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
            </button>
          </div>
        </nav>
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white py-2">
            <div className="flex flex-col space-y-2 px-4">
              <NavLink icon={<FaHome />} text="Inicio" />
              <NavLink icon={<FaBook />} text="Cursos" />
              <NavLink icon={<FaUsers />} text="Estudiantes" />
              <NavLink icon={<FaChartBar />} text="Informes" />
            </div>
          </div>
        )}
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Perfil</h2>
              <button
                onClick={() => setIsEditMode(!isEditMode)}
                className="text-blue-600 hover:text-blue-800"
                aria-label="Editar perfil"
              >
                <FaEdit size={20} />
              </button>
            </div>
            <div className="flex flex-col items-center">
              <img
                src="images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80"
                alt="Perfil del profesor"
                className="w-32 h-32 rounded-full mb-4"
              />
              {isEditMode ? (
                <div className="space-y-4 w-full">
                  <input
                    type="text"
                    value={profileData.name}
                    onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                    className="w-full p-2 border rounded"
                  />
                  <input
                    type="text"
                    value={profileData.role}
                    onChange={(e) => setProfileData({ ...profileData, role: e.target.value })}
                    className="w-full p-2 border rounded"
                  />
                  <button
                    onClick={handleProfileUpdate}
                    className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                  >
                    Guardar Cambios
                  </button>
                </div>
              ) : (
                <div className="text-center">
                  <h3 className="text-lg font-semibold">{profileData.name}</h3>
                  <p className="text-gray-600">{profileData.role}</p>
                  <p className="text-gray-600">{profileData.email}</p>
                  <p className="text-gray-600">{profileData.phone}</p>
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4">Distribución de Estudiantes</h2>
              <div className="h-64">
                <BarChart
                  width={500}
                  height={250}
                  data={mockStudentData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="subject" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="students" fill="#4F46E5" />
                </BarChart>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-4">Estado de Estudiantes</h2>
                <PieChart width={250} height={250}>
                  <Pie
                    data={pieData}
                    cx={120}
                    cy={120}
                    innerRadius={60}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-4">Notificaciones</h2>
                <div className="space-y-4">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 rounded-lg ${notification.read ? "bg-gray-100" : "bg-blue-50"} flex justify-between items-start`}
                    >
                      <p className="text-gray-700">{notification.message}</p>
                      {!notification.read && (
                        <button
                          onClick={() => handleNotificationDismiss(notification.id)}
                          className="text-gray-500 hover:text-gray-700"
                          aria-label="Descartar notificación"
                        >
                          <FaTimes />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

const NavLink = ({ icon, text }) => (
  <a
    href="#"
    className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors duration-200"
  >
    {icon}
    <span>{text}</span>
  </a>
);

export default TeacherDashboard;
import React, { useState } from "react";
import { FaBell, FaTrash, FaCheck, FaTimes, FaFilter } from "react-icons/fa";

const NotificationComponent = () => {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: "reminder",
      title: "Revisar cuestionario de Matemáticas",
      message: "El cuestionario necesita ser revisado antes del viernes",
      date: "2024-01-20",
      isRead: false,
      status: "pending"
    },
    {
      id: 2,
      type: "student",
      title: "Mensaje de Juan Pérez",
      message: "Consulta sobre el proyecto final",
      date: "2024-01-19",
      isRead: true,
      status: "warning"
    },
    {
      id: 3,
      type: "system",
      title: "Actualización del Sistema",
      message: "Nueva versión disponible",
      date: "2024-01-18",
      isRead: false,
      status: "error"
    }
  ]);

  const [filters, setFilters] = useState({
    type: "all",
    date: ""
  });

  const [showFilters, setShowFilters] = useState(false);

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-[#4CAF50]";
      case "warning":
        return "bg-[#FFC107]";
      case "error":
        return "bg-[#F44336]";
      default:
        return "bg-[#9E9E9E]";
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case "reminder":
        return "bg-[#00BCD4]";
      case "student":
        return "bg-[#FF9800]";
      case "system":
        return "bg-[#4A90E2]";
      default:
        return "bg-[#9E9E9E]";
    }
  };

  const toggleRead = (id) => {
    setNotifications(notifications.map(notif =>
      notif.id === id ? { ...notif, isRead: !notif.isRead } : notif
    ));
  };

  const deleteNotification = (id) => {
    setNotifications(notifications.filter(notif => notif.id !== id));
  };

  const filteredNotifications = notifications.filter(notif => {
    const typeMatch = filters.type === "all" || notif.type === filters.type;
    const dateMatch = !filters.date || notif.date === filters.date;
    return typeMatch && dateMatch;
  });

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <FaBell className="text-[#4A90E2] text-2xl mr-2" />
          <h1 className="text-2xl font-bold text-gray-800">Notificaciones</h1>
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center px-4 py-2 bg-[#4A90E2] text-white rounded-lg hover:bg-[#357ABD] transition-colors"
        >
          <FaFilter className="mr-2" />
          Filtros
        </button>
      </div>

      {showFilters && (
        <div className="mb-6 p-4 bg-[#F5F5F5] rounded-lg">
          <div className="flex flex-wrap gap-4">
            <select
              value={filters.type}
              onChange={(e) => setFilters({ ...filters, type: e.target.value })}
              className="p-2 rounded-md border border-gray-300 focus:outline-none focus:border-[#4A90E2]"
            >
              <option value="all">Todos los tipos</option>
              <option value="reminder">Recordatorios</option>
              <option value="student">Mensajes de estudiantes</option>
              <option value="system">Alertas del sistema</option>
            </select>
            <input
              type="date"
              value={filters.date}
              onChange={(e) => setFilters({ ...filters, date: e.target.value })}
              className="p-2 rounded-md border border-gray-300 focus:outline-none focus:border-[#4A90E2]"
            />
          </div>
        </div>
      )}

      <div className="space-y-4">
        {filteredNotifications.map((notification) => (
          <div
            key={notification.id}
            className={`p-4 rounded-lg border transition-all duration-300 transform hover:scale-[1.01] ${
              notification.isRead ? "bg-[#F5F5F5]" : "bg-white border-[#4A90E2]"
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`w-3 h-3 rounded-full ${getTypeIcon(notification.type)}`} />
                <div className={`w-2 h-2 rounded-full ${getStatusColor(notification.status)}`} />
                <h3 className="font-semibold text-gray-800">{notification.title}</h3>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => toggleRead(notification.id)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  {notification.isRead ? (
                    <FaTimes className="text-[#9E9E9E]" />
                  ) : (
                    <FaCheck className="text-[#4CAF50]" />
                  )}
                </button>
                <button
                  onClick={() => deleteNotification(notification.id)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <FaTrash className="text-[#F44336]" />
                </button>
              </div>
            </div>
            <p className="mt-2 text-[#9E9E9E]">{notification.message}</p>
            <div className="mt-2 text-sm text-[#9E9E9E]">{notification.date}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotificationComponent;
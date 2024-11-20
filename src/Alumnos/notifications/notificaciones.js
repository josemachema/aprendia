import React, { useState } from "react";
import { FaBell, FaUserGraduate, FaCog } from "react-icons/fa";

const NotificacionesComponent = () => {
  const [selectedType, setSelectedType] = useState("all");

  const notifications = [
    {
      id: 1,
      type: "reminder",
      subject: "Tarea pendiente",
      date: "2024-01-15",
      content: "Recuerda entregar tu proyecto de matemáticas antes del viernes.",
      dimension: "processing"
    },
    {
      id: 2,
      type: "teacher",
      subject: "Mensaje del profesor",
      date: "2024-01-14",
      content: "La clase de mañana será en el laboratorio B.",
      dimension: "social"
    },
    {
      id: 3,
      type: "system",
      subject: "Actualización del sistema",
      date: "2024-01-13",
      content: "Nueva funcionalidad disponible en la plataforma.",
      dimension: "information"
    }
  ];

  const getDimensionColor = (dimension) => {
    const colors = {
      processing: "#4A90E2",
      perception: "#4CAF50",
      information: "#FFC107",
      understanding: "#FF9800",
      social: "#00BCD4"
    };
    return colors[dimension] || "#4A90E2";
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case "reminder":
        return <FaBell className="text-yellow-500" />;
      case "teacher":
        return <FaUserGraduate className="text-cyan-500" />;
      case "system":
        return <FaCog className="text-blue-500" />;
      default:
        return <FaBell className="text-gray-500" />;
    }
  };

  const filteredNotifications = selectedType === "all"
    ? notifications
    : notifications.filter(notification => notification.type === selectedType);

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold text-[#4A90E2] mb-6">Notificaciones</h1>

      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setSelectedType("all")}
          className={`px-4 py-2 rounded-lg ${selectedType === "all" ? "bg-[#4A90E2] text-white" : "bg-[#F5F5F5] text-[#9E9E9E]"}`}
        >
          Todos
        </button>
        <button
          onClick={() => setSelectedType("reminder")}
          className={`px-4 py-2 rounded-lg ${selectedType === "reminder" ? "bg-[#FFC107] text-white" : "bg-[#F5F5F5] text-[#9E9E9E]"}`}
        >
          Recordatorios
        </button>
        <button
          onClick={() => setSelectedType("teacher")}
          className={`px-4 py-2 rounded-lg ${selectedType === "teacher" ? "bg-[#00BCD4] text-white" : "bg-[#F5F5F5] text-[#9E9E9E]"}`}
        >
          Mensajes de Profesores
        </button>
        <button
          onClick={() => setSelectedType("system")}
          className={`px-4 py-2 rounded-lg ${selectedType === "system" ? "bg-[#4A90E2] text-white" : "bg-[#F5F5F5] text-[#9E9E9E]"}`}
        >
          Anuncios del Sistema
        </button>
      </div>

      <div className="space-y-4">
        {filteredNotifications.map((notification) => (
          <div
            key={notification.id}
            className="p-4 bg-[#F5F5F5] rounded-lg border-l-4"
            style={{ borderLeftColor: getDimensionColor(notification.dimension) }}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                {getTypeIcon(notification.type)}
                <h3 className="font-semibold text-[#333333]">{notification.subject}</h3>
              </div>
              <span className="text-sm text-[#9E9E9E]">{notification.date}</span>
            </div>
            <p className="text-[#333333]">{notification.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotificacionesComponent;
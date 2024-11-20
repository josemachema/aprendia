import React, { useState } from "react";
import { Bar } from "react-chartjs-2";
import { FiCalendar, FiClock, FiCheckCircle } from "react-icons/fi";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const HistorialProgreso = () => {
  const [dateRange, setDateRange] = useState({
    start: "",
    end: ""
  });

  const modulesData = [
    {
      titulo: "Introducción a la Programación",
      fechaInicio: "2024-01-01",
      fechaFin: "2024-01-15",
      calificacion: 95
    },
    {
      titulo: "Estructuras de Datos",
      fechaInicio: "2024-01-16",
      fechaFin: "2024-01-30",
      calificacion: 88
    },
    {
      titulo: "Algoritmos Avanzados",
      fechaInicio: "2024-02-01",
      fechaFin: "2024-02-15",
      calificacion: 92
    }
  ];

  const chartData = {
    labels: ["Programación", "Matemáticas", "Ciencias", "Lenguaje", "Historia"],
    datasets: [
      {
        label: "Progreso por Categoría (%)",
        data: [85, 70, 90, 65, 75],
        backgroundColor: ["#4A90E2", "#4CAF50", "#FFC107", "#FF9800", "#00BCD4"]
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top"
      },
      title: {
        display: true,
        text: "Progreso por Categoría"
      }
    }
  };

  const handleDateRangeChange = (e) => {
    setDateRange({
      ...dateRange,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-[#333333] mb-8">Historial de Progreso</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-[#F5F5F5] p-6 rounded-lg shadow-sm">
            <div className="flex items-center gap-3">
              <FiCheckCircle className="text-2xl text-[#4CAF50]" />
              <div>
                <p className="text-[#9E9E9E] text-sm">Actividades Completadas</p>
                <p className="text-2xl font-bold text-[#333333]">24</p>
              </div>
            </div>
          </div>

          <div className="bg-[#F5F5F5] p-6 rounded-lg shadow-sm">
            <div className="flex items-center gap-3">
              <FiClock className="text-2xl text-[#FFC107]" />
              <div>
                <p className="text-[#9E9E9E] text-sm">Tiempo Dedicado</p>
                <p className="text-2xl font-bold text-[#333333]">45h 30m</p>
              </div>
            </div>
          </div>

          <div className="bg-[#F5F5F5] p-6 rounded-lg shadow-sm">
            <div className="flex items-center gap-3">
              <FiCheckCircle className="text-2xl text-[#00BCD4]" />
              <div>
                <p className="text-[#9E9E9E] text-sm">Cuestionarios Aprobados</p>
                <p className="text-2xl font-bold text-[#333333]">18</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-[#F5F5F5] p-6 rounded-lg shadow-sm mb-8">
          <Bar options={chartOptions} data={chartData} />
        </div>

        <div className="bg-[#F5F5F5] p-6 rounded-lg shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-[#333333]">Módulos Completados</h2>
            <div className="flex gap-4">
              <div className="flex items-center gap-2">
                <FiCalendar className="text-[#4A90E2]" />
                <input
                  type="date"
                  name="start"
                  value={dateRange.start}
                  onChange={handleDateRangeChange}
                  className="border border-[#9E9E9E] rounded px-2 py-1"
                />
              </div>
              <div className="flex items-center gap-2">
                <FiCalendar className="text-[#4A90E2]" />
                <input
                  type="date"
                  name="end"
                  value={dateRange.end}
                  onChange={handleDateRangeChange}
                  className="border border-[#9E9E9E] rounded px-2 py-1"
                />
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#9E9E9E]">
                  <th className="text-left py-3 px-4 text-[#333333]">Título del Módulo</th>
                  <th className="text-left py-3 px-4 text-[#333333]">Fecha de Inicio</th>
                  <th className="text-left py-3 px-4 text-[#333333]">Fecha de Finalización</th>
                  <th className="text-left py-3 px-4 text-[#333333]">Calificación</th>
                </tr>
              </thead>
              <tbody>
                {modulesData.map((module, index) => (
                  <tr key={index} className="border-b border-[#9E9E9E]">
                    <td className="py-3 px-4 text-[#333333]">{module.titulo}</td>
                    <td className="py-3 px-4 text-[#333333]">{module.fechaInicio}</td>
                    <td className="py-3 px-4 text-[#333333]">{module.fechaFin}</td>
                    <td className="py-3 px-4">
                      <span className="bg-[#4CAF50] text-white px-2 py-1 rounded">
                        {module.calificacion}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HistorialProgreso;
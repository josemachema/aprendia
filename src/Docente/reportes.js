import React, { useState } from "react";
import { FaDownload, FaFilter } from "react-icons/fa";
import { Bar } from "react-chartjs-2";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const EstudiantesReporte = () => {
  const [selectedClass, setSelectedClass] = useState("todas");
  const [selectedModule, setSelectedModule] = useState("todos");

  const barChartData = {
    labels: ["Clase A", "Clase B", "Clase C", "Clase D"],
    datasets: [
      {
        label: "Progreso Promedio (%)",
        data: [75, 82, 65, 90],
        backgroundColor: "#4A90E2",
      },
    ],
  };

  const pieChartData = {
    labels: ["Módulo 1", "Módulo 2", "Módulo 3", "Módulo 4"],
    datasets: [
      {
        data: [30, 25, 20, 25],
        backgroundColor: ["#4CAF50", "#FFC107", "#F44336", "#00BCD4"],
      },
    ],
  };

  const estudiantes = [
    {
      nombre: "Ana García",
      progreso: 85,
      actividades: 42,
      clase: "Clase A",
      modulo: "Módulo 1",
    },
    {
      nombre: "Carlos López",
      progreso: 92,
      actividades: 45,
      clase: "Clase B",
      modulo: "Módulo 2",
    },
    {
      nombre: "María Rodríguez",
      progreso: 78,
      actividades: 38,
      clase: "Clase C",
      modulo: "Módulo 3",
    },
  ];

  const filteredStudents = estudiantes.filter(
    (student) =>
      (selectedClass === "todas" || student.clase === selectedClass) &&
      (selectedModule === "todos" || student.modulo === selectedModule)
  );

  const handleDownload = () => {
    console.log("Descargando reporte...");
  };

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-7xl mx-auto">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-[#333333]">Reportes de Estudiantes</h1>
          <button
            onClick={handleDownload}
            className="bg-[#4A90E2] text-white px-6 py-2 rounded-lg flex items-center gap-2 hover:bg-[#357ABD] transition-colors"
          >
            <FaDownload /> Generar Reporte
          </button>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-[#F5F5F5] p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Progreso General por Clase</h2>
            <Bar data={barChartData} />
          </div>
          <div className="bg-[#F5F5F5] p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Progreso por Módulo</h2>
            <Pie data={pieChartData} />
          </div>
        </div>

        <div className="bg-[#F5F5F5] p-6 rounded-lg shadow mb-8">
          <div className="flex flex-wrap gap-4 mb-6">
            <div className="flex items-center gap-2">
              <FaFilter className="text-[#9E9E9E]" />
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="border rounded-md px-3 py-2"
              >
                <option value="todas">Todas las Clases</option>
                <option value="Clase A">Clase A</option>
                <option value="Clase B">Clase B</option>
                <option value="Clase C">Clase C</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <FaFilter className="text-[#9E9E9E]" />
              <select
                value={selectedModule}
                onChange={(e) => setSelectedModule(e.target.value)}
                className="border rounded-md px-3 py-2"
              >
                <option value="todos">Todos los Módulos</option>
                <option value="Módulo 1">Módulo 1</option>
                <option value="Módulo 2">Módulo 2</option>
                <option value="Módulo 3">Módulo 3</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-[#4A90E2] text-white">
                  <th className="px-4 py-3 text-left">Nombre del Estudiante</th>
                  <th className="px-4 py-3 text-left">Progreso</th>
                  <th className="px-4 py-3 text-left">Actividades Completadas</th>
                  <th className="px-4 py-3 text-left">Clase</th>
                  <th className="px-4 py-3 text-left">Módulo</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map((student, index) => (
                  <tr
                    key={index}
                    className="border-b border-gray-200 hover:bg-gray-50"
                  >
                    <td className="px-4 py-3">{student.nombre}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div
                            className="bg-[#4CAF50] h-2.5 rounded-full"
                            style={{ width: `${student.progreso}%` }}
                          ></div>
                        </div>
                        <span>{student.progreso}%</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">{student.actividades}</td>
                    <td className="px-4 py-3">{student.clase}</td>
                    <td className="px-4 py-3">{student.modulo}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-[#F5F5F5] p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Calificaciones Promedio</h2>
            <div className="text-4xl font-bold text-[#4A90E2]">8.5</div>
            <p className="text-[#9E9E9E]">de 10 puntos posibles</p>
          </div>
          <div className="bg-[#F5F5F5] p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Tiempo Promedio por Módulo</h2>
            <div className="text-4xl font-bold text-[#4A90E2]">45</div>
            <p className="text-[#9E9E9E]">minutos por módulo</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EstudiantesReporte;
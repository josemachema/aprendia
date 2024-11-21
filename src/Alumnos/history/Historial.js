import React, { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import { FiCalendar, FiClock, FiCheckCircle } from "react-icons/fi";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebaseConfig"; // Ajusta la ruta según tu estructura
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const HistorialProgreso = () => {
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  const [modulesData, setModulesData] = useState([]); // Módulos desde Firebase
  const [chartData, setChartData] = useState(null); // Datos dinámicos del gráfico
  const [summaryData, setSummaryData] = useState({
    actividadesCompletadas: 0,
    tiempoDedicado: "0h",
    cuestionariosAprobados: 0,
  });

  // Cargar datos desde Firebase
  useEffect(() => {
    const fetchModulesData = async () => {
      try {
        // Obtener módulos completados
        const modulesSnapshot = await getDocs(collection(db, "cursos"));
        const modules = modulesSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setModulesData(modules);

        // Calcular resumen
        const actividadesCompletadas = modules.length;
        const tiempoDedicado = modules.reduce(
          (acc, module) => acc + (module.tiempoDedicado || 0),
          0
        );
        const cuestionariosAprobados = modules.filter(
          (module) => module.aprobado
        ).length;

        setSummaryData({
          actividadesCompletadas,
          tiempoDedicado: `${Math.floor(tiempoDedicado / 60)}h ${
            tiempoDedicado % 60
          }m`,
          cuestionariosAprobados,
        });

        // Configurar datos del gráfico
        const categorias = [
          ...new Set(modules.map((module) => module.categoria || "Otros")),
        ];
        const progresoPorCategoria = categorias.map((categoria) =>
          Math.round(
            modules
              .filter((module) => module.categoria === categoria)
              .reduce((acc, module) => acc + (module.progreso || 0), 0) /
              modules.filter((module) => module.categoria === categoria).length
          )
        );

        setChartData({
          labels: categorias,
          datasets: [
            {
              label: "Progreso por Categoría (%)",
              data: progresoPorCategoria,
              backgroundColor: [
                "#4A90E2",
                "#4CAF50",
                "#FFC107",
                "#FF9800",
                "#00BCD4",
              ],
            },
          ],
        });
      } catch (error) {
        console.error("Error al cargar datos de Firebase:", error);
      }
    };

    fetchModulesData();
  }, []);

  const handleDateRangeChange = (e) => {
    setDateRange({
      ...dateRange,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-[#333333] mb-8">
          Historial de Progreso
        </h1>

        {/* Resumen */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-[#F5F5F5] p-6 rounded-lg shadow-sm">
            <div className="flex items-center gap-3">
              <FiCheckCircle className="text-2xl text-[#4CAF50]" />
              <div>
                <p className="text-[#9E9E9E] text-sm">Actividades Completadas</p>
                <p className="text-2xl font-bold text-[#333333]">
                  {summaryData.actividadesCompletadas}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-[#F5F5F5] p-6 rounded-lg shadow-sm">
            <div className="flex items-center gap-3">
              <FiClock className="text-2xl text-[#FFC107]" />
              <div>
                <p className="text-[#9E9E9E] text-sm">Tiempo Dedicado</p>
                <p className="text-2xl font-bold text-[#333333]">
                  {summaryData.tiempoDedicado}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-[#F5F5F5] p-6 rounded-lg shadow-sm">
            <div className="flex items-center gap-3">
              <FiCheckCircle className="text-2xl text-[#00BCD4]" />
              <div>
                <p className="text-[#9E9E9E] text-sm">Cuestionarios Aprobados</p>
                <p className="text-2xl font-bold text-[#333333]">
                  {summaryData.cuestionariosAprobados}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Gráfico */}
        {chartData && (
          <div className="bg-[#F5F5F5] p-6 rounded-lg shadow-sm mb-8">
            <Bar
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    position: "top",
                  },
                  title: {
                    display: true,
                    text: "Progreso por Categoría",
                  },
                },
              }}
              data={chartData}
            />
          </div>
        )}

        {/* Tabla */}
        <div className="bg-[#F5F5F5] p-6 rounded-lg shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-[#333333]">
              Módulos Completados
            </h2>
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
                  <th className="text-left py-3 px-4 text-[#333333]">
                    Título del Módulo
                  </th>
                  <th className="text-left py-3 px-4 text-[#333333]">
                    Fecha de Inicio
                  </th>
                  <th className="text-left py-3 px-4 text-[#333333]">
                    Fecha de Finalización
                  </th>
                  <th className="text-left py-3 px-4 text-[#333333]">
                    Calificación
                  </th>
                </tr>
              </thead>
              <tbody>
                {modulesData.map((module, index) => (
                  <tr key={index} className="border-b border-[#9E9E9E]">
                    <td className="py-3 px-4 text-[#333333]">
                      {module.nombreCurso}
                    </td>
                    <td className="py-3 px-4 text-[#333333]">
                      {module.fechaInicio || "N/A"}
                    </td>
                    <td className="py-3 px-4 text-[#333333]">
                      {module.fechaFin || "N/A"}
                    </td>
                    <td className="py-3 px-4">
                      <span className="bg-[#4CAF50] text-white px-2 py-1 rounded">
                        {module.calificacion || "N/A"}%
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

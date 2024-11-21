import React, { useState } from "react";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";

const QuestionnaireManagement = () => {
  const [showModal, setShowModal] = useState(false);
  const [questionnaires, setQuestionnaires] = useState([
    {
      id: 1,
      title: "Evaluación Matemáticas Básicas",
      module: "Matemáticas",
      status: "Publicado",
      createdAt: "2024-01-15",
    },
    {
      id: 2,
      title: "Quiz Programación",
      module: "Informática",
      status: "Borrador",
      createdAt: "2024-01-16",
    },
  ]);

  const [students] = useState([
    {
      id: 1,
      name: "Juan Pérez",
      score: 85,
      time: "45 min",
    },
    {
      id: 2,
      name: "María García",
      score: 92,
      time: "38 min",
    },
  ]);

  const [formData, setFormData] = useState({
    title: "",
    module: "",
    questions: [
      {
        type: "multiple",
        question: "",
        options: ["", "", "", ""],
      },
    ],
  });

  const handleAddQuestion = () => {
    setFormData({
      ...formData,
      questions: [
        ...formData.questions,
        {
          type: "multiple",
          question: "",
          options: ["", "", "", ""],
        },
      ],
    });
  };

  const handleDeleteQuestionnaire = (id) => {
    setQuestionnaires(questionnaires.filter((q) => q.id !== id));
  };

  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-7xl mx-auto">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-[#4A90E2]">Gestión de Cuestionarios</h1>
          <button
            onClick={() => setShowModal(true)}
            className="bg-[#4A90E2] text-white px-6 py-2 rounded-lg flex items-center gap-2 hover:bg-[#357ABD] transition-colors"
          >
            <FaPlus /> Crear Cuestionario
          </button>
        </header>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4 text-[#4A90E2]">Lista de Cuestionarios</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#F5F5F5]">
                <tr>
                  <th className="px-4 py-3 text-left">Nombre</th>
                  <th className="px-4 py-3 text-left">Módulo</th>
                  <th className="px-4 py-3 text-left">Estado</th>
                  <th className="px-4 py-3 text-left">Fecha</th>
                  <th className="px-4 py-3 text-left">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {questionnaires.map((questionnaire) => (
                  <tr key={questionnaire.id} className="border-b">
                    <td className="px-4 py-3">{questionnaire.title}</td>
                    <td className="px-4 py-3">{questionnaire.module}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-3 py-1 rounded-full text-sm ${
                          questionnaire.status === "Publicado"
                            ? "bg-[#4CAF50] text-white"
                            : "bg-[#FFC107] text-gray-800"
                        }`}
                      >
                        {questionnaire.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">{questionnaire.createdAt}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button className="text-[#00BCD4] hover:text-[#008C9E]">
                          <FaEdit size={20} />
                        </button>
                        <button
                          onClick={() => handleDeleteQuestionnaire(questionnaire.id)}
                          className="text-[#F44336] hover:text-[#D32F2F]"
                        >
                          <FaTrash size={20} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4 text-[#4A90E2]">Resultados de Estudiantes</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#F5F5F5]">
                <tr>
                  <th className="px-4 py-3 text-left">Estudiante</th>
                  <th className="px-4 py-3 text-left">Puntuación</th>
                  <th className="px-4 py-3 text-left">Tiempo</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => (
                  <tr key={student.id} className="border-b">
                    <td className="px-4 py-3">{student.name}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-gray-200 rounded-full h-2.5">
                          <div
                            className="bg-[#4CAF50] h-2.5 rounded-full"
                            style={{ width: `${student.score}%` }}
                          ></div>
                        </div>
                        <span>{student.score}%</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">{student.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg w-full max-w-3xl p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-[#4A90E2]">Crear Cuestionario</h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <IoMdClose size={24} />
                </button>
              </div>

              <form className="space-y-6">
                <div>
                  <label className="block text-gray-700 mb-2">Título del Cuestionario</label>
                  <input
                    type="text"
                    className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:border-[#4A90E2]"
                    placeholder="Ingrese el título"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 mb-2">Módulo</label>
                  <input
                    type="text"
                    className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:border-[#4A90E2]"
                    placeholder="Ingrese el módulo"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-4">
                    <label className="text-gray-700">Preguntas</label>
                    <button
                      type="button"
                      onClick={handleAddQuestion}
                      className="text-[#00BCD4] hover:text-[#008C9E] flex items-center gap-1"
                    >
                      <FaPlus /> Agregar Pregunta
                    </button>
                  </div>

                  {formData.questions.map((_, index) => (
                    <div key={index} className="border rounded-lg p-4 mb-4">
                      <div className="mb-4">
                        <label className="block text-gray-700 mb-2">Tipo de Pregunta</label>
                        <select className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:border-[#4A90E2]">
                          <option value="multiple">Opción Múltiple</option>
                          <option value="single">Selección Única</option>
                          <option value="short">Respuesta Corta</option>
                        </select>
                      </div>

                      <div className="mb-4">
                        <label className="block text-gray-700 mb-2">Pregunta</label>
                        <input
                          type="text"
                          className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:border-[#4A90E2]"
                          placeholder="Ingrese la pregunta"
                        />
                      </div>

                      <div>
                        <label className="block text-gray-700 mb-2">Opciones</label>
                        <div className="space-y-2">
                          {[1, 2, 3, 4].map((optionNum) => (
                            <input
                              key={optionNum}
                              type="text"
                              className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:border-[#4A90E2]"
                              placeholder={`Opción ${optionNum}`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex justify-end gap-4">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-[#4A90E2] text-white rounded-lg hover:bg-[#357ABD]"
                  >
                    Guardar
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuestionnaireManagement;

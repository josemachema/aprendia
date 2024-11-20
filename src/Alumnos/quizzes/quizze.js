import React, { useState } from "react";
import { FiClock, FiCheck, FiX } from "react-icons/fi";
import { IoMdTime } from "react-icons/io";
import { MdQuiz, MdArrowForward } from "react-icons/md";

const QuizInterface = () => {
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [answers, setAnswers] = useState([]);
  const [selectedModule, setSelectedModule] = useState("all");

  const modules = [
    { id: "all", name: "Todos los Módulos" },
    { id: "mod1", name: "Módulo 1: Fundamentos" },
    { id: "mod2", name: "Módulo 2: Avanzado" },
    { id: "mod3", name: "Módulo 3: Especialización" }
  ];

  const quizzes = [
    {
      id: 1,
      module: "mod1",
      title: "Conceptos Básicos",
      status: "not_started",
      deadline: "2024-02-20",
      questions: [
        {
          type: "multiple",
          question: "¿Cuál es el concepto principal?",
          options: ["Opción 1", "Opción 2", "Opción 3", "Opción 4"],
          correct: 0
        }
      ]
    },
    {
      id: 2,
      module: "mod2",
      title: "Evaluación Intermedia",
      status: "completed",
      deadline: "2024-02-25",
      questions: []
    }
  ];

  const handleStartQuiz = (quiz) => {
    setSelectedQuiz(quiz);
    setCurrentQuestion(0);
    setShowResults(false);
    setAnswers([]);
  };

  const handleAnswer = (answer) => {
    setAnswers([...answers, answer]);
    if (currentQuestion < selectedQuiz.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResults(true);
    }
  };

  const getStatusColor = (status) => {
    return status === "completed" ? "bg-[#4CAF50]" : "bg-[#FFC107]";
  };

  const filteredQuizzes = selectedModule === "all" 
    ? quizzes 
    : quizzes.filter(quiz => quiz.module === selectedModule);

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-[#4A90E2] mb-6">Cuestionarios Disponibles</h1>
          <select
            className="w-full md:w-64 p-2 border rounded-lg bg-[#F5F5F5] text-gray-700"
            value={selectedModule}
            onChange={(e) => setSelectedModule(e.target.value)}
          >
            {modules.map((module) => (
              <option key={module.id} value={module.id}>
                {module.name}
              </option>
            ))}
          </select>
        </header>

        {!selectedQuiz ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredQuizzes.map((quiz) => (
              <div
                key={quiz.id}
                className="bg-[#F5F5F5] rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold text-gray-800">{quiz.title}</h3>
                  <span
                    className={`${getStatusColor(quiz.status)} px-3 py-1 rounded-full text-white text-sm`}
                  >
                    {quiz.status === "completed" ? "Completo" : "No Iniciado"}
                  </span>
                </div>
                <div className="flex items-center text-[#9E9E9E] mb-4">
                  <FiClock className="mr-2" />
                  <span>Fecha límite: {quiz.deadline}</span>
                </div>
                <button
                  onClick={() => handleStartQuiz(quiz)}
                  className="w-full bg-[#4A90E2] text-white py-2 rounded-lg hover:bg-[#357ABD] transition-colors flex items-center justify-center"
                >
                  <MdQuiz className="mr-2" />
                  Iniciar
                </button>
              </div>
            ))}
          </div>
        ) : showResults ? (
          <div className="bg-[#F5F5F5] rounded-lg p-8 max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-[#4A90E2] mb-6">Resultados</h2>
            <div className="mb-6">
              <div className="text-xl mb-2">
                Calificación: {Math.round((answers.filter((a, i) => a === selectedQuiz.questions[i].correct).length / answers.length) * 100)}%
              </div>
              <div className="flex items-center space-x-4">
                <span className="flex items-center">
                  <FiCheck className="text-[#4CAF50] mr-1" /> 
                  Correctas: {answers.filter((a, i) => a === selectedQuiz.questions[i].correct).length}
                </span>
                <span className="flex items-center">
                  <FiX className="text-[#F44336] mr-1" /> 
                  Incorrectas: {answers.filter((a, i) => a !== selectedQuiz.questions[i].correct).length}
                </span>
              </div>
            </div>
            <button
              onClick={() => setSelectedQuiz(null)}
              className="bg-[#FF9800] text-white py-2 px-6 rounded-lg hover:bg-[#F57C00] transition-colors"
            >
              Volver a Cuestionarios
            </button>
          </div>
        ) : (
          <div className="bg-[#F5F5F5] rounded-lg p-8 max-w-2xl mx-auto">
            <div className="mb-6">
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-[#4CAF50] h-2.5 rounded-full"
                  style={{ width: `${(currentQuestion / selectedQuiz.questions.length) * 100}%` }}
                ></div>
              </div>
              <div className="text-right text-sm text-[#9E9E9E] mt-2">
                {currentQuestion + 1} de {selectedQuiz.questions.length}
              </div>
            </div>

            <div className="mb-8">
              <h3 className="text-xl font-semibold mb-4">
                {selectedQuiz.questions[currentQuestion].question}
              </h3>
              <div className="space-y-3">
                {selectedQuiz.questions[currentQuestion].options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswer(index)}
                    className="w-full text-left p-4 rounded-lg bg-white hover:bg-[#E3F2FD] transition-colors border border-gray-200"
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizInterface;
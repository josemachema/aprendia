import { useState } from "react";
import { FaHome, FaBook, FaFileDownload, FaChevronLeft, FaChevronRight, FaCheckCircle, FaTimesCircle } from "react-icons/fa";

const StudentModule = () => {
  const [currentTab, setCurrentTab] = useState("home");
  const [currentStage, setCurrentStage] = useState(0);
  const [quizScore, setQuizScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);

  const moduleContent = [
    {
      title: "Introduction to React",
      content: "Learn the basics of React framework",
      type: "video",
      url: "images.unsplash.com/photo-1633356122544-f134324a6cee?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
    },
    {
      title: "Component Lifecycle",
      content: "Understanding React component lifecycle",
      type: "text"
    },
    {
      title: "Hooks in React",
      content: "Deep dive into React Hooks",
      type: "simulation"
    }
  ];

  const quizData = [
    {
      question: "What is React?",
      options: ["A JavaScript library", "A programming language", "A database", "An operating system"],
      correctAnswer: 0
    }
  ];

  const resources = [
    {
      title: "React Documentation",
      type: "pdf",
      size: "2.5MB"
    },
    {
      title: "React Best Practices",
      type: "presentation",
      size: "1.8MB"
    }
  ];

  const handleAnswerSelection = (index) => {
    setSelectedAnswer(index);
    if (index === quizData[0].correctAnswer) {
      setQuizScore(100);
    } else {
      setQuizScore(0);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <header className="bg-[#4A90E2] text-white p-6">
        <h1 className="text-2xl font-bold mb-4">Advanced React Development</h1>
        <nav className="flex space-x-6">
          <button
            onClick={() => setCurrentTab("home")}
            className={`flex items-center space-x-2 ${currentTab === "home" ? "text-[#FFC107]" : ""}`}
          >
            <FaHome /> <span>Home</span>
          </button>
          <button
            onClick={() => setCurrentTab("activities")}
            className={`flex items-center space-x-2 ${currentTab === "activities" ? "text-[#FFC107]" : ""}`}
          >
            <FaBook /> <span>Activities</span>
          </button>
          <button
            onClick={() => setCurrentTab("resources")}
            className={`flex items-center space-x-2 ${currentTab === "resources" ? "text-[#FFC107]" : ""}`}
          >
            <FaFileDownload /> <span>Resources</span>
          </button>
        </nav>
      </header>

      <main className="container mx-auto p-6">
        {currentTab === "home" && (
          <div className="bg-[#F5F5F5] rounded-lg p-6">
            <div className="mb-8">
              {moduleContent[currentStage].type === "video" && (
                <img
                  src={moduleContent[currentStage].url}
                  alt="Video thumbnail"
                  className="w-full h-64 object-cover rounded-lg mb-4"
                />
              )}
              <h2 className="text-xl font-bold text-[#333333] mb-2">{moduleContent[currentStage].title}</h2>
              <p className="text-[#9E9E9E]">{moduleContent[currentStage].content}</p>
            </div>
            <div className="flex justify-between">
              <button
                onClick={() => setCurrentStage(Math.max(0, currentStage - 1))}
                className="flex items-center space-x-2 bg-[#FF9800] text-white px-4 py-2 rounded-lg disabled:opacity-50"
                disabled={currentStage === 0}
              >
                <FaChevronLeft /> <span>Previous</span>
              </button>
              <button
                onClick={() => setCurrentStage(Math.min(moduleContent.length - 1, currentStage + 1))}
                className="flex items-center space-x-2 bg-[#4A90E2] text-white px-4 py-2 rounded-lg disabled:opacity-50"
                disabled={currentStage === moduleContent.length - 1}
              >
                <span>Next</span> <FaChevronRight />
              </button>
            </div>
          </div>
        )}

        {currentTab === "activities" && (
          <div className="bg-[#F5F5F5] rounded-lg p-6">
            <h2 className="text-xl font-bold text-[#333333] mb-4">Quiz</h2>
            <div className="mb-6">
              <p className="text-[#333333] mb-4">{quizData[0].question}</p>
              <div className="space-y-3">
                {quizData[0].options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswerSelection(index)}
                    className={`w-full text-left p-3 rounded-lg ${selectedAnswer === index ? "bg-[#4A90E2] text-white" : "bg-white"}`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
            {selectedAnswer !== null && (
              <div className="flex items-center space-x-2">
                {selectedAnswer === quizData[0].correctAnswer ? (
                  <>
                    <FaCheckCircle className="text-[#4CAF50]" />
                    <span className="text-[#4CAF50]">Correct!</span>
                  </>
                ) : (
                  <>
                    <FaTimesCircle className="text-[#F44336]" />
                    <span className="text-[#F44336]">Incorrect</span>
                  </>
                )}
                <span className="ml-4">Score: {quizScore}%</span>
              </div>
            )}
          </div>
        )}

        {currentTab === "resources" && (
          <div className="bg-[#F5F5F5] rounded-lg p-6">
            <h2 className="text-xl font-bold text-[#333333] mb-4">Additional Resources</h2>
            <div className="space-y-4">
              {resources.map((resource, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between bg-white p-4 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <FaFileDownload className="text-[#00BCD4]" />
                    <span className="text-[#333333]">{resource.title}</span>
                  </div>
                  <div className="text-[#9E9E9E] text-sm">{resource.size}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default StudentModule;
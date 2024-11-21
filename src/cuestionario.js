import { useState } from "react";
import { FaCheck } from "react-icons/fa";
import { FaVolumeUp } from "react-icons/fa";

// Componente principal
const LearningStylesQuestionnaire = () => {
  const [answers, setAnswers] = useState({});
  const [formSubmitted, setFormSubmitted] = useState(false);

  const questions = [
    { "id": 1, "text": "Entiendo algo mejor después de", "options": ["probarlo.", "pensarlo detenidamente."] },
    { "id": 2, "text": "Preferiría ser considerado", "options": ["realista.", "innovador."] },
    { "id": 3, "text": "Cuando pienso en lo que hice ayer, es más probable que recuerde", "options": ["una imagen.", "palabras."] },
    { "id": 4, "text": "Tiendo a", "options": ["entender los detalles de un tema, pero puede que me confunda con la estructura general.", "entender la estructura general, pero puede que me confunda con los detalles."] },
    { "id": 5, "text": "Cuando estoy aprendiendo algo nuevo, me ayuda", "options": ["hablar sobre ello.", "pensar sobre ello."] },
    { "id": 6, "text": "Si fuera maestro, preferiría enseñar un curso que trate", "options": ["con hechos y situaciones de la vida real.", "con ideas y teorías."] },
    { "id": 7, "text": "Prefiero obtener nueva información en forma de", "options": ["imágenes, diagramas, gráficos o mapas.", "instrucciones escritas o información verbal."] },
    { "id": 8, "text": "Una vez que entiendo", "options": ["todas las partes, entiendo todo el conjunto.", "el conjunto, veo cómo encajan las partes."] },
    { "id": 9, "text": "En un grupo de estudio trabajando con material difícil, es más probable que", "options": ["participe y aporte ideas.", "me siente y escuche."] },
    { "id": 10, "text": "Me resulta más fácil", "options": ["aprender hechos.", "aprender conceptos."] },
    { "id": 11, "text": "En un libro con muchas imágenes y gráficos, es más probable que", "options": ["examine cuidadosamente las imágenes y gráficos.", "me concentre en el texto escrito."] },
    { "id": 12, "text": "Cuando resuelvo problemas matemáticos", "options": ["usualmente sigo los pasos uno por uno para llegar a la solución.", "a menudo veo la solución pero tengo que esforzarme para descubrir los pasos para llegar a ella."] },
    { "id": 13, "text": "En las clases que he tomado", "options": ["generalmente he conocido a muchos de los estudiantes.", "raramente he conocido a muchos de los estudiantes."] },
    { "id": 14, "text": "Cuando leo textos no ficticios, prefiero", "options": ["algo que me enseñe nuevos hechos o me diga cómo hacer algo.", "algo que me dé nuevas ideas para reflexionar."] },
    { "id": 15, "text": "Me gustan los maestros", "options": ["que ponen muchos diagramas en el tablero.", "que pasan mucho tiempo explicando."] },
    { "id": 16, "text": "Cuando analizo una historia o novela", "options": ["pienso en los incidentes y trato de unirlos para entender los temas.", "simplemente sé cuáles son los temas cuando termino de leer y luego tengo que volver y encontrar los incidentes que los demuestran."] },
    { "id": 17, "text": "Cuando empiezo un problema de tarea, es más probable que", "options": ["comience a trabajar en la solución de inmediato.", "trate de entender completamente el problema primero."] },
    { "id": 18, "text": "Prefiero la idea de", "options": ["certeza.", "teoría."] },
    { "id": 19, "text": "Recuerdo mejor", "options": ["lo que veo.", "lo que escucho."] },
    { "id": 20, "text": "Para mí es más importante que un instructor", "options": ["presente el material en pasos secuenciales claros.", "me dé una visión general y relacione el material con otros temas."] },
    { "id": 21, "text": "Prefiero estudiar", "options": ["en un grupo de estudio.", "solo."] },
    { "id": 22, "text": "Es más probable que se me considere", "options": ["cuidadoso con los detalles de mi trabajo.", "creativo en cómo hago mi trabajo."] },
    { "id": 23, "text": "Cuando recibo indicaciones para ir a un lugar nuevo, prefiero", "options": ["un mapa.", "instrucciones escritas."] },
    { "id": 24, "text": "Aprendo", "options": ["a un ritmo bastante regular. Si estudio mucho, lo entenderé.", "de forma irregular. Estoy completamente confundido y luego, de repente, todo hace 'clic'."] },
    { "id": 25, "text": "Prefiero primero", "options": ["probar cosas.", "pensar en cómo voy a hacerlo."] },
    { "id": 26, "text": "Cuando leo por diversión, prefiero que los escritores", "options": ["digan claramente lo que quieren decir.", "digan cosas de maneras creativas e interesantes."] },
    { "id": 27, "text": "Cuando veo un diagrama o un esquema en clase, es más probable que recuerde", "options": ["la imagen.", "lo que dijo el instructor al respecto."] },
    { "id": 28, "text": "Al considerar un conjunto de información, es más probable que", "options": ["me concentre en los detalles y pierda la visión general.", "trate de entender la visión general antes de entrar en los detalles."] },
    { "id": 29, "text": "Recuerdo más fácilmente", "options": ["algo que he hecho.", "algo en lo que he pensado mucho."] },
    { "id": 30, "text": "Cuando tengo que realizar una tarea, prefiero", "options": ["dominar una forma de hacerlo.", "idear nuevas formas de hacerlo."] },
    { "id": 31, "text": "Cuando alguien me muestra datos, prefiero", "options": ["gráficos o diagramas.", "texto que resuma los resultados."] },
    { "id": 32, "text": "Cuando escribo un trabajo, es más probable que", "options": ["trabaje en el comienzo del trabajo y avance en orden.", "trabaje en diferentes partes del trabajo y luego las ordene."] },
    { "id": 33, "text": "Cuando trabajo en un proyecto grupal, primero quiero", "options": ["tener una 'lluvia de ideas grupal' donde todos contribuyan con ideas.", "pensar individualmente y luego reunirnos como grupo para comparar ideas."] },
    { "id": 34, "text": "Considero que es más halagador que me llamen", "options": ["sensato.", "imaginativo."] },
    { "id": 35, "text": "Cuando conozco a personas en una fiesta, es más probable que recuerde", "options": ["cómo se veían.", "lo que dijeron sobre sí mismos."] },
    { "id": 36, "text": "Cuando estoy aprendiendo un tema nuevo, prefiero", "options": ["mantenerme enfocado en ese tema, aprendiendo tanto como pueda sobre él.", "tratar de hacer conexiones entre ese tema y temas relacionados."] },
    { "id": 37, "text": "Es más probable que se me considere", "options": ["extrovertido.", "reservado."] },
    { "id": 38, "text": "Prefiero cursos que enfatizan", "options": ["material concreto (hechos, datos).", "material abstracto (conceptos, teorías)."] },
    { "id": 39, "text": "Para entretenerme, prefiero", "options": ["ver televisión.", "leer un libro."] },
    { "id": 40, "text": "Algunos maestros comienzan sus clases con un esquema de lo que cubrirán. Estos esquemas son", "options": ["algo útiles para mí.", "muy útiles para mí."] },
    { "id": 41, "text": "La idea de hacer tareas en grupo, con una calificación para todo el grupo,", "options": ["me atrae.", "no me atrae."] },
    { "id": 42, "text": "Cuando hago cálculos largos,", "options": ["tiendo a repetir todos mis pasos y revisar mi trabajo cuidadosamente.", "revisar mi trabajo me resulta tedioso y tengo que obligarme a hacerlo."] },
    { "id": 43, "text": "Tiendo a imaginar lugares donde he estado", "options": ["fácil y bastante exactamente.", "con dificultad y sin mucho detalle."] },
    { "id": 44, "text": "Cuando resuelvo problemas en grupo, es más probable que", "options": ["piense en los pasos del proceso de solución.", "piense en posibles consecuencias o aplicaciones de la solución en una amplia variedad de áreas."] },
    { "id": 45, "text": "Prefiero estudiar en", "options": ["grupo.", "solitario."] },
    { "id": 46, "text": "Cuando tengo que resolver un problema difícil, prefiero", "options": ["trabajar con otras personas.", "trabajar solo."] },
    { "id": 47, "text": "En reuniones sociales, tiendo a", "options": ["ser muy participativo.", "escuchar más que hablar."] },
    { "id": 48, "text": "Prefiero trabajar en proyectos", "options": ["en equipo.", "de forma individual."] },
    { "id": 49, "text": "Cuando aprendo algo nuevo, me ayuda", "options": ["discutirlo con otros.", "pensar en ello por mí mismo."] },
    { "id": 50, "text": "Cuando tengo dudas sobre un tema, prefiero", "options": ["preguntar a otros.", "buscar respuestas por mi cuenta."] },
    { "id": 51, "text": "Cuando trabajo, me siento más productivo", "options": ["rodeado de otras personas.", "en un ambiente tranquilo y privado."] },
    { "id": 52, "text": "Prefiero participar en actividades de aprendizaje que son", "options": ["colaborativas.", "independientes."] },
    { "id": 53, "text": "Cuando pienso en mis logros, prefiero compartirlos con", "options": ["un grupo de personas.", "una persona cercana o conmigo mismo."] },
    { "id": 54, "text": "En mi tiempo libre, prefiero", "options": ["hacer actividades en grupo.", "hacer actividades por mi cuenta."] },
    { "id": 55, "text": "Cuando trabajo en un equipo, suelo", "options": ["contribuir activamente en las discusiones.", "realizar mi parte sin mucha interacción."] }
  ];

    const handleOptionSelect = (questionId, optionIndex) => {
      setAnswers((prev) => ({
        ...prev,
        [questionId]: optionIndex,
      }));
    };

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormSubmitted(true);

    if (Object.keys(answers).length === questions.length) { 
      console.log("Formulario enviado con éxito:", answers);
    }
  };

  const speakText = (question) => {
    const optionsText = question.options
      .map((value, index) => `Opción ${index + 1}: ${value}`)
      .join(". ");
    const textToSpeak = `${question.text}. ${optionsText}`;

    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.lang = "es-ES";
    window.speechSynthesis.speak(utterance);
  };

  // Componente de Resultados
  const Results = ({ responses }) => {
    const categoryMap = {
      ACT: [1, 5, 9, 13, 17, 21, 25, 29, 33, 37, 41],
      SNS: [2, 6, 10, 14, 18, 22, 26, 30, 34, 38, 42],
      VIS: [3, 7, 11, 15, 19, 23, 27, 31, 35, 39, 43],
      SEQ: [4, 8, 12, 16, 20, 24, 28, 32, 36, 40, 44],
      SOC: [45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55],
    };
  
    const descriptions = {
      ACT: "Procesamiento de información: Activo vs. Reflexivo.",
      SNS: "Percepción de la información: Sensitivo vs. Intuitivo.",
      VIS: "Entrada de información: Visual vs. Verbal.",
      SEQ: "Comprensión de la información: Secuencial vs. Global.",
      SOC: "Interacción social: Social vs. Solitario.",
    };
  
    const scores = {
      ACT: { a: 0, b: 0 },
      SNS: { a: 0, b: 0 },
      VIS: { a: 0, b: 0 },
      SEQ: { a: 0, b: 0 },
      SOC: { a: 0, b: 0 },
    };
  
    // Calcula los puntajes basado en 0 y 1
    Object.entries(responses).forEach(([questionId, answer]) => {
      const id = parseInt(questionId);
  
      Object.keys(categoryMap).forEach((category) => {
        if (categoryMap[category].includes(id)) {
          if (answer === 0) {
            scores[category].a += 1; // Incrementa "a" para 0
          } else if (answer === 1) {
            scores[category].b += 1; // Incrementa "b" para 1
          }
        }
      });
    });
  
    console.log("Puntajes calculados:", scores);
  
    const getLearningStyle = (category, values) => {
      if (values.a > values.b) {
        switch (category) {
          case "ACT":
            return "Activo";
          case "SNS":
            return "Sensitivo";
          case "VIS":
            return "Visual";
          case "SEQ":
            return "Secuencial";
          case "SOC":
            return "Social";
          default:
            return "Indeterminado";
        }
      } else if (values.b > values.a) {
        switch (category) {
          case "ACT":
            return "Reflexivo";
          case "SNS":
            return "Intuitivo";
          case "VIS":
            return "Verbal";
          case "SEQ":
            return "Global";
          case "SOC":
            return "Solitario";
          default:
            return "Indeterminado";
        }
      } else {
        return "Balanceado";
      }
    };
  
    return (
      <div>
        <h2>Resultados del Inventario de Estilos de Aprendizaje</h2>
        {Object.entries(scores).map(([category, values]) => (
          <div key={category} style={{ marginBottom: "20px" }}>
            <h4>{descriptions[category]}</h4>
            <p>
              Tu estilo de aprendizaje en esta dimensión es:{" "}
              <strong>{getLearningStyle(category, values)}</strong>
            </p>
          </div>
        ))}
        <p>
          Un puntaje mayor en "0" o "1" indica tu preferencia de estilo de aprendizaje en cada dimensión.
        </p>
      </div>
    );
  };
  


  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-lg shadow-xl p-6 md:p-8">
          {!formSubmitted ? (
            <>
              <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
                Cuestionario de Estilos de Aprendizaje
              </h1>
              <form onSubmit={handleSubmit} className="space-y-8">
                {questions.map((question) => (
                  <div key={question.id} className="space-y-4">
                    <fieldset>
                      <div className="flex items-center justify-between mb-4">
                        <legend className="text-lg font-medium text-gray-900">
                          {question.id}. {question.text}
                        </legend>
                        <button
                          type="button"
                          onClick={() => speakText(question)}
                          className="ml-4 p-2 text-blue-600 hover:text-blue-800 transition-colors duration-200 focus:outline-none"
                          aria-label="Leer pregunta en voz alta"
                        >
                          <FaVolumeUp className="w-5 h-5" />
                        </button>
                      </div>
                      <div className="space-y-3">
                        {question.options.map((option, index) => (
                          <div
                            key={index}
                            className="relative flex items-center"
                          >
                            <div
                              className={`flex items-center justify-between w-full p-4 cursor-pointer rounded-lg border-2 transition-all duration-200 ${
                                answers[question.id] === index
                                  ? "border-blue-500 bg-blue-50"
                                  : "border-gray-200 hover:border-blue-200"
                              }`}
                              onClick={() => handleOptionSelect(question.id, index)}
                              role="radio"
                              aria-checked={answers[question.id] === index}
                              tabIndex="0"
                            >
                              <div className="flex items-center">
                                <div
                                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                                    answers[question.id] === index
                                      ? "border-blue-500 bg-blue-500"
                                      : "border-gray-300"
                                  }`}
                                >
                                  {answers[question.id] === index && (
                                    <FaCheck className="text-white text-xs" />
                                  )}
                                </div>
                                <span className="ml-3 text-gray-700">
                                  {option}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </fieldset>
                    {formSubmitted && !answers[question.id] && (
                      <p className="text-red-500 text-sm mt-2" role="alert">
                        Por favor, seleccione una opción para esta pregunta
                      </p>
                    )}
                  </div>
                ))}
                <div className="mt-8">
                  <button
                    type="submit"
                    className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                  >
                    Enviar Respuestas
                  </button>
                </div>
              </form>
            </>
          ) : (
            <Results responses={answers} />
          )}
        </div>
      </div>
    </div>
  );
};

export default LearningStylesQuestionnaire;

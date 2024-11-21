import React, { useState, useEffect } from "react";
import {
  FiPlus,
  FiEdit2,
  FiCpu,
  FiX,
} from "react-icons/fi";
import { getFirestore, collection, addDoc, getDocs, updateDoc, doc, deleteDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import firebaseApp from "./firebaseConfig";

const db = getFirestore(firebaseApp);
const storage = getStorage(firebaseApp);

const LearningModuleManager = () => {
  const [modules, setModules] = useState([]);
  const [courses, setCourses] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentModule, setCurrentModule] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    course: "",
  });
  const [errors, setErrors] = useState({});
  const [previewActivities, setPreviewActivities] = useState([]);
  const [showAiPreview, setShowAiPreview] = useState(false);
  const [selectedModuleId, setSelectedModuleId] = useState(null);
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentActivityIndex, setCurrentActivityIndex] = useState(0); // Estado para el carrusel

  useEffect(() => {
    fetchCourses();
    fetchModules();
  }, []);

  // Obtener cursos desde Firebase
  const fetchCourses = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "cursos"));
      const fetchedCourses = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCourses(fetchedCourses);
    } catch (error) {
      console.error("Error al obtener los cursos:", error);
    }
  };

  // Obtener módulos desde Firebase
  const fetchModules = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "modulos"));
      const fetchedModules = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setModules(fetchedModules);
    } catch (error) {
      console.error("Error al obtener los módulos:", error);
    }
  };

  const openModal = (module = null) => {
    if (module) {
      setCurrentModule(module);
      setFormData({
        name: module.name,
        description: module.description,
        course: module.course || "",
      });
    } else {
      setCurrentModule(null);
      setFormData({ name: "", description: "", course: "" });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentModule(null);
    setFormData({ name: "", description: "", course: "" });
    setErrors({});
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "El nombre del módulo es requerido";
    if (!formData.description.trim()) newErrors.description = "La descripción es requerida";
    if (!formData.course) newErrors.course = "Debe seleccionar un curso";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const newModule = {
      name: formData.name,
      description: formData.description,
      course: formData.course,
      status: "active",
    };

    try {
      if (currentModule) {
        const moduleRef = doc(db, "modulos", currentModule.id);
        await updateDoc(moduleRef, newModule);
        setModules((prevModules) =>
          prevModules.map((mod) => (mod.id === currentModule.id ? { ...mod, ...newModule } : mod))
        );
      } else {
        const docRef = await addDoc(collection(db, "modulos"), newModule);
        setModules((prevModules) => [...prevModules, { id: docRef.id, ...newModule }]);
      }
      closeModal();
    } catch (error) {
      console.error("Error al guardar el módulo:", error);
    }
  };

  const openAiModal = (moduleId) => {
    setSelectedModuleId(moduleId);
    setAiModalOpen(true);
  };

  const generateAIActivities = async (activityType) => {
    const selectedModule = modules.find((mod) => mod.id === selectedModuleId);
    if (!selectedModule) return;

    const prompt =
      activityType === "personalized"
        ? `Genera 5 actividades personalizadas para los estilos de aprendizaje de mis alumnos. Curso: ${selectedModule.course}. Módulo: ${selectedModule.name}. Descripción: ${selectedModule.description}.`
        : `Genera 10 actividades que cubran todos los estilos de aprendizaje. Curso: ${selectedModule.course}. Módulo: ${selectedModule.name}. Descripción: ${selectedModule.description}.`;

    try {
      setIsLoading(true);
      const response = await fetch("http://localhost:5000/generate-activities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) throw new Error("Error al comunicarse con la IA");

      const data = await response.json();
      const activities = data.activities.map((activity, index) => ({
        id: `${Date.now()}-${index}`,
        title: `Actividad ${index + 1}`,
        description: activity,
        approved: false,
        dueDate: "",
        file: null,
      }));

      setPreviewActivities(activities);
      setShowAiPreview(true);
      setAiModalOpen(false);
    } catch (error) {
      console.error("Error al generar actividades:", error);
      alert("Hubo un problema al generar las actividades.");
    } finally {
      setIsLoading(false);
    }
  };

  const saveSelectedActivities = async () => {
    try {
      const selectedActivities = previewActivities.filter(
        (activity) => activity.approved
      );

      for (const activity of selectedActivities) {
        const newActivity = {
          title: activity.title,
          description: activity.description,
          dueDate: activity.dueDate,
          file: activity.file || null,
          moduleId: selectedModuleId,
        };

        // Guardar cada actividad individualmente en la colección
        await addDoc(collection(db, "Tareas_y_trabajos"), newActivity);
      }

      alert("Actividades guardadas exitosamente.");
      setShowAiPreview(false);
      setPreviewActivities([]);
    } catch (error) {
      console.error("Error al guardar actividades:", error);
      alert("Ocurrió un error al guardar las actividades.");
    }
  };

  const handleActivityChange = (id, field, value) => {
    console.log(`Actualizando actividad ${id} con campo ${field} y valor:`, value); // Log de depuración
    setPreviewActivities(prevActivities =>
      prevActivities.map(activity =>
        activity.id === id ? { ...activity, [field]: value } : activity
      )
    );
  };

  const handleFileUpload = async (id, file) => {
    if (!file) return; // Verifica si hay un archivo seleccionado

    // Validar el tipo de archivo (PDF o Word)
    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    if (!allowedTypes.includes(file.type)) {
      alert("Solo se permiten archivos PDF o Word.");
      return;
    }

    const fileRef = ref(storage, `activities/${file.name}`);
    try {
      // Subir el archivo a Firebase Storage
      const snapshot = await uploadBytes(fileRef, file);
      const fileURL = await getDownloadURL(snapshot.ref());

      // Verificar si la URL del archivo es válida
      if (!fileURL) {
        console.error("No se pudo obtener la URL del archivo");
        alert("Hubo un error al obtener la URL del archivo.");
        return;
      }

      console.log("Archivo subido correctamente. URL:", fileURL); // Log para verificar

      // Si se obtiene la URL, guarda la URL en la actividad
      handleActivityChange(id, "file", fileURL); // Actualiza la actividad con la URL del archivo
    } catch (error) {
      console.error("Error al subir el archivo:", error);
      alert("Hubo un error al subir el archivo.");
    }
  };

  const toggleApproval = id => {
    setPreviewActivities(prevActivities =>
      prevActivities.map(activity =>
        activity.id === id ? { ...activity, approved: !activity.approved } : activity
      )
    );
  };

  const reloadActivities = async () => {
    setPreviewActivities([]);  // Limpiar actividades previas
    setCurrentActivityIndex(0); // Reiniciar el carrusel
    setAiModalOpen(true); // Abrir modal para generar actividades nuevamente
  };

  const nextActivity = () => {
    if (currentActivityIndex < previewActivities.length - 1) {
      setCurrentActivityIndex(currentActivityIndex + 1);
    }
  };

  const prevActivity = () => {
    if (currentActivityIndex > 0) {
      setCurrentActivityIndex(currentActivityIndex - 1);
    }
  };

  // Eliminar módulo
  const deleteModule = async (moduleId) => {
    try {
      const moduleRef = doc(db, "modulos", moduleId);
      await deleteDoc(moduleRef);
      setModules(modules.filter(module => module.id !== moduleId));
    } catch (error) {
      console.error("Error al eliminar el módulo:", error);
      alert("Hubo un error al eliminar el módulo.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <header className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">Gestión de Módulos de Aprendizaje</h1>
          <button
            onClick={() => openModal()}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700"
          >
            <FiPlus className="w-5 h-5" />
            Nuevo Módulo
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {modules.map((module) => (
          <div key={module.id} className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800">{module.name}</h2>
            <p className="text-gray-600 mb-4">{module.description}</p>
            <p className="text-gray-500 mb-4">Curso: {module.course}</p>
            <div className="flex justify-between">
              <button
                onClick={() => openAiModal(module.id)}
                className="bg-purple-600 text-white px-3 py-1 rounded-lg flex items-center gap-2 hover:bg-purple-700"
              >
                <FiCpu className="w-4 h-4" />
                Generar Actividades IA
              </button>
              <button
                onClick={() => openModal(module)}
                className="text-blue-600 hover:text-blue-800"
              >
                <FiEdit2 className="w-5 h-5" />
              </button>
              <button
                onClick={() => deleteModule(module.id)}
                className="text-red-600 hover:text-red-800"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal de selección de actividades */}
      {aiModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg w-full max-w-md p-6">
            <h2 className="text-xl font-bold mb-4">Generar Actividades</h2>
            <p className="mb-4">¿Qué tipo de actividades deseas generar?</p>
            <div className="flex justify-between">
              <button
                onClick={() => generateAIActivities("personalized")}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                5 Actividades Personalizadas
              </button>
              <button
                onClick={() => generateAIActivities("generic")}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
              >
                10 Actividades Genéricas
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de actividades generadas */}
      {showAiPreview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-8">
          <div className="bg-white rounded-lg w-full max-w-[90vw] p-10 overflow-y-auto max-h-[90vh]">
            <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Actividades Generadas</h2>
            {/* Carrusel de actividades */}
            <div className="relative">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                {previewActivities.slice(currentActivityIndex, currentActivityIndex + 3).map((activity) => (
                  <div
                    key={activity.id}
                    className="relative border-2 rounded-lg p-8 shadow-lg hover:shadow-xl transition-shadow duration-300 bg-gray-50 w-full"
                  >
                    <input
                      type="checkbox"
                      checked={activity.approved}
                      onChange={() => toggleApproval(activity.id)}
                      className="absolute top-4 right-4 w-10 h-10 accent-green-500 hover:accent-green-600 cursor-pointer"
                    />
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">
                      {activity.title}
                    </h3>
                    <textarea
                      value={activity.description}
                      onChange={(e) =>
                        handleActivityChange(activity.id, "description", e.target.value)
                      }
                      className="w-full p-4 text-lg border rounded-lg mb-6 bg-white text-gray-800 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows="5"
                      placeholder="Descripción de la actividad"
                    />
                    <label className="block text-lg font-medium text-gray-700 mb-4">
                      Fecha de Entrega:
                      <input
                        type="datetime-local"
                        value={activity.dueDate}
                        onChange={(e) =>
                          handleActivityChange(activity.id, "dueDate", e.target.value)
                        }
                        className="w-full mt-2 p-3 text-lg border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </label>
                    <label className="block text-lg font-medium text-gray-700 mb-4">
                      Agregar Archivo:
                      <input
                        type="file"
                        onChange={(e) =>
                          handleFileUpload(activity.id, e.target.files[0])
                        }
                        className="w-full mt-2 p-3 text-lg border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </label>

                    {activity.file && (
                      <a
                        href={activity.file}
                        download
                        className="text-blue-500 mt-4 inline-block"
                      >
                        Descargar archivo
                      </a>
                    )}
                  </div>
                ))}
              </div>
              {/* Botones de navegación del carrusel */}
              <div className="flex justify-between mt-4">
                <button
                  onClick={prevActivity}
                  className="bg-gray-500 text-white px-4 py-2 rounded-lg"
                  disabled={currentActivityIndex === 0}
                >
                  Anterior
                </button>
                <button
                  onClick={nextActivity}
                  className="bg-gray-500 text-white px-4 py-2 rounded-lg"
                  disabled={currentActivityIndex + 3 >= previewActivities.length}
                >
                  Siguiente
                </button>
              </div>
            </div>
            <div className="mt-8 flex justify-end gap-6">
              <button
                onClick={reloadActivities}
                className="bg-yellow-500 text-white px-8 py-3 rounded-lg hover:bg-yellow-600 transition-colors duration-300"
              >
                Recargar Actividades
              </button>
              <button
                onClick={saveSelectedActivities}
                className="bg-green-500 text-white px-8 py-3 rounded-lg hover:bg-green-600 transition-colors duration-300"
              >
                Guardar Seleccionadas
              </button>
              <button
                onClick={() => setShowAiPreview(false)}
                className="bg-red-500 text-white px-8 py-3 rounded-lg hover:bg-red-600 transition-colors duration-300"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Spinner de carga */}
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded-lg shadow-lg">
            <p className="text-lg font-bold">Generando actividades, por favor espera...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default LearningModuleManager;

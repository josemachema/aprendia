import React, { useState, useEffect } from "react"
import { getFirestore, collection, addDoc, onSnapshot, doc, updateDoc, arrayUnion } from "firebase/firestore"
import { getAuth, onAuthStateChanged } from "firebase/auth"
import app from "../firebaseConfig"

const db = getFirestore(app)
const auth = getAuth(app)

function AdminDashboard({ onLogout }) {
  const [teachers, setTeachers] = useState([])
  const [courses, setCourses] = useState([])
  const [selectedTeacher, setSelectedTeacher] = useState("")
  const [selectedCourse, setSelectedCourse] = useState("")
  const [newCourseName, setNewCourseName] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [user, setUser] = useState(null)

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser)
      if (currentUser) {
        const unsubscribeTeachers = fetchTeachers()
        const unsubscribeCourses = subscribeToCoursesUpdates()
        return () => {
          unsubscribeTeachers()
          unsubscribeCourses()
        }
      }
    })

    return () => unsubscribeAuth()
  }, [])

  const fetchTeachers = () => {
    const teachersCollection = collection(db, "maestros")
    return onSnapshot(teachersCollection, (snapshot) => {
      const teachersList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
      setTeachers(teachersList)
    }, (error) => {
      console.error("Error fetching teachers:", error)
      setError("Error al cargar los maestros. Por favor, intenta de nuevo.")
    })
  }

  const subscribeToCoursesUpdates = () => {
    const coursesCollection = collection(db, "cursos")
    return onSnapshot(coursesCollection, (snapshot) => {
      const coursesList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
      setCourses(coursesList)
    }, (error) => {
      console.error("Error fetching courses:", error)
      setError("Error al cargar los cursos. Por favor, intenta de nuevo.")
    })
  }

  const handleAssignCourse = async () => {
    if (!user) {
      setError("Debes estar autenticado para realizar esta acción.")
      return
    }

    if (!selectedTeacher || !selectedCourse) {
      setError("Por favor, selecciona un maestro y un curso.")
      return
    }

    try {
      const teacherRef = doc(db, "maestros", selectedTeacher)
      await updateDoc(teacherRef, {
        courses: arrayUnion(selectedCourse)
      })
      setSuccess("Curso asignado exitosamente.")
      setSelectedTeacher("")
      setSelectedCourse("")
      setError("")
    } catch (error) {
      console.error("Error al asignar curso:", error)
      setError(`Error al asignar curso: ${error.message}`)
    }
  }

  const addCourse = async (e) => {
    e.preventDefault()

    if (!user) {
      setError("Debes estar autenticado para realizar esta acción.")
      return
    }

    if (!newCourseName.trim()) {
      setError("Por favor, ingresa un nombre para el curso.")
      return
    }

    try {
      const docRef = await addDoc(collection(db, "cursos"), {
        nombreCurso: newCourseName.trim(),
      })
      console.log("Curso agregado con ID: ", docRef.id)
      setSuccess(`Curso "${newCourseName}" agregado exitosamente.`)
      setNewCourseName("")
      setError("")
    } catch (error) {
      console.error("Error al agregar curso:", error)
      setError(`Error al agregar curso: ${error.message}`)
    }
  }

  if (!user) {
    return <div className="flex items-center justify-center h-screen">Cargando...</div>
  }

  return (
    <div className="container mx-auto p-4 space-y-8">
      <h1 className="text-3xl font-bold mb-6">Panel de Administrador</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      )}
      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Éxito: </strong>
          <span className="block sm:inline">{success}</span>
        </div>
      )}
      
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <h2 className="text-2xl font-bold mb-4">Asignar Curso a Maestro</h2>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="teacher-select">
            Maestro
          </label>
          <select
            id="teacher-select"
            value={selectedTeacher}
            onChange={(e) => setSelectedTeacher(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          >
            <option value="">Selecciona un maestro</option>
            {teachers.map((teacher) => (
              <option key={teacher.id} value={teacher.id}>
                {teacher.email}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="course-select">
            Curso
          </label>
          <select
            id="course-select"
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          >
            <option value="">Selecciona un curso</option>
            {courses.map((course) => (
              <option key={course.id} value={course.id}>
                {course.nombreCurso}
              </option>
            ))}
          </select>
        </div>
        <button
          onClick={handleAssignCourse}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Asignar Curso
        </button>
      </div>

      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <h2 className="text-2xl font-bold mb-4">Agregar Nuevo Curso</h2>
        <form onSubmit={addCourse} className="mb-4">
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="new-course-name">
              Nombre del Curso
            </label>
            <input
              id="new-course-name"
              type="text"
              value={newCourseName}
              onChange={(e) => setNewCourseName(e.target.value)}
              placeholder="Nombre del nuevo curso"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <button
            type="submit"
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Agregar Curso
          </button>
        </form>
      </div>

      <button
        onClick={onLogout}
        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
      >
        Cerrar Sesión
      </button>
    </div>
  )
}

export default AdminDashboard
import React, { useState, useEffect } from "react"
import { getFirestore, collection, addDoc, onSnapshot, doc, updateDoc, arrayUnion } from "firebase/firestore"
import { getAuth, onAuthStateChanged, createUserWithEmailAndPassword } from "firebase/auth"
import { hash } from "bcryptjs"
import Swal from 'sweetalert2'
import app from "../firebaseConfig"

const db = getFirestore(app)
const auth = getAuth(app)

function AdminDashboard({ onLogout }) {
  const [teachers, setTeachers] = useState([])
  const [courses, setCourses] = useState([])
  const [selectedTeacher, setSelectedTeacher] = useState("")
  const [selectedCourse, setSelectedCourse] = useState("")
  const [newCourseName, setNewCourseName] = useState("")
  const [user, setUser] = useState(null)
  const [newTeacher, setNewTeacher] = useState({
    nombre: "",
    apellido: "",
    edad: "",
    cedula: "",
    email: "",
    genero: "",
    password: "",
    rol: "maestro"
  })

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
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Error al cargar los maestros. Por favor, intenta de nuevo.',
      })
    })
  }

  const subscribeToCoursesUpdates = () => {
    const coursesCollection = collection(db, "cursos")
    return onSnapshot(coursesCollection, (snapshot) => {
      const coursesList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
      setCourses(coursesList)
    }, (error) => {
      console.error("Error fetching courses:", error)
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Error al cargar los cursos. Por favor, intenta de nuevo.',
      })
    })
  }

  const handleAssignCourse = async () => {
    if (!user) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Debes estar autenticado para realizar esta acción.',
      })
      return
    }

    if (!selectedTeacher || !selectedCourse) {
      Swal.fire({
        icon: 'warning',
        title: 'Campos incompletos',
        text: 'Por favor, selecciona un maestro y un curso.',
      })
      return
    }

    try {
      const teacherRef = doc(db, "maestros", selectedTeacher)
      await updateDoc(teacherRef, {
        courses: arrayUnion(selectedCourse)
      })
      Swal.fire({
        icon: 'success',
        title: 'Éxito',
        text: 'Curso asignado exitosamente.',
      })
      setSelectedTeacher("")
      setSelectedCourse("")
    } catch (error) {
      console.error("Error al asignar curso:", error)
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: `Error al asignar curso: ${error.message}`,
      })
    }
  }

  const addCourse = async (e) => {
    e.preventDefault()

    if (!user) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Debes estar autenticado para realizar esta acción.',
      })
      return
    }

    if (!newCourseName.trim()) {
      Swal.fire({
        icon: 'warning',
        title: 'Campo vacío',
        text: 'Por favor, ingresa un nombre para el curso.',
      })
      return
    }

    try {
      const docRef = await addDoc(collection(db, "cursos"), {
        nombreCurso: newCourseName.trim(),
      })
      console.log("Curso agregado con ID: ", docRef.id)
      Swal.fire({
        icon: 'success',
        title: 'Éxito',
        text: `Curso "${newCourseName}" agregado exitosamente.`,
      })
      setNewCourseName("")
    } catch (error) {
      console.error("Error al agregar curso:", error)
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: `Error al agregar curso: ${error.message}`,
      })
    }
  }

  const handleNewTeacherChange = (e) => {
    const { name, value } = e.target
    setNewTeacher(prev => ({ ...prev, [name]: value }))
  }

  const addTeacher = async (e) => {
    e.preventDefault()

    if (!user) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Debes estar autenticado para realizar esta acción.',
      })
      return
    }

    // Validación básica
    for (let field in newTeacher) {
      if (!newTeacher[field]) {
        Swal.fire({
          icon: 'warning',
          title: 'Campos incompletos',
          text: `Por favor, completa el campo ${field}.`,
        })
        return
      }
    }

    try {
      // Crear usuario en Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, newTeacher.email, newTeacher.password)
      
      // Encriptar la contraseña
      const hashedPassword = await hash(newTeacher.password, 10)

      // Crear documento en Firestore
      const teacherData = {
        ...newTeacher,
        password: hashedPassword,
        uid: userCredential.user.uid
      }
      delete teacherData.password // No guardamos la contraseña en texto plano

      await addDoc(collection(db, "maestros"), teacherData)

      Swal.fire({
        icon: 'success',
        title: 'Éxito',
        text: 'Maestro agregado exitosamente.',
      })
      setNewTeacher({
        nombre: "",
        apellido: "",
        edad: "",
        cedula: "",
        email: "",
        genero: "",
        password: "",
        rol: "maestro"
      })
    } catch (error) {
      console.error("Error al agregar maestro:", error)
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: `Error al agregar maestro: ${error.message}`,
      })
    }
  }

  if (!user) {
    return <div className="flex items-center justify-center h-screen">Cargando...</div>
  }

  return (
    <div className="container mx-auto p-4 space-y-8">
      <h1 className="text-3xl font-bold mb-6">Panel de Administrador</h1>
      
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
                {`${teacher.nombre} ${teacher.apellido} - ${teacher.email}`}
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

      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <h2 className="text-2xl font-bold mb-4">Agregar Nuevo Maestro</h2>
        <form onSubmit={addTeacher} className="mb-4">
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="nombre">
              Nombre
            </label>
            <input
              id="nombre"
              name="nombre"
              type="text"
              value={newTeacher.nombre}
              onChange={handleNewTeacherChange}
              placeholder="Nombre del maestro"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="apellido">
              Apellido
            </label>
            <input
              id="apellido"
              name="apellido"
              type="text"
              value={newTeacher.apellido}
              onChange={handleNewTeacherChange}
              placeholder="Apellido del maestro"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="edad">
              Edad
            </label>
            <input
              id="edad"
              name="edad"
              type="number"
              value={newTeacher.edad}
              onChange={handleNewTeacherChange}
              placeholder="Edad del maestro"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="cedula">
              Cédula
            </label>
            <input
              id="cedula"
              name="cedula"
              type="text"
              value={newTeacher.cedula}
              onChange={handleNewTeacherChange}
              placeholder="Cédula del maestro"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={newTeacher.email}
              onChange={handleNewTeacherChange}
              placeholder="Email del maestro"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="genero">
              Género
            </label>
            <select
              id="genero"
              name="genero"
              value={newTeacher.genero}
              onChange={handleNewTeacherChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            >
              <option value="">Selecciona un género</option>
              <option value="masculino">Masculino</option>
              <option value="femenino">Femenino</option>
              <option value="otro">Otro</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
              Contraseña
            </label>
            <input
              id="password"
              name="password"
              type="password"
              value={newTeacher.password}
              onChange={handleNewTeacherChange}
              placeholder="Contraseña del maestro"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <button
            type="submit"
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Agregar Maestro
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
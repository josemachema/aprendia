'use client'

import React, { useState, useEffect } from "react"
import { getFirestore, collection, addDoc, onSnapshot, doc, updateDoc, arrayUnion, query, where, getDocs, deleteDoc } from "firebase/firestore"
import { getAuth, onAuthStateChanged, signOut, createUserWithEmailAndPassword } from "firebase/auth"
import { hash } from "bcryptjs"
import Swal from 'sweetalert2'
import { initializeApp } from "firebase/app"

const firebaseConfig = {
  apiKey: "AIzaSyBZrNoGRaxgPiuFquT7IRzKnebSNijE7ME",
  authDomain: "proyectonacional-9ac68.firebaseapp.com",
  projectId: "proyectonacional-9ac68",
  storageBucket: "proyectonacional-9ac68.appspot.com",
  messagingSenderId: "847022716640",
  appId: "1:847022716640:web:4bf51125d3e8f04a5d8285",
  measurementId: "G-X98RJHN1HC"
}

const app = initializeApp(firebaseConfig)

const db = getFirestore()
const auth = getAuth()

export default function AdminDashboard() {
  const [maestros, setMaestros] = useState([])
  const [courses, setCourses] = useState([])
  const [selectedMaestro, setSelectedMaestro] = useState(null)
  const [selectedCourse, setSelectedCourse] = useState("")
  const [newCourseName, setNewCourseName] = useState("")
  const [user, setUser] = useState(null)
  const [showAddMaestro, setShowAddMaestro] = useState(false)
  const [showAddCourse, setShowAddCourse] = useState(false)
  const [showAssignCourse, setShowAssignCourse] = useState(false)
  const [showMaestroCourses, setShowMaestroCourses] = useState(false)
  const [showAdminMenu, setShowAdminMenu] = useState(false)
  const [newUser, setNewUser] = useState({
    nombre: "",
    apellido: "",
    edad: "",
    cedula: "",
    email: "",
    genero: "",
    password: "",
    role: "maestro"
  })

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        fetchMaestros();
        subscribeToCoursesUpdates();
      } else {
        setMaestros([]);
        setCourses([]);
        window.location.href = '/LocalHost:3000';
      }
    });

    return () => {
      unsubscribeAuth();
    };
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        window.location.href = '/LocalHost:3000';
      }
    });

    return () => unsubscribe();
  }, []);

  const fetchMaestros = () => {
    if (!auth.currentUser) return;
    const maestrosQuery = query(collection(db, "usuarios"), where("role", "==", "maestro"));
    return onSnapshot(maestrosQuery, (snapshot) => {
      const maestrosList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setMaestros(maestrosList);
    }, (error) => {
      console.error("Error fetching maestros:", error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Error al cargar los maestros. Por favor, intenta de nuevo.',
      });
    });
  };

  const subscribeToCoursesUpdates = () => {
    if (!auth.currentUser) return;
    const coursesCollection = collection(db, "cursos");
    return onSnapshot(coursesCollection, (snapshot) => {
      const coursesList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setCourses(coursesList);
    }, (error) => {
      console.error("Error fetching courses:", error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Error al cargar los cursos. Por favor, intenta de nuevo.',
      });
    });
  };

  const handleAssignCourse = async (e) => {
    e.preventDefault()
    if (!user) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Debes estar autenticado para realizar esta acción.',
      })
      return
    }

    if (!selectedMaestro || !selectedCourse) {
      Swal.fire({
        icon: 'warning',
        title: 'Campos incompletos',
        text: 'Por favor, selecciona un maestro y un curso.',
      })
      return
    }

    try {
      const maestroRef = doc(db, "usuarios", selectedMaestro.id)
      await updateDoc(maestroRef, {
        courses: arrayUnion(selectedCourse)
      })
      Swal.fire({
        icon: 'success',
        title: 'Éxito',
        text: 'Curso asignado exitosamente.',
      })
      setSelectedMaestro(null)
      setSelectedCourse("")
      setShowAssignCourse(false)
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
      const courseQuery = query(collection(db, "cursos"), where("nombreCurso", "==", newCourseName.trim()))
      const courseSnapshot = await getDocs(courseQuery)

      if (!courseSnapshot.empty) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Este curso ya existe en la base de datos.',
        })
        return
      }

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
      setShowAddCourse(false)
    } catch (error) {
      console.error("Error al agregar curso:", error)
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: `Error al agregar curso: ${error.message}`,
      })
    }
  }

  const handleNewUserChange = (e) => {
    const { name, value } = e.target
    setNewUser(prev => ({ ...prev, [name]: value }))
  }

  const addUser = async (e) => {
    e.preventDefault()

    if (!user) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Debes estar autenticado para realizar esta acción.',
      })
      return
    }

    for (let field in newUser) {
      if (!newUser[field]) {
        Swal.fire({
          icon: 'warning',
          title: 'Campos incompletos',
          text: `Por favor, completa el campo ${field}.`,
        })
        return
      }
    }

    try {
      const userQuery = query(collection(db, "usuarios"), where("cedula", "==", newUser.cedula))
      const userSnapshot = await getDocs(userQuery)

      if (!userSnapshot.empty) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Ya existe un usuario con esta cédula en la base de datos.',
        })
        return
      }

      await createUserWithEmailAndPassword(auth, newUser.email, newUser.password)
      
      const hashedPassword = await hash(newUser.password, 10)

      const userData = {
        ...newUser,
        password: hashedPassword,
        courses: []
      }

      await addDoc(collection(db, "usuarios"), userData)

      Swal.fire({
        icon: 'success',
        title: 'Éxito',
        text: 'Maestro agregado exitosamente.',
      })
      setNewUser({
        nombre: "",
        apellido: "",
        edad: "",
        cedula: "",
        email: "",
        genero: "",
        password: "",
        role: "maestro"
      })
      setShowAddMaestro(false)
    } catch (error) {
      console.error("Error al agregar maestro:", error)
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: `Error al agregar maestro: ${error.message}`,
      })
    }
  }

  const handleLogout = () => {
    Swal.fire({
      title: '¿Estás seguro?',
      text: "¿Deseas cerrar sesión?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, cerrar sesión',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        window.location.reload();
      }
    });
  };

  const handleDeleteMaestro = async (maestroId) => {
    if (!user) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Debes estar autenticado para realizar esta acción.',
      })
      return
    }

    try {
      await deleteDoc(doc(db, "usuarios", maestroId))
      Swal.fire({
        icon: 'success',
        title: 'Éxito',
        text: 'Maestro eliminado exitosamente.',
      })
    } catch (error) {
      console.error("Error al eliminar maestro:", error)
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: `Error al eliminar maestro: ${error.message}`,
      })
    }
  }

  const handleDeleteCourse = async (courseId) => {
    if (!user) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Debes estar autenticado para realizar esta acción.',
      })
      return
    }

    try {
      await deleteDoc(doc(db, "cursos", courseId))
      Swal.fire({
        icon: 'success',
        title: 'Éxito',
        text: 'Curso eliminado exitosamente.',
      })
    } catch (error) {
      console.error("Error al eliminar curso:", error)
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: `Error al eliminar curso: ${error.message}`,
      })
    }
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="sticky top-0 z-50 w-full border-b bg-gradient-to-r from-blue-600 to-blue-700">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <button className="md:hidden text-white">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
            </button>
            <div className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white"><path d="M8.21 13.89L7 23l9-9-8.99-9L7 13.89"></path><path d="M14.92 14.92L17 23l2.08-8.08L23 15l-8.08-2.08L17 5l-2.08 8.08L7 15l7.92-1.08"></path></svg>
              <span className="text-xl font-bold text-white">Panel Administrativo</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <button
                onClick={() => setShowAdminMenu(!showAdminMenu)}
                className="flex items-center space-x-2 text-white focus:outline-none"
              >
                <div className="w-8 h-8 rounded-full bg-white"></div>
                <div className="hidden md:flex flex-col items-start">
                  <span className="text-sm font-medium">Administrador</span>
                  <span className="text-xs text-blue-100">Sistema Educativo</span>
                </div>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
              {showAdminMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md overflow-hidden shadow-xl z-10">
                  <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Perfil</a>
                  <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Configuración</a>
                  <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Ayuda</a>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Cerrar Sesión
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto p-4 space-y-4">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="flex items-center justify-between pb-2">
              <h3 className="text-sm font-medium">Total Maestros</h3>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
            </div>
            <div className="text-2xl font-bold">{maestros.length}</div>
            <p className="text-xs text-gray-500">Maestros registrados</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="flex items-center justify-between pb-2">
              <h3 className="text-sm font-medium">Total Cursos</h3>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>
            </div>
            <div className="text-2xl font-bold">{courses.length}</div>
            <p className="text-xs text-gray-500">Cursos disponibles</p>
          </div>
        </div>

        <div className="flex gap-4 flex-wrap">
          <button
            onClick={() => setShowAddMaestro(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle><line x1="20" y1="8" x2="20" y2="14"></line><line x1="23" y1="11" x2="17" y2="11"></line></svg>
            Agregar Maestro
          </button>
          <button
            onClick={() => setShowAddCourse(true)}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
            Agregar Curso
          </button>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="p-4 border-b">
            <h2 className="text-lg font-semibold">Maestros Registrados</h2>
          </div>
          <div className="p-4">
            <div className="space-y-4">
              {maestros.map((maestro) => (
                <div key={maestro.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                      <span className="text-lg font-semibold">{maestro.nombre[0]}{maestro.apellido[0]}</span>
                    </div>
                    <div>
                      <p className="font-medium">{`${maestro.nombre} ${maestro.apellido}`}</p>
                      <p className="text-sm text-gray-500">{maestro.email}</p>
                      <button
                        onClick={() => {
                          setSelectedMaestro(maestro)
                          setShowMaestroCourses(true)
                        }}
                        className="text-sm text-blue-600 hover:underline"
                      >
                        Cursos asignados: {maestro.courses ? maestro.courses.length : 0}
                      </button>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setSelectedMaestro(maestro)
                        setShowAssignCourse(true)
                      }}
                      className="px-3 py-1 bg-blue-100 text-blue-600 rounded-md hover:bg-blue-200"
                    >
                      Asignar Curso
                    </button>
                    <button
                      onClick={() => {
                        console.log("Edit maestro:", maestro.id)
                      }}
                      className="px-3 py-1 bg-yellow-100 text-yellow-600 rounded-md hover:bg-yellow-200"
                    >
                      Modificar
                    </button>
                    <button
                      onClick={() => handleDeleteMaestro(maestro.id)}
                      className="px-3 py-1 bg-red-100 text-red-600 rounded-md hover:bg-red-200"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="p-4 border-b">
            <h2 className="text-lg font-semibold">Cursos Disponibles</h2>
          </div>
          <div className="p-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {courses.map((course) => (
                <div key={course.id} className="p-4 border rounded-lg flex justify-between items-center">
                  <h3 className="font-medium">{course.nombreCurso}</h3>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        console.log("Edit course:", course.id)
                      }}
                      className="px-2 py-1 bg-yellow-100 text-yellow-600 rounded-md hover:bg-yellow-200 text-sm"
                    >
                      Modificar
                    </button>
                    <button
                      onClick={() => handleDeleteCourse(course.id)}
                      className="px-2 py-1 bg-red-100 text-red-600 rounded-md hover:bg-red-200 text-sm"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {showAddMaestro && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Agregar Nuevo Maestro</h2>
            <form onSubmit={addUser} className="space-y-4">
              <input
                className="w-full px-3 py-2 border rounded-md"
                type="text"
                name="nombre"
                placeholder="Nombre"
                value={newUser.nombre}
                onChange={handleNewUserChange}
              />
              <input
                className="w-full px-3 py-2 border rounded-md"
                type="text"
                name="apellido"
                placeholder="Apellido"
                value={newUser.apellido}
                onChange={handleNewUserChange}
              />
              <input
                className="w-full px-3 py-2 border rounded-md"
                type="text"
                name="cedula"
                placeholder="Cédula"
                value={newUser.cedula}
                onChange={handleNewUserChange}
              />
              <input
                className="w-full px-3 py-2 border rounded-md"
                type="email"
                name="email"
                placeholder="Email"
                value={newUser.email}
                onChange={handleNewUserChange}
              />
              <input
                className="w-full px-3 py-2 border rounded-md"
                type="password"
                name="password"
                placeholder="Contraseña"
                value={newUser.password}
                onChange={handleNewUserChange}
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddMaestro(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Guardar Maestro
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showAddCourse && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Agregar Nuevo Curso</h2>
            <form onSubmit={addCourse} className="space-y-4">
              <input
                className="w-full px-3 py-2 border rounded-md"
                type="text"
                value={newCourseName}
                onChange={(e) => setNewCourseName(e.target.value)}
                placeholder="Nombre del curso"
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddCourse(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                >
                  Guardar Curso
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showAssignCourse && selectedMaestro && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Asignar Curso a {selectedMaestro.nombre} {selectedMaestro.apellido}</h2>
            <form onSubmit={handleAssignCourse} className="space-y-4">
              <select
                className="w-full px-3 py-2 border rounded-md"
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
              >
                <option value="">Selecciona un curso</option>
                {courses.map((course) => (
                  <option key={course.id} value={course.id}>
                    {course.nombreCurso}
                  </option>
                ))}
              </select>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowAssignCourse(false)
                    setSelectedMaestro(null)
                    setSelectedCourse("")
                  }}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Asignar Curso
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showMaestroCourses && selectedMaestro && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Cursos de {selectedMaestro.nombre} {selectedMaestro.apellido}</h2>
            {selectedMaestro.courses && selectedMaestro.courses.length > 0 ? (
              <ul className="list-disc list-inside">
                {selectedMaestro.courses.map((courseId) => {
                  const course = courses.find(c => c.id === courseId)
                  return course ? (
                    <li key={courseId} className="mb-2">{course.nombreCurso}</li>
                  ) : null
                })}
              </ul>
            ) : (
              <p>Este maestro no tiene cursos asignados.</p>
            )}
            <div className="flex justify-end mt-4">
              <button
                onClick={() => {
                  setShowMaestroCourses(false)
                  setSelectedMaestro(null)
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
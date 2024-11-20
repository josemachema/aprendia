'use client'

import React, { useState } from "react"
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth"
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore"
import bcrypt from "bcryptjs"
import app from "./firebaseConfig"
import DashboardAdmin from "./Administrador/Dashboardadmin"
import DashboardAlumnos from "./Alumnos/dashboard/dashboardAlumnos"

const auth = getAuth(app)
const db = getFirestore(app)

export default function App() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [role, setRole] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [isRegister, setIsRegister] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userRole, setUserRole] = useState("")
  const [isAdmin, setIsAdmin] = useState(false)
  const [isAdminRegister, setIsAdminRegister] = useState(false)

  const handleRoleSelection = (selectedRole) => {
    setRole(selectedRole)
    setError("")
  }

  const handleFormSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    if (!email || !email.includes("@")) {
      setError("Por favor, introduce un correo válido.")
      return
    }
    if (!password || password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.")
      return
    }

    try {
      if (isRegister) {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password)
        const user = userCredential.user

        const hashedPassword = await bcrypt.hash(password, 10)

        const collectionName = role === "maestro" ? "maestros" : "estudiantes"
        await setDoc(doc(db, collectionName, user.uid), {
          email,
          role,
          password: hashedPassword,
        })

        setSuccess(`Usuario registrado con éxito: ${user.email}`)
        setUserRole(role)
        setIsLoggedIn(true)
      } else {
        const userCredential = await signInWithEmailAndPassword(auth, email, password)
        const user = userCredential.user

        const collectionName = role === "maestro" ? "maestros" : "estudiantes"
        const docRef = doc(db, collectionName, user.uid)
        const docSnap = await getDoc(docRef)

        if (docSnap.exists()) {
          const userData = docSnap.data()

          const isPasswordValid = await bcrypt.compare(password, userData.password)
          if (!isPasswordValid) {
            setError("Contraseña incorrecta. Inténtalo de nuevo.")
            return
          }

          if (userData.role !== role) {
            setError("El rol seleccionado no coincide con tu cuenta.")
            return
          }

          setUserRole(userData.role)
          setSuccess(`Inicio de sesión exitoso: ${user.email}`)
          setIsLoggedIn(true)
        } else {
          setError("No se encontró información del usuario en la colección correspondiente.")
          return
        }
      }
    } catch (err) {
      if (err.code === "auth/user-not-found") {
        setError("Usuario no encontrado. Por favor, regístrate.")
      } else if (err.code === "auth/wrong-password") {
        setError("Contraseña incorrecta. Inténtalo de nuevo.")
      } else if (err.code === "auth/email-already-in-use") {
        setError("El correo ya está registrado. Intenta iniciar sesión.")
      } else {
        setError("Error: " + err.message)
      }
    }
  }

  const handleAdminLogin = async (e) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    if (!email || !email.includes("@")) {
      setError("Por favor, introduce un correo válido.")
      return
    }
    if (!password || password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.")
      return
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      const user = userCredential.user

      const docRef = doc(db, "administrador", user.uid)
      const docSnap = await getDoc(docRef)

      if (docSnap.exists()) {
        const userData = docSnap.data()
        const isPasswordValid = await bcrypt.compare(password, userData.password)
        if (!isPasswordValid) {
          setError("Contraseña incorrecta. Inténtalo de nuevo.")
          return
        }

        setUserRole("admin")
        setIsAdmin(true)
        setSuccess(`Inicio de sesión de administrador exitoso: ${user.email}`)
        setIsLoggedIn(true)
      } else {
        setError("No se encontró información del administrador.")
      }
    } catch (err) {
      setError("Error de inicio de sesión de administrador: " + err.message)
    }
  }

  const handleAdminRegister = async (e) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    if (!email || !email.includes("@")) {
      setError("Por favor, introduce un correo válido.")
      return
    }
    if (!password || password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.")
      return
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      const user = userCredential.user

      const hashedPassword = await bcrypt.hash(password, 10)

      await setDoc(doc(db, "administrador", user.uid), {
        email,
        password: hashedPassword,
        role: "admin"
      })

      setSuccess(`Administrador registrado con éxito: ${user.email}`)
      setIsAdminRegister(false)
    } catch (err) {
      if (err.code === "auth/email-already-in-use") {
        setError("El correo ya está registrado. Intenta iniciar sesión.")
      } else {
        setError("Error al registrar administrador: " + err.message)
      }
    }
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
    setEmail("")
    setPassword("")
    setRole("")
    setUserRole("")
    setIsAdmin(false)
    setError("")
    setSuccess("")
    setIsAdminRegister(false)
  }

  if (isLoggedIn) {
    if (userRole === "admin") {
      return <DashboardAdmin onLogout={handleLogout} />;
    } else if (userRole === "estudiante") {
      return <DashboardAlumnos userId={auth.currentUser.uid} onLogout={handleLogout} />;
    } else if (userRole === "maestro") {
      // You can create and add a DashboardMaestros component here if needed
      return (
        <div className="w-full max-w-md mx-auto mt-8 bg-white shadow-md rounded-lg overflow-hidden">
          <div className="px-6 py-4">
            <h2 className="text-2xl font-bold mb-2">Dashboard Maestro</h2>
            <p className="mb-4">Bienvenido, has iniciado sesión como maestro.</p>
            <button
              onClick={handleLogout}
              className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Cerrar Sesión
            </button>
          </div>
        </div>
      );
    }
  }

  if (!role && !isAdmin) {
    return (
      <div className="w-full max-w-md mx-auto mt-8 bg-white shadow-md rounded-lg overflow-hidden">
        <div className="px-6 py-4">
          <h2 className="text-2xl font-bold mb-4">Selecciona tu Rol</h2>
          <div className="space-y-4">
            <button
              onClick={() => handleRoleSelection("estudiante")}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Estudiante
            </button>
            <button
              onClick={() => handleRoleSelection("maestro")}
              className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Maestro
            </button>
            <button
              onClick={() => setIsAdmin(true)}
              className="w-full bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Administrador
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full max-w-md mx-auto mt-8 bg-white shadow-md rounded-lg overflow-hidden">
      <div className="px-6 py-4">
        <h2 className="text-2xl font-bold mb-4">
          {isAdmin
            ? isAdminRegister
              ? "Registro de Administrador"
              : "Inicio de Sesión (Administrador)"
            : isRegister
            ? `Registro (${role})`
            : `Inicio de Sesión (${role})`}
        </h2>
        <form onSubmit={isAdmin ? (isAdminRegister ? handleAdminRegister : handleAdminLogin) : handleFormSubmit} className="space-y-4">
          <div>
            <input
              type="email"
              placeholder="Correo electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2 placeholder-gray-300 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-100 focus:border-indigo-300"
            />
          </div>
          <div>
            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-3 py-2 placeholder-gray-300 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-100 focus:border-indigo-300"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            {isAdmin
              ? isAdminRegister
                ? "Registrarse como Admin"
                : "Iniciar Sesión como Admin"
              : isRegister
              ? "Registrarse"
              : "Iniciar Sesión"}
          </button>
        </form>
        <button
          className="mt-4 w-full text-indigo-500 hover:text-indigo-600 font-semibold"
          onClick={() => isAdmin ? setIsAdminRegister(!isAdminRegister) : setIsRegister(!isRegister)}
        >
          {isAdmin
            ? isAdminRegister
              ? "¿Ya tienes cuenta? Inicia sesión"
              : "¿No tienes cuenta? Regístrate"
            : isRegister
            ? "¿Ya tienes una cuenta? Inicia sesión"
            : "¿No tienes cuenta? Regístrate"}
        </button>
        <button
          className="mt-4 w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          onClick={() => { setRole(""); setIsAdmin(false); setIsAdminRegister(false); }}
        >
          Volver
        </button>
        {error && <p className="text-red-500 mt-4">{error}</p>}
        {success && <p className="text-green-500 mt-4">{success}</p>}
      </div>
    </div>
  )
}
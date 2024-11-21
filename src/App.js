'use client'

import React, { useState, useEffect, useRef } from "react";
import { FaEye, FaEyeSlash, FaSpinner } from "react-icons/fa";
import { initializeApp, getApps } from "firebase/app";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { getFirestore, doc, setDoc, getDoc, collection, query, where, getDocs } from "firebase/firestore";
import bcrypt from "bcryptjs";
import DashboardAdmin from "./Administrador/Dashboardadmin";
import DashboardAlumnos from "./Alumnos/dashboard/dashboardAlumnos";
import DashboardDocentes from "./Docente/dashboard ";
import Cuestionario from "./cuestionario";

const firebaseConfig = {
  apiKey: "AIzaSyBZrNoGRaxgPiuFquT7IRzKnebSNijE7ME",
  authDomain: "proyectonacional-9ac68.firebaseapp.com",
  projectId: "proyectonacional-9ac68",
  storageBucket: "proyectonacional-9ac68.appspot.com",
  messagingSenderId: "847022716640",
  appId: "1:847022716640:web:4bf51125d3e8f04a5d8285",
  measurementId: "G-X98RJHN1HC"
};

// Inicializar Firebase
let app;
let auth;
let db;

if (!getApps().length) {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
}

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    username: "",
    fullName: ""
  });
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [userRole, setUserRole] = useState(null);
  const [userRoleRegister, setuserRoleRegister] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isAdminRegister, setIsAdminRegister] = useState(false);
  const adminAccessRef = useRef(null);

  useEffect(() => {
    // Asegurarse de que Firebase está inicializado
    if (!app) {
      app = initializeApp(firebaseConfig);
      auth = getAuth(app);
      db = getFirestore(app);
    }
  }, []);

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    const newErrors = { ...errors };
    switch (name) {
      case "email":
        if (!validateEmail(value)) {
          newErrors.email = "Formato de correo electrónico inválido";
        } else {
          delete newErrors.email;
        }
        break;
      case "password":
        if (value.length < 6) {
          newErrors.password = "La contraseña debe tener al menos 8 caracteres";
        } else {
          delete newErrors.password;
        }
        break;
      case "username":
        if (value.length < 3) {
          newErrors.username = "El nombre de usuario debe tener al menos 3 caracteres";
        } else {
          delete newErrors.username;
        }
        break;
      case "fullName":
        if (value.trim() === "") {
          newErrors.fullName = "El nombre completo es requerido";
        } else {
          delete newErrors.fullName;
        }
        break;
      default:
        break;
    }
    setErrors(newErrors);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    if (Object.keys(errors).length > 0) {
      setLoading(false);
      return;
    }

    const { email, password, username, fullName } = formData;

    try {
      if (!isLogin) {
        // Registro de usuario (estudiante o maestro)
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        const hashedPassword = await bcrypt.hash(password, 10);

        await setDoc(doc(db, "usuarios", user.uid), {
          email,
          username,
          fullName,
          password: hashedPassword,
          role: "estudiante" // Por defecto, registramos como estudiante
        });

        setSuccess("Usuario registrado con éxito.");
        setuserRoleRegister("estudiante");
      } else {
        // Inicio de sesión
        // Verificar en todas las colecciones
        const collections = ["usuarios", "administrador"];
        let userFound = false;

        for (const collectionName of collections) {
          const q = query(collection(db, collectionName), where("email", "==", email));
          const querySnapshot = await getDocs(q);

          if (!querySnapshot.empty) {
            const userDoc = querySnapshot.docs[0];
            const userData = userDoc.data();
            const isPasswordValid = await bcrypt.compare(password, userData.password);

            if (isPasswordValid) {
              userFound = true;
              setSuccess("Inicio de sesión exitoso.");
              setUserRole(userData.role);
              break;
            }
          }
        }

        if (!userFound) {
          throw new Error("Usuario no encontrado o contraseña incorrecta.");
        }
      }
    } catch (err) {
      setError(err.message || "Ocurrió un error.");
    } finally {
      setLoading(false);
    }
  };

  const handleAdminRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    const { email, password } = formData;

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const hashedPassword = await bcrypt.hash(password, 10);

      await setDoc(doc(db, "administrador", user.uid), {
        email,
        password: hashedPassword,
        role: "administrador"
      });

      setSuccess("Administrador registrado con éxito.");
      setIsAdminRegister(false);
    } catch (err) {
      setError(err.message || "Error al registrar administrador.");
    } finally {
      setLoading(false);
    }
  };

  const triggerAdminAccess = () => {
    if (adminAccessRef.current) {
      adminAccessRef.current.click();
    }
  };

  if (userRole) {
    switch (userRole) {
      case "administrador":
        return <DashboardAdmin />;
      case "estudiante":
        return <DashboardAlumnos />;
      case "maestro":
        return <DashboardDocentes />;
      default:
        return <div>Rol no reconocido</div>;
    }
  }

  if (userRoleRegister) {
    switch(userRoleRegister)  {
      case "estudiante":
        return <Cuestionario />;
      default:
        return <div>Rol no reconocido</div>;
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F5F5F5]">
      <div className="bg-[#FFFFFF] rounded-xl shadow-2xl p-8 w-full max-w-md relative overflow-hidden">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-[#333333] mb-2">
            {isAdmin
              ? isAdminRegister
                ? "Registro de Administrador"
                : "Inicio de Sesión (Administrador)"
              : isLogin
              ? "Bienvenido de nuevo"
              : "Registro de Estudiante"}
          </h2>
          <p className="text-[#333333]">
            {isAdmin
              ? isAdminRegister
                ? "Completa tus datos para registrarte como administrador"
                : "Inicia sesión como administrador"
              : isLogin
              ? "Por favor, inicia sesión para continuar"
              : "Completa tus datos para comenzar"}
          </p>
        </div>

        <form onSubmit={isAdmin && isAdminRegister ? handleAdminRegister : handleSubmit} className="space-y-4">
          {!isLogin && !isAdmin && (
            <>
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-[#333333] mb-1">
                  Nombre de usuario
                </label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2 rounded-lg border ${
                    errors.username ? "border-[#F44336]" : "border-gray-300"
                  } focus:ring-2 focus:ring-[#4A90E2] focus:border-transparent transition duration-200 outline-none`}
                  placeholder="Ingresa tu nombre de usuario"
                  aria-label="Nombre de usuario"
                />
                {errors.username && (
                  <p className="text-[#F44336] text-sm mt-1">{errors.username}</p>
                )}
              </div>

              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-[#333333] mb-1">
                  Nombre completo
                </label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2 rounded-lg border ${
                    errors.fullName ? "border-[#F44336]" : "border-gray-300"
                  } focus:ring-2 focus:ring-[#4A90E2] focus:border-transparent transition duration-200 outline-none`}
                  placeholder="Ingresa tu nombre completo"
                  aria-label="Nombre completo"
                />
                {errors.fullName && (
                  <p className="text-[#F44336] text-sm mt-1">{errors.fullName}</p>
                )}
              </div>
            </>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-[#333333] mb-1">
              Correo electrónico
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className={`w-full px-4 py-2 rounded-lg border ${
                errors.email ? "border-[#F44336]" : "border-gray-300"
              } focus:ring-2 focus:ring-[#4A90E2] focus:border-transparent transition duration-200 outline-none`}
              placeholder="Ingresa tu correo electrónico"
              aria-label="Correo electrónico"
              autoComplete="email"
            />
            {errors.email && (
              <p className="text-[#F44336] text-sm mt-1">{errors.email}</p>
            )}
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-[#333333] mb-1">
              Contraseña
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className={`w-full px-4 py-2 rounded-lg border ${
                  errors.password ? "border-[#F44336]" : "border-gray-300"
                } focus:ring-2 focus:ring-[#4A90E2] focus:border-transparent transition duration-200 outline-none pr-10`}
                placeholder="Ingresa tu contraseña"
                aria-label="Contraseña"
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#333333] hover:text-[#4A90E2] focus:outline-none"
                aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {errors.password && (
              <p className="text-[#F44336] text-sm mt-1">{errors.password}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading || Object.keys(errors).length > 0}
            className="w-full bg-[#4A90E2] hover:bg-[#357ABD] text-white font-semibold py-2 px-4 rounded-lg transition duration-200 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? <FaSpinner className="animate-spin mr-2" /> : null}
            {isAdmin
              ? isAdminRegister
                ? "Registrarse como Admin"
                : "Iniciar Sesión como Admin"
              : isLogin
              ? "Iniciar sesión"
              : "Registrarse como estudiante"}
          </button>
        </form>

        {error && <p className="text-[#F44336] mt-4">{error}</p>}
        {success && <p className="text-[#4CAF50] mt-4">{success}</p>}

        <div className="mt-6 text-center">
          <button
            onClick={() => {
              if (isAdmin) {
                setIsAdminRegister(!isAdminRegister);
              } else {
                setIsLogin(!isLogin);
              }
            }}
            className="text-[#4A90E2] hover:text-[#357ABD] font-medium transition duration-200"
          >
            {isAdmin
              ? isAdminRegister
                ? "¿Ya tienes cuenta? Inicia sesión"
                : "¿No tienes cuenta? Regístrate"
              : isLogin
              ? "¿No tienes una cuenta? Regístrate como estudiante"
              : "¿Ya tienes una cuenta? Inicia sesión"}
          </button>
        </div>

        <button
          ref={adminAccessRef}
          onClick={() => setIsAdmin(true)}
          className="hidden"
        >
          Hidden Admin Access
        </button>

        {isAdmin && (
          <div className="mt-4 text-center">
            <button
              onClick={() => {
                setIsAdmin(false);
                setIsAdminRegister(false);
              }}
              className="text-[#4A90E2] hover:text-[#357ABD] font-medium transition duration-200"
            >
              Volver al inicio de sesión normal
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
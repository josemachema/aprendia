import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LoginPage from "./LoginPage";
import AdminPage from "./Administrador/Dashboardadmin";
import TeacherPage from "./Docente/dashboard ";
import Clasess from './Docente/clasess';
import StudentPage from "./Alumnos/dashboard/dashboardAlumnos";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/teacher" element={<TeacherPage />} />
        <Route path="/student" element={<StudentPage />} />
        <Route path="/teacher/class" element={<Clasess />} />
      </Routes>
    </Router>
  );
}

export default App;

import React, { useState, useEffect } from "react";
import { FiPlus, FiEdit2, FiTrash2, FiX } from "react-icons/fi";

const TeacherClassManagement = () => {
  const [classes, setClasses] = useState([
    {
      id: 1,
      name: "Matemáticas 101",
      image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb",
      students: [
        { id: 1, name: "Juan Pérez", progress: 85, assignments: 12, attendance: 90 },
        { id: 2, name: "María García", progress: 92, assignments: 15, attendance: 95 },
        { id: 3, name: "Miguel González", progress: 78, assignments: 10, attendance: 85 }
      ]
    },
    {
      id: 2,
      name: "Física Avanzada",
      image: "https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa",
      students: [
        { id: 4, name: "Sara Wilson", progress: 88, assignments: 14, attendance: 92 },
        { id: 5, name: "Tomás Brown", progress: 75, assignments: 11, attendance: 80 }
      ]
    }
  ]);

  const [selectedClass, setSelectedClass] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showAddStudentModal, setShowAddStudentModal] = useState(false);
  const [newClassName, setNewClassName] = useState("");
  const [newStudent, setNewStudent] = useState({ name: "", progress: 0, assignments: 0, attendance: 0 });

  const handleCreateClass = () => {
    if (newClassName.trim()) {
      const newClass = {
        id: classes.length + 1,
        name: newClassName,
        image: "https://images.unsplash.com/photo-1634733988138-bf2c3a2a13fa",
        students: []
      };
      setClasses([...classes, newClass]);
      setNewClassName("");
      setShowCreateModal(false);
    }
  };

  const handleAddStudent = () => {
    if (selectedClass && newStudent.name.trim()) {
      const updatedClasses = classes.map(cls => {
        if (cls.id === selectedClass.id) {
          return {
            ...cls,
            students: [...cls.students, { ...newStudent, id: Date.now() }]
          };
        }
        return cls;
      });
      setClasses(updatedClasses);
      setNewStudent({ name: "", progress: 0, assignments: 0, attendance: 0 });
      setShowAddStudentModal(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFFFF] p-6">
      <header className="bg-[#F5F5F5] rounded-lg shadow-md p-6 mb-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-[#333333]">Gestión de Clases</h1>
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-[#4A90E2] text-white px-6 py-2 rounded-lg flex items-center gap-2 hover:opacity-90 transition-opacity"
          >
            <FiPlus /> Crear Actividad
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        {classes.map((cls) => (
          <div
            key={cls.id}
            className="bg-[#F5F5F5] rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => setSelectedClass(cls)}
          >
            <img 
              src={cls.image} 
              alt={cls.name}
              className="w-full h-48 object-cover"
            />
            <div className="p-6">
              <h2 className="text-xl font-semibold text-[#333333] mb-4">{cls.name}</h2>
              <p className="text-[#333333]">Estudiantes Inscritos: {cls.students.length}</p>
            </div>
          </div>
        ))}
      </div>

      {selectedClass && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-[#FFFFFF] rounded-lg w-full max-w-4xl max-h-[80vh] overflow-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-[#333333]">{selectedClass.name}</h2>
                <div className="flex gap-4">
                  <button
                    onClick={() => setShowAddStudentModal(true)}
                    className="bg-[#4CAF50] text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:opacity-90 transition-opacity"
                  >
                    <FiPlus /> Agregar Estudiante
                  </button>
                  <button
                    onClick={() => setSelectedClass(null)}
                    className="text-[#333333] hover:text-[#F44336]"
                  >
                    <FiX size={24} />
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-[#F5F5F5]">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-[#333333] uppercase tracking-wider">Nombre</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-[#333333] uppercase tracking-wider">Progreso</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-[#333333] uppercase tracking-wider">Tareas</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-[#333333] uppercase tracking-wider">Asistencia</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-[#333333] uppercase tracking-wider">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-[#F5F5F5]">
                    {selectedClass.students.map((student, index) => (
                      <tr key={student.id} className={index % 2 === 0 ? "bg-white" : "bg-[#F5F5F5]"}>>
                        <td className="px-6 py-4 whitespace-nowrap text-[#333333]">{student.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="w-full bg-[#F5F5F5] rounded-full h-2.5">
                            <div
                              className="bg-[#4CAF50] h-2.5 rounded-full"
                              style={{ width: `${student.progress}%` }}
                            ></div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-[#333333]">{student.assignments} completadas</td>
                        <td className="px-6 py-4 whitespace-nowrap text-[#333333]">{student.attendance}%</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex gap-2">
                            <button className="text-[#4A90E2] hover:text-[#333333]"><FiEdit2 /></button>
                            <button className="text-[#F44336] hover:text-[#333333]"><FiTrash2 /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-[#FFFFFF] rounded-lg p-6 w-full max-w-md">
            <h2 className="text-2xl font-bold text-[#333333] mb-4">Crear Nueva Clase</h2>
            <input
              type="text"
              value={newClassName}
              onChange={(e) => setNewClassName(e.target.value)}
              placeholder="Nombre de la clase"
              className="w-full p-2 border border-[#F5F5F5] rounded-lg mb-4"
            />
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 text-[#333333] hover:text-[#F44336]"
              >
                Cancelar
              </button>
              <button
                onClick={handleCreateClass}
                className="bg-[#4A90E2] text-white px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
              >
                Crear
              </button>
            </div>
          </div>
        </div>
      )}

      {showAddStudentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-[#FFFFFF] rounded-lg p-6 w-full max-w-md">
            <h2 className="text-2xl font-bold text-[#333333] mb-4">Agregar Nuevo Estudiante</h2>
            <input
              type="text"
              value={newStudent.name}
              onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
              placeholder="Nombre del estudiante"
              className="w-full p-2 border border-[#F5F5F5] rounded-lg mb-4"
            />
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowAddStudentModal(false)}
                className="px-4 py-2 text-[#333333] hover:text-[#F44336]"
              >
                Cancelar
              </button>
              <button
                onClick={handleAddStudent}
                className="bg-[#4A90E2] text-white px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
              >
                Agregar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherClassManagement;

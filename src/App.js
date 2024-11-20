import React, { useState } from "react";
import { FiPlus, FiSearch, FiEdit2, FiTrash2 } from "react-icons/fi";

const ClassManagement = () => {
  const [showModal, setShowModal] = useState(false);
  const [classes, setClasses] = useState([
    {
      id: 1,
      className: "Advanced Mathematics",
      subject: "Mathematics",
      schedule: "Mon, Wed 10:00 AM",
      students: 25,
      progress: 75,
      image: "images.unsplash.com/photo-1509062522246-3755977927d7"
    },
    {
      id: 2,
      className: "Physics 101",
      subject: "Physics",
      schedule: "Tue, Thu 2:00 PM",
      students: 20,
      progress: 60,
      image: "images.unsplash.com/photo-1606326608606-aa0b62935f2b"
    }
  ]);

  const [formData, setFormData] = useState({
    className: "",
    subject: "",
    schedule: ""
  });

  const [errors, setErrors] = useState({});
  const [selectedClass, setSelectedClass] = useState(null);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.className.trim()) newErrors.className = "Class name is required";
    if (!formData.subject.trim()) newErrors.subject = "Subject is required";
    if (!formData.schedule.trim()) newErrors.schedule = "Schedule is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      const newClass = {
        id: classes.length + 1,
        ...formData,
        students: 0,
        progress: 0,
        image: "images.unsplash.com/photo-1513258496099-48168024aec0"
      };
      setClasses([...classes, newClass]);
      setFormData({ className: "", subject: "", schedule: "" });
      setShowModal(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const StudentTable = ({ classData }) => (
    <div className="overflow-x-auto bg-white rounded-lg shadow p-4">
      <h3 className="text-xl font-bold mb-4">Student Progress - {classData.className}</h3>
      <table className="min-w-full table-auto">
        <thead>
          <tr className="bg-gray-100">
            <th className="px-4 py-2">Student Name</th>
            <th className="px-4 py-2">Attendance</th>
            <th className="px-4 py-2">Progress</th>
            <th className="px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {[...Array(5)].map((_, index) => (
            <tr key={index} className="border-b">
              <td className="px-4 py-2">Student {index + 1}</td>
              <td className="px-4 py-2">{Math.floor(Math.random() * 100)}%</td>
              <td className="px-4 py-2">
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-blue-600 h-2.5 rounded-full"
                    style={{ width: `${Math.floor(Math.random() * 100)}%` }}
                  ></div>
                </div>
              </td>
              <td className="px-4 py-2">
                <button className="text-blue-600 hover:text-blue-800 mr-2">
                  <FiEdit2 />
                </button>
                <button className="text-red-600 hover:text-red-800">
                  <FiTrash2 />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Class Management Dashboard</h1>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors"
        >
          <FiPlus /> Create Class
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative mb-8">
        <input
          type="text"
          placeholder="Search classes..."
          className="w-full p-4 pl-12 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
      </div>

      {/* Class Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {classes.map((classItem) => (
          <div
            key={classItem.id}
            onClick={() => setSelectedClass(classItem)}
            className="bg-white rounded-lg shadow-lg overflow-hidden cursor-pointer transform hover:scale-105 transition-transform"
          >
            <img
              src={`https://${classItem.image}`}
              alt={classItem.className}
              className="w-full h-48 object-cover"
            />
            <div className="p-6">
              <h3 className="text-xl font-bold mb-2">{classItem.className}</h3>
              <p className="text-gray-600 mb-2">{classItem.subject}</p>
              <p className="text-gray-500 mb-4">{classItem.schedule}</p>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">{classItem.students} Students</span>
                <div className="w-24 bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-blue-600 h-2.5 rounded-full"
                    style={{ width: `${classItem.progress}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Selected Class Details */}
      {selectedClass && <StudentTable classData={selectedClass} />}

      {/* Create Class Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg w-full max-w-md p-6">
            <h2 className="text-2xl font-bold mb-4">Create New Class</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Class Name</label>
                <input
                  type="text"
                  name="className"
                  value={formData.className}
                  onChange={handleInputChange}
                  className={`w-full p-2 border rounded ${errors.className ? "border-red-500" : ""}`}
                />
                {errors.className && (
                  <p className="text-red-500 text-sm mt-1">{errors.className}</p>
                )}
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Subject</label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  className={`w-full p-2 border rounded ${errors.subject ? "border-red-500" : ""}`}
                />
                {errors.subject && (
                  <p className="text-red-500 text-sm mt-1">{errors.subject}</p>
                )}
              </div>
              <div className="mb-6">
                <label className="block text-gray-700 mb-2">Schedule</label>
                <input
                  type="text"
                  name="schedule"
                  value={formData.schedule}
                  onChange={handleInputChange}
                  className={`w-full p-2 border rounded ${errors.schedule ? "border-red-500" : ""}`}
                />
                {errors.schedule && (
                  <p className="text-red-500 text-sm mt-1">{errors.schedule}</p>
                )}
              </div>
              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Create Class
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClassManagement;
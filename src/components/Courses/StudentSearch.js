// StudentSearch.js
import React from "react";

const StudentSearch = ({
  showStudentResults,
  setShowStudentResults,
  setFocused,
  handleAssignedStudent,
  filteredStudents,
  handleSelectedStudent,
  setFilteredStudents,
  students,
}) => (
  <div className="form-group mb-4">
    <label
      htmlFor="assigned-student"
      className="block text-sm font-medium text-gray-700"
    >
      Student
    </label>
    <input
      type="text"
      className="form-control block w-full border border-red-500 bg-yellow-100 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm z-[1000]"
      id="assigned-student"
      tabIndex={0}
      autoFocus
      style={{ position: 'relative' }}
      onClick={(e) => {
        setShowStudentResults(true);
        setFocused(e.target.id);
        if (!e.target.value.length) {
          setFilteredStudents(students);
        }
        // Debug: log students array and ids
        console.log('[DEBUG] StudentSearch input clicked. students:', students);
      }}
      onChange={(e) => {
        handleAssignedStudent(e);
        // Debug: log filtered students and their ids
        console.log('[DEBUG] StudentSearch input changed. filteredStudents:', filteredStudents.map(s => ({ username: s.username, id: s.id })));
      }}
    />
    {showStudentResults && (
      <div id="results-container" className="mt-2 space-y-2">
        {filteredStudents.slice(0, 10).map((student) => (
          <button
            key={student.id || student.userId || student.username}
            type="button"
            className="form-control block w-full text-left border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            onClick={() => {
              console.log('[DEBUG] Student selected:', student);
              handleSelectedStudent(student);
            }}
          >
            {student.username} <span style={{color:'red',fontSize:'10px'}}>[id:{student.uid || 'none'}]</span>
          </button>
        ))}
      </div>
    )}
  </div>
);

export default StudentSearch;

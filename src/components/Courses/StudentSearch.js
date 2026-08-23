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
}) => {
  return (
    <div className="space-y-2 max-w-2xl mx-auto">
      <label
        htmlFor="assigned-student"
        className="block text-sm font-medium text-gray-700"
      >
        Select Student
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
          </svg>
        </div>
        <input
          type="text"
          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#F38315] focus:border-transparent transition-colors placeholder-gray-400"
          id="assigned-student"
          placeholder="Search for a student..."
          autoFocus
          onClick={(e) => {
            setShowStudentResults(true);
            setFocused(e.target.id);
            if (!e.target.value.length) {
              setFilteredStudents(students);
            }
            console.log('[DEBUG] StudentSearch input clicked. students:', students);
          }}
          onChange={(e) => {
            handleAssignedStudent(e);
            console.log('[DEBUG] StudentSearch input changed. filteredStudents:', filteredStudents.map(s => ({ username: s.username, id: s.id })));
          }}
        />
      </div>
      
      {showStudentResults && (
        <div className="mt-2 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto z-10">
          {filteredStudents.length > 0 ? (
            <div className="py-2">
              {filteredStudents.slice(0, 10).map((student) => (
                <button
                  key={student.id || student.userId || student.username}
                  type="button"
                  className="w-full text-left px-4 py-3 hover:bg-[#F38315]/10 transition-colors flex items-center space-x-3"
                  onClick={() => {
                    console.log('[DEBUG] Student selected:', student);
                    handleSelectedStudent(student);
                  }}
                >
                  <div className="w-8 h-8 bg-[#F38315] rounded-full flex items-center justify-center text-white font-medium text-sm">
                    {student.username?.charAt(0).toUpperCase() || 'S'}
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-900">
                      {student.username}
                    </div>
                    <div className="text-xs text-gray-500">
                      {student.email || student.name || 'Student'}
                    </div>
                  </div>
                  {/* Debug info - remove in production */}
                  <div className="text-xs text-red-500 font-mono">
                    ID: {student.uid || student.id || 'none'}
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="px-4 py-6 text-center text-gray-500">
              <svg className="w-8 h-8 mx-auto mb-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <p className="text-sm">No students found</p>
            </div>
          )}
        </div>
      )}
      
      {/* Helper Text */}
      <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mt-4">
        <div className="flex">
          <svg className="w-5 h-5 text-blue-400 mt-0.5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <h3 className="text-sm font-medium text-blue-800">Student Selection</h3>
            <p className="text-sm text-blue-700 mt-1">
              Search and select a student to enroll them in a course. You can search by username or name.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentSearch;
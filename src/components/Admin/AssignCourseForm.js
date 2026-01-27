import React from "react";
import * as Components from "../../components/all";

export default function AssignCourseForm({
  users,
  courses,
  handleAssignedUser,
  handleCourseName,
  handleSelectedUser,
  handleSelectedCourse,
  setShowUserResults,
  setFocused,
  setFilteredUsers,
  filteredUsers,
  showUserResults,
  isUserFound,
  isCourseFound,
  setShowCourseResults,
  filteredCourses,
  showCourseResults,
}) {
  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      {/* User Selection */}
      <div className="space-y-2">
        <label
          htmlFor="assigned-user"
          className="block text-sm font-medium text-gray-700"
        >
          Select Teacher/Instructor
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <input
            type="text"
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#F38315] focus:border-transparent transition-colors placeholder-gray-400"
            id="assigned-user"
            placeholder="Search for a teacher or instructor..."
            onClick={(e) => {
              setShowUserResults(true);
              setFocused(e.target.id);
              if (!e.target.value.length) {
                setFilteredUsers(users);
              }
            }}
            onChange={(e) => {
              handleAssignedUser(e);
            }}
          />
        </div>
        
        {showUserResults && (
          <div className="mt-2 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto z-10">
            {filteredUsers.length > 0 ? (
              <div className="py-2">
                {filteredUsers.slice(0, 10).map((user, index) => {
                  return (
                    <button
                      key={user._id || user.id || index}
                      type="button"
                      className="w-full text-left px-4 py-3 hover:bg-[#F38315]/10 transition-colors flex items-center space-x-3"
                      onClick={() => {
                        handleSelectedUser(user);
                      }}
                    >
                      <div className="w-8 h-8 bg-[#F38315] rounded-full flex items-center justify-center text-white font-medium text-sm">
                        {user.username?.charAt(0).toUpperCase() || 'U'}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {user.username}
                        </div>
                        <div className="text-xs text-gray-500">
                          {user.email || 'No email provided'}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="px-4 py-6 text-center text-gray-500">
                <svg className="w-8 h-8 mx-auto mb-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <p className="text-sm">No users found</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Course Selection - Only show when user is found */}
      <div className={`space-y-2 transition-all duration-300 ${isUserFound ? "opacity-100" : "opacity-50 pointer-events-none"}`}>
        <label
          htmlFor="assigned-course-name"
          className="block text-sm font-medium text-gray-700"
        >
          Select Course to Assign
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          
          {!isCourseFound ? (
            <input
              type="text"
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#F38315] focus:border-transparent transition-colors placeholder-gray-400"
              id="assigned-course-name"
              placeholder={isUserFound ? "Search for a course..." : "Please select a user first"}
              disabled={!isUserFound}
              onClick={(e) => {
                setShowCourseResults(true);
                setFocused(e.target.id);
              }}
              onChange={(e) => {
                handleCourseName(e);
              }}
            />
          ) : (
            <input
              type="text"
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md bg-gray-50 text-gray-600 cursor-not-allowed"
              id="assigned-course-name"
              disabled
              placeholder="Course selected"
            />
          )}
        </div>

        {showCourseResults && isUserFound && (
          <div className="mt-2 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto z-10">
            {(courses.length > 0 || filteredCourses.length > 0) ? (
              <div className="py-2">
                {/* Show all courses first */}
                {courses.map((course, index) => {
                  return (
                    <button
                      key={course._id || course.id || `course-${index}`}
                      type="button"
                      className="w-full text-left px-4 py-3 hover:bg-[#F38315]/10 transition-colors"
                      onClick={() => {
                        handleSelectedCourse(course);
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {course.courseName || course.course_name}
                          </div>
                          <div className="text-xs text-gray-500">
                            Subject: {course.subject || 'Not specified'}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-xs text-gray-500">
                            {course.gradeLevel || course.grade_level || 'Any Level'}
                          </div>
                          <div className="text-xs text-[#F38315]">
                            {course.num_of_students || 0} students
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                })}
                
                {/* Show filtered courses */}
                {filteredCourses.slice(0, 10).map((course, index) => {
                  return (
                    <button
                      key={course._id || course.id || `filtered-${index}`}
                      type="button"
                      className="w-full text-left px-4 py-3 hover:bg-[#F38315]/10 transition-colors border-l-2 border-[#F38315]/20"
                      onClick={() => {
                        handleSelectedCourse(course);
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {course.course_name || course.courseName}
                          </div>
                          <div className="text-xs text-gray-500">
                            Instructor: {course.instructor?.username || course.courseInstructor || 'Unknown'}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-xs text-gray-500">
                            {course.subject || 'Not specified'}
                          </div>
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Available
                          </span>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="px-4 py-6 text-center text-gray-500">
                <svg className="w-8 h-8 mx-auto mb-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                <p className="text-sm">No courses available</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Progress Indicator */}
      <div className="flex items-center space-x-4 py-4">
        <div className={`flex items-center space-x-2 ${isUserFound ? 'text-green-600' : 'text-gray-400'}`}>
          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
            isUserFound ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
          }`}>
            {isUserFound ? '✓' : '1'}
          </div>
          <span className="text-sm font-medium">Select Teacher</span>
        </div>
        
        <div className={`w-8 h-0.5 ${isUserFound ? 'bg-green-200' : 'bg-gray-200'}`}></div>
        
        <div className={`flex items-center space-x-2 ${isCourseFound ? 'text-green-600' : isUserFound ? 'text-gray-600' : 'text-gray-400'}`}>
          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
            isCourseFound ? 'bg-green-100 text-green-600' : isUserFound ? 'bg-gray-100 text-gray-600' : 'bg-gray-100 text-gray-400'
          }`}>
            {isCourseFound ? '✓' : '2'}
          </div>
          <span className="text-sm font-medium">Select Course</span>
        </div>
      </div>

      {/* Helper Text */}
      {!isUserFound && (
        <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
          <div className="flex">
            <svg className="w-5 h-5 text-blue-400 mt-0.5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <h3 className="text-sm font-medium text-blue-800">Getting Started</h3>
              <p className="text-sm text-blue-700 mt-1">
                Begin by searching for and selecting a teacher or instructor from the list above.
              </p>
            </div>
          </div>
        </div>
      )}

      {isUserFound && !isCourseFound && (
        <div className="bg-green-50 border border-green-200 rounded-md p-4">
          <div className="flex">
            <svg className="w-5 h-5 text-green-400 mt-0.5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <h3 className="text-sm font-medium text-green-800">Great! Teacher Selected</h3>
              <p className="text-sm text-green-700 mt-1">
                Now search for and select a course to assign to this teacher.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
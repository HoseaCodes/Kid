import React from "react";

export default function CourseSearch({
  courses,
  filteredCourses,
  handleCourseName,
  handleSelectedCourse,
  setShowCourseResults,
  setFocused,
  isStudentFound,
  isCourseFound,
  showCourseResults,
}) {
  return (
    <div className="space-y-2 max-w-2xl mx-auto">
      <label
        htmlFor="assigned-course-name"
        className="block text-sm font-medium text-gray-700"
      >
        Select Course
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
            placeholder="Search for a course..."
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
            placeholder="Course selected"
            disabled
          />
        )}
      </div>

      {showCourseResults && !isCourseFound && (
        <div className="mt-2 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto z-10">
          {(courses.length > 0 || filteredCourses.length > 0) ? (
            <div className="py-2">
              {/* Show all courses first */}
              {courses.map((course, idx) => (
                <button
                  key={course.id || course.courseId || `course-${idx}`}
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
              ))}
              
              {/* Show filtered courses */}
              {filteredCourses.slice(0, 10).map((course, idx) => (
                <button
                  key={course.id || course.courseId || `filtered-course-${idx}`}
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
              ))}
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

      {/* Helper Text */}
      <div className="bg-green-50 border border-green-200 rounded-md p-4 mt-4">
        <div className="flex">
          <svg className="w-5 h-5 text-green-400 mt-0.5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <h3 className="text-sm font-medium text-green-800">Course Selection</h3>
            <p className="text-sm text-green-700 mt-1">
              Search and select a course to enroll the student. You can search by course name or instructor.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
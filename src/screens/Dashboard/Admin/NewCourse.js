import React, { useState, lazy, Suspense, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../../../lib/firebase";
import { deleteDoc, doc } from "firebase/firestore";
import Layout from "../../../components/Dashboard/Layout";
import useGetAllCourses from "../../../hooks/useGetAllCourses";
import useGetAllUsers from "../../../hooks/useGetAllUsers";
import { searchCourse, assignCourse, selectCourse, assignStudentToCourse } from "../../../utils/courseFunctions";
import * as Components from "../../../components/all";

const StepForm = lazy(() =>
  import("../../../components/Form/MultStep/StepForm")
);
const PendingCoursesList = lazy(() => 
  import("../../../components/Courses/PendingCourses")
);
const AssignCourseForm = lazy(() => 
  import("../../../components/Admin/AssignCourseForm")
);
const CourseDetails = lazy(() => 
  import("../../../components/Admin/CourseDetails")
);
const StudentSearch = lazy(() => 
  import("../../../components/Courses/StudentSearch")
);
const CourseSearch = lazy(() => 
  import("../../../components/Courses/CourseSearch")
);
const StudentCourseDetails = lazy(() => 
  import("../../../components/Courses/CourseDetails")
);

// Action Dropdown Component
const ActionDropdown = ({ course, onDelete, isDeleting }) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const courseId = course.courseId || course.id;

  const handleViewDetails = () => {
    navigate(`/dashboard/courses/${courseId}`);
    setIsOpen(false);
  };

  const handleEdit = () => {
    navigate(`/dashboard/courses/edit/${courseId}`);
    setIsOpen(false);
  };

  const handleDuplicate = () => {
    // Implementation for duplicating a course
    console.log("Duplicate course:", courseId);
    setIsOpen(false);
  };

  const handleDelete = () => {
    onDelete();
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block text-left">
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={isDeleting}
        className="p-2 rounded-full hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v.01M12 12v.01M12 18v.01" />
        </svg>
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown Menu */}
          <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg ring-1 ring-black ring-opacity-5 rounded-md z-20">
            <div className="py-1">
              <button
                onClick={handleViewDetails}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                View Details
              </button>
              
              <button
                onClick={handleEdit}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Edit Course
              </button>
              
              <button
                onClick={handleDuplicate}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                Duplicate
              </button>
              
              <div className="border-t border-gray-100 my-1" />
              
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="w-full text-left px-4 py-2 text-sm text-red-700 hover:bg-red-50 flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isDeleting ? (
                  <>
                    <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-red-400 mr-3"></div>
                    Deleting...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Delete
                  </>
                )}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

const NewCourse = (props) => {
  const history = useNavigate();
  const { currentUser, loading, user } = props;
  const { courses, error, isLoading, refetch } = useGetAllCourses();
  const { users, userError, usersAreLoading } = useGetAllUsers();
  
  const [newCourse, setNewCourse] = useState({
    num_of_students: 0,
    type: "course",
    isPublished: false,
  });
  
  const [activeTab, setActiveTab] = useState("create");
  const [localCourses, setLocalCourses] = useState([]);
  const [deletingIds, setDeletingIds] = useState(new Set());
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [deleteError, setDeleteError] = useState(null);

  // Pending courses state
  const [pendingCourses, setPendingCourses] = useState([]);
  const [searchedItems, setSearchedItems] = useState([]);
  const [coursesSlice, setCoursesSlice] = useState([0, 10]);


  // Assign Teacher state
  const [selectedUser, setSelectedUser] = useState({});
  const [showUserResults, setShowUserResults] = useState(false);
  const [showCourseResults, setShowCourseResults] = useState(false);
  const [focused, setFocused] = useState({});
  const [isUserFound, setIsUserFound] = useState(false);
  const [isCourseFound, setIsCourseFound] = useState(false);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [assignedCourse, setAssignedCourse] = useState({
    instructor: { username: "" },
  });
  const [isAssignedCourseLoading, setIsAssignedCourseLoading] = useState(false);
  // Fix: define setIsAssigningCourse for Assign Teacher loading state
  const [isAssigningCourse, setIsAssigningCourse] = useState(false);

  // Assign Student state
  const [students, setStudents] = useState([]);
  const [areStudentsLoaded, setAreStudentsLoaded] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState({});
  const [areCoursesLoaded, setAreCoursesLoaded] = useState(false);
  const [showStudentResults, setShowStudentResults] = useState(false);
  const [showStudentCourseResults, setShowStudentCourseResults] = useState(false);
  const [studentFocused, setStudentFocused] = useState({});
  const [isStudentFound, setIsStudentFound] = useState(false);
  const [isStudentCourseFound, setIsStudentCourseFound] = useState(false);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [studentFilteredCourses, setStudentFilteredCourses] = useState([]);
  const [studentAssignedCourse, setStudentAssignedCourse] = useState({
    student: { username: "" },
  });
  const [isStudentAssignedCourseLoading, setIsStudentAssignedCourseLoading] = useState(false);
  const [isAssigningStudent, setIsAssigningStudent] = useState(false);

  // Sync local courses with hook data
  useEffect(() => {
    if (courses && courses.length > 0) {
      setLocalCourses(courses);
    }
  }, [courses]);

  // Sync pending courses data
  useEffect(() => {
    const fetchPendingCourses = () => {
      if (currentUser && users.length > 0 && courses.length > 0) {
        const usersWithPendingCourses = users.filter(
          (user) => user.pendingCourses && user.pendingCourses.length > 0
        );
        
        const pendingCoursesData = usersWithPendingCourses.map((user) => {
          const userPendingCourses = courses.filter((course) => {
            return user.pendingCourses.includes(course.courseId || course.id);
          });
          return { ...user, pendingCourses: userPendingCourses };
        });
        
        setPendingCourses(pendingCoursesData);
        setSearchedItems(pendingCoursesData);
      }
    };
    fetchPendingCourses();
  }, [currentUser, users, courses]);

  // Load students for assign student functionality
  useEffect(() => {
    if (users.length > 0 && !areStudentsLoaded) {
      const studentsData = [];
      users.forEach((user) => {
        if (user.isStudent) {
          const student = { ...user, id: user.id };
          studentsData.push(student);
        }
      });
      setStudents(studentsData);
      setAreStudentsLoaded(true);
    }
  }, [users, areStudentsLoaded]);

  // Handle focus states
  useEffect(() => {
    if (focused && focused !== "assigned-course-name") {
      setShowCourseResults(false);
    } else if (focused && focused !== "assigned-user") {
      setShowUserResults(false);
    }
  }, [focused]);

  useEffect(() => {
    if (studentFocused && studentFocused !== "assigned-course-name") {
      setShowStudentCourseResults(false);
    } else if (studentFocused && studentFocused !== "assigned-student") {
      setShowStudentResults(false);
    }
  }, [studentFocused]);
  
  const state = { currentUser, history, newCourse, setNewCourse, user };

  const handleDeleteClick = (course) => {
    setConfirmDelete(course);
    setDeleteError(null);
  };

  const handleConfirmDelete = async () => {
    if (!confirmDelete) return;

    const courseId = confirmDelete.courseId || confirmDelete.id;
    setDeletingIds(prev => new Set([...prev, courseId]));
    setDeleteError(null);

    try {
      await deleteDoc(doc(db, "courses", courseId));
      
      setLocalCourses(prevCourses => 
        prevCourses.filter(course => 
          (course.courseId || course.id) !== courseId
        )
      );

      if (refetch) {
        refetch();
      }

      setConfirmDelete(null);
    } catch (error) {
      console.error("Error deleting course: ", error);
      setDeleteError(`Failed to delete course: ${error.message}`);
    } finally {
      setDeletingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(courseId);
        return newSet;
      });
    }
  };

  const handleCancelDelete = () => {
    setConfirmDelete(null);
    setDeleteError(null);
  };

  // Assign Teacher handlers
  const handleAssignedUser = (e) => {
    setShowUserResults(true);
    setIsUserFound(false);
    setIsCourseFound(false);
    setFilteredUsers(
      users.filter((f) =>
        f.username.toLowerCase().includes(e.target.value.toLowerCase())
      )
    );
    setAssignedCourse({
      ...assignedCourse,
      assignedUser: { username: e.target.value },
    });
  };

  const handleCourseName = (e) => {
    setShowCourseResults(true);
    setIsCourseFound(false);
    setAssignedCourse({
      ...assignedCourse,
      course_name: e.target.value,
    });

    if (e.target.value.length > 0) {
      setFilteredCourses(
        courses.filter((f) => {
          if (
            !f.students?.some((s) => {
              return s._id?.toString() === selectedUser._id?.toString();
            }) &&
            (f.courseName
              ?.toLowerCase()
              .includes(e.target.value.toLowerCase()) ||
              f.courseInstructor
                ?.toLowerCase()
                .includes(e.target.value.toLowerCase()))
          ) {
            return f;
          } else {
            return "";
          }
        })
      );
    } else {
      setFilteredCourses(
        courses.filter((f) => {
          if (
            !f.students?.some((s) => {
              return s._id?.toString() === selectedUser._id?.toString();
            })
          ) {
            return f;
          } else {
            return "";
          }
        })
      );
    }
  };

  const handleSelectedUser = (user) => {
    setShowUserResults(false);
    if (user.username !== assignedCourse.assignedUser) {
      setSelectedUser(user);
      setShowCourseResults(false);
      setIsCourseFound(false);
      setIsUserFound(true);
      setAssignedCourse({ assignedUser: user });
      
      const userInput = document.getElementById("assigned-user");
      if (userInput) userInput.value = user.username;
      
      if (filteredCourses.length) {
        const courseInput = document.getElementById("assigned-course-name");
        if (courseInput) courseInput.value = "";
      }
      setFilteredCourses(
        courses.filter((f) => {
          if (
            !f.students?.some((s) => {
              return s._id?.toString() === user._id?.toString();
            })
          ) {
            return f;
          } else {
            return "";
          }
        })
      );
    }
  };

  const handleSelectedCourse = (course) => {
    setIsAssignedCourseLoading(true);
    setIsCourseFound(true);
    setShowCourseResults(false);
    selectCourse({
      currentUser,
      assignedCourse,
      setAssignedCourse,
      setIsAssignedCourseLoading,
      course,
    });

    const courseInput = document.getElementById("assigned-course-name");
    if (courseInput) {
      courseInput.value = `Name: ${course.courseName || course.course_name}, Instructor: ${course.courseInstructor || course.instructor?.username}`;
    }
  };

  // Assign Student handlers
  const handleAssignedStudent = (e) => {
    setShowStudentResults(true);
    setIsStudentFound(false);
    setIsStudentCourseFound(false);
    setFilteredStudents(
      students.filter((s) =>
        s.username.toLowerCase().includes(e.target.value.toLowerCase())
      )
    );
    setStudentAssignedCourse({
      ...studentAssignedCourse,
      student: { username: e.target.value },
    });
  };

  const handleStudentCourseName = (e) => {
    setShowStudentCourseResults(true);
    setIsStudentCourseFound(false);
    setStudentAssignedCourse({
      ...studentAssignedCourse,
      course_name: e.target.value,
    });

    if (e.target.value.length > 0) {
      setStudentFilteredCourses(
        courses.filter((c) => 
          c.courseName?.toLowerCase().includes(e.target.value.toLowerCase())
        )
      );
    } else {
      setStudentFilteredCourses(courses);
    }
  };

  const handleSelectedStudent = (student) => {
    setShowStudentResults(false);
    if (student.username !== studentAssignedCourse.student.username) {
      setSelectedStudent(student);
      setShowStudentCourseResults(false);
      setIsStudentCourseFound(false);
      setIsStudentFound(true);
      setStudentAssignedCourse({ student });
      
      const studentInput = document.getElementById("assigned-student");
      if (studentInput) studentInput.value = student.username;
    }
    
    const courseInput = document.getElementById("assigned-course-name");
    if (studentFilteredCourses.length && courseInput) {
      courseInput.value = "";
    }
  };

  const handleSelectedStudentCourse = (course) => {
    setIsStudentAssignedCourseLoading(true);
    setIsStudentCourseFound(true);
    setShowStudentCourseResults(false);
    selectCourse({
      currentUser,
      assignedCourse: studentAssignedCourse,
      setAssignedCourse: setStudentAssignedCourse,
      setIsAssignedCourseLoading: setIsStudentAssignedCourseLoading,
      course,
    });
    
    const courseInput = document.getElementById("assigned-course-name");
    if (courseInput) {
      courseInput.value = `Name: ${course.courseName || course.course_name}, Instructor: ${course.courseInstructor || course.instructor?.username}`;
    }
  };

  const renderCourseTable = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#F38315] mx-auto mb-4"></div>
            <Components.Paragraph>Loading courses...</Components.Paragraph>
          </div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="text-center py-12">
          <svg className="w-16 h-16 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <Components.SubHeading className="!text-xl text-red-600 mb-2">
            Error Loading Courses
          </Components.SubHeading>
          <Components.Paragraph className="text-gray-600 mb-4">
            {error.message}
          </Components.Paragraph>
          <button 
            onClick={() => refetch && refetch()}
            className="px-6 py-3 bg-[#F38315] text-white rounded-md hover:bg-[#e57309] transition-colors font-medium"
          >
            Try Again
          </button>
        </div>
      );
    }

    if (!localCourses || localCourses.length === 0) {
      return (
        <div className="text-center py-12">
          <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <Components.SubHeading className="!text-xl text-gray-500 mb-2">
            No Courses Found
          </Components.SubHeading>
          <Components.Paragraph className="text-gray-400 mb-4">
            There are no courses to manage yet.
          </Components.Paragraph>
          <button
            onClick={() => setActiveTab("create")}
            className="px-6 py-3 bg-[#F38315] text-white rounded-md hover:bg-[#e57309] transition-colors font-medium"
          >
            Create Your First Course
          </button>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {/* Error Alert */}
        {deleteError && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex">
              <svg className="w-5 h-5 text-red-400 mt-0.5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <h3 className="text-sm font-medium text-red-800">Deletion Error</h3>
                <p className="text-sm text-red-700 mt-1">{deleteError}</p>
              </div>
              <button
                onClick={() => setDeleteError(null)}
                className="ml-auto pl-3"
              >
                <svg className="w-5 h-5 text-red-400 hover:text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* Course Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-gray-50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-[#F38315]">
              {localCourses.length}
            </div>
            <div className="text-sm text-gray-600">Total Courses</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-[#F38315]">
              {localCourses.filter(c => c.isPublished).length}
            </div>
            <div className="text-sm text-gray-600">Published</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-[#F38315]">
              {localCourses.filter(c => !c.isPublished).length}
            </div>
            <div className="text-sm text-gray-600">Drafts</div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-lg">
          <table className="min-w-full divide-y divide-gray-300">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Course Name
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Instructor
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Students
                </th>
                <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {localCourses.map((course) => {
                const courseId = course.courseId || course.id;
                const isDeleting = deletingIds.has(courseId);
                
                return (
                  <tr key={courseId} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {course.courseName || 'Untitled Course'}
                        </div>
                        {course.subject && (
                          <div className="text-sm text-gray-500">
                            {course.subject}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {course.instructor || course.courseInstructor || 'No Instructor'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          course.isPublished
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {course.isPublished ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {course.num_of_students || course.students?.length || 0}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <ActionDropdown 
                        course={course} 
                        onDelete={() => handleDeleteClick(course)}
                        isDeleting={isDeleting}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  };
  
  if (loading || !currentUser) {
    return (
      <Layout>
        <div className="p-4 flex-1 flex flex-col h-full overflow-auto">
          <div className="relative flex bg-white py-8 px-8 items-center justify-center rounded-md shadow">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#F38315] mx-auto mb-4"></div>
              <Components.SubHeading className="!text-2xl">Loading...</Components.SubHeading>
            </div>
          </div>
        </div>
      </Layout>
    );
  }
  
  if (!currentUser.isAdmin && !currentUser.isTeacher) {
    history("/dashboard");
    return null;
  }
  
  return (
    <Layout>
      <div className="p-4 flex-1 flex flex-col h-full overflow-auto">
        {/* Header Section */}
        <div className="relative flex bg-white py-6 px-8 items-center rounded-md shadow mb-6">
          <div className="flex flex-col items-start">
            <Components.SubHeading className="!text-3xl mb-2">
              Course <span className="text-[#F38315]">Management</span>
            </Components.SubHeading>
            <Components.Paragraph className="!font-[Grandstander] text-gray-600">
              Create new courses or manage existing ones
            </Components.Paragraph>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mb-6">
          <nav className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
            <button
              onClick={() => setActiveTab("create")}
              className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                activeTab === "create"
                  ? "bg-white text-[#F38315] shadow"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Create
            </button>
            <button
              onClick={() => setActiveTab("manage")}
              className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                activeTab === "manage"
                  ? "bg-white text-[#F38315] shadow"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Manage ({localCourses.length})
            </button>
            <button
              onClick={() => setActiveTab("pending")}
              className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                activeTab === "pending"
                  ? "bg-white text-[#F38315] shadow"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Pending ({pendingCourses.reduce((total, user) => total + user.pendingCourses.length, 0)})
            </button>
            <button
              onClick={() => setActiveTab("assign-teacher")}
              className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                activeTab === "assign-teacher"
                  ? "bg-white text-[#F38315] shadow"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Assign Teacher
            </button>
            <button
              onClick={() => setActiveTab("assign-student")}
              className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                activeTab === "assign-student"
                  ? "bg-white text-[#F38315] shadow"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
              </svg>
              Assign Student
            </button>
          </nav>
        </div>

        {/* Content Container */}
        <div className="bg-white rounded-md shadow p-6 flex-1">
          {activeTab === "create" ? (
            <Suspense 
              fallback={
                <div className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#F38315] mx-auto mb-4"></div>
                    <Components.Paragraph>Loading form...</Components.Paragraph>
                  </div>
                </div>
              }
            >
              <StepForm state={state} />
            </Suspense>
          ) : activeTab === "manage" ? (
            renderCourseTable()
          ) : activeTab === "pending" ? (
            // Pending Courses Tab
            <div className="h-full">
              {usersAreLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#F38315] mx-auto mb-4"></div>
                    <Components.Paragraph>Loading pending courses...</Components.Paragraph>
                  </div>
                </div>
              ) : userError ? (
                <div className="text-center py-12">
                  <svg className="w-16 h-16 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <Components.SubHeading className="!text-xl text-red-600 mb-2">
                    Error Loading Pending Courses
                  </Components.SubHeading>
                  <Components.Paragraph className="text-gray-600">
                    {userError.message}
                  </Components.Paragraph>
                </div>
              ) : !searchedItems.length ? (
                <div className="text-center py-12">
                  <svg className="w-20 h-20 text-gray-400 mx-auto mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <Components.SubHeading className="!text-2xl text-gray-500 mb-4">
                    All Caught Up! 🎉
                  </Components.SubHeading>
                  <Components.Paragraph className="text-gray-400 mb-6 max-w-md mx-auto">
                    There are no pending courses to review at this time. New submissions will appear here when they need your approval.
                  </Components.Paragraph>
                  <button
                    onClick={() => setActiveTab("create")}
                    className="px-6 py-3 bg-[#F38315] text-white rounded-md hover:bg-[#e57309] transition-colors font-medium"
                  >
                    Create New Course
                  </button>
                </div>
              ) : (
                <Suspense 
                  fallback={
                    <div className="flex items-center justify-center py-12">
                      <div className="text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#F38315] mx-auto mb-4"></div>
                        <Components.Paragraph>Loading pending courses list...</Components.Paragraph>
                      </div>
                    </div>
                  }
                >
                  <PendingCoursesList
                    pendingCourses={pendingCourses}
                    searchCourse={searchCourse}
                    setSearchedItems={setSearchedItems}
                    searchedItems={searchedItems}
                    currentUser={currentUser}
                    setCoursesSlice={setCoursesSlice}
                    coursesSlice={coursesSlice}
                  />
                </Suspense>
              )}
            </div>
          ) : activeTab === "assign-teacher" ? (
            // Assign Teacher Tab
            <div className="h-full space-y-6">
              <div className="text-center mb-6">
                <Components.SubHeading className="!text-2xl mb-2">
                  Assign a <span className="text-[#F38315]">Teacher</span> to Course
                </Components.SubHeading>
                <Components.Paragraph className="text-gray-600">
                  Select a teacher and assign them to an existing course
                </Components.Paragraph>
              </div>
              
              <Suspense fallback={
                <div className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#F38315] mx-auto mb-4"></div>
                    <Components.Paragraph>Loading assignment form...</Components.Paragraph>
                  </div>
                </div>
              }>
                <AssignCourseForm
                  users={users}
                  courses={courses}
                  handleAssignedUser={handleAssignedUser}
                  handleCourseName={handleCourseName}
                  handleSelectedUser={handleSelectedUser}
                  handleSelectedCourse={handleSelectedCourse}
                  setShowUserResults={setShowUserResults}
                  setFocused={setFocused}
                  setFilteredUsers={setFilteredUsers}
                  filteredUsers={filteredUsers}
                  showUserResults={showUserResults}
                  isUserFound={isUserFound}
                  isCourseFound={isCourseFound}
                  setShowCourseResults={setShowCourseResults}
                  filteredCourses={filteredCourses}
                  showCourseResults={showCourseResults}
                />
              </Suspense>

              {isCourseFound && (
                <Suspense fallback={
                  <div className="flex items-center justify-center py-12">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#F38315] mx-auto mb-4"></div>
                      <Components.Paragraph>Loading course details...</Components.Paragraph>
                    </div>
                  </div>
                }>
                  <CourseDetails
                    assignedCourse={assignedCourse}
                    isAssignedCourseLoading={isAssignedCourseLoading}
                    setAssignedCourse={setAssignedCourse}
                    setIsCourseFound={setIsCourseFound}
                    assignCourse={assignCourse}
                    isUserFound={isUserFound}
                    selectedUser={selectedUser}
                    currentUser={currentUser}
                    setIsUserFound={setIsUserFound}
                    setLoading={setIsAssigningCourse}
                    isAssigningCourse={isAssigningCourse}
                  />
                </Suspense>
              )}
            </div>
          ) : activeTab === "assign-student" ? (
            // Assign Student Tab
            <div className="h-full space-y-6">
              <div className="text-center mb-6">
                <Components.SubHeading className="!text-2xl mb-2">
                  Assign <span className="text-[#F38315]">Student</span> to Course
                </Components.SubHeading>
                <Components.Paragraph className="text-gray-600">
                  Select a student and enroll them in a course
                </Components.Paragraph>
              </div>
              
              <Suspense fallback={
                <div className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#F38315] mx-auto mb-4"></div>
                    <Components.Paragraph>Loading student search...</Components.Paragraph>
                  </div>
                </div>
              }>
                <StudentSearch
                  showStudentResults={showStudentResults}
                  setShowStudentResults={setShowStudentResults}
                  setFocused={setStudentFocused}
                  handleAssignedStudent={handleAssignedStudent}
                  filteredStudents={filteredStudents}
                  handleSelectedStudent={handleSelectedStudent}
                  students={students}
                />
              </Suspense>

              {isStudentFound && (
                <Suspense fallback={
                  <div className="flex items-center justify-center py-12">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#F38315] mx-auto mb-4"></div>
                      <Components.Paragraph>Loading course search...</Components.Paragraph>
                    </div>
                  </div>
                }>
                  <CourseSearch
                    isCourseFound={isStudentCourseFound}
                    showCourseResults={showStudentCourseResults}
                    setShowCourseResults={setShowStudentCourseResults}
                    setFocused={setStudentFocused}
                    handleCourseName={handleStudentCourseName}
                    courses={courses}
                    filteredCourses={studentFilteredCourses}
                    handleSelectedCourse={handleSelectedStudentCourse}
                  />
                </Suspense>
              )}

              {isStudentCourseFound && (
                <Suspense fallback={
                  <div className="flex items-center justify-center py-12">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#F38315] mx-auto mb-4"></div>
                      <Components.Paragraph>Loading course details...</Components.Paragraph>
                    </div>
                  </div>
                }>
                  <StudentCourseDetails
                    isAssignedCourseLoading={isStudentAssignedCourseLoading}
                    assignedCourse={studentAssignedCourse}
                    imgPlaceholder="https://d10grw5om5v513.cloudfront.net/assets/images/image-placeholder.png"
                    currentUser={currentUser}
                    selectedStudent={selectedStudent}
                    setLoading={setIsAssigningStudent}
                    setIsAssigningStudent={setIsAssigningStudent}
                    isAssigningStudent={isAssigningStudent}
                    setAreCoursesLoaded={setAreCoursesLoaded}
                    setAssignedCourse={setStudentAssignedCourse}
                    assignStudentToCourse={assignStudentToCourse}
                  />
                </Suspense>
              )}
            </div>
          ) : null}
        </div>
      </div>

      {/* Confirmation Modal */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full mb-4">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <div className="text-center">
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Confirm Course Deletion
                </h3>
                <div className="text-sm text-gray-500 mb-4">
                  <p className="mb-2">Are you sure you want to delete this course?</p>
                  <div className="bg-gray-50 p-3 rounded-md text-left">
                    <p><strong>Course:</strong> {confirmDelete.courseName || 'Untitled Course'}</p>
                    <p><strong>Instructor:</strong> {confirmDelete.instructor || confirmDelete.courseInstructor || 'No Instructor'}</p>
                    {confirmDelete.num_of_students > 0 && (
                      <p><strong>Students:</strong> {confirmDelete.num_of_students}</p>
                    )}
                  </div>
                  <p className="mt-2 text-red-600 font-medium">This action cannot be undone.</p>
                </div>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={handleCancelDelete}
                  className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmDelete}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors font-medium"
                >
                  Delete Course
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default NewCourse;
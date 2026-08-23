import React from "react";
import { createCourse } from "../../../utils/courseFunctions";
import * as Components from "../../../components/all";

const Confirm = ({ prevStep, values, state }) => {
  const {
    courseName,
    courseDescription,
    courseContent,
    classNum,
    courseInstructor,
    subject,
    gradeLevel,
    price,
    category,
    instructorBio,
  } = values;
  
  const { currentUser, history, setCheckUser, user } = state;

  const submitForm = (e) => {
    e.preventDefault();
    createCourse({
      currentUser,
      setCheckUser,
      newCourse: values,
      history,
      user,
    });
    alert("Course created successfully!");
  };

  const goBack = (e) => {
    e.preventDefault();
    prevStep();
  };

  const confirmationItems = [
    { label: "Class Number", value: classNum },
    { label: "Course Name", value: courseName },
    { label: "Course Description", value: courseDescription },
    { label: "Course Instructor", value: courseInstructor },
    { label: "Instructor Bio", value: instructorBio },
    { label: "Course Content", value: courseContent },
    { label: "Subject", value: subject },
    { label: "Grade Level", value: gradeLevel },
    { label: "Price", value: price ? `$${price}` : "Free" },
    { label: "Category", value: category },
  ].filter(item => item.value); // Only show items with values

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <form>
        <Components.SubHeading className="!text-2xl text-center mb-6">
          <span className="text-[#F38315]">Confirm</span> Your Course Details
        </Components.SubHeading>
        
        <div className="bg-gray-50 rounded-lg p-6 mb-8">
          <Components.Paragraph className="text-gray-600 text-center mb-6">
            Please review all the information below before submitting your course.
          </Components.Paragraph>
          
          <div className="space-y-4">
            {confirmationItems.map((item, index) => (
              <div key={index} className="flex justify-between items-start py-3 border-b border-gray-200 last:border-b-0">
                <span className="font-medium text-gray-700 min-w-0 mr-4">
                  {item.label}:
                </span>
                <span className="text-gray-900 text-right flex-1 min-w-0">
                  {item.value || "Not specified"}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Summary Card */}
        <div className="bg-[#F38315]/5 border border-[#F38315]/20 rounded-lg p-4 mb-8">
          <div className="flex items-center mb-2">
            <div className="w-2 h-2 bg-[#F38315] rounded-full mr-2"></div>
            <span className="font-semibold text-[#F38315]">Course Summary</span>
          </div>
          <Components.Paragraph className="text-gray-700">
            <strong>{courseName || "Course"}</strong> - {subject} course for {gradeLevel} 
            {price && ` at $${price}`}
            {courseInstructor && ` taught by ${courseInstructor}`}
          </Components.Paragraph>
        </div>

        <div className="flex justify-between">
          <button 
            className="px-6 py-3 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors font-medium"
            onClick={goBack}
          >
            ← Back
          </button>
          <button 
            className="px-8 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors font-medium flex items-center"
            onClick={submitForm}
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Submit Course
          </button>
        </div>
      </form>
    </div>
  );
};

export default Confirm;
import React from "react";
import * as Components from "../../../components/all";

const Step1 = ({ nextStep, prevStep, handleChange, values }) => {
  const continueStep = (e) => {
    e.preventDefault();
    nextStep();
  };

  const goBack = (e) => {
    e.preventDefault();
    prevStep();
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <form>
        <Components.SubHeading className="!text-2xl text-center mb-6">
          Step 1: <span className="text-[#F38315]">Course Information</span>
        </Components.SubHeading>
        
        <div className="space-y-6">
          <div>
            <label htmlFor="classNum" className="block text-sm font-medium text-gray-700 mb-2">
              Class Number
            </label>
            <input
              type="text"
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#F38315] focus:border-transparent transition-colors"
              id="classNum"
              placeholder="Enter class number..."
              required
              value={values.classNum}
              onChange={handleChange("classNum")}
            />
          </div>

          <div>
            <label htmlFor="courseName" className="block text-sm font-medium text-gray-700 mb-2">
              Course Name
            </label>
            <input
              type="text"
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#F38315] focus:border-transparent transition-colors"
              id="courseName"
              placeholder="Enter course name..."
              value={values.courseName}
              onChange={handleChange("courseName")}
            />
          </div>

          <div>
            <label htmlFor="courseDescription" className="block text-sm font-medium text-gray-700 mb-2">
              Course Description
            </label>
            <textarea
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#F38315] focus:border-transparent transition-colors resize-none"
              id="courseDescription"
              rows="4"
              placeholder="Describe your course..."
              value={values.courseDescription}
              onChange={handleChange("courseDescription")}
            />
          </div>
        </div>

        <div className="flex justify-between mt-8">
          <button 
            className="px-6 py-3 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors font-medium"
            onClick={goBack}
          >
            ← Back
          </button>
          <button 
            className="px-6 py-3 bg-[#F38315] text-white rounded-md hover:bg-[#e57309] transition-colors font-medium"
            onClick={continueStep}
          >
            Next →
          </button>
        </div>
      </form>
    </div>
  );
};

export default Step1;
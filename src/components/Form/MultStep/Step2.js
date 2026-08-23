import React from "react";
import * as Components from "../../../components/all";

const Step2 = ({ nextStep, prevStep, handleChange, values }) => {
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
          Step 2: <span className="text-[#F38315]">Instructor Information</span>
        </Components.SubHeading>
        
        <div className="space-y-6">
          <div>
            <label htmlFor="courseInstructor" className="block text-sm font-medium text-gray-700 mb-2">
              Course Instructor
            </label>
            <input
              type="text"
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#F38315] focus:border-transparent transition-colors"
              id="courseInstructor"
              placeholder="Enter instructor name..."
              required
              value={values.courseInstructor}
              onChange={handleChange("courseInstructor")}
            />
            <Components.Paragraph className="text-sm text-gray-500 mt-2">
              This will be displayed as the main instructor for the course
            </Components.Paragraph>
          </div>

          {/* Optional: Add instructor bio or qualifications field */}
          <div>
            <label htmlFor="instructorBio" className="block text-sm font-medium text-gray-700 mb-2">
              Instructor Bio (Optional)
            </label>
            <textarea
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#F38315] focus:border-transparent transition-colors resize-none"
              id="instructorBio"
              rows="3"
              placeholder="Brief instructor background or qualifications..."
              value={values.instructorBio || ""}
              onChange={handleChange("instructorBio")}
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

export default Step2;
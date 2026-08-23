import React from "react";
import * as Components from "../../../components/all";

const Step3 = ({ nextStep, prevStep, handleChange, values }) => {
  const continueStep = (e) => {
    e.preventDefault();
    nextStep();
  };

  const goBack = (e) => {
    e.preventDefault();
    prevStep();
  };

  const subjects = [
    "Mathematics",
    "Science",
    "English",
    "History",
    "Art",
    "Music",
    "Physical Education",
    "Computer Science",
    "Foreign Language",
    "Other"
  ];

  const gradeLevels = [
    "Pre-K",
    "Kindergarten",
    "1st Grade",
    "2nd Grade",
    "3rd Grade",
    "4th Grade",
    "5th Grade",
    "6th Grade",
    "7th Grade",
    "8th Grade",
    "9th Grade",
    "10th Grade",
    "11th Grade",
    "12th Grade",
    "College Level",
    "Adult Education"
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <form>
        <Components.SubHeading className="!text-2xl text-center mb-6">
          Step 3: <span className="text-[#F38315]">Course Details</span>
        </Components.SubHeading>
        
        <div className="space-y-6">
          <div>
            <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
              Subject
            </label>
            <select
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#F38315] focus:border-transparent transition-colors"
              id="subject"
              required
              value={values.subject}
              onChange={handleChange("subject")}
            >
              <option value="">Select a subject...</option>
              {subjects.map((subject) => (
                <option key={subject} value={subject}>
                  {subject}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="gradeLevel" className="block text-sm font-medium text-gray-700 mb-2">
              Grade Level
            </label>
            <select
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#F38315] focus:border-transparent transition-colors"
              id="gradeLevel"
              required
              value={values.gradeLevel}
              onChange={handleChange("gradeLevel")}
            >
              <option value="">Select grade level...</option>
              {gradeLevels.map((grade) => (
                <option key={grade} value={grade}>
                  {grade}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
              Course Price ($)
            </label>
            <input
              type="number"
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#F38315] focus:border-transparent transition-colors"
              id="price"
              placeholder="0.00"
              min="0"
              step="0.01"
              value={values.price}
              onChange={handleChange("price")}
            />
          </div>

          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
              Course Category
            </label>
            <input
              type="text"
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#F38315] focus:border-transparent transition-colors"
              id="category"
              placeholder="e.g., STEM, Arts, Language..."
              value={values.category}
              onChange={handleChange("category")}
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

export default Step3;
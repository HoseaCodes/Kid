import React from "react";
import { columns } from "./Columns";
import DataTableSort from "./DataTableSort";
import { mockCourses } from "../../../constants/mockData";
import useGetAllCourses from "../../../hooks/useGetAllCourses";
import * as Components from "../../../components/all";

export default function Overview({ nextStep, handleChange, values }) {
  const { courses, error, isLoading } = useGetAllCourses();
  
  const continueStep = (e) => {
    e.preventDefault();
    nextStep();
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#F38315] mx-auto mb-4"></div>
            <Components.Paragraph>Loading courses...</Components.Paragraph>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="text-center py-12">
          <div className="text-red-600 text-xl font-semibold mb-4">
            Error loading courses
          </div>
          <Components.Paragraph className="text-gray-600">
            {error.message}
          </Components.Paragraph>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <Components.SubHeading className="!text-2xl text-center mb-6">
        Course <span className="text-[#F38315]">Overview</span>
      </Components.SubHeading>
      
      <div className="mb-6">
        <Components.Paragraph className="text-gray-600 text-center">
          Review existing courses before creating your new one. This helps ensure your course offers unique value.
        </Components.Paragraph>
      </div>

      {/* Course Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-gray-50 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-[#F38315]">
            {courses?.length || 0}
          </div>
          <div className="text-sm text-gray-600">Total Courses</div>
        </div>
        <div className="bg-gray-50 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-[#F38315]">
            {mockCourses?.length || 0}
          </div>
          <div className="text-sm text-gray-600">Sample Courses</div>
        </div>
        <div className="bg-gray-50 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-[#F38315]">
            {(courses?.length || 0) + (mockCourses?.length || 0)}
          </div>
          <div className="text-sm text-gray-600">All Available</div>
        </div>
      </div>

      {/* Data Table */}
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <DataTableSort
          continueStep={continueStep}
          data={[...mockCourses, ...courses]}
          columns={columns}
        />
      </div>

      {/* Continue Button */}
      <div className="flex justify-end mt-6">
        <button 
          className="px-6 py-3 bg-[#F38315] text-white rounded-md hover:bg-[#e57309] transition-colors font-medium"
          onClick={continueStep}
        >
          Create New Course →
        </button>
      </div>
    </div>
  );
}
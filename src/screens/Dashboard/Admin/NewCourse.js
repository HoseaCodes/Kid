import React, { useState, lazy, Suspense } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../../../components/Dashboard/Layout";
import * as Components from "../../../components/all";

const StepForm = lazy(() =>
  import("../../../components/Form/MultStep/StepForm")
);

const NewCourse = (props) => {
  const history = useNavigate();
  const { currentUser, loading, user } = props;
  const [newCourse, setNewCourse] = useState({
    num_of_students: 0,
    type: "course",
    isPublished: false,
  });
  
  const state = { currentUser, history, newCourse, setNewCourse, user };
  
  if (loading || !currentUser) {
    return (
      <Layout>
        <div className="p-4 flex-1 flex flex-col h-full overflow-auto">
          <div className="relative flex bg-white py-8 px-8 items-center justify-center rounded-md shadow">
            <Components.SubHeading className="!text-2xl">
              Loading...
            </Components.SubHeading>
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
              Create a <span className="text-[#F38315]">New Course</span>
            </Components.SubHeading>
            <Components.Paragraph className="!font-[Grandstander] text-gray-600">
              Build an engaging learning experience for your students
            </Components.Paragraph>
          </div>
        </div>

        {/* Form Container */}
        <div className="bg-white rounded-md shadow p-6 flex-1">
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
        </div>
      </div>
    </Layout>
  );
};

export default NewCourse;
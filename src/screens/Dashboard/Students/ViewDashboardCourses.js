import React, { Suspense, lazy } from "react";
import { useQuery } from "@tanstack/react-query";
import { CiClock2 } from "react-icons/ci";
import { FaCheckCircle } from "react-icons/fa";
import Layout from "../../../components/Dashboard/Layout";
import { getDashboardCourses } from "../../../features/lms/getDashboardCourses";
import { traceLoadDashboardCourses } from "../../../utils/performanceTraces";

const CoursesList = lazy(() =>
  import("../../../components/Courses/CoursesList")
);
const InfoCard = lazy(() => import("../../../components/Dashboard/InfoCard"));

const Dashboard = ({ currentUser }) => {
  const userId = currentUser?.uid;

  const {
    data = { coursesInProgress: [], completedCourses: [] },
    isLoading,
    error,
  } = useQuery({
    queryKey: ["dashboardCourses", userId],
    queryFn: () =>
      traceLoadDashboardCourses(() => getDashboardCourses(userId)),
    enabled: !!userId,
    staleTime: 30 * 1000,
  });

  if (!currentUser) return <Layout>Loading this page.</Layout>;
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  const { coursesInProgress, completedCourses } = data;
  const allCourses = [...coursesInProgress, ...completedCourses];

  return (
    <Layout>
      <div className="p-6 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Suspense fallback={<div>Loading info cards...</div>}>
            <InfoCard
              icon={CiClock2}
              label={"In Progress"}
              numberOfItems={coursesInProgress.length}
            />
            <InfoCard
              icon={FaCheckCircle}
              label={"Completed"}
              numberOfItems={completedCourses.length}
              variant="success"
            />
          </Suspense>
        </div>
        <Suspense fallback={<div>Loading courses...</div>}>
          <CoursesList items={allCourses} />
        </Suspense>
      </div>
    </Layout>
  );
};

export default Dashboard;

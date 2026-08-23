import React, { lazy, Suspense, useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import Layout from "../../components/Dashboard/Layout";
import SearchInput from "../../components/SearchInput";
import useGetAllCategories from "../../hooks/useGetAllCategories";
import useGetAllCourses from "../../hooks/useGetAllCourses";
import { getCourses } from "../../features/lms/getCourses";

const CoursesList = lazy(() => import("../../components/Courses/CoursesList"));

export default function Search({ currentUser }) {
  const userId = currentUser?.uid;

  const [title, setTitle] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [gradeLevel, setGradeLevel] = useState("");
  const [subject, setSubject] = useState("");
  const [hidePurchased, setHidePurchased] = useState(false);

  const { categories = [] } = useGetAllCategories();
  const { courses: allCourses = [] } = useGetAllCourses();

  const gradeLevels = useMemo(
    () =>
      Array.from(
        new Set(allCourses.map((c) => c.gradeLevel).filter(Boolean))
      ),
    [allCourses]
  );
  const subjects = useMemo(
    () =>
      Array.from(new Set(allCourses.map((c) => c.subject).filter(Boolean))),
    [allCourses]
  );

  const {
    data: courses = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: [
      "searchCourses",
      userId,
      title,
      categoryId,
      gradeLevel,
      subject,
      hidePurchased,
    ],
    queryFn: () =>
      getCourses({
        userId,
        title,
        categoryId,
        gradeLevel,
        subject,
        hidePurchased,
      }),
    staleTime: 30 * 1000,
  });

  if (error) return <div>Error: {error.message}</div>;

  return (
    <Layout>
      <div className="px-6 pt-6 space-y-3">
        <SearchInput onSearch={setTitle} />
        <div className="flex flex-wrap gap-3">
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="px-3 py-2 border rounded-md text-sm bg-white"
          >
            <option value="">All categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          <select
            value={gradeLevel}
            onChange={(e) => setGradeLevel(e.target.value)}
            className="px-3 py-2 border rounded-md text-sm bg-white"
          >
            <option value="">All grades</option>
            {gradeLevels.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>
          <select
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="px-3 py-2 border rounded-md text-sm bg-white"
          >
            <option value="">All subjects</option>
            {subjects.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          {userId && (
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={hidePurchased}
                onChange={(e) => setHidePurchased(e.target.checked)}
              />
              Hide purchased
            </label>
          )}
        </div>
      </div>
      <div className="p-6 space-y-4">
        {isLoading ? (
          <div>Loading...</div>
        ) : (
          <Suspense fallback={<div>Loading courses...</div>}>
            <CoursesList items={courses} />
          </Suspense>
        )}
      </div>
    </Layout>
  );
}

import { trace } from "firebase/performance";
import { performance } from "../lib/performance";

// Example: Custom trace for loading dashboard courses
export const traceLoadDashboardCourses = async (fn) => {
  const loadTrace = trace(performance, "load_dashboard_courses");
  loadTrace.start();
  try {
    const result = await fn();
    return result;
  } catch (error) {
    loadTrace.putAttribute("error", error.message);
    throw error;
  } finally {
    loadTrace.stop();
  }
};

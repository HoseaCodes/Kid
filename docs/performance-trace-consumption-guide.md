# Firebase Performance Custom Trace Consumption Guide

This guide explains how to add a custom Firebase Performance trace to any async feature in your app using the provided utility.

## Prerequisites
- Firebase Performance Monitoring is set up and initialized in your project.
- The `traceLoadDashboardCourses` pattern is available in `src/utils/performanceTraces.js`.

## Step-by-Step Usage

### 1. Create a Custom Trace Wrapper
In `src/utils/performanceTraces.js`, add a new function for your feature. For example, to trace a feature called `fetchUserProfile`:

```js
import { trace } from "firebase/performance";
import { performance } from "../lib/performance";

export const traceFetchUserProfile = async (fn) => {
  const userTrace = trace(performance, "fetch_user_profile");
  userTrace.start();
  try {
    const result = await fn();
    return result;
  } catch (error) {
    userTrace.putAttribute("error", error.message);
    throw error;
  } finally {
    userTrace.stop();
  }
};
```

### 2. Use the Trace in Your Feature
Wrap your async logic with the trace function. Example for a React component:

```js
import { traceFetchUserProfile } from "../utils/performanceTraces";

React.useEffect(() => {
  async function loadProfile() {
    await traceFetchUserProfile(async () => {
      // Your async logic here
      const data = await fetchUserProfile();
      setProfile(data);
    });
  }
  loadProfile();
}, []);
```

### 3. View Traces in Firebase Console
- Go to Firebase Console → Performance Monitoring → Traces.
- Look for your custom trace name (e.g., `fetch_user_profile`).
- Analyze duration, attributes, and error rates.

## Tips
- Use descriptive trace names (e.g., `load_dashboard_courses`, `fetch_user_profile`).
- Add attributes or metrics as needed for more context.
- Only wrap code you want to measure for performance.

---

By following this guide, you can easily add custom performance traces to any async feature in your app for granular monitoring and optimization.

Read more [here](https://github.com/HoseaCodes/Kid/wiki/FireBase-Performance-Monitoring)
# Google Analytics + Firebase Performance Monitoring Consumption Guide

This guide explains how to add Google Analytics event tracking alongside Firebase Performance Monitoring to any feature in your app.

## Prerequisites
- Firebase and Google Analytics are set up and initialized in your project.
- The `analytics` object is exported from `src/lib/analytics.js`.
- Firebase Performance Monitoring is initialized (see `src/lib/performance.js`).

## Step-by-Step Usage

### 1. Import Analytics and Performance
In your feature/component file, import the analytics and logEvent utilities:

```js
import { analytics } from "../lib/analytics";
import { logEvent } from "firebase/analytics";
// (Optional) For performance traces:
import { trace } from "firebase/performance";
import { performance } from "../lib/performance";
```

### 2. Log Analytics Events
Call `logEvent` when a user action occurs (e.g., button click, form submit, page view):

```js
const handleClick = () => {
  if (analytics) {
    logEvent(analytics, "event_name", { key: "value" });
  }
  // ...your logic
};
```
- Use descriptive event names (e.g., `course_enroll`, `profile_update`, `cta_click`).
- Pass relevant parameters for context (e.g., userId, courseId, screen).

### 3. (Optional) Add Custom Performance Traces
For advanced performance monitoring, wrap async logic with a custom trace:

```js
const myAsyncFunction = async () => {
  const myTrace = trace(performance, "my_feature_trace");
  myTrace.start();
  try {
    // ...your async logic
  } finally {
    myTrace.stop();
  }
};
```

### 4. View Data in Firebase Console
- Go to Firebase Console → Analytics to view event data.
- Go to Firebase Console → Performance Monitoring to view traces and network metrics.

## Example: Tracking a Button Click
```js
import { analytics } from "../lib/analytics";
import { logEvent } from "firebase/analytics";

function MyButton({ userId }) {
  const handleClick = () => {
    if (analytics) {
      logEvent(analytics, "cta_click", { userId, button: "my_button" });
    }
    // ...other logic
  };
  return <button onClick={handleClick}>Click Me</button>;
}
```

## Tips
- Use analytics for user actions and engagement.
- Use performance traces for measuring load times and async operations.
- Combine both for a complete view of user experience and app health.

---
By following this guide, you can easily add analytics and performance monitoring to any feature for actionable insights and optimization.

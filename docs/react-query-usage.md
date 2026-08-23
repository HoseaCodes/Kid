# React Query Usage in This App

## Overview
This application uses [react-query](https://tanstack.com/query/latest) (now @tanstack/react-query) for efficient data fetching, caching, and state management in React.

## Implementation Details
- **Provider Setup:**
  - The app is wrapped with `QueryClientProvider` in `src/index.js`, making react-query available throughout the component tree.
- **Custom Hooks:**
  - Data fetching is abstracted into custom hooks using `useQuery`, such as:
    - `useGetAllCategories`
    - `useGetAllCourses`
    - `useGetCourseAttachments`
    - `useUserData`
    - `useGetAllTransactions`
    - `useGetAllUsers`
    - `useGetCouseById`
    - `useGetUserById`
- **Benefits:**
  - Automatic caching and background refetching
  - Consistent loading and error states
  - Simplified data synchronization across components
  - Devtools support for debugging queries

## Example Usage
```js
import { useQuery } from "@tanstack/react-query";

const { data, isLoading, error } = useQuery({
  queryKey: ["courses"],
  queryFn: fetchCourses,
});
```

## Best Practices
- Use custom hooks to encapsulate query logic.
- Leverage query keys for cache control and refetching.
- Use `QueryClientProvider` at the root of your app.
- Use React Query Devtools for debugging.

## References
- [React Query Docs](https://tanstack.com/query/latest)
- [React Query Devtools](https://tanstack.com/query/latest/docs/devtools)

---
React Query is a core part of this app’s data layer, ensuring fast, reliable, and maintainable data fetching.

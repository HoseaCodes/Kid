# Manual Test Guide: KidsverCity App

This guide covers manual testing for all user roles and major endpoints/features in the app. For each role, log in and follow the steps to verify expected functionality.

---

## 1. Roles Overview
- **Admin**: Full access to all features, user management, course management, analytics, etc.
- **Instructor**: Can create and manage courses, view enrolled students, manage course content.
- **Student**: Can browse, enroll, and participate in courses, view progress, and access resources.
- **Guest**: Limited access, can browse public content but cannot enroll or access premium features.

---

## 2. General Steps
1. Open the app in a browser (production or local build).
2. Log in as each role (use test accounts if available).
3. For each role, follow the test cases below.

---

## 3. Admin Role
- [x] **Login**: Admin can log in successfully.
- [x] **Dashboard**: Admin dashboard loads with analytics and stats.
- [x] **User Management**: Can view, add, edit, and remove users.
- [x] **Course Management**: Can create, edit, and delete courses.
- [ ] **Transactions**: Can view all transactions and filter/search.
- [ ] **Analytics**: Can view analytics and reports.
- [ ] **Settings**: Can update app-wide settings.
- [ ] **Logout**: Can log out and is redirected to login page.

---

## 4. Instructor Role
- [ ] **Login**: Instructor can log in successfully.
- [ ] **Dashboard**: Instructor dashboard loads with their courses and stats.
- [ ] **Create Course**: Can create a new course (fill all required fields, upload images, add content).
- [ ] **Edit Course**: Can edit existing courses.
- [ ] **Delete Course**: Can delete their own courses.
- [ ] **View Enrollments**: Can see list of students enrolled in their courses.
- [ ] **Upload Resources**: Can upload files/resources to courses.
- [ ] **Logout**: Can log out and is redirected to login page.

---

## 5. Student Role
- [ ] **Sign Up**: Student can register a new account.
- [ ] **Login**: Student can log in successfully.
- [ ] **Browse Courses**: Can view all available courses.
- [ ] **Search/Filter**: Can search and filter courses.
- [ ] **Enroll in Course**: Can enroll in a course and see it in their dashboard.
- [ ] **View Course Content**: Can access lessons, videos, and resources.
- [ ] **Track Progress**: Can see progress and completed lessons.
- [ ] **Transactions**: Can view their own payment history.
- [ ] **Profile**: Can view and edit their profile.
- [ ] **Logout**: Can log out and is redirected to login page.

---

## 6. Guest (Unauthenticated User)
- [ ] **Browse Public Content**: Can view landing page, about, and public course previews.
- [ ] **Restricted Actions**: Cannot enroll, access premium content, or view dashboards.
- [ ] **Sign Up/Login**: Can access sign up and login forms.

---

## 7. Common Functionality (All Roles)
- [ ] **Responsive Design**: App works on desktop, tablet, and mobile.
- [ ] **Navigation**: All navigation links work and update the URL.
- [ ] **Error Handling**: Invalid actions show user-friendly error messages.
- [ ] **Performance**: Pages load quickly, images lazy load, and no unnecessary API calls.
- [ ] **Accessibility**: Forms and navigation are accessible via keyboard and screen readers.

---

## 8. Endpoints/Features to Test
- **Authentication**: /login, /signup, /logout
- **Dashboard**: /dashboard (role-specific)
- **Courses**: /courses, /courses/:id, /courses/create, /courses/edit/:id
- **Users**: /admin/users, /profile
- **Transactions**: /transactions, /admin/transactions
- **Analytics**: /admin/analytics
- **Settings**: /admin/settings
- **Public Pages**: /, /about, /contact

---

## 9. Tips
- Use different browsers/devices for cross-browser testing.
- Clear cache/cookies between role tests.
- Use test data for destructive actions (deletes, edits).
- Record any bugs or unexpected behavior for follow-up.

---

**This checklist ensures all major roles and endpoints are covered for manual QA. Update as new features are added!**

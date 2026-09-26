# StudyMate — Full Expo Prototype

This version covers the StudyMate wireframe as a functional local prototype.

## Included

### Student
- Login / Register
- Forgot Password
- Dashboard with progress
- Subjects: search, add/edit/delete (available from the student screen when the logged-in user is admin)
- Tasks: search, filters, add/edit/delete, mark complete
- Activity Details
- Add activity to personal tasks
- Study Planner: calendar view, add sessions, complete sessions
- Notes: search, add/edit/delete
- Profile
- Notifications: unread state, mark all read, clear all

### Admin / Teacher
- Login
- Admin Dashboard
- Post Activity
- Edit/Delete Activities
- Manage Activities + Search
- Students list + search
- Student details
- Shared activity state + automatic notification when an activity is posted

## Demo accounts

Student:
student@studymate.app
student123

Admin:
admin@studymate.app
admin123

## Setup

From a fresh Expo project:

1. Install the two needed dependencies:
   npx expo install expo-linear-gradient @react-native-async-storage/async-storage

2. Copy this package's `app`, `components`, and `context` folders into the fresh project, replacing the existing `app` folder.

3. Run:
   npx expo start -c

## Data

This is a local prototype. Data is persisted on the device with AsyncStorage, so CRUD actions survive app restarts on that device. It does NOT yet use a cloud database or real server authentication.

For a production/capstone backend, connect the same data models to Firebase/Supabase and replace the local login with server-side auth.

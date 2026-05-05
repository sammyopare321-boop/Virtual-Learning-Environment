# University LMS — Complete Frontend Roadmap
## React + Next.js (App Router)

---

## Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Language**: JavaScript
- **Styling**: Tailwind CSS
- **State Management**: React Context API
- **Real-time**: Socket.io Client
- **HTTP Client**: Axios
- **File Uploads**: Axios multipart/form-data
- **Charts**: Recharts (for grade analytics)
- **JWT Decoding**: jwt-decode (client-side role checks)

---

## Project Structure

```
/frontend
  /public
    /icons
    /images
    logo.svg

  /app                        # Next.js App Router
    layout.js                 # Root layout (wraps all providers)
    page.js                   # Landing page
    not-found.js              # 404 page
    error.js                  # Global error boundary

    /auth
      /login
        page.js
      /register
        page.js

    /dashboard
      /student
        page.js
      /teacher
        page.js
      /admin
        page.js

    /courses
      page.js                 # Browse all courses
      /[courseId]
        page.js               # Course overview
        /modules
          page.js
        /assignments
          page.js
          /[assignmentId]
            page.js           # Assignment detail + submission
        /quizzes
          page.js
          /[quizId]
            page.js           # Quiz attempt page
        /grades
          page.js
        /attendance
          page.js
        /announcements
          page.js
        /discussions
          page.js
          /[discussionId]
            page.js           # Discussion thread
        /live
          page.js             # Live session

    /messages
      page.js                 # All conversations
      /[chatId]
        page.js               # Single chat thread

    /notifications
      page.js

    /profile
      page.js

    /admin
      page.js                 # Admin overview (redirects to analytics)
      /users
        page.js               # User list
        /[userId]
          page.js             # User detail + actions
      /courses
        page.js               # All courses
        /[courseId]
          page.js             # Course detail + reassign teacher
      /analytics
        page.js               # Platform-wide analytics
      /logs
        page.js               # Activity logs

  /components
    /auth
      LoginForm.js
      RegisterForm.js
      ProfileCard.js
      ProfileEditForm.js

    /courses
      CourseCard.js
      CourseForm.js           # Create / edit course
      EnrollButton.js
      ModuleCard.js
      ModuleForm.js
      ContentItem.js
      ContentUploadForm.js

    /assignments
      AssignmentCard.js
      AssignmentForm.js
      SubmissionForm.js       # Text + file upload
      SubmissionCard.js
      GradeForm.js            # Teacher grades a submission

    /quizzes
      QuizCard.js
      QuizForm.js             # Create quiz
      QuestionForm.js         # Add question
      QuizAttemptForm.js      # Student takes quiz
      QuizResults.js          # Shows score + feedback

    /grades
      GradeChart.js           # Recharts bar/pie chart
      GradeTable.js           # Gradebook table
      GradeWeightForm.js      # Set assignment vs quiz weights
      FinalGradeCard.js       # Student final grade display
      AtRiskTable.js          # Students below 50%

    /attendance
      AttendanceTable.js      # Teacher bulk mark UI
      AttendanceRecord.js     # Student attendance history
      AttendanceSummary.js    # Per-student attendance %

    /communication
      ChatBox.js              # Real-time DM
      MessageList.js
      MessageBubble.js
      AnnouncementBanner.js
      AnnouncementForm.js
      DiscussionThread.js
      DiscussionReplyForm.js
      NotificationBell.js     # Badge + dropdown
      NotificationItem.js

    /live
      LiveSessionCard.js
      LiveSessionForm.js      # Schedule session
      JoinButton.js           # Time-gated join

    /admin
      UserTable.js            # List + filter + search
      UserActionMenu.js       # Suspend, delete, change role
      ImpersonationBanner.js  # Shows when admin is impersonating
      CourseAdminTable.js
      ReassignTeacherModal.js
      AnalyticsOverview.js    # Stat cards
      UserGrowthChart.js      # Monthly user registrations
      GradeDistributionChart.js
      AttendanceRateChart.js
      ActivityLogTable.js

    /shared
      Navbar.js
      Sidebar.js
      Footer.js
      Loader.js
      Modal.js
      Button.js
      Input.js
      Badge.js
      Avatar.js
      Pagination.js
      EmptyState.js
      ErrorMessage.js
      FileUploader.js
      ConfirmDialog.js        # For destructive actions

  /layouts
    AuthLayout.js             # Login / register pages
    DashboardLayout.js        # Student + teacher dashboards
    CourseLayout.js           # All /courses/[courseId] pages
    AdminLayout.js            # All /admin pages

  /context
    AuthContext.js            # JWT, user object, login/logout
    SocketContext.js          # Socket.io connection + events
    ThemeContext.js           # Dark / light mode

  /hooks
    useAuth.js                # Access AuthContext
    useSocket.js              # Socket.io event bindings
    useFetch.js               # Generic data fetching with loading/error
    useNotifications.js       # Notification count + real-time updates
    useImpersonation.js       # Detect + exit impersonation session

  /utils
    /api
      authApi.js
      courseApi.js
      enrollmentApi.js
      moduleApi.js
      contentApi.js
      assignmentApi.js
      submissionApi.js
      gradeApi.js
      quizApi.js
      attendanceApi.js
      communicationApi.js
      liveApi.js
      adminApi.js             # User mgmt, course mgmt, analytics, logs
    axiosInstance.js          # Base Axios config + interceptors
    socketClient.js           # Socket.io client setup
    formatters.js             # Date, grade, percentage formatters
    roleGuard.js              # Role check helpers

  middleware.js               # Next.js route protection (CRITICAL)
  .env.local
```

---

## Environment Variables

```
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_SOCKET_URL=http://localhost:5000
```

---

## Route Protection — middleware.js (CRITICAL)

This file must exist at the root of `/frontend`. Without it, any user can
manually navigate to any page regardless of their role.

```javascript
import { NextResponse } from 'next/server';
import { jwtDecode } from 'jwt-decode';

// Define which roles can access which route prefixes
const routePermissions = {
  '/dashboard/admin': ['admin'],
  '/dashboard/teacher': ['teacher'],
  '/dashboard/student': ['student'],
  '/admin': ['admin'],
};

export function middleware(request) {
  const token = request.cookies.get('token')?.value;
  const { pathname } = request.nextUrl;

  // Redirect unauthenticated users to login
  if (!token) {
    if (pathname.startsWith('/dashboard') || pathname.startsWith('/courses') ||
        pathname.startsWith('/admin') || pathname.startsWith('/messages')) {
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }
    return NextResponse.next();
  }

  try {
    const decoded = jwtDecode(token);

    // Check role-based access
    for (const [route, allowedRoles] of Object.entries(routePermissions)) {
      if (pathname.startsWith(route) && !allowedRoles.includes(decoded.role)) {
        // Redirect to their own dashboard
        return NextResponse.redirect(
          new URL(`/dashboard/${decoded.role}`, request.url)
        );
      }
    }

    return NextResponse.next();
  } catch {
    // Invalid token — clear and redirect to login
    const response = NextResponse.redirect(new URL('/auth/login', request.url));
    response.cookies.delete('token');
    return response;
  }
}

export const config = {
  matcher: ['/dashboard/:path*', '/courses/:path*', '/admin/:path*',
            '/messages/:path*', '/notifications/:path*', '/profile/:path*']
};
```

---

## AuthContext.js

Manages JWT storage, user object, and login/logout across the app.

```javascript
'use client';
import { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import { useRouter } from 'next/navigation';
import axiosInstance from '@/utils/axiosInstance';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // On mount, fetch current user if token exists
    const token = document.cookie.includes('token');
    if (token) {
      axiosInstance.get('/api/auth/me')
        .then(res => setUser(res.data.data))
        .catch(() => logout())
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    const res = await axiosInstance.post('/api/auth/login', { email, password });
    const { token, data } = res.data;
    // Store token in httpOnly-like cookie via API or document.cookie
    document.cookie = `token=${token}; path=/; max-age=${7 * 24 * 60 * 60}`;
    setUser(data);
    router.push(`/dashboard/${data.role}`);
  };

  const logout = () => {
    document.cookie = 'token=; path=/; max-age=0';
    setUser(null);
    router.push('/auth/login');
  };

  const isImpersonating = () => {
    try {
      const token = document.cookie.match(/token=([^;]+)/)?.[1];
      if (!token) return false;
      const decoded = jwtDecode(token);
      return decoded.isImpersonation === true;
    } catch { return false; }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, isImpersonating }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
```

---

## SocketContext.js

Initializes the Socket.io connection and binds all real-time events.
All components consume this via `useSocket` hook — never initialize
a new socket connection inside a component.

```javascript
'use client';
import { createContext, useContext, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';

const SocketContext = createContext(null);

export function SocketProvider({ children }) {
  const { user } = useAuth();
  const socketRef = useRef(null);

  useEffect(() => {
    if (!user) return;

    const token = document.cookie.match(/token=([^;]+)/)?.[1];

    socketRef.current = io(process.env.NEXT_PUBLIC_SOCKET_URL, {
      auth: { token },        // JWT sent during handshake
      transports: ['websocket']
    });

    socketRef.current.on('connect', () => {
      console.log('Socket connected:', socketRef.current.id);
    });

    socketRef.current.on('connect_error', (err) => {
      console.error('Socket connection failed:', err.message);
    });

    return () => {
      socketRef.current?.disconnect();
    };
  }, [user]);

  return (
    <SocketContext.Provider value={socketRef}>
      {children}
    </SocketContext.Provider>
  );
}

export const useSocket = () => useContext(SocketContext);
```

---

## Socket Events — Where They Connect to UI

| Event (received) | Triggered by | Updates |
|-----------------|--------------|---------|
| `new_message` | Another user sends a DM | `ChatBox` — appends new message bubble |
| `new_announcement` | Teacher posts announcement | `NotificationBell` — increments badge |
| `new_notification` | Grade posted, submission received | `NotificationBell` — increments badge |

Bind these inside `useNotifications.js`:

```javascript
import { useEffect, useState } from 'react';
import { useSocket } from '@/context/SocketContext';

export function useNotifications() {
  const socketRef = useSocket();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const socket = socketRef?.current;
    if (!socket) return;

    const increment = () => setUnreadCount(c => c + 1);

    socket.on('new_notification', increment);
    socket.on('new_announcement', increment);

    return () => {
      socket.off('new_notification', increment);
      socket.off('new_announcement', increment);
    };
  }, [socketRef]);

  return { unreadCount, setUnreadCount };
}
```

---

## axiosInstance.js

Single Axios instance used by all API files. Automatically attaches
the JWT token to every request and handles 401 responses globally.

```javascript
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: { 'Content-Type': 'application/json' }
});

// Attach token to every request
axiosInstance.interceptors.request.use((config) => {
  const token = document.cookie.match(/token=([^;]+)/)?.[1];
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Handle expired tokens globally
axiosInstance.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      document.cookie = 'token=; path=/; max-age=0';
      window.location.href = '/auth/login';
    }
    return Promise.reject(err);
  }
);

export default axiosInstance;
```

---

## API Layer Examples

### authApi.js
```javascript
import api from '../axiosInstance';

export const authApi = {
  register: (data) => api.post('/api/auth/register', data),
  login: (data) => api.post('/api/auth/login', data),
  getMe: () => api.get('/api/auth/me'),
  updateMe: (data) => api.put('/api/auth/me', data),
};
```

### courseApi.js
```javascript
import api from '../axiosInstance';

export const courseApi = {
  getAll: (params) => api.get('/api/courses', { params }),
  getOne: (id) => api.get(`/api/courses/${id}`),
  create: (data) => api.post('/api/courses', data),
  update: (id, data) => api.put(`/api/courses/${id}`, data),
  delete: (id) => api.delete(`/api/courses/${id}`),
  getStudents: (id) => api.get(`/api/courses/${id}/students`),
  enroll: (id) => api.post(`/api/courses/${id}/enroll`),
  drop: (id) => api.delete(`/api/courses/${id}/enroll`),
  getMyCourses: () => api.get('/api/students/me/courses'),
};
```

### adminApi.js
```javascript
import api from '../axiosInstance';

export const adminApi = {
  // Users
  getUsers: (params) => api.get('/api/admin/users', { params }),
  getUser: (id) => api.get(`/api/admin/users/${id}`),
  changeRole: (id, role) => api.patch(`/api/admin/users/${id}/role`, { role }),
  changeStatus: (id, status) => api.patch(`/api/admin/users/${id}/status`, { status }),
  deleteUser: (id) => api.delete(`/api/admin/users/${id}`),
  impersonate: (id) => api.post(`/api/admin/users/${id}/impersonate`),
  exitImpersonation: () => api.post('/api/admin/impersonate/exit'),

  // Courses
  getCourses: (params) => api.get('/api/admin/courses', { params }),
  reassignTeacher: (id, teacherId) => api.patch(`/api/admin/courses/${id}/teacher`, { teacherId }),
  changeCourseStatus: (id, status) => api.patch(`/api/admin/courses/${id}/status`, { status }),
  deleteCourse: (id) => api.delete(`/api/admin/courses/${id}`),

  // Analytics
  getOverview: () => api.get('/api/admin/analytics/overview'),
  getUserAnalytics: () => api.get('/api/admin/analytics/users'),
  getGradeAnalytics: () => api.get('/api/admin/analytics/grades'),
  getAttendanceAnalytics: () => api.get('/api/admin/analytics/attendance'),
  getEnrollmentTrends: () => api.get('/api/admin/analytics/enrollment-trends'),

  // Logs
  getLogs: (params) => api.get('/api/admin/logs', { params }),
  getUserLogs: (userId) => api.get(`/api/admin/logs/${userId}`),
};
```

---

## Impersonation Banner

When an admin is in an impersonation session, show a persistent banner
at the top of every page so it's always clear they are not themselves.

```javascript
// components/admin/ImpersonationBanner.js
'use client';
import { useAuth } from '@/context/AuthContext';
import { adminApi } from '@/utils/api/adminApi';
import { useRouter } from 'next/navigation';

export default function ImpersonationBanner() {
  const { user, isImpersonating } = useAuth();
  const router = useRouter();

  if (!isImpersonating()) return null;

  const handleExit = async () => {
    const res = await adminApi.exitImpersonation();
    // Replace token with returned admin token
    document.cookie = `token=${res.data.token}; path=/; max-age=${7 * 24 * 60 * 60}`;
    router.push('/dashboard/admin');
    window.location.reload(); // Force context refresh
  };

  return (
    <div style={{ background: '#FEF3C7', borderBottom: '2px solid #F59E0B', padding: '8px 16px',
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <span>⚠️ You are currently impersonating <strong>{user?.name}</strong></span>
      <button onClick={handleExit}
        style={{ background: '#F59E0B', color: 'white', border: 'none',
                 borderRadius: '6px', padding: '4px 12px', cursor: 'pointer' }}>
        Exit Impersonation
      </button>
    </div>
  );
}
```

Add `<ImpersonationBanner />` at the top of `DashboardLayout.js` and `AdminLayout.js`.

---

## Feature Mapping — Backend to Frontend

| Backend Module | Frontend Page | Key Components |
|----------------|---------------|----------------|
| Auth | /auth/login, /auth/register | LoginForm, RegisterForm |
| Profile | /profile | ProfileCard, ProfileEditForm |
| Courses | /courses | CourseCard, CourseForm |
| Enrollment | /courses/[courseId] | EnrollButton |
| Modules + Content | /courses/[courseId]/modules | ModuleCard, ContentItem, ContentUploadForm |
| Assignments + Submissions | /courses/[courseId]/assignments | AssignmentCard, SubmissionForm, GradeForm |
| Grade Weights + Gradebook | /courses/[courseId]/grades | GradeWeightForm, GradeTable, GradeChart, FinalGradeCard, AtRiskTable |
| Quiz + Questions + Attempts | /courses/[courseId]/quizzes | QuizCard, QuizForm, QuestionForm, QuizAttemptForm, QuizResults |
| Attendance | /courses/[courseId]/attendance | AttendanceTable, AttendanceRecord, AttendanceSummary |
| Announcements | /courses/[courseId]/announcements | AnnouncementBanner, AnnouncementForm |
| Discussions | /courses/[courseId]/discussions | DiscussionThread, DiscussionReplyForm |
| Direct Messages | /messages | ChatBox, MessageList, MessageBubble |
| Notifications | /notifications | NotificationBell, NotificationItem |
| Live Sessions | /courses/[courseId]/live | LiveSessionCard, LiveSessionForm, JoinButton |
| Admin — Users | /admin/users | UserTable, UserActionMenu, ConfirmDialog |
| Admin — Courses | /admin/courses | CourseAdminTable, ReassignTeacherModal |
| Admin — Analytics | /admin/analytics | AnalyticsOverview, UserGrowthChart, GradeDistributionChart |
| Admin — Logs | /admin/logs | ActivityLogTable |
| Impersonation | All pages | ImpersonationBanner |

---

## Build Phases

### Phase 1 — Core (Start here)
- Auth pages (login, register)
- middleware.js route protection
- AuthContext + axiosInstance
- Course list + course detail
- Modules + content viewer
- Assignment list + submission form
- Student dashboard

### Phase 2 — Engagement
- Teacher dashboard
- Grade weights form + gradebook
- Final grade card (student)
- Quiz creation + attempt flow
- Attendance marking + student view

### Phase 3 — Real-time
- SocketContext setup
- Direct messaging (ChatBox)
- Announcements
- Discussion boards
- Notification bell + real-time badge

### Phase 4 — Admin
- Admin layout + dashboard
- User management table
- Course management + teacher reassignment
- Analytics charts (Recharts)
- Activity logs table
- Impersonation banner + exit flow

### Phase 5 — Live Classroom
- Live session scheduling
- Time-gated join button
- Daily.co or Whereby embed

---

## Important Rules for the Frontend Developer

1. **Never hardcode the API URL** — always use `process.env.NEXT_PUBLIC_API_URL`
2. **Never create a new socket connection inside a component** — always use `SocketContext`
3. **Never store the JWT in localStorage** — use cookies so `middleware.js` can read it
4. **Always use `axiosInstance`** — never use raw `fetch` or a separate axios instance
5. **Role checks in UI are cosmetic only** — the backend enforces real security.
   Always check role before rendering admin/teacher UI elements but never rely on
   this alone for security.
6. **Impersonation token contains `isImpersonation: true`** — decode it client-side
   to show the `ImpersonationBanner`
7. **Quiz pages must never display `correctAnswer`** — the backend strips it but
   add a client-side check too as a safety net
8. **File uploads must use `multipart/form-data`** — set the correct Content-Type
   header when uploading content items or assignment submissions
9. **Paginate all list views** — every admin table and course list supports
   `?page=` and `?limit=` params. Use the `Pagination` shared component.
10. **All destructive actions need a `ConfirmDialog`** — deleting users, dropping
    courses, deleting content. Never delete on a single click.

export const queryKeys = {
  courses: {
    all: ['courses'] as const,
    list: (params?: { search?: string; status?: string }) =>
      ['courses', 'list', params ?? {}] as const,
    detail: (id: string) => ['courses', 'detail', id] as const,
    modules: (id: string) => ['courses', 'modules', id] as const,
    moduleContent: (moduleId: string) => ['courses', 'module-content', moduleId] as const,
    assignments: (courseId: string) => ['courses', 'assignments', courseId] as const,
    mySubmissions: (courseId: string) => ['courses', 'my-submissions', courseId] as const,
    grades: (courseId: string, role: string) => ['courses', 'grades', courseId, role] as const,
    announcements: (courseId: string) => ['courses', 'announcements', courseId] as const,
    discussions: (courseId: string) => ['courses', 'discussions', courseId] as const,
    attendance: (courseId: string, role: string) => ['courses', 'attendance', courseId, role] as const,
    liveSessions: (courseId: string) => ['courses', 'live-sessions', courseId] as const,
    enrolled: ['courses', 'enrolled'] as const,
  },
  student: {
    dashboard: ['student', 'dashboard'] as const,
    milestones: ['student', 'milestones'] as const,
  },
  teacher: {
    dashboard: ['teacher', 'dashboard'] as const,
    courses: (teacherId: string) => ['teacher', 'courses', teacherId] as const,
  },
  admin: {
    stats: ['admin', 'stats'] as const,
    analytics: ['admin', 'analytics'] as const,
    users: (params: Record<string, unknown>) => ['admin', 'users', params] as const,
    courses: (params: Record<string, unknown>) => ['admin', 'courses', params] as const,
    logs: (params: Record<string, unknown>) => ['admin', 'logs', params] as const,
    teachers: ['admin', 'teachers'] as const,
  },
  quizzes: {
    list: (courseId: string) => ['courses', 'quizzes', courseId] as const,
    detail: (quizId: string) => ['quizzes', 'detail', quizId] as const,
  },
  communication: {
    notifications: ['communication', 'notifications'] as const,
    conversations: ['communication', 'conversations'] as const,
    messages: (userId: string) => ['communication', 'messages', userId] as const,
    discussion: (id: string) => ['communication', 'discussion', id] as const,
  },
};

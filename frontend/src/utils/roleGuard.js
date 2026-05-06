export const roles = {
  student: "student",
  teacher: "teacher",
  admin: "admin"
};

export function canManageCourse(user) {
  return user?.role === roles.teacher || user?.role === roles.admin;
}

export function isAdmin(user) {
  return user?.role === roles.admin;
}

export function dashboardPath(role) {
  if (role === roles.admin) return "/dashboard/admin";
  if (role === roles.teacher) return "/dashboard/teacher";
  return "/dashboard/student";
}

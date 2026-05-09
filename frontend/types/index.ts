export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'student' | 'teacher' | 'admin';
  status: 'active' | 'suspended'; // Fix #5: was missing from interface
  avatar?: string;
  department?: string;
  createdAt?: string;
}

export interface Course {
  _id: string;
  title: string;
  code: string;
  description?: string;
  status: 'active' | 'draft' | 'archived';
  semester: string;
  academicYear: string;
  teacher?: {
    _id: string;
    name?: string;
  } | string;
  students?: string[] | any[];
  modules?: any[];
}

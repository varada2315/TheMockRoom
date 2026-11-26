const TOKEN_KEY = 'mockroom_portal_token';
const USER_KEY = 'mockroom_portal_user';

export interface UserProfile {
  id: string;
  username: string;
  name: string;
  role: 'superadmin' | 'mentor' | 'student';
  email: string;
  phone?: string;
  address?: string;
}

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setSession(token: string, user: UserProfile): void {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function clearSession(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

export function getStoredUser(): UserProfile | null {
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

async function fetchApi<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  if (!(options.body instanceof FormData) && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json';
  }

  const res = await fetch(`/api${endpoint}`, {
    ...options,
    headers,
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'API Request failed');
  }
  return data as T;
}

export const apiClient = {
  login: (username: string, password: string, expectedRole?: string) =>
    fetchApi<{ token: string; user: UserProfile }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password, expectedRole }),
    }),

  getMe: () => fetchApi<{ user: UserProfile }>('/auth/me'),

  // Admin
  getAdminOverview: () => fetchApi<any>('/admin/overview'),
  createStudent: (data: { name: string; email: string; phone: string; address?: string; courseId?: string }) =>
    fetchApi<any>('/admin/students', { method: 'POST', body: JSON.stringify(data) }),
  updateStudent: (id: string, data: any) =>
    fetchApi<any>(`/admin/students/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteStudent: (id: string) =>
    fetchApi<any>(`/admin/students/${id}`, { method: 'DELETE' }),
  deleteMentor: (id: string) =>
    fetchApi<any>(`/admin/mentors/${id}`, { method: 'DELETE' }),
  createMentor: (data: { name: string; email: string; phone: string; courseIds?: string[] }) =>
    fetchApi<any>('/admin/mentors', { method: 'POST', body: JSON.stringify(data) }),
  updateMentor: (id: string, data: any) =>
    fetchApi<any>(`/admin/mentors/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  createCourse: (data: { title: string; code: string; description?: string }) =>
    fetchApi<any>('/admin/courses', { method: 'POST', body: JSON.stringify(data) }),
  assignCourse: (data: { studentId: string; courseId: string }) =>
    fetchApi<any>('/admin/assign-course', { method: 'POST', body: JSON.stringify(data) }),

  // Mentor
  getMentorStudents: () => fetchApi<any>('/mentor/students'),
  updateMentorScores: (data: {
    studentId: string;
    courseId: string;
    assignmentScore?: string;
    testQuizScore?: string;
    projectScore?: string;
    overallGrade?: string;
    mentorRemarks?: string;
  }) => fetchApi<any>('/mentor/scores', { method: 'POST', body: JSON.stringify(data) }),

  // Student
  getStudentProfile: () => fetchApi<any>('/student/profile'),
  uploadResume: (file: File) => {
    const formData = new FormData();
    formData.append('resume', file);
    return fetchApi<any>('/student/resume', {
      method: 'POST',
      body: formData,
    });
  },
};

import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

export type Role = "student" | "admin";
export type Priority = "High" | "Medium" | "Low";

export type User = {
  id: string;
  name: string;
  email: string;
  password: string;
  role: Role;
  studentId?: string;
  course?: string;
  year?: string;
};

export type Subject = {
  id: string;
  name: string;
  instructor: string;
  room: string;
  schedule: string;
  icon: string;
};

export type Activity = {
  id: string;
  title: string;
  description: string;
  subject: string;
  dueDate: string;
  priority: Priority;
  attachment?: string;
  createdAt: string;
};

export type Task = {
  id: string;
  title: string;
  description: string;
  subject: string;
  dueDate: string;
  priority: Priority;
  completed: boolean;
  sourceActivityId?: string;
};

export type Note = {
  id: string;
  title: string;
  content: string;
  subject: string;
  createdAt: string;
  updatedAt: string;
};

export type StudySession = {
  id: string;
  subject: string;
  date: string;
  startTime: string;
  duration: string;
  status: "Planned" | "Completed";
};

export type AppNotification = {
  id: string;
  title: string;
  message: string;
  createdAt: string;
  read: boolean;
  type: "activity" | "general";
};

type AppState = {
  currentUser: User | null;
  users: User[];
  subjects: Subject[];
  activities: Activity[];
  tasks: Task[];
  notes: Note[];
  sessions: StudySession[];
  notifications: AppNotification[];
};

type AppContextType = AppState & {
  loading: boolean;
  login: (email: string, password: string, role: Role) => Promise<{ ok: boolean; message?: string }>;
  register: (name: string, email: string, password: string, studentId: string, course: string, year: string) => Promise<{ ok: boolean; message?: string }>;
  logout: () => Promise<void>;
  resetPassword: (email: string, newPassword: string) => Promise<{ ok: boolean; message?: string }>;
  updateProfile: (data: Partial<User>) => void;
  addSubject: (subject: Omit<Subject, "id">) => void;
  updateSubject: (id: string, subject: Omit<Subject, "id">) => void;
  deleteSubject: (id: string) => void;
  addActivity: (activity: Omit<Activity, "id" | "createdAt">) => void;
  updateActivity: (id: string, activity: Omit<Activity, "id" | "createdAt">) => void;
  deleteActivity: (id: string) => void;
  addTask: (task: Omit<Task, "id">) => void;
  updateTask: (id: string, task: Omit<Task, "id">) => void;
  deleteTask: (id: string) => void;
  toggleTask: (id: string) => void;
  addTaskFromActivity: (activity: Activity) => void;
  addNote: (note: Omit<Note, "id" | "createdAt" | "updatedAt">) => void;
  updateNote: (id: string, note: Omit<Note, "id" | "createdAt" | "updatedAt">) => void;
  deleteNote: (id: string) => void;
  addSession: (session: Omit<StudySession, "id">) => void;
  completeSession: (id: string) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  clearNotifications: () => void;
};

const STORAGE_KEY = "@studymate_state_v2";

const seedUsers: User[] = [
  {
    id: "u-admin",
    name: "Prof. Santos",
    email: "admin@studymate.app",
    password: "admin123",
    role: "admin",
  },
  {
    id: "u-student",
    name: "Angel Joyce A. Boctot",
    email: "student@studymate.app",
    password: "student123",
    role: "student",
    studentId: "2026-0001",
    course: "BS Information Technology",
    year: "3rd Year",
  },
];

const seedSubjects: Subject[] = [
  { id: "s1", name: "Information Assurance", instructor: "Prof. Santos", room: "Room 101", schedule: "MWF 9:00 AM", icon: "shield-checkmark-outline" },
  { id: "s2", name: "Software Engineering", instructor: "Prof. Cruz", room: "Room 205", schedule: "TTH 10:30 AM", icon: "code-slash-outline" },
  { id: "s3", name: "Database Systems", instructor: "Prof. Reyes", room: "Room 302", schedule: "MWF 1:00 PM", icon: "server-outline" },
  { id: "s4", name: "Web Development", instructor: "Prof. Lim", room: "Room 201", schedule: "TTH 3:00 PM", icon: "globe-outline" },
];

const seedActivities: Activity[] = [
  {
    id: "a1",
    title: "Midterm Project",
    description: "Create a network security report and submit the final PDF.",
    subject: "Information Assurance",
    dueDate: "Sep 30, 2026",
    priority: "High",
    attachment: "NetworkSecurityGuide.pdf",
    createdAt: "Sep 20, 2026",
  },
  {
    id: "a2",
    title: "Lab Activity 3",
    description: "Complete the assigned laboratory activity.",
    subject: "Software Engineering",
    dueDate: "Oct 5, 2026",
    priority: "Medium",
    createdAt: "Sep 21, 2026",
  },
  {
    id: "a3",
    title: "Chapter 4 Quiz",
    description: "Review Chapter 4 and answer the quiz.",
    subject: "Database Systems",
    dueDate: "Oct 8, 2026",
    priority: "Low",
    createdAt: "Sep 21, 2026",
  },
];

const seedTasks: Task[] = [
  {
    id: "t1",
    title: "Midterm Project",
    description: "Create a network security report.",
    subject: "Information Assurance",
    dueDate: "Sep 30, 2026",
    priority: "High",
    completed: false,
    sourceActivityId: "a1",
  },
  {
    id: "t2",
    title: "Lab Activity 3",
    description: "Complete the assigned laboratory activity.",
    subject: "Software Engineering",
    dueDate: "Oct 5, 2026",
    priority: "Medium",
    completed: false,
    sourceActivityId: "a2",
  },
];

const seedNotes: Note[] = [
  {
    id: "n1",
    title: "Database Review",
    content: "ERD, normalization and SQL concepts.",
    subject: "Database Systems",
    createdAt: "Sep 20, 2026",
    updatedAt: "Sep 20, 2026",
  },
  {
    id: "n2",
    title: "Security Notes",
    content: "CIA Triad and information assurance.",
    subject: "Information Assurance",
    createdAt: "Sep 18, 2026",
    updatedAt: "Sep 18, 2026",
  },
];

const seedSessions: StudySession[] = [
  { id: "ss1", subject: "Database Systems", date: "Sep 22, 2026", startTime: "2:00 PM", duration: "1 hour", status: "Planned" },
  { id: "ss2", subject: "Software Engineering", date: "Sep 22, 2026", startTime: "4:00 PM", duration: "45 mins", status: "Planned" },
];

const seedNotifications: AppNotification[] = [
  {
    id: "nfy1",
    title: "New Activity Posted",
    message: "Midterm Project was posted in Information Assurance.",
    createdAt: "Sep 20, 2026",
    read: false,
    type: "activity",
  },
  {
    id: "nfy2",
    title: "Upcoming Deadline",
    message: "Your Midterm Project is due on Sep 30, 2026.",
    createdAt: "Sep 21, 2026",
    read: false,
    type: "general",
  },
];

const defaultState: AppState = {
  currentUser: null,
  users: seedUsers,
  subjects: seedSubjects,
  activities: seedActivities,
  tasks: seedTasks,
  notes: seedNotes,
  sessions: seedSessions,
  notifications: seedNotifications,
};

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AppState>(defaultState);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (stored) setState(JSON.parse(stored));
      } catch {
        // Keep defaults if storage is unavailable/corrupt.
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    if (!loading) {
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state)).catch(() => {});
    }
  }, [state, loading]);

  const api = useMemo<AppContextType>(() => ({
    ...state,
    loading,

    login: async (email, password, role) => {
      const user = state.users.find(
        (u) => u.email.toLowerCase() === email.trim().toLowerCase() && u.password === password && u.role === role
      );
      if (!user) return { ok: false, message: "Invalid email, password, or role." };
      setState((s) => ({ ...s, currentUser: user }));
      return { ok: true };
    },

    register: async (name, email, password, studentId, course, year) => {
      if (!name.trim() || !email.trim() || !password.trim()) return { ok: false, message: "Please complete all required fields." };
      if (state.users.some((u) => u.email.toLowerCase() === email.trim().toLowerCase())) {
        return { ok: false, message: "That email is already registered." };
      }
      const user: User = {
        id: "u-" + Date.now(),
        name: name.trim(),
        email: email.trim(),
        password,
        role: "student",
        studentId: studentId.trim(),
        course: course.trim(),
        year: year.trim(),
      };
      setState((s) => ({ ...s, users: [...s.users, user], currentUser: user }));
      return { ok: true };
    },

    logout: async () => {
      setState((s) => ({ ...s, currentUser: null }));
      try { await AsyncStorage.removeItem(STORAGE_KEY); } catch {}
    },

    resetPassword: async (email, newPassword) => {
      const exists = state.users.some((u) => u.email.toLowerCase() === email.trim().toLowerCase());
      if (!exists) return { ok: false, message: "Email not found." };
      setState((s) => ({
        ...s,
        users: s.users.map((u) => (u.email.toLowerCase() === email.trim().toLowerCase() ? { ...u, password: newPassword } : u)),
      }));
      return { ok: true };
    },

    updateProfile: (data) => setState((s) => {
      if (!s.currentUser) return s;
      const updated = { ...s.currentUser, ...data };
      return { ...s, currentUser: updated, users: s.users.map(u => u.id === updated.id ? updated : u) };
    }),

    addSubject: (subject) => setState((s) => ({ ...s, subjects: [{ ...subject, id: "s-" + Date.now() }, ...s.subjects] })),
    updateSubject: (id, subject) => setState((s) => ({ ...s, subjects: s.subjects.map((x) => x.id === id ? { ...subject, id } : x) })),
    deleteSubject: (id) => setState((s) => ({ ...s, subjects: s.subjects.filter((x) => x.id !== id) })),

    addActivity: (activity) => setState((s) => {
      const created = { ...activity, id: "a-" + Date.now(), createdAt: "Just now" };
      const notification: AppNotification = {
        id: "nf-" + Date.now(),
        title: "New Activity Posted",
        message: `${created.title} was posted in ${created.subject}.`,
        createdAt: "Just now",
        read: false,
        type: "activity",
      };
      return { ...s, activities: [created, ...s.activities], notifications: [notification, ...s.notifications] };
    }),
    updateActivity: (id, activity) => setState((s) => ({ ...s, activities: s.activities.map((x) => x.id === id ? { ...activity, id, createdAt: x.createdAt } : x) })),
    deleteActivity: (id) => setState((s) => ({ ...s, activities: s.activities.filter((x) => x.id !== id) })),

    addTask: (task) => setState((s) => ({ ...s, tasks: [{ ...task, id: "t-" + Date.now() }, ...s.tasks] })),
    updateTask: (id, task) => setState((s) => ({ ...s, tasks: s.tasks.map((x) => x.id === id ? { ...task, id } : x) })),
    deleteTask: (id) => setState((s) => ({ ...s, tasks: s.tasks.filter((x) => x.id !== id) })),
    toggleTask: (id) => setState((s) => ({ ...s, tasks: s.tasks.map((x) => x.id === id ? { ...x, completed: !x.completed } : x) })),
    addTaskFromActivity: (activity) => setState((s) => {
      if (s.tasks.some((x) => x.sourceActivityId === activity.id)) return s;
      const task: Task = {
        id: "t-" + Date.now(),
        title: activity.title,
        description: activity.description,
        subject: activity.subject,
        dueDate: activity.dueDate,
        priority: activity.priority,
        completed: false,
        sourceActivityId: activity.id,
      };
      return { ...s, tasks: [task, ...s.tasks] };
    }),

    addNote: (note) => {
      const now = "Just now";
      setState((s) => ({ ...s, notes: [{ ...note, id: "n-" + Date.now(), createdAt: now, updatedAt: now }, ...s.notes] }));
    },
    updateNote: (id, note) => {
      const now = "Just now";
      setState((s) => ({ ...s, notes: s.notes.map((x) => x.id === id ? { ...note, id, createdAt: x.createdAt, updatedAt: now } : x) }));
    },
    deleteNote: (id) => setState((s) => ({ ...s, notes: s.notes.filter((x) => x.id !== id) })),

    addSession: (session) => setState((s) => ({ ...s, sessions: [{ ...session, id: "ss-" + Date.now() }, ...s.sessions] })),
    completeSession: (id) => setState((s) => ({ ...s, sessions: s.sessions.map((x) => x.id === id ? { ...x, status: "Completed" } : x) })),

    markNotificationRead: (id) => setState((s) => ({ ...s, notifications: s.notifications.map((x) => x.id === id ? { ...x, read: true } : x) })),
    markAllNotificationsRead: () => setState((s) => ({ ...s, notifications: s.notifications.map((x) => ({ ...x, read: true })) })),
    clearNotifications: () => setState((s) => ({ ...s, notifications: [] })),
  }), [state, loading]);

  return <AppContext.Provider value={api}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used inside AppProvider");
  return ctx;
}

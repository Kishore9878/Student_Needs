export const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL ||
  import.meta.env.VITE_API_URL ||
  "http://localhost:8000"
).replace(/\/$/, "");

export const API_PREFIXES = {
  tutors: "/api",
  attendance: "/api",
  referrals: "/api/v1",
  expenses: "/api/expenses",
};

export const AUTH_STORAGE_KEYS = {
  token: "auth_token",
  user: "auth_user",
};

export const getApiUrl = (prefix = "") => `${API_BASE_URL}${prefix}`;

export const getGoogleOAuthUrl = (role = "student") =>
  `${API_BASE_URL}/api/v1/student/auth/google?role=${encodeURIComponent(role)}`;

export const getGithubOAuthUrl = (role = "student") =>
  `${API_BASE_URL}/api/v1/student/auth/github?role=${encodeURIComponent(role)}`;


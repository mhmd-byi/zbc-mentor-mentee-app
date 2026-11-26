export type Role = "admin" | "counselor" | "mentor" | "mentee";

export const ROLE_LABELS: Record<Role, string> = {
  admin: "Admin",
  counselor: "Counselor",
  mentor: "Mentor",
  mentee: "Mentee",
};

export const DASHBOARD_PATHS: Record<Role, string> = {
  admin: "/admin",
  counselor: "/counselor",
  mentor: "/mentor",
  mentee: "/mentee",
};

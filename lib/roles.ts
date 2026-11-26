export const ROLES = ["admin", "counselor", "mentor", "mentee"] as const;

export type Role = (typeof ROLES)[number];

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

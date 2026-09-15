// Client service wrapping the demo backend endpoints (updated for full_name).
export interface User {
  id: number;
  full_name: string;
  email: string;
  avatar_url?: string;
}

export function getUser(userId: number): User {
  const res = fetch(`/users/${userId}`);
  return res.json();
}

export function listUsers() {
  return fetch("/users").then((r) => r.json());
}

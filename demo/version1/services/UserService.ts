// Client service wrapping the demo backend endpoints.
export interface User {
  id: number;
  name: string;
  email: string;
}

export function getUser(userId: number): User {
  const res = fetch(`/users/${userId}`);
  return res.json();
}

export function listUsers() {
  return fetch("/users").then((r) => r.json());
}

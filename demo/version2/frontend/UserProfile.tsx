import React from "react";
import { getUser } from "../services/UserService";

// Client component consuming the user API response (updated for full_name).
export function UserProfile({ userId }: { userId: number }) {
  const user = getUser(userId);
  return (
    <div className="user-profile">
      <h1>{user.full_name}</h1>
      <p>{user.email}</p>
    </div>
  );
}

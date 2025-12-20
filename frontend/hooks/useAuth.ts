// import { useEffect, useState } from 'react';
// import { getToken, getUserRole } from '@/lib/auth';

// export const useAuth = () => {
//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   const [role, setRole] = useState<string | null>(null);

//   useEffect(() => {
//     const token = getToken();
//     if (token) {
//       setIsLoggedIn(true);
//       setRole(getUserRole());
//     }
//   }, []);

//   return { isLoggedIn, role };
// };

"use client";

import { useSyncExternalStore } from "react";
import { getUserRole } from "@/lib/auth";

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
}

export const useAuth = () => {
  const token = useSyncExternalStore(
    subscribe,
    // getToken,
    () => null
  );

  const role = useSyncExternalStore(
    subscribe,
    () => getUserRole() ?? null,
    () => null
  );

  return {
    isLoggedIn: !!token,
    role,
  };
};

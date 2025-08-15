import { getAuth, onAuthStateChanged, type User } from "firebase/auth";
import { useEffect, useState } from "react";
import type { Claims } from "../contexts/ClaimsContext";

const useAuthState = () => {
  console.log(`useAuthState`);

  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [claims, setClaims] = useState<Claims | null>(null);

  useEffect(() => {
    console.log(`Start listening for onAuthStateChanged.`);

    setLoading(true);

    const unsubscribe = onAuthStateChanged(getAuth(), {
      next: async (user) => {
        console.log(`onAuthStateChanged :: `, user);
        let curClaims = null;
        if (user) {
          const idTokenResult = await user.getIdTokenResult();
          curClaims = {
            admin: idTokenResult.claims.admin == true,
            superAdmin: idTokenResult.claims.superAdmin == true,
          };
        }
        setUser(user);
        setClaims(curClaims);

        if (user) {
          console.log(`User ${user.email} is logged in.`);
        } else {
          console.log(`No one is logged in.`);
        }
        console.log(`Claims::`, curClaims);

        setLoading(false);
      },
      error: (err) => {
        setUser(null);
        setClaims(null);
        setLoading(false);
        console.error(err);
      },
      complete: () => {
        console.log(`Complete`, loading);
        setLoading(false);
      },
    });

    return () => {
      console.log(`Cleanup onAuthStateChanged.`);
      unsubscribe();
    };
  }, []);
  return { loading, user, claims };
};

export default useAuthState;

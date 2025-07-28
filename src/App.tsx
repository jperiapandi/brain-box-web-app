import { Outlet } from "react-router";
import { UserContext } from "./contexts/UserContext";
import { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged, type User } from "firebase/auth";
import { type Claims, ClaimsContext } from "./contexts/ClaimsContext";

function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentClaims, setCurrentClaims] = useState<Claims | null>(null);

  useEffect(() => {
    console.log(`Start watching for Auth Change`);
    const unsubscribe = onAuthStateChanged(getAuth(), {
      next: async (user) => {
        console.warn(`Auth State Changed Success. `);
        setCurrentUser(user);
        if (user == null) {
          console.log(`No one is logged in.`);
          console.log(`User will be set to null`);
          setCurrentClaims(null);
          return;
        }
        console.log(`User '${user.displayName}' is logged in now!`);
        console.log(`UPDATE Current User!!!`);
        try {
          //Get claims
          const idTokenResult = await user.getIdTokenResult();
          setCurrentClaims({
            admin: idTokenResult.claims.admin == true,
            superAdmin: idTokenResult.claims.superAdmin == true,
          });
        } catch (error) {
          console.error(error);
        }
      },
      error: (error) => {
        console.error(error);
      },
      complete: () => {
        console.log(`onAuthStateChanged completed.`);
      },
    });

    return () => {
      console.warn(`Clean up AuthStateChange Listener`);
      unsubscribe();
    };
  }, []);
  return (
    <UserContext value={currentUser}>
      <ClaimsContext value={currentClaims}>
        <Outlet></Outlet>
      </ClaimsContext>
    </UserContext>
  );
}

export default App;

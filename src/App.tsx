import { Outlet } from "react-router";
import { UserContext } from "./contexts/UserContext";
import { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged, type User } from "firebase/auth";

function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    console.log(`Start watching for Auth Change`);
    const unsubscribe = onAuthStateChanged(getAuth(), {
      next: (user) => {
        console.warn(`Auth State Changed Success. `);
        if (user == null) {
          console.log(`No one is logged in.`);
          return;
        }
        console.log(`User '${user.displayName}' is logged in now!`, user);
        console.log(`UPDATE Current User!!!`);
        setCurrentUser(user);
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
      <Outlet></Outlet>
    </UserContext>
  );
}

export default App;

import { Outlet } from "react-router";
import { UserContext } from "./contexts/UserContext";
import useAuthState from "./hooks/useAuthState";
import { ClaimsContext } from "./contexts/ClaimsContext";

function App() {
  const { loading, user, claims } = useAuthState();
  if (loading) {
    return <div>Please wait... app is loading.</div>;
  }
  return (
    <UserContext value={user}>
      <ClaimsContext value={claims}>
        <Outlet></Outlet>
      </ClaimsContext>
    </UserContext>
  );
}

export default App;

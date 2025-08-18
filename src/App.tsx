import { Outlet } from "react-router";
import { UserContext } from "./contexts/UserContext";
import useAuthState from "./hooks/useAuthState";
import { ClaimsContext } from "./contexts/ClaimsContext";

function App() {
  const { loading, user, claims } = useAuthState();
  if (loading) {
    return (
      <div className="app-pre-load-container">
        <img src="Logo.png" alt="logo" className="app-logo" />
        <div className="app-name-container">
          <h1>BrainBox</h1>
          <p>&copy; Developed by Periapandi Jeyaram</p>
        </div>
        <div className="progress-box"></div>
      </div>
    );
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

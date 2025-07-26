import type React from "react";
import { useContext } from "react";
import { UserContext } from "../contexts/UserContext";

const WelcomeUser: React.FunctionComponent = () => {
  const user = useContext(UserContext);

  let salute = "Hello, ";
  const now = new Date();
  if (now.getHours() < 12) {
    salute = "Good morning, ";
  } else if (now.getHours() < 16) {
    salute = "Good afternoon, ";
  } else {
    salute = "Good evening, ";
  }

  if (user) {
    return (
      <div className="welcome-user">
        <span className="salute">{salute}</span>
        <span>{user.displayName}</span>
      </div>
    );
  } else {
    return null;
  }
};

export default WelcomeUser;

import type React from "react";
import { useContext, type PropsWithChildren } from "react";
import { UserContext } from "../contexts/UserContext";

type WelcomeUserProps = PropsWithChildren & {
  onSignInClick: () => void;
  onCreateQuizClick: () => void;
};
const WelcomeUser: React.FunctionComponent<WelcomeUserProps> = ({
  onSignInClick,
  onCreateQuizClick,
}) => {
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

  return (
    <div className="welcome-user">
      {user == null ? (
        <>
          <h1>Welcome to BrainBox !</h1>
          <p>
            {salute} <strong>BrainBox</strong> is your go-to app for quizzes
            that will challenge your skills and sharpen your mind. To dive into
            our full library of quizzes, please sign in or create an account.
          </p>

          <p>
            If you'd like to explore the app first, you're welcome to log in as
            a Guest user. However, to get the most out of BrainBox and track
            your progress, to create new Quizzes, we recommend logging in using
            your Email ID.
          </p>

          <div className="controls-container-h">
            <button className="btn btn-primary" onClick={onCreateQuizClick} disabled>
              Create a Quiz
            </button>
            <button className="btn btn-primary" onClick={onSignInClick}>Sign In</button>
          </div>
        </>
      ) : (
        <>
          <span className="salute">{salute}</span>
          <span>{user.displayName}</span>
        </>
      )}
    </div>
  );
};

export default WelcomeUser;

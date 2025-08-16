import type React from "react";
import PageHeader from "../../components/headers/PageHeader";

import QuizDraftsList from "../../components/QuizDraftsList";
import { useContext, useRef } from "react";
import { UserContext } from "../../contexts/UserContext";
import { NavLink, useNavigate } from "react-router";
import {
  ABOUT_PAGE_PATH,
  AUTH_PAGE_PATH,
  CREATE_QUIZ_PAGE_PATH,
  EDIT_QUIZ_PAGE_PATH,
} from "../router";
import WelcomeUser from "../../components/WelcomeUser";
import { ClaimsContext } from "../../contexts/ClaimsContext";
import SubmittedQuizDrafts from "../../components/SubmittedQuizDrafts";
import QuizList from "../../components/QuizList";
import Dialog, { type DialogRef } from "../../components/Dialog";

const HomePage: React.FunctionComponent = () => {
  //Hooks
  const user = useContext(UserContext);
  const claims = useContext(ClaimsContext);

  const navigate = useNavigate();
  //States
  const loginModal = useRef<DialogRef>(null);
  //Const
  const handleDraftEdit = (quizDraftId: string) => {
    console.log(`Start editing ${quizDraftId}`);
    navigate(EDIT_QUIZ_PAGE_PATH.replace(":id", quizDraftId));
  };

  const handleCreateQuizClick = () => {
    if (user == null) {
      loginModal.current?.open();
    } else {
      navigate(CREATE_QUIZ_PAGE_PATH);
    }
  };

  const handleSignInClick = () => {
    navigate(AUTH_PAGE_PATH);
  };

  const loginToCreateQuizzes =
    "Only logged in users can create Quizzes. Please login.";
  //
  return (
    <>
      <Dialog
        title="Login"
        labelCancel="I will login later"
        labelConfirm="Login"
        ref={loginModal}
        onConfirm={() => {
          navigate(AUTH_PAGE_PATH);
        }}
      >
        <div>{loginToCreateQuizzes}</div>
      </Dialog>
      <PageHeader title="Brain Box"></PageHeader>
      <main className="page-content">
        <WelcomeUser
          onCreateQuizClick={handleCreateQuizClick}
          onSignInClick={handleSignInClick}
        />

        <QuizList />

        {user !== null && (
          <div className="controls-container-h">
            <button
              className="btn btn-secondary"
              onClick={handleCreateQuizClick}
            >
              Create a Quiz
            </button>
          </div>
        )}

        <QuizDraftsList onEdit={handleDraftEdit} />

        {claims?.admin == true && (
          <>
            <SubmittedQuizDrafts />
          </>
        )}
        {claims?.superAdmin == true && (
          <>
            <p>You are a Super Admin!!!</p>
          </>
        )}
      </main>

      <footer className="page-footer">
        <NavLink to={ABOUT_PAGE_PATH} >About this app</NavLink>
      </footer>
    </>
  );
};

export default HomePage;

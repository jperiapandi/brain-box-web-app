import type React from "react";
import PageHeader from "../../components/headers/PageHeader";

import QuizDraftsList from "../../components/QuizDraftsList";
import { useContext, useRef, type MouseEventHandler } from "react";
import { UserContext } from "../../contexts/UserContext";
import { useNavigate } from "react-router";
import {
  AUTH_PAGE_PATH,
  CREATE_QUIZ_PAGE_PATH,
  EDIT_QUIZ_PAGE_PATH,
} from "../router";
import LoginDialog, { type ModalRef } from "../../components/LoginDialog";
import WelcomeUser from "../../components/WelcomeUser";
import { ClaimsContext } from "../../contexts/ClaimsContext";
import SubmittedQuizDrafts from "../../components/SubmittedQuizDrafts";
import QuizList from "../../components/QuizList";
import QuizzesProvider from "../../components/QuizzesProvider";

const HomePage: React.FunctionComponent = () => {
  //Hooks
  const user = useContext(UserContext);
  const claims = useContext(ClaimsContext);

  const navigate = useNavigate();
  //States
  const loginModal = useRef<ModalRef>(null);
  //Const
  const handleDraftEdit = (quizDraftId: string) => {
    console.log(`Start editing ${quizDraftId}`);
    navigate(EDIT_QUIZ_PAGE_PATH.replace(":id", quizDraftId));
  };

  const handleCreateQuizClick = () => {
    if (user == null) {
      loginModal.current?.openModal();
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
      <PageHeader title="Brain Box"></PageHeader>
      <main className="page-content">
        <LoginDialog
          ref={loginModal}
          message={loginToCreateQuizzes}
          onLoginClick={() => {
            navigate(AUTH_PAGE_PATH);
          }}
        ></LoginDialog>

        <WelcomeUser
          onCreateQuizClick={handleCreateQuizClick}
          onSignInClick={handleSignInClick}
        />

        <QuizzesProvider>
          <QuizList />
        </QuizzesProvider>

        {user !== null && (
          <div className="controls-container-h">
            <button className="btn btn-secondary" onClick={handleCreateQuizClick}>Create a Quiz</button>
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

      <footer className="page-footer"></footer>
    </>
  );
};

export default HomePage;

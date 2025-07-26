import type React from "react";
import PageHeader from "../../components/headers/PageHeader";

import QuizDraftsList from "../../components/QuizDraftsList";
import { useContext, useRef, type MouseEventHandler } from "react";
import { UserContext } from "../../contexts/UserContext";
import { useNavigate } from "react-router";
import { AUTH_PAGE_PATH, CREATE_QUIZ_PAGE_PATH } from "../router";
import LoginDialog, { type ModalRef } from "../../components/LoginDialog";
import WelcomeUser from "../../components/WelcomeUser";

const HomePage: React.FunctionComponent = () => {
  //Hooks
  const user = useContext(UserContext);
  const navigate = useNavigate();
  //States
  const loginModal = useRef<ModalRef>(null);
  //Const
  const handleDraftEdit = (quizDraftId: string) => {
    console.log(`Start editing ${quizDraftId}`);
  };

  const handleCreateQuizClick: MouseEventHandler = (evt) => {
    evt.stopPropagation();
    if (user == null) {
      loginModal.current?.openModal();
    } else {
      navigate(CREATE_QUIZ_PAGE_PATH);
    }
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

        <WelcomeUser />
        <QuizDraftsList onEdit={handleDraftEdit} />
      </main>

      <footer className="page-footer">
        <div>
          <button onClick={handleCreateQuizClick} className="btn btn-primary">
            Create a Quiz
          </button>
        </div>
      </footer>
    </>
  );
};

export default HomePage;

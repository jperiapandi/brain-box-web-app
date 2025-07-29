import type React from "react";
import PageHeader from "../../components/headers/PageHeader";

import { useContext, useEffect, useRef, useState } from "react";

import { UserContext } from "../../contexts/UserContext";

import Toast, { type ToastRef } from "../../components/Toast";
import QuizDraftForm from "../../components/QuizDraftForm";
import { type QuizDraft } from "../../types/quizDraft";
import { useNavigate } from "react-router";

const CreateQuizPage: React.FunctionComponent = () => {
  const navigate = useNavigate();

  const user = useContext(UserContext);
  const [draft, setDraft] = useState<QuizDraft | null>(null);
  const toastRef = useRef<ToastRef>(null);

  useEffect(() => {
    if (user != null) {
      setDraft({
        title: "",
        desc: "",
        questions: [],
        author: user.displayName ?? "UNKNOWN",
        author_uid: user.uid,
        isAnonymous: user.isAnonymous,
        status: "new",
      });
    }
  }, [user]);

  const handleCancelClick = () => {
    navigate(-1);
  };

  const handleSaveSuccess = () => {
    toastRef.current?.showToast("Quiz saved successfully.");
  };
  const handleSubmitSuccess = () => {
    toastRef.current?.showToast("Quiz submitted successfully.");
  };

  const handleErrors = (error: Error) => {
    toastRef.current?.showToast(`Save failed. ${error.message}`);
  };
  return (
    <>
      <PageHeader title="New Quiz" navBack={true}></PageHeader>
      <Toast ref={toastRef} />
      <main className="page-content">
        {draft != null ? (
          <QuizDraftForm
            draft={draft}
            onSaveSuccess={handleSaveSuccess}
            onSubmitSuccess={handleSubmitSuccess}
            onSaveFail={handleErrors}
            onSubmitFail={handleErrors}
            onCancel={handleCancelClick}
          />
        ) : (
          <>
            <div>Please wait</div>
          </>
        )}
      </main>
    </>
  );
};

export default CreateQuizPage;

import type React from "react";
import PageHeader from "../../components/headers/PageHeader";
import QuizDraftForm from "../../components/QuizDraftForm";
import { useContext, useEffect, useRef, useState } from "react";
import { type QuizDraft } from "../../types/quizDraft";
import { UserContext } from "../../contexts/UserContext";
import {
  doc,
  DocumentReference,
  getDoc,
  getFirestore,
  type DocumentData,
} from "firebase/firestore";
import { useNavigate, useParams } from "react-router";
import type { ToastRef } from "../../components/Toast";
import Toast from "../../components/Toast";

const EditQuizPage: React.FunctionComponent = () => {
  const docId = useParams().id;
  const user = useContext(UserContext);
  const navigate = useNavigate();
  const toastRef = useRef<ToastRef>(null);

  const [quizDraft, setQuizDraft] = useState<QuizDraft>();
  const [loading, setLoading] = useState(true);
  const [failure, setFailure] = useState(false);
  const [success, setSuccess] = useState(false);

  let docRef: DocumentReference<DocumentData, DocumentData>;

  useEffect(() => {
    setLoading(true);
    setSuccess(false);
    setFailure(false);

    if (user != null) {
      //Load Quiz from Firestore
      //TODO; Ensure this user is allowed to load this doc form Firestore
      docRef = doc(getFirestore(), `quiz-drafts/${docId}`);

      //Load data from Firestore
      getDoc(docRef)
        .then((docSnapshot) => {
          if (docSnapshot.exists()) {
            //Success
            setLoading(false);
            setSuccess(true);
            setFailure(false);
            const data = docSnapshot.data() as QuizDraft;
            setQuizDraft(data);
          } else {
            setLoading(false);
            setSuccess(false);
            setFailure(true);
          }
        })
        .catch((err) => {
          console.error(err);
          setLoading(true);
          setSuccess(false);
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
    // toastRef.current?.showToast("Quiz submitted successfully.");
    navigate(-1);
  };

  const handleErrors = (error: Error) => {
    toastRef.current?.showToast(`Save failed. ${error.message}`);
  };

  return (
    <>
      <PageHeader title="Edit Quiz" navBack={true} />
      <Toast ref={toastRef} />
      <main className="page-content">
        {success && quizDraft != null ? (
          <>
            <QuizDraftForm
              draft={quizDraft}
              docId={docId}
              onCancel={handleCancelClick}
              onSaveSuccess={handleSaveSuccess}
              onSubmitSuccess={handleSubmitSuccess}
              onSaveFail={handleErrors}
              onSubmitFail={handleErrors}
            />
          </>
        ) : (
          <>
            {loading && <div>Loading ... please wait.</div>}
            {failure && <div>Sorry something went wrong.</div>}
            {success && <div>Data loaded Success</div>}
          </>
        )}
      </main>
    </>
  );
};

export default EditQuizPage;

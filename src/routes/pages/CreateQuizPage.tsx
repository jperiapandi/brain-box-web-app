import type React from "react";
import PageHeader from "../../components/headers/PageHeader";
import FormField from "../../components/FormField";
import {
  useContext,
  useReducer,
  useState,
  type MouseEventHandler,
} from "react";
import QuestionEditor from "../../components/QuestionEditor";
import questionListReducer, {
  CREATE_QUESTION,
  REMOVE_QUESTION,
  UPDATE_QUESTION,
} from "../../reducers/questionListReducer";
import { Q_TYPE_UNKNOWN } from "../../types/questionTypes";
import {
  addDoc,
  collection,
  DocumentReference,
  getFirestore,
  serverTimestamp,
  setDoc,
  type DocumentData,
} from "firebase/firestore";
import { UserContext } from "../../contexts/UserContext";

const CreateQuizPage: React.FunctionComponent = () => {
  const user = useContext(UserContext);
  const [questions, dispatch] = useReducer(questionListReducer, []);
  const [quizTitle, setQuizTitle] = useState("");
  const [quizDesc, setQuizDesc] = useState("");

  const [docRef, setDocRef] =
    useState<DocumentReference<DocumentData, DocumentData>>(); // Firestore Doc Ref to the Quiz

  const onAddNewQuestionClick: MouseEventHandler = (evt) => {
    evt.stopPropagation();
    dispatch({
      type: CREATE_QUESTION,
    });
  };

  const onRemoveClick = (id: string) => {
    dispatch({
      type: REMOVE_QUESTION,
      id,
    });
  };

  const handleSaveClick: MouseEventHandler<HTMLButtonElement> = async (evt) => {
    evt.stopPropagation();
    if (user == null) {
      return;
    }
    //Validate the data.
    //Submit the data to Firebase
    const hasValidTitle = quizTitle.trim() != "";
    const hasValidDesc = quizDesc.trim() != "";

    if (!hasValidTitle) {
      throw new Error(`Title is required.`);
    }
    if (!hasValidDesc) {
      throw new Error(`Desc is required.`);
    }

    if (questions.length == 0) {
      throw new Error(`Add some questions to the Quiz.`);
    }

    const invalidQuestions = questions.filter((q) => {
      const hasQType = q.type != Q_TYPE_UNKNOWN;
      const hasQText = q.questionText.trim() != "";

      const correctAnswers = q.answersMap[q.type].filter((ans) => ans.checked);
      const someAnswersSet = correctAnswers.length != 0;

      if (hasQType && hasQText && someAnswersSet) {
        //Valid Question
        return false;
      } else {
        //Invalid Question
        return true;
      }
    });

    const allQACorrect = invalidQuestions.length == 0;

    if (hasValidTitle && hasValidDesc && allQACorrect) {
      const quizDoc: any = {
        title: quizTitle,
        desc: quizDesc,
        author: user.displayName,
        questions: questions,
        author_uid: user.uid,
        isAnonymous: user.isAnonymous,
      };

      if (!docRef) {
        //Firestore document is not yet created. So, create a new Doc in Firestore
        //
        quizDoc.createdAt = serverTimestamp();
        quizDoc.updatedAt = serverTimestamp();
        //
        const nDocRef = await addDoc(
          collection(getFirestore(), "quiz-drafts"),
          quizDoc
        );
        console.log(`New Quiz is created in Firestore. `, nDocRef, nDocRef.id);
        setDocRef(nDocRef);
      } else {
        //Update the existing document
        quizDoc.updatedAt = serverTimestamp();
        await setDoc(docRef, quizDoc, { merge: true });
        console.log(`Existing Quiz is updated.`);
      }
    } else {
      throw new Error(`Quiz Form has some errors. Please fix them.`);
    }
  };

  return (
    <>
      <PageHeader title="New Quiz" navBack={true}></PageHeader>

      <main className="page-content">
        <div className="create-quiz-form">
          <div>
            <div>
              <span>Author:</span> <span>Periapandi J</span>
            </div>
          </div>

          <FormField
            type="input"
            label="Quiz Title"
            id="quiz-title"
            value={quizTitle}
            placeHolder="Quiz Title"
            onChange={(v) => {
              setQuizTitle(v);
            }}
          ></FormField>
          <FormField
            type="textarea"
            label="Description"
            id="quiz-desc"
            value={quizDesc}
            placeHolder="Describe this quiz."
            onChange={(v) => {
              setQuizDesc(v);
            }}
          ></FormField>

          <section className="questions">
            <div>
              {questions.length == 0 ? (
                <p>
                  There are no questions added yet. Please add questions to the
                  quiz.
                </p>
              ) : (
                <h2>Questions</h2>
              )}
            </div>

            <div className="questions-panel">
              {questions.map((q, idx) => {
                return (
                  <QuestionEditor
                    key={q.id}
                    sn={idx + 1}
                    question={q}
                    onChange={(v) => {
                      dispatch({
                        type: UPDATE_QUESTION,
                        id: v.id,
                        question: v,
                      });
                    }}
                    onRemove={onRemoveClick}
                  />
                );
              })}
            </div>

            <div style={{ padding: "1rem 0rem" }}>
              <button
                onClick={onAddNewQuestionClick}
                className="btn btn-primary"
              >
                <span className="material-symbols-rounded">add</span>
                <span>Add a Question</span>
              </button>
            </div>
          </section>
          <button className="btn btn-primary" onClick={handleSaveClick}>
            Save
          </button>
          <button className="btn btn-secondary">Submit</button>
        </div>
      </main>
    </>
  );
};

export default CreateQuizPage;

import {
  useReducer,
  useRef,
  useState,
  type MouseEventHandler,
  type PropsWithChildren,
} from "react";
import type React from "react";
import { QUIZ_STATUS_DRAFT, type QuizDraft } from "../types/quizDraft";
import FormField from "./FormField";
import QuestionEditor from "./QuestionEditor";
import quizDraftReducer, {
  DRAFT_ADD_QUESTION,
  DRAFT_CHANGE_DESC,
  DRAFT_CHANGE_STATUS,
  DRAFT_CHANGE_TITLE,
  DRAFT_REMOVE_QUESTION,
  DRAFT_UPDATE_QUESTION,
} from "../reducers/quizDraftReducer";
import {
  createDefaultQuestion,
  type QuestionModel,
} from "../types/questionTypes";
import {
  saveQuizDraft,
  submitQuizDraft,
  updateQuizDraft,
} from "../services/quizDraftServices";
import Dialog, { type DialogRef } from "./Dialog";
import { deleteDoc, doc, getFirestore } from "firebase/firestore";
import { COLXN_QUIZ_DRAFTS } from "../types/constants";
import { useNavigate } from "react-router";

type QuizDraftFormProps = PropsWithChildren & {
  draft: QuizDraft;
  docId?: string;
  onSaveSuccess?: () => void;
  onSaveFail?: (error: Error) => void;
  onSubmitSuccess?: () => void;
  onSubmitFail?: (error: Error) => void;
  onCancel?: () => void;
};

const QuizDraftForm: React.FunctionComponent<QuizDraftFormProps> = ({
  draft,
  docId,
  onSaveSuccess,
  onSubmitSuccess,
  onSaveFail,
  onSubmitFail,
  onCancel,
}) => {
  const navigate = useNavigate();
  const [updatedDraft, dispatch] = useReducer(quizDraftReducer, draft);
  const [curDocId, setCurDocId] = useState(docId);

  const [dirty, setDirty] = useState(false);
  const deleteDialog = useRef<DialogRef>(null);

  const handleTitleChange = (v: string) => {
    dispatch({
      type: DRAFT_CHANGE_TITLE,
      dataToUpdate: {
        title: v,
      },
    });

    setDirty(true);
  };
  const handleDescChange = (v: string) => {
    dispatch({
      type: DRAFT_CHANGE_DESC,
      dataToUpdate: {
        desc: v,
      },
    });
    setDirty(true);
  };
  const handleQuestionChange = (v: QuestionModel) => {
    dispatch({
      type: DRAFT_UPDATE_QUESTION,
      dataToUpdate: { question: v },
    });
    setDirty(true);
  };

  const handleQuestionRemove = (questionId: string) => {
    dispatch({
      type: DRAFT_REMOVE_QUESTION,
      dataToUpdate: {
        questionId,
      },
    });
    setDirty(true);
  };

  const handleQuestionAdd: MouseEventHandler = (evt) => {
    evt.stopPropagation();
    //
    dispatch({
      type: DRAFT_ADD_QUESTION,
      dataToUpdate: {
        question: createDefaultQuestion(),
      },
    });
    setDirty(true);
  };

  const handleSaveClick: MouseEventHandler<HTMLButtonElement> = async (evt) => {
    evt.stopPropagation();

    try {
      if (updatedDraft.status == "new") {
        const id = await saveQuizDraft(updatedDraft);
        console.log(`SAVE SUCCESS !!!`, id);
        setCurDocId(id);
        setDirty(false);
        onSaveSuccess?.();
        dispatch({
          type: DRAFT_CHANGE_STATUS,
          dataToUpdate: {
            status: QUIZ_STATUS_DRAFT,
          },
        });
      } else if (updatedDraft.status == QUIZ_STATUS_DRAFT) {
        if (curDocId === "" || curDocId == undefined || curDocId == null) {
          throw new Error("docId is missing. Can not update this in DB.");
        }
        await updateQuizDraft(curDocId, updatedDraft);
        console.log(`UPDATE SUCCESS !!!`, curDocId);
        setDirty(false);
        onSaveSuccess?.();
      }
    } catch (err) {
      onSaveFail?.(err as Error);
    }
  };

  const handleSubmitClick: MouseEventHandler<HTMLButtonElement> = async (
    evt
  ) => {
    evt.stopPropagation();
    try {
      if (curDocId === "" || curDocId == undefined || curDocId == null) {
        throw new Error("docId is missing. Can not update this in DB.");
      }
      console.log(`----SUBMIT Quiz to Firestore----`);
      await submitQuizDraft(curDocId, dirty, updatedDraft);
      setDirty(false);
      onSubmitSuccess?.();
    } catch (error) {
      onSubmitFail?.(error as Error);
    }
  };
  const handleCancelClick: MouseEventHandler<HTMLButtonElement> = (evt) => {
    evt.stopPropagation();
    setDirty(false);
    onCancel?.();
  };

  const handleDeleteQuizClick: MouseEventHandler<HTMLButtonElement> = (evt) => {
    evt.stopPropagation();

    deleteDialog?.current?.open();
  };

  const deleteDraft = async () => {
    if (curDocId) {
      await deleteDoc(doc(getFirestore(), COLXN_QUIZ_DRAFTS, curDocId));
      console.log(`Quiz Draft ${curDocId} is deleted.`);
      navigate(-1);
    }
  };
  const saveDisabled = dirty === false;

  return (
    <>
      <Dialog
        title="Are you sure?"
        labelCancel="No"
        labelConfirm="Yes"
        ref={deleteDialog}
        onConfirm={deleteDraft}
      >
        <div>Do you really want to delete this Quiz?</div>
      </Dialog>

      <div className="quiz-edit-form">
        <div>
          <div>
            <span>Author:</span> <span>{updatedDraft.author}</span>
          </div>
        </div>

        <FormField
          type="input"
          label="Quiz Title"
          id="quiz-title"
          value={updatedDraft.title}
          placeHolder="Quiz Title"
          onChange={handleTitleChange}
        ></FormField>
        <FormField
          type="textarea"
          label="Description"
          id="quiz-desc"
          value={updatedDraft.desc}
          placeHolder="Describe this quiz."
          onChange={handleDescChange}
        ></FormField>

        <section className="questions">
          <div>
            {updatedDraft.questions.length == 0 ? (
              <p>
                There are no questions added yet. Please add questions to the
                quiz.
              </p>
            ) : (
              <h2>Questions</h2>
            )}
          </div>

          <div className="questions-panel">
            {updatedDraft.questions.map((q, idx) => {
              return (
                <QuestionEditor
                  key={q.id}
                  sn={idx + 1}
                  question={q}
                  onChange={handleQuestionChange}
                  onRemove={handleQuestionRemove}
                />
              );
            })}
          </div>

          <div className="controls-container-h-c">
            {updatedDraft.status != "new" && (
              <button
                className="btn btn-danger"
                onClick={handleDeleteQuizClick}
              >
                <span className="material-symbols-rounded">delete</span>
                <span>Delete this Quiz Draft</span>
              </button>
            )}

            <button onClick={handleQuestionAdd} className="btn btn-primary">
              <span className="material-symbols-rounded">add</span>
              <span>Add a Question</span>
            </button>
          </div>
        </section>

        <footer>
          <button className="btn" onClick={handleCancelClick}>
            Cancel
          </button>
          {curDocId == null ||
          curDocId == undefined ||
          curDocId === "" ? null : (
            <button className="btn btn-secondary" onClick={handleSubmitClick}>
              Submit
            </button>
          )}

          <button
            className="btn btn-primary"
            onClick={handleSaveClick}
            disabled={saveDisabled}
          >
            {updatedDraft.status === "new" ? "Save" : "Update"}
          </button>
        </footer>
      </div>
    </>
  );
};

export default QuizDraftForm;

import type React from "react";
import PageHeader from "../../components/headers/PageHeader";
import FormField from "../../components/FormField";
import { useReducer, useState, type MouseEventHandler } from "react";
import QuestionEditor from "../../components/QuestionEditor";
import questionListReducer, {
  CREATE_QUESTION,
  REMOVE_QUESTION,
  UPDATE_QUESTION,
} from "../../reducers/questionListReducer";

const CreateQuizPage: React.FunctionComponent = () => {
  const [questions, dispatch] = useReducer(questionListReducer, []);
  const [quizTitle, setQuizTitle] = useState("");
  const [quizDesc, setQuizDesc] = useState("");

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
              <button onClick={onAddNewQuestionClick}>
                <span className="material-symbols-rounded">add</span>
                <span>Add a Question</span>
              </button>
            </div>
          </section>
          <button>Submit</button>
        </div>
      </main>
    </>
  );
};

export default CreateQuizPage;

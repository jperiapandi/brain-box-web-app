import type React from "react";
import PageHeader from "../../components/headers/PageHeader";
import FormField from "../../components/FormField";
import { useReducer, type MouseEventHandler } from "react";
import QuestionEditor from "../../components/QuestionEditor";
import questionsReducer, {
  ADD_QUESTION,
  REMOVE_QUESTION,
} from "../../reducers/QuestionsReducer";

import { v4 as uuidV4 } from "uuid";

const CreateQuizPage: React.FunctionComponent = () => {
  const [questions, dispatch] = useReducer(questionsReducer, []);

  const onAddNewQuestionClick: MouseEventHandler = (evt) => {
    evt.stopPropagation();
    dispatch({
      type: ADD_QUESTION,
      question: {
        id: uuidV4(),
        questionText: "",
        type: "",
        answers: [],
      },
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
        <form
          className="create-quiz-form"
          onSubmit={(evt) => {
            evt.preventDefault();
          }}
        >
          <div>
            <div>
              <span>Author:</span> <span>Periapandi J</span>
            </div>
          </div>

          <FormField
            type="input"
            label="Quiz Title"
            id="quiz-title"
            value=""
            placeHolder="Quiz Title"
          ></FormField>
          <FormField
            type="textarea"
            label="Description"
            id="quiz-desc"
            value=""
            placeHolder="Describe this quiz."
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
                    onOkay={() => {}}
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
          <button type="submit">Submit</button>
        </form>
      </main>
    </>
  );
};

export default CreateQuizPage;

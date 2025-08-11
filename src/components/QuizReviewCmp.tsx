import { useState, type PropsWithChildren } from "react";
import type { EvaluateQuizResponse } from "../types/quiz";
import { Q_TYPE_CHOOSE_MULTIPLE } from "../types/questionTypes";

type QuizReviewCmpProps = PropsWithChildren & {
  data: EvaluateQuizResponse;
};
const QuizReviewCmp: React.FunctionComponent<QuizReviewCmpProps> = ({
  data,
}) => {
  //Question index
  const [index, setIndex] = useState(0);

  const curQuestion = data.questionsEvaluated[index];

  // curQuestion.questionText
  const handleNextClick = () => {
    if (index < data.questionsEvaluated.length - 1) {
      setIndex((i) => i + 1);
    }
  };
  const handlePrevClick = () => {
    if (index > 0) {
      setIndex((i) => i - 1);
    }
  };

  return (
    <div className="quiz-runner quiz-review-cmp">
      <div className="question-body">
        <div className="question-n-answers" id={curQuestion.id}>
          <h3>{`${index + 1}. ${curQuestion.questionText}`}</h3>
          <ul className="answers-list">
            {curQuestion.evaluatedOptions.map((ans, i) => {
              let liClassName = "";
              if (ans.correct) {
                liClassName = "correct";
              } else {
                liClassName = "wrong";
              }

              if (ans.userChecked) {
                liClassName += " user-checked";
              }

              const groupKey = `radio-grp-${curQuestion.id}`;
              const fieldKey = `radio-grp-ans-${i}-${curQuestion.id}`;
              let formELm = (
                <>
                  <input
                    type="radio"
                    name={groupKey}
                    id={fieldKey}
                    checked={ans.userChecked}
                    disabled
                  ></input>
                  <label htmlFor={fieldKey}>{ans.label}</label>
                  {ans.correct && ans.userChecked && (
                    <span className="material-symbols-rounded">
                      check_small
                    </span>
                  )}
                  {!ans.correct && ans.userChecked && (
                    <span className="material-symbols-rounded">
                      close_small
                    </span>
                  )}
                </>
              );
              if (curQuestion.type == Q_TYPE_CHOOSE_MULTIPLE) {
                formELm = (
                  <>
                    <input
                      type="checkbox"
                      id={fieldKey}
                      checked={ans.userChecked}
                      disabled
                    ></input>
                    <label htmlFor={fieldKey}>{ans.label}</label>
                    {ans.correct && ans.userChecked && (
                      <span className="material-symbols-rounded">
                        check_small
                      </span>
                    )}
                    {!ans.correct && ans.userChecked && (
                      <span className="material-symbols-rounded">
                        close_small
                      </span>
                    )}
                  </>
                );
              }
              return (
                <li key={`answer-${i}`} className={liClassName}>
                  {formELm}
                </li>
              );
            })}
          </ul>
        </div>

        <div className="nav-control">
          <button
            className="icon-btn"
            onClick={handlePrevClick}
            disabled={index == 0}
          >
            <span className="material-symbols-rounded">arrow_back_ios</span>
          </button>
          <div>
            {index + 1} of {data.questionsEvaluated.length} questions
          </div>
          <button
            className="icon-btn"
            onClick={handleNextClick}
            disabled={index == data.questionsEvaluated.length - 1}
          >
            <span className="material-symbols-rounded">arrow_forward_ios</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuizReviewCmp;

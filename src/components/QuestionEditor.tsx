import { useReducer, type PropsWithChildren } from "react";
import type React from "react";
import {
  Q_TYPE_UNKNOWN,
  SupportedQuestionTypes,
  type QuestionModel,
} from "../types/questionTypes";
import FormField from "./FormField";

import questionReducer, {
  CHANGE_Q_TEXT,
  CHANGE_Q_TYPE,
} from "../reducers/questionReducer";

import AnswerList from "./AnswerList";

type QuestionEditorProps = PropsWithChildren & {
  sn: number;
  question: QuestionModel;
  onChange: (v: QuestionModel) => void;
  onRemove: (id: string) => void;
};

const QuestionEditor: React.FunctionComponent<QuestionEditorProps> = ({
  sn,
  question,
  onRemove,
}) => {
  const [curQuestion, dispatch] = useReducer(questionReducer, question);

  const hasQuestionType = curQuestion.type != Q_TYPE_UNKNOWN;
  const answers = curQuestion.answersMap[curQuestion.type];

  const handleQTypeChange = (v: string) => {
    dispatch({
      type: CHANGE_Q_TYPE,
      questionType: v,
    });
  };

  const handleQTextChange = (v: string) => {
    dispatch({
      type: CHANGE_Q_TEXT,
      questionText: v,
    });
  };

  return (
    <div className="question-editor">
      <div className="header">
        <div className="sn">{sn}</div>
        <button
          onClick={(evt) => {
            evt.stopPropagation();
            onRemove(curQuestion.id);
          }}
          className="close-btn"
        >
          <span className="material-symbols-rounded">close</span>
        </button>
      </div>

      <FormField
        type="select"
        options={SupportedQuestionTypes}
        label="Question Type"
        value={curQuestion.type}
        onChange={handleQTypeChange}
        id={`q-type-${curQuestion.id}`}
      />

      <FormField
        type="input"
        label="Question"
        id={`q-text-${curQuestion.id}`}
        value={curQuestion.questionText}
        onChange={handleQTextChange}
        placeHolder="Write the question text here."
      />

      {hasQuestionType ? (
        <div className="answers-container">
          <AnswerList
            qId={curQuestion.id}
            answers={answers}
            qType={curQuestion.type}
            onChange={() => {
              console.log(`TODO -- Handle AnswersList Change!`);
            }}
          ></AnswerList>
        </div>
      ) : (
        <p>Choose a question type!</p>
      )}
    </div>
  );
};

export default QuestionEditor;

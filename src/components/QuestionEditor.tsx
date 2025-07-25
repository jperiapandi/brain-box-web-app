import {
  useEffect,
  useReducer,
  useState,
  type JSX,
  type PropsWithChildren,
} from "react";
import type React from "react";
import {
  Q_TYPE_UNKNOWN,
  SupportedQuestionTypes,
  type QuestionModel,
} from "../types/questionTypes";
import FormField from "./FormField";

import questionReducer, {
  CHANGE_ANS_CHECKED,
  CHANGE_ANS_TEXT,
  CHANGE_Q_TEXT,
  CHANGE_Q_TYPE,
} from "../reducers/questionReducer";

import AnswerList from "./AnswerList";
import useDebounce from "../hooks/useDebounce";

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
  onChange
}) => {
  const [curQuestion, dispatch] = useReducer(questionReducer, question);

  //Update Question after a delay
  const [qText, setQText] = useState(curQuestion.questionText);
  const debouncedQText = useDebounce(qText, 1000);
  useEffect(() => {
    dispatch({
      type: CHANGE_Q_TEXT,
      questionText: debouncedQText,
    });
  }, [debouncedQText]);

  useEffect(() => {
    onChange(curQuestion);
  }, [curQuestion]);

  const hasQuestionType = curQuestion.type != Q_TYPE_UNKNOWN;
  const answers = curQuestion.answersMap[curQuestion.type];
  const selectedAnswers = answers.filter((ans) => ans.checked);

  const handleQTypeChange = (v: string) => {
    dispatch({
      type: CHANGE_Q_TYPE,
      questionType: v,
    });
  };

  return (
    <div className="question-editor">
      <div className="header">
        <div className="sn">{sn}</div>
        <FormField
          type="select"
          options={SupportedQuestionTypes}
          label="Question Type"
          value={curQuestion.type}
          onChange={handleQTypeChange}
          id={`q-type-${curQuestion.id}`}
        />
        <div className="h-space" />
        <button
          onClick={(evt) => {
            evt.stopPropagation();
            onRemove(curQuestion.id);
          }}
          className="close-btn"
        >
          <span className="material-symbols-rounded">delete</span>
        </button>
      </div>

      <FormField
        type="input"
        label="Question"
        id={`q-text-${curQuestion.id}`}
        value={qText}
        onChange={(v: string) => {
          setQText(v);
        }}
        placeHolder="Write the question text here."
      />

      {hasQuestionType ? (
        <>
          <div className="answers-container">
            <AnswerList
              qId={curQuestion.id}
              answers={answers}
              qType={curQuestion.type}
              onTextChange={(ansId, ansText) => {
                dispatch({
                  type: CHANGE_ANS_TEXT,
                  ansId,
                  ansText,
                });
              }}
              onCheckedChange={(ansId, checked) => {
                dispatch({
                  type: CHANGE_ANS_CHECKED,
                  ansId,
                  checked,
                });
              }}
            ></AnswerList>
          </div>

          <div className="selected-answers-container">
            {selectedAnswers.length == 0 ? (
              <div className="error">Please set answers to this question.</div>
            ) : (
              <>
                <h3>Answer(s)</h3>
                <div className="selected-answers-list">
                  {answers.map((ans) => {
                    if (ans.checked) {
                      return <div key={ans.id}>{ans.value}</div>;
                    }
                  })}
                </div>
              </>
            )}
          </div>
        </>
      ) : (
        <div className="error">Choose a question type!</div>
      )}
    </div>
  );
};

export default QuestionEditor;

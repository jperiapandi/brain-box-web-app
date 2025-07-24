import { useState, type PropsWithChildren } from "react";
import type React from "react";
import {
  Q_TYPE_CHOOSE_MULTIPLE,
  Q_TYPE_CHOOSE_ONE,
  Q_TYPE_TRUE_FALSE,
  Q_TYPE_YES_OR_NO,
  SupportedQuestionTypes,
  type Answer,
  type QuestionModel,
} from "../types/questionTypes";
import FormField from "./FormField";
import EditText from "./EditText";

type QuestionProps = PropsWithChildren & {
  sn: number;
  question: QuestionModel;
  onChange: (v: QuestionModel) => void;
  onRemove: (id: string) => void;
};

const QuestionEditor: React.FunctionComponent<QuestionProps> = ({
  sn,
  question,
  onRemove,
}) => {
  const [qText, setQText] = useState(question.questionText);
  const [qType, setQType] = useState(question.type);

  const [yesOrNoAnswers] = useState<Answer[]>([
    {
      value: "Yes",
      correct: true,
    },
    {
      value: "No",
      correct: false,
    },
  ]);

  const [trueOrFalseAnswers] = useState<Answer[]>([
    {
      value: "True",
      correct: true,
    },
    {
      value: "False",
      correct: false,
    },
  ]);

  const [singleChoiceAnswers] = useState<Answer[]>([
    {
      value: "Option 1",
      correct: true,
    },
    {
      value: "Option 2",
      correct: false,
    },
    {
      value: "Option 3",
      correct: false,
    },
    {
      value: "Option 4",
      correct: false,
    },
  ]);

  const [multiChoiceAnswers] = useState<Answer[]>([
    {
      value: "Answer 1",
      correct: true,
    },
    {
      value: "Answer 2",
      correct: true,
    },
    {
      value: "Answer 3",
      correct: false,
    },
    {
      value: "Answer 4",
      correct: false,
    },
  ]);

  const [answers, setAnswers] = useState<Answer[]>(question.answers);
  const hasQuestionType = qType != "";

  const handleQTypeChange = (v: string) => {
    console.log(`QType CHange Handler ${v}`);

    setQType(v);
    switch (v) {
      case Q_TYPE_TRUE_FALSE:
        setAnswers(trueOrFalseAnswers);
        break;
      case Q_TYPE_YES_OR_NO:
        setAnswers(yesOrNoAnswers);
        break;
      case Q_TYPE_CHOOSE_ONE:
        setAnswers(singleChoiceAnswers);
        break;
      case Q_TYPE_CHOOSE_MULTIPLE:
        setAnswers(multiChoiceAnswers);
        break;
      default:
        throw new Error(`Unknown question type `);
    }
  };

  return (
    <div className="question-editor">
      <div className="header">
        <div className="sn">{sn}</div>
        <button
          onClick={(evt) => {
            evt.stopPropagation();
            onRemove(question.id);
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
        value={qType}
        onChange={handleQTypeChange}
        id={`q-type-${question.id}`}
      />

      <FormField
        type="input"
        label="Question"
        id={`q-text-${question.id}`}
        value={qText}
        onChange={(v) => {
          setQText(v);
        }}
        placeHolder="Write the question text here."
      />

      {hasQuestionType ? (
        <div className="answers-container">
          <AnswersList
            qId={question.id}
            answers={answers}
            qType={qType}
          ></AnswersList>
        </div>
      ) : (
        <p>Choose a question type!</p>
      )}
    </div>
  );
};

type AnswersListProps = PropsWithChildren & {
  qId: string;
  qType: string;
  answers: Answer[];
};

const AnswersList: React.FunctionComponent<AnswersListProps> = ({
  qId,
  qType,
  answers,
}) => {
  switch (qType) {
    case Q_TYPE_TRUE_FALSE:
    case Q_TYPE_YES_OR_NO:
    case Q_TYPE_CHOOSE_ONE:
      //Return a Radio Group
      return (
        <>
          {answers.map((ans, i) => {
            const key = `ans-${i}-${qId}`;
            return (
              <div className="answer-field" key={key} id={key}>
                <input
                  type="radio"
                  name={`answers-radio-group-${qId}`}
                  id={key}
                />
                <EditText
                  text={ans.value}
                  onChange={(v) => {
                    //New value received
                    console.log(`TODO: Updated value : ${v}`);
                  }}
                />
              </div>
            );
          })}
        </>
      );
      break;
    case Q_TYPE_CHOOSE_MULTIPLE:
      //Return a Check boxes list
      return (
        <>
          {answers.map((ans, i) => {
            const key = `ans-${i}-${qId}`;
            return (
              <div className="answer-field" key={key} id={key}>
                <input
                  type="checkbox"
                  name={`answers-radio-group-${qId}`}
                  id={key}
                />
                <EditText
                  text={ans.value}
                  onChange={(v) => {
                    console.log(`TODO: Updated value : ${v}`);
                  }}
                />
              </div>
            );
          })}
        </>
      );
      break;
  }
};

export default QuestionEditor;

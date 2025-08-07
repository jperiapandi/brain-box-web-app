import type { SelectOption } from "../components/FormField";
import { v4 as uuidv4 } from "uuid";

export type Answer = {
  id: string;
  value: string;
  checked: boolean;
};

export type QToAnswers = {
  questionId: string;
  correctAnswers: string[];
};

export type QuizAnswersDoc = {
  answers: QToAnswers[];
};

export type QuestionModel = {
  id: string;
  questionText: string;
  type: string;
  answersMap: { [key: string]: Answer[] };
};

export type QuestionQuizView = {
  id: string;
  questionText: string;
  type: string;
  availableAnswers: string[];
};

export type QuestionRunnerView = Omit<QuestionQuizView, "availableAnswers"> & {
  hasSomeSelectedAnswers: boolean;
  selectedAnswers: SelectedAnswerType[];
};

export type SelectedAnswerType = {
  id: number;
  answer: String;
  checked: boolean;
};

//Readonly question data to show in UI, not in forms
export type Question = {
  id: string;
  questionText: string;
  type: string;
  answers: Answer[];
};

export type QuestionReview = {
  id: string;
  questionText: string;
  type: string;
  answers: Answer[];
};

export const Q_TYPE_UNKNOWN = "unknown_question_type";
export const Q_TYPE_TRUE_FALSE = "true_false";
export const Q_TYPE_YES_OR_NO = "yes_no";
export const Q_TYPE_CHOOSE_ONE = "choose_one";
export const Q_TYPE_CHOOSE_MULTIPLE = "choose_multiple";

export const SupportedQuestionTypes: SelectOption[] = [
  {
    value: Q_TYPE_UNKNOWN,
    label: "",
  },
  {
    value: Q_TYPE_YES_OR_NO,
    label: "Yes or No",
  },
  {
    value: Q_TYPE_TRUE_FALSE,
    label: "True or False",
  },
  {
    value: Q_TYPE_CHOOSE_ONE,
    label: "Single Choice",
  },
  {
    value: Q_TYPE_CHOOSE_MULTIPLE,
    label: "Multiple Choice",
  },
];

export function getQuestionTypeLabel(qType: string): string {
  return (
    SupportedQuestionTypes.find((q) => {
      return q.value === qType;
    })?.label || ""
  );
}

export function createAnswer(value: string): Answer {
  return {
    id: uuidv4(),
    value,
    checked: false,
  };
}

export function createDefaultQuestion(): QuestionModel {
  const answersMap: { [key: string]: Answer[] } = {};

  SupportedQuestionTypes.forEach((qOption) => {
    let answers: Answer[];

    switch (qOption.value) {
      case Q_TYPE_TRUE_FALSE:
        answers = [createAnswer("True"), createAnswer("False")];
        break;
      case Q_TYPE_YES_OR_NO:
        answers = [createAnswer("Yes"), createAnswer("No")];
        break;
      case Q_TYPE_CHOOSE_ONE:
        answers = [
          createAnswer("Option 1"),
          createAnswer("Option 2"),
          createAnswer("Option 3"),
          createAnswer("Option 4"),
        ];
        break;
      case Q_TYPE_CHOOSE_MULTIPLE:
        answers = [
          createAnswer("Answer 1"),
          createAnswer("Answer 2"),
          createAnswer("Answer 3"),
          createAnswer("Answer 4"),
        ];
        break;
      default:
        answers = [];
        break;
    }

    answersMap[qOption.value] = answers;
  });

  return {
    id: uuidv4(),
    questionText: "What is your question?",
    type: Q_TYPE_UNKNOWN,
    answersMap,
  };
}

import { v4 as uuidV4 } from "uuid";
import type { SelectOption } from "../components/FormField";

export type Answer = {
  value: string;
  correct: boolean;
};

export type QuestionModel = {
  id: string;
  questionText: string;
  type: string;
  answers: Answer[];
};

export const Q_TYPE_TRUE_FALSE = "true_false";
export const Q_TYPE_YES_OR_NO = "yes_no";
export const Q_TYPE_CHOOSE_ONE = "choose_one";
export const Q_TYPE_CHOOSE_MULTIPLE = "choose_multiple";

export const SupportedQuestionTypes: SelectOption[] = [
  {
    value: "",
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

/*
export function TrueFalseQuestion(): QuestionModel {
  return {
    id: uuidV4(),
    questionText: "",
    type: Q_TYPE_TRUE_FALSE,
    answers: [
      {
        value: "True",
        correct: true,
      },
      {
        value: "False",
        correct: false,
      },
    ],
  };
}
  */

export interface Question1 {
  readonly qId: string;
  readonly questionText: string;
  readonly type: string;
  readonly answers: Answer[];
}

export class Question {
  readonly qId: string;
  private _questionText: string;
  private _type: string;
  private _answers: Answer[];

  constructor() {
    this.qId = uuidV4();
    this._questionText = "";
    this._type = "";
    this._answers = [];
  }

  updateType(nv: string) {}
}

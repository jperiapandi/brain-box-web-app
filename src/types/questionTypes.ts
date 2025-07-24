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

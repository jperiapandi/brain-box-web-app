import type { PropsWithChildren } from "react";
import type React from "react";
import {
  Q_TYPE_CHOOSE_MULTIPLE,
  Q_TYPE_CHOOSE_ONE,
  Q_TYPE_TRUE_FALSE,
  Q_TYPE_YES_OR_NO,
  type Answer,
} from "../types/questionTypes";

type AnswerReviewListProps = PropsWithChildren & {
  answers: Answer[];
  qType: string;
};
const AnswerReviewList: React.FunctionComponent<AnswerReviewListProps> = ({
  answers,
  qType,
}) => {
  let ansType = "radio";
  switch (qType) {
    case Q_TYPE_TRUE_FALSE:
    case Q_TYPE_YES_OR_NO:
    case Q_TYPE_CHOOSE_ONE:
      ansType = "radio";
      break;
    case Q_TYPE_CHOOSE_MULTIPLE:
      ansType = "checkbox";
      break;
  }

  return (
    <>
      {answers.map((ans) => {
        return (
          <div key={ans.id}>
            <input type={ansType} disabled={true} checked={ans.checked} />
            <label>{ans.value}</label>
          </div>
        );
      })}
    </>
  );
};

export default AnswerReviewList;

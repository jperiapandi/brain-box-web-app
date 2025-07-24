import { type PropsWithChildren } from "react";
import {
  Q_TYPE_CHOOSE_MULTIPLE,
  Q_TYPE_CHOOSE_ONE,
  Q_TYPE_TRUE_FALSE,
  Q_TYPE_YES_OR_NO,
  type Answer,
} from "../types/questionTypes";

import EditText from "./EditText";

type AnswerListProps = PropsWithChildren & {
  qId: string;
  qType: string;
  answers: Answer[];
  onTextChange: (ansId: string, ansTxt: string) => void;
  onCheckedChange: (ansId: string, checked: boolean) => void;
};

const AnswerList: React.FunctionComponent<AnswerListProps> = ({
  qId,
  qType,
  answers,
  onTextChange,
  onCheckedChange,
}) => {
  let ansType = "radio";
  let editable =
    [Q_TYPE_TRUE_FALSE, Q_TYPE_YES_OR_NO].find((v) => v == qType) == undefined;

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
        const key = `ans-${ans.id}-${qType}-${qId}`;
        const groupName = `group-${qType}-${qId}`;
        return (
          <div className="answer-field" key={key}>
            <input
              value={ans.value}
              type={ansType}
              checked={ans.checked}
              name={groupName}
              onChange={(evt) => {
                onCheckedChange(ans.id, evt.target.checked);
              }}
            />
            {editable ? (
              <EditText
                text={ans.value}
                onChange={(v) => {
                  onTextChange(ans.id, v);
                }}
              />
            ) : (
              <div>{ans.value}</div>
            )}
          </div>
        );
      })}

      {editable && <div>Edit the answer texts by clicking them.</div>}
    </>
  );
};

export default AnswerList;

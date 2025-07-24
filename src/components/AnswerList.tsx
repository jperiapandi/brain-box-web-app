import { useEffect, useReducer, type PropsWithChildren } from "react";
import {
  Q_TYPE_CHOOSE_MULTIPLE,
  Q_TYPE_CHOOSE_ONE,
  Q_TYPE_TRUE_FALSE,
  Q_TYPE_UNKNOWN,
  Q_TYPE_YES_OR_NO,
  type Answer,
} from "../types/questionTypes";

import EditText from "./EditText";
import {
  ANS_UPDATE_VALUE,
  UPDATE_NEW_ANSWERS_LIST,
} from "../reducers/answersReducer";
import answersReducer from "../reducers/answersReducer";

type AnswerListProps = PropsWithChildren & {
  qId: string;
  qType: string;
  answers: Answer[];
  onChange: () => void;
};

const AnswerList: React.FunctionComponent<AnswerListProps> = ({
  qId,
  qType,
  answers,
  onChange,
}) => {
  console.log(`Rendering AnswerList for ${qType}`);

  const [curAnswers, dispatch] = useReducer(answersReducer, []);

  useEffect(() => {
    dispatch({
      type: UPDATE_NEW_ANSWERS_LIST,
      answers: answers,
      id: "",
    });
  }, [answers]);

  switch (qType) {
    case Q_TYPE_UNKNOWN:
      return <></>;
    case Q_TYPE_TRUE_FALSE:
    case Q_TYPE_YES_OR_NO:
    case Q_TYPE_CHOOSE_ONE:
      //Return a Radio Group
      return (
        <>
          {curAnswers.map((ans) => {
            const key = `ans-${ans.id}-${qType}-${qId}`;
            const groupName = `radio-group-${qType}-${qId}`;
            return (
              <div className="answer-field" key={key}>
                <input value={ans.value} type="radio" name={groupName} />
                <EditText
                  text={ans.value}
                  onChange={(v) => {
                    dispatch({
                      type: ANS_UPDATE_VALUE,
                      id: ans.id,
                      textToUpdate: v,
                    });
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
          {curAnswers.map((ans) => {
            const key = `ans-${ans.id}-${qType}-${qId}`;
            const groupName = `radio-group-${qType}-${qId}`;
            return (
              <div className="answer-field" key={key}>
                <input type="checkbox" name={groupName} />
                <EditText
                  text={ans.value}
                  onChange={(v) => {
                    dispatch({
                      type: ANS_UPDATE_VALUE,
                      id: ans.id,
                      textToUpdate: v,
                    });
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

export default AnswerList;

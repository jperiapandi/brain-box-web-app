import type { MouseEventHandler, PropsWithChildren } from "react";
import type React from "react";
import { getFormattedDate } from "../utils";
import type { Timestamp } from "firebase/firestore";
import {
  QUIZ_STATUS_REJECTED,
  QUIZ_STATUS_SUBMITTED,
} from "../types/quizDraft";

type DraftListItemProps = PropsWithChildren & {
  title: string;
  status: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  submittedAt: Timestamp;
  onEditClick: MouseEventHandler;
};
const DraftListItem: React.FunctionComponent<DraftListItemProps> = ({
  title,
  status,
  createdAt,
  updatedAt,
  submittedAt,
  onEditClick,
}) => {
  const editDisabled =
    [QUIZ_STATUS_SUBMITTED, QUIZ_STATUS_REJECTED].find((s) => s == status) !=
    undefined;
  return (
    <div className="draft-item two-controls-100-1">
      <div>
        <h1>{title}</h1>
        <div className="label-value-pair">
          <span>Created:</span>
          <span>{getFormattedDate(createdAt)}</span>
        </div>
        {status == QUIZ_STATUS_SUBMITTED ? (
          <div className="label-value-pair">
            <span>Submitted:</span>
            <span>{getFormattedDate(submittedAt)}</span>
          </div>
        ) : (
          <div className="label-value-pair">
            <span>Updated:</span>
            <span>{getFormattedDate(updatedAt)}</span>
          </div>
        )}
      </div>
      <div className="controls-container">
        <span className={`status-label ${status}`}>{status}</span>
        {status==QUIZ_STATUS_SUBMITTED && <div className="error">
          Not yet Published.
          </div>}
        {!editDisabled && (
          <button
            className="icon-btn"
            onClick={onEditClick}
            disabled={editDisabled}
          >
            <span className="material-symbols-rounded">edit</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default DraftListItem;

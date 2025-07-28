import type { MouseEventHandler, PropsWithChildren } from "react";
import type React from "react";
import { getFormattedDate } from "../utils";
import type { Timestamp } from "firebase/firestore";

type DraftListItemProps = PropsWithChildren & {
  title: string;
  status: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  onEditClick: MouseEventHandler;
};
const DraftListItem: React.FunctionComponent<DraftListItemProps> = ({
  title,
  status,
  createdAt,
  updatedAt,
  onEditClick,
}) => {
  const editDisabled =
    ["submitted", "rejected"].find((s) => s == status) != undefined;
  return (
    <div className="draft-item two-controls-100-1">
      <div>
        <h1>{title}</h1>
        <div className="label-value-pair">
          <span>Created:</span>
          <span>{getFormattedDate(createdAt)}</span>
        </div>
        <div className="label-value-pair">
          <span>Updated:</span>
          <span>{getFormattedDate(updatedAt)}</span>
        </div>
      </div>
      <div className="controls-container">
        <span className={`status-label ${status}`}>{status}</span>
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

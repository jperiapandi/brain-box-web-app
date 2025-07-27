import type React from "react";
import { useContext, type MouseEventHandler } from "react";
import { UserContext } from "../contexts/UserContext";

import { useNavigate } from "react-router";
import { PROFILE_PAGE_PATH } from "../routes/router";

const Profile: React.FunctionComponent = () => {
  const navigate = useNavigate();
  const user = useContext(UserContext);

  const disabled = user == null;
  const icon_name = user ? "account_circle" : "account_circle_off";

  const onProfileIconClick: MouseEventHandler<HTMLButtonElement> = async (
    evt
  ) => {
    evt.stopPropagation();
    navigate(PROFILE_PAGE_PATH);
  };
  return (
    <>
      <div className="profile">
        <button
          className="icon-btn profile-icon-btn"
          disabled={disabled}
          onClick={onProfileIconClick}
        >
          <span className="material-symbols-rounded">{icon_name}</span>
        </button>
      </div>
    </>
  );
};

export default Profile;

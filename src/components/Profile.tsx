import type React from "react";
import { useContext, type MouseEventHandler } from "react";
import { UserContext } from "../contexts/UserContext";
import { getAuth, signOut } from "firebase/auth";
import { useNavigate } from "react-router";
import { AUTH_PAGE_PATH } from "../routes/router";

const Profile: React.FunctionComponent = () => {
  const navigate = useNavigate();
  const user = useContext(UserContext);

  const disabled = user == null;
  const icon_name = user ? "account_circle" : "account_circle_off";

  const onLogOutClick: MouseEventHandler<HTMLButtonElement> = async (evt) => {
    evt.stopPropagation();
    await signOut(getAuth());
    console.warn(`User is logged out`);
  };
  const onSwitchAccountClick: MouseEventHandler<HTMLButtonElement> = async (
    evt
  ) => {
    evt.stopPropagation();
    navigate(AUTH_PAGE_PATH);
  };
  return (
    <>
      <div className="profile">
        <button
          className="icon-btn profile-icon-btn"
          disabled={disabled}
          popoverTarget="profile-dropdown"
        >
          <span className="material-symbols-rounded">{icon_name}</span>
        </button>
      </div>

      <div popover="" className="profile-popover" id="profile-dropdown">
        {user ? (
          <>
            <div>
              <div style={{ fontWeight: "bold" }}>{user.displayName}</div>
              {user.isAnonymous && <div className="error">Anonymous User</div>}
              <div className="info">
                Last logged In :{user.metadata.lastSignInTime}
              </div>
            </div>

            {user.isAnonymous ? (
              <button
                className="btn btn-primary"
                onClick={onSwitchAccountClick}
              >
                Switch Account
              </button>
            ) : (
              <button className="btn btn-logout" onClick={onLogOutClick}>
                Logout
              </button>
            )}
          </>
        ) : (
          <>
            <div>Hi</div>
            <button className="btn">Sign In</button>
          </>
        )}
      </div>
    </>
  );
};

export default Profile;

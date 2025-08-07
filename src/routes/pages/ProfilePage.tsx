import type React from "react";
import PageHeader from "../../components/headers/PageHeader";
import {
  useContext,
  useEffect,
  useRef,
  useState,
  type ChangeEventHandler,
  type KeyboardEventHandler,
  type MouseEventHandler,
} from "react";
import { UserContext } from "../../contexts/UserContext";
import { getAuth, signOut, updateProfile } from "firebase/auth";
import { useNavigate } from "react-router";
import { HOME_PAGE_PATH } from "../router";
import {
  collection,
  getCountFromServer,
  getFirestore,
  query,
  where,
} from "firebase/firestore";
import { COLXN_QUIZ_DRAFTS } from "../../types/constants";
import Dialog, { type DialogRef } from "../../components/Dialog";

const ProfilePage: React.FunctionComponent = () => {
  const navigate = useNavigate();
  const user = useContext(UserContext);
  const [numOwnQuizzes, setNumOwnQuizzes] = useState(0);
  const [updatedDisplayName, setUpdatedDisplayName] = useState("");
  const [editing, setEditing] = useState(false);
  const [progress, setProgress] = useState(false);
  const logoutDialog = useRef<DialogRef>(null);
  const updatedDisplayNameField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (user) {
      const q = query(
        collection(getFirestore(), COLXN_QUIZ_DRAFTS),
        where("author_uid", "==", user.uid)
      );
      getCountFromServer(q)
        .then((v) => {
          setNumOwnQuizzes(v.data().count);
        })
        .catch((reason) => {
          console.error(reason);
        });
    }
  }, [user]);

  const handleLogoutClick: MouseEventHandler<HTMLButtonElement> = async (
    evt
  ) => {
    evt.stopPropagation();

    logoutDialog.current?.open();
  };

  const handleLogOutConfirm = async () => {
    await signOut(getAuth());
    navigate(HOME_PAGE_PATH);
  };
  const handleEditClick = () => {
    setUpdatedDisplayName(user?.displayName ?? "");
    setEditing(true);
  };

  const handleInputChange: ChangeEventHandler<HTMLInputElement> = (evt) => {
    setUpdatedDisplayName(evt.target.value);
  };
  const handleKeyBoardEvent: KeyboardEventHandler<HTMLInputElement> = (evt) => {
    evt.stopPropagation();
    // console.log(evt.key);

    if (evt.key == "Enter") {
      //TODO Save
      saveDisplayName();
      return;
    }
    if (evt.key == "Escape") {
      //TODO Cancel
      setEditing(false);
      return;
    }
  };
  const handleSaveClick = () => {
    saveDisplayName();
  };

  const handleCancelClick = () => {
    setEditing(false);
  };

  const saveDisplayName = async () => {
    setProgress(true);

    try {
      if (user && updatedDisplayName != user.displayName) {
        console.log(`Update Display Name ${updatedDisplayName}`);
        await updateProfile(user, {
          displayName: updatedDisplayName,
        });
        console.log(`Display Name updated!`);
        setEditing(false);
      } else {
      }
    } catch (error) {
      console.error(error);
    }
    setProgress(false);
  };

  useEffect(() => {
    if (editing === true) {
      updatedDisplayNameField.current?.focus();
    }
  }, [editing]);

  return (
    <>
      <PageHeader title="Profile" navBack={true} profile={false} />
      {user ? (
        <main className="page-content profile-page">
          <div className="welcome-content">
            <div className="salute">Hi,</div>
            {editing == false ? (
              <div className="display-name-content">
                <div className="display-name">{user.displayName}</div>
                <button className="icon-btn" onClick={handleEditClick}>
                  <span className="material-symbols-rounded">edit</span>
                </button>
              </div>
            ) : (
              <div className="display-name-editor-content">
                <input
                  type="text"
                  value={updatedDisplayName}
                  onChange={handleInputChange}
                  onKeyUp={handleKeyBoardEvent}
                  ref={updatedDisplayNameField}
                  disabled={progress}
                />
                <button
                  className="icon-btn"
                  onClick={handleSaveClick}
                  disabled={progress}
                >
                  <span className="material-symbols-rounded">check</span>
                </button>
                <button className="icon-btn" disabled={progress}>
                  <span
                    className="material-symbols-rounded"
                    onClick={handleCancelClick}
                  >
                    close
                  </span>
                </button>
              </div>
            )}
          </div>

          {user.isAnonymous && (
            <div className="anonymous-content">
              <span>You are an Anonymous user.</span>
            </div>
          )}
          <p>Number of quizzes created by you: {numOwnQuizzes}</p>
          <p>Number of quizzes you attended: {0}</p>

          <div>
            <button className="btn btn-logout" onClick={handleLogoutClick}>
              Logout
            </button>
          </div>
        </main>
      ) : (
        <main className="page-content">
          <div className="error">Please login</div>
        </main>
      )}

      <Dialog
        title={`Confirm Logout`}
        labelCancel="Cancel"
        labelConfirm="Yes, Log out"
        onConfirm={handleLogOutConfirm}
        ref={logoutDialog}
      >
        {user?.isAnonymous && (
          <ul className="simple-list">
            <p>
              <span className="material-symbols-rounded">warning</span>
            </p>
            <li>
              Your current anonymous account will be deleted upon logging out
              and cannot be recovered.
            </li>
            <li>
              Any unpublished quizzes will become permanently inaccessible.
            </li>
            <li>
              A new anonymous account will be created if you sign in as a guest
              again later.
            </li>

            <li>All published quizzes will remain available to other users.</li>
          </ul>
        )}

        {user?.isAnonymous == false && (
          <>
            <p>Are you sure you want to log out?</p>
          </>
        )}
      </Dialog>
    </>
  );
};

export default ProfilePage;

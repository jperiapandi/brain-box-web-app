import type React from "react";
import PageHeader from "../../components/headers/PageHeader";
import { useContext, useEffect, useState, type MouseEventHandler } from "react";
import { UserContext } from "../../contexts/UserContext";
import { getAuth, signOut } from "firebase/auth";
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

const ProfilePage: React.FunctionComponent = () => {
  const navigate = useNavigate();
  const user = useContext(UserContext);
  const [numOwnQuizzes, setNumOwnQuizzes] = useState(0);

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
    await signOut(getAuth());
    navigate(HOME_PAGE_PATH);
  };
  return (
    <>
      <PageHeader title="Profile" navBack={true} profile={false} />
      {user ? (
        <main className="page-content">
          <div>
            <h2>Hi,</h2>
            <div>
              <h1>{user.displayName}</h1>
              <button className="icon-btn">
                <span className="material-symbols-rounded">edit</span>
              </button>
            </div>
          </div>

          {user.isAnonymous && (
            <div>
              <p>You are logged in as an Anonymous user.</p>
            </div>
          )}
          <h2>Number of quizzes created by you: {numOwnQuizzes}</h2>
          <h2>Number of quizzes you attended: {0}</h2>

          <div>
            <button className="btn btn-logout" onClick={handleLogoutClick}>
              Logout
            </button>
            {user.isAnonymous && (
              <ul>
                <p>Note:</p>
                <li>Your current Anonymous will be deleted once you logout.</li>
                <li>
                  A new Anonymous account will be created when you sign in back
                  later.
                </li>
                <li>
                  All {numOwnQuizzes} of your unpublished quizzes will become
                  inaccessible to you/others.
                </li>
                <li>
                  All published quizzes will continue to be available for users
                  as usual.
                </li>
              </ul>
            )}
          </div>
        </main>
      ) : (
        <main className="page-content">
          <div className="error">Please login</div>
        </main>
      )}
    </>
  );
};

export default ProfilePage;

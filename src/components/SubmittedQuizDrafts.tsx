import type React from "react";
import useDraftQuizzesSnapshot from "../hooks/useDraftQuizzesSnapshot";
import { useContext, useEffect } from "react";
import { UserContext } from "../contexts/UserContext";
import { QUIZ_STATUS_SUBMITTED } from "../types/quizDraft";
import { useNavigate } from "react-router";
import { REVIEW_PAGE_PATH } from "../routes/router";

const SubmittedQuizDrafts: React.FunctionComponent = () => {
  const navigate = useNavigate();
  const user = useContext(UserContext);
  const [quizDraftsSnapshot] = useDraftQuizzesSnapshot();

  const handleReviewClick = (id: string) => {
    navigate(REVIEW_PAGE_PATH.replace(":id", id));
  };

  useEffect(() => {
    if (user != null) {
      quizDraftsSnapshot.load(QUIZ_STATUS_SUBMITTED);
    }
  }, []);

  return (
    <>
      <h3>Submitted Quizzes</h3>
      <h4>Please review and take actions.</h4>

      {quizDraftsSnapshot.quizDrafts.map((doc) => {
        let authorName = doc.get("author");
        if (doc.get("author_uid") === user?.uid) {
          authorName = "You";
        }

        return (
          <div className="submitted-list-item" key={doc.id}>
            <div>{doc.get("title")}</div>
            <div>
              <div className="author-label">Author:</div>
              <div>{authorName}</div>
            </div>
            <button
              className="btn btn-primary"
              onClick={() => {
                handleReviewClick(doc.id);
              }}
            >
              Review
            </button>
          </div>
        );
      })}
    </>
  );
};

export default SubmittedQuizDrafts;

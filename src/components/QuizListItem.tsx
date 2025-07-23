import type React from "react";
import type { Quiz } from "../types/quiz";
import Attribute from "./Attribute";
import { Link, NavLink } from "react-router";
import { EDIT_QUIZ_PAGE_PATH, VIEW_QUIZ_PAGE_PATH } from "../routes/router";

interface QuizListItemProps {
  quiz: Quiz;
}
const QuizListItem: React.FunctionComponent<QuizListItemProps> = ({ quiz }) => {
  const quizViewPath = VIEW_QUIZ_PAGE_PATH.replace(":id", quiz.id);
  const quizEditPath = EDIT_QUIZ_PAGE_PATH.replace(":id", quiz.id);
  return (
    <div className="quiz-list-item">
      <div className="content-container">
        <NavLink to={quizViewPath}>{quiz.title}</NavLink>
        <div className="info-container">
          <Attribute icon="person" label="Periapandi J" />
          <Attribute icon="event" label="May-15-2025" />
          <Attribute icon="star" label="32" />
        </div>
        <p>{quiz.desc}</p>
      </div>

      <div className="controls-container">
        <Link to={quizEditPath}>
          <span className="material-symbols-rounded">edit</span>
        </Link>
      </div>
    </div>
  );
};

export default QuizListItem;

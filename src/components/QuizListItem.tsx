import type React from "react";
import type { QuizItem } from "../types/quiz";
import Attribute from "./Attribute";
import { NavLink } from "react-router";
import { VIEW_QUIZ_PAGE_PATH } from "../routes/router";
import { getFormattedDate } from "../utils";

interface QuizListItemProps {
  quiz: QuizItem;
}
const QuizListItem: React.FunctionComponent<QuizListItemProps> = ({ quiz }) => {
  const quizViewPath = VIEW_QUIZ_PAGE_PATH.replace(":id", quiz.id);
  return (
    <div className="quiz-list-item">
      <div className="content-container">
        <NavLink to={quizViewPath}>{quiz.title}</NavLink>
        <div className="info-container">
          <Attribute icon="person" label={quiz.author} />
          <Attribute icon="event" label={getFormattedDate(quiz.approvedAt)} />
          {/* <Attribute icon="star" label="32" /> */}
        </div>
        <p>{quiz.desc}</p>
      </div>
    </div>
  );
};

export default QuizListItem;

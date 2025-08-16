import type React from "react";
import type { QuizItem } from "../types/quiz";
import Attribute from "./Attribute";
import { NavLink } from "react-router";
import { VIEW_QUIZ_PAGE_PATH } from "../routes/router";
import { getFormattedDate } from "../utils";

interface QuizListItemProps {
  quiz: QuizItem;
  sn: number;
}
const QuizListItem: React.FunctionComponent<QuizListItemProps> = ({
  quiz,
  sn,
}) => {
  const maxChars = 120 - 3;
  const truncatedDesc =
    quiz.desc.length > maxChars
      ? quiz.desc.substring(0, maxChars) + "..."
      : quiz.desc;

  const quizViewPath = VIEW_QUIZ_PAGE_PATH.replace(":id", quiz.id);
  return (
    <div className="quiz-list-item">
      <div className="sn-box">
        <span>{sn}</span>
      </div>
      <div className="content-container">
        <NavLink to={quizViewPath} className={"title-link"}>
          {quiz.title}
        </NavLink>
        <p>{truncatedDesc}</p>
        <div className="info-container">
          <Attribute icon="person" label={"By " + quiz.author} />
          <Attribute icon="event" label={getFormattedDate(quiz.approvedAt)} />
          {quiz.participantsCount > 5 && (
            <Attribute icon="trending_up" label={quiz.participantsCount + ""} />
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizListItem;

import type React from "react";
import { useContext } from "react";
import { QuizzesContext } from "../contexts/QuizzesContext";
import QuizListItem from "./QuizListItem";

const QuizList: React.FunctionComponent = () => {
  const quizzes = useContext(QuizzesContext);

  return (
    <div className="quizzes-list-container">
      {quizzes.map((q) => {
        return <QuizListItem quiz={q} key={q.id}></QuizListItem>;
      })}
    </div>
  );
};

export default QuizList;

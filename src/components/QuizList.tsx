import type React from "react";
import { useContext } from "react";
import { QuizzesContext } from "../contexts/QuizzesContext";
import QuizListItem from "./QuizListItem";

const QuizList: React.FunctionComponent = () => {
  const quizzes = useContext(QuizzesContext);

  return (
    <>
      {quizzes.length > 0 && (
        <>
          <h1>Quizzes available </h1>
        </>
      )}
      <div className="quizzes-list-container">
        {quizzes.map((q, i) => {
          return <QuizListItem quiz={q} key={q.id} sn={i + 1}></QuizListItem>;
        })}
      </div>
    </>
  );
};

export default QuizList;

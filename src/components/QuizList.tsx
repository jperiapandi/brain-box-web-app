import type React from "react";

import QuizListItem from "./QuizListItem";
import useQuizzesSnapshot from "../hooks/useQuizzesSnapshot";

const QuizList: React.FunctionComponent = () => {
  const { loading, error, quizzes } = useQuizzesSnapshot();

  if (loading) {
    return (
      <>
        <div>
          <span>Loading available quizzes </span>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <div className="error">
          <span>{error.message}</span>
        </div>
      </>
    );
  }
  return (
    <>
      {quizzes.length > 0 && (
        <>
          <h1>Quizzes available </h1>
          <div className="quizzes-list-container">
            {quizzes.map((q, i) => {
              return (
                <QuizListItem quiz={q} key={q.id} sn={i + 1}></QuizListItem>
              );
            })}
          </div>
        </>
      )}
    </>
  );
};

export default QuizList;

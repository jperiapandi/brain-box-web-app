import type React from "react";
import QuizzesProvider from "../../components/QuizzesProvider";
import QuizList from "../../components/QuizList";
import PageHeader from "../../components/headers/PageHeader";
import type { MouseEventHandler } from "react";
import { useNavigate } from "react-router";
import { CREATE_QUIZ_PAGE_PATH } from "../router";

const HomePage: React.FunctionComponent = () => {
  const navigate = useNavigate();
  const handleCreateQuizClick: MouseEventHandler = (evt) => {
    evt.stopPropagation();
    navigate(CREATE_QUIZ_PAGE_PATH);
  };
  return (
    <>
      <PageHeader title="Brain Box"></PageHeader>
      <main>
        <QuizzesProvider>
          <QuizList></QuizList>
        </QuizzesProvider>
      </main>

      <footer>
        <button onClick={handleCreateQuizClick}>Create a Quiz</button>
      </footer>
    </>
  );
};

export default HomePage;

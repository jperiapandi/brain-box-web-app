import type React from "react";
import QuizzesProvider from "../../components/QuizzesProvider";
import QuizList from "../../components/QuizList";
import PageHeader from "../../components/headers/PageHeader";

const HomePage: React.FunctionComponent = () => {
  return (
    <>
      <PageHeader title="Brain Box"></PageHeader>
      <main>
        <QuizzesProvider>
          <QuizList></QuizList>
        </QuizzesProvider>
      </main>
    </>
  );
};

export default HomePage;

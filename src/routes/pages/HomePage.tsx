import type React from "react";
import PageHeader from "../../components/headers/PageHeader";

import QuizDraftsList from "../../components/QuizDraftsList";

const HomePage: React.FunctionComponent = () => {
  return (
    <>
      <PageHeader title="Brain Box"></PageHeader>
      <main>
        <QuizDraftsList />
      </main>

      <footer></footer>
    </>
  );
};

export default HomePage;

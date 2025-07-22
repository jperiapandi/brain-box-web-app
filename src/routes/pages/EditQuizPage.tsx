import type React from "react";
import PageHeader from "../../components/headers/PageHeader";
import { useParams } from "react-router";

const EditQuizPage: React.FunctionComponent = () => {
  const { id } = useParams();
  return (
    <>
      <PageHeader title="Edit" subTitle={id} navBack={true}></PageHeader>
    </>
  );
};

export default EditQuizPage;

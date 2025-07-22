import type React from "react";
import { useParams } from "react-router";
import PageHeader from "../../components/headers/PageHeader";

const ViewQuizPage: React.FunctionComponent = () => {
  const { id } = useParams();

  return (
    <>
      <PageHeader title="View" subTitle={id} navBack={true}></PageHeader>
    </>
  );
};

export default ViewQuizPage;

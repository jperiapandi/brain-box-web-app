import type React from "react";
import PageHeader from "../../components/headers/PageHeader";

const AboutPage: React.FunctionComponent = () => {
  return (
    <>
      <PageHeader title="About Me" navBack={true} profile={false}></PageHeader>
      <main className="page-content about-me-page">
        <section>
            <h2>Developed by: Periapandi </h2>
            <div>Please check my LinkedIn profile <a href="https://www.linkedin.com/in/jperiapandi" target="_blank">here</a>.</div>
        </section>

        <section>
          <h2>Skills used in this app</h2>
          <ul>
            <li>ReactJs v19.1.0</li>
            <li>TypeScript, HTML5 & CSS3</li>
            <li>Firebase - Cloud Functions</li>
            <li>Firebase - Firestore NoSQL Database</li>
            <li>Firebase - Auth</li>
          </ul>
          <h2>GitHub Repositories</h2>
          <ul>
            <li>
              Web UI :{" "}
              <a
                href="https://github.com/jperiapandi/brain-box-web-app"
                target="_blank"
              >
                https://github.com/jperiapandi/brain-box-web-app
              </a>
            </li>
            <li>
              Cloud Functions / API{" "}
              <a
                href="https://github.com/jperiapandi/brain-box-cloud-functions"
                target="_blank"
              >
                https://github.com/jperiapandi/brain-box-cloud-functions
              </a>
            </li>
          </ul>
        </section>
      </main>
    </>
  );
};
export default AboutPage;

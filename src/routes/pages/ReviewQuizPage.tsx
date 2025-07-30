import type React from "react";
import PageHeader from "../../components/headers/PageHeader";
import { useParams } from "react-router";
import { useEffect, useState } from "react";
import { doc, getDoc, getFirestore } from "firebase/firestore";
import { COLXN_QUIZ_DRAFTS } from "../../types/constants";
import type { QuizDraft } from "../../types/quizDraft";
import { getFormattedDate } from "../../utils";

const ReviewQuizPage: React.FunctionComponent = () => {
  const docId = useParams().id;
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    if (docId && docId != "") {
      const docRef = doc(getFirestore(), COLXN_QUIZ_DRAFTS, docId);
      getDoc(docRef)
        .then((snapshot) => {
          if (snapshot.exists()) {
            //Calculate the data
            const d = snapshot.data() as QuizDraft;
            console.log(d);
            const questions = d.questions.map((q) => {
              const answers = q.answersMap[q.type];

              return {
                id: q.id,
                questionText: q.questionText,
                type: q.type,
                answers,
              };
            });
            const formattedQuiz = {
              author: d.author,
              isAnonymous: d.isAnonymous,
              title: d.title,
              desc: d.desc,
              createdAt: d.createdAt,
              submittedAt: d.submittedAt,
              questions: questions,
            };

            console.log(formattedQuiz);
            setData(formattedQuiz);
          }
        })
        .catch((error) => {
          console.error(error);
          setData(null);
        });
    }
  }, []);
  return (
    <>
      <PageHeader title="Review" navBack={true} />
      <main className="page-content">
        {data != null && (
          <div className="review-quiz-container">
            <div className="label-value-container">
              <label>Author:</label>
              <div className="value">{data.author}</div>
            </div>
            <div className="label-value-container">
              <label>Submitted at:</label>
              <div className="value">{getFormattedDate(data.submittedAt)}</div>
            </div>

            <div className="label-value-container">
              <label>Quiz Title:</label>
              <div className="value quiz-title">{data.title}</div>
            </div>

            <div className="label-value-container">
              <label>Description:</label>
              <div className="value">{data.desc}</div>
            </div>

            <div className="label-value-container">
              <label>Total Questions:</label>
              <div className="value">{data.questions.length}</div>
            </div>

            <hr />
            {data.questions.map((q:any, i:number) => {
              return (
                <div key={q.id} className="question-container">
                  <div>{i + 1}</div>

                  <div className="label-value-container">
                    <label>Question:</label>
                    <div className="value question-text">{q.questionText}</div>
                  </div>

                  <div className="label-value-container">
                    <label>Type:</label>
                    <div className="value">{q.type}</div>
                  </div>

                  <div className="label-value-container">
                    <label>Given answer options:</label>
                    <div className="value">
                      {q.answers.map((ans:any) => {
                        return (
                          <div key={ans.id}>
                            <div>{ans.value}</div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="label-value-container">
                    <label>Correct answers:</label>
                    <div className="value">
                      {q.answers
                        .filter((ans:any) => {
                          return ans.checked;
                        })
                        .map((ans:any) => {
                          return (
                            <div key={ans.id}>
                              <div>{ans.value}</div>
                            </div>
                          );
                        })}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      <footer className="review-quiz-footer">
        <button className="btn btn-logout">Reject</button>
        <button className="btn btn-primary">Approve</button>
      </footer>
    </>
  );
};

export default ReviewQuizPage;

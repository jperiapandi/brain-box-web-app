import type React from "react";
import PageHeader from "../../components/headers/PageHeader";
import { useNavigate, useParams } from "react-router";

import { getFormattedDate } from "../../utils";
import useReviewQuizLoader from "../../hooks/useReviewQuizLoader";
import {
  getQuestionTypeLabel,
  type QToAnswers,
  type QuestionOption,
  type QuizAnswersDoc,
} from "../../types/questionTypes";
import AnswerReviewList from "../../components/AnswerReviewList";
import type { QuizDoc } from "../../types/quiz";
import {
  deleteDoc,
  doc,
  getFirestore,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import { useContext } from "react";
import { UserContext } from "../../contexts/UserContext";
import {
  COLXN_ANSWERS,
  COLXN_QUIZ_DRAFTS,
  COLXN_QUIZZES,
} from "../../types/constants";

const ReviewQuizPage: React.FunctionComponent = () => {
  const navigate = useNavigate();
  const docId = useParams().id;
  const user = useContext(UserContext);

  const loader = useReviewQuizLoader(docId || "");
  const { data } = loader;

  const handleApproveClick = async () => {
    if (data && user != null && docId) {
      const questions: QuestionOption[] = data.questions.map((q) => {
        return {
          id: q.id,
          questionText: q.questionText,
          type: q.type,
          availableAnswers: q.answers.map((ans) => {
            return ans.value;
          }),
        };
      });

      const questionToAnswersList: QToAnswers[] = data.questions.map((q) => {
        return {
          questionId: q.id,
          correctAnswers: q.answers
            .filter((ans) => ans.checked)
            .map((ans) => ans.value),
        };
      });

      let approvedQuiz: QuizDoc = {
        title: data.title,
        desc: data.desc,
        author: data.author,
        author_uid: data.author_uid,
        isAnonymous: data.isAnonymous,

        approved: true,
        approvedAt: serverTimestamp(),
        approver: user?.displayName || "UNKNOWN",
        approver_uid: user?.uid,
        questions,
      };

      let quizAnswersDoc: QuizAnswersDoc = {
        answers: questionToAnswersList,
      };

      // console.log(`Approved Quiz:: `, approvedQuiz);
      // console.log(`Answers Key:: `, quizAnswersDoc);

      //Save the approved Quiz
      await setDoc(doc(getFirestore(), COLXN_QUIZZES, docId), approvedQuiz);
      console.log(`Approved Quiz is saved in Firestore.`);

      //Save the Quiz Answers
      await setDoc(doc(getFirestore(), COLXN_ANSWERS, docId), quizAnswersDoc);
      console.log(`Quiz Answers are saved in Firestore.`);

      //Delete Quiz Draft
      await deleteDoc(doc(getFirestore(), COLXN_QUIZ_DRAFTS, docId));
      console.log(`Quiz Draft is delete from Firestore.`);

      console.log(`Quiz Published`);

      //Go Back
      navigate(-1);
    }
  };

  const handleRejectClick = () => {};

  return (
    <>
      <PageHeader title="Review" navBack={true} />
      <main className="page-content">
        {loader.progress && <div>Please wait...</div>}

        {loader.success == true && data != null && (
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

            {data.questions.map((q: any, i: number) => {
              return (
                <div key={q.id} className="question-container">
                  <div className="sn">{i + 1}</div>
                  <div className="label-value-container">
                    <label>Question:</label>
                    <div className="value question-text">{q.questionText}</div>
                  </div>

                  <div className="label-value-container">
                    <label>Type:</label>
                    <div className="value">{getQuestionTypeLabel(q.type)}</div>
                  </div>

                  <div className="label-value-container">
                    <label>Given answer options:</label>
                    <AnswerReviewList answers={q.answers} qType={q.type} />
                  </div>

                  <div className="label-value-container">
                    <label>Correct answers:</label>
                    <div className="value">
                      {q.answers
                        .filter((ans: any) => {
                          return ans.checked;
                        })
                        .map((ans: any) => {
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

      {loader.success == true && data != null && (
        <footer className="review-quiz-footer">
          <button className="btn btn-danger" onClick={handleRejectClick}>
            Reject
          </button>
          <button className="btn btn-primary" onClick={handleApproveClick}>
            Approve
          </button>
        </footer>
      )}
    </>
  );
};

export default ReviewQuizPage;

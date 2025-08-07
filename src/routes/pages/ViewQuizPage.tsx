import type React from "react";
import { NavLink, useParams } from "react-router";
import PageHeader from "../../components/headers/PageHeader";
import { useContext, useEffect, useState, type PropsWithChildren } from "react";
import { UserContext } from "../../contexts/UserContext";
import { doc, getDoc, getFirestore } from "firebase/firestore";
import { COLXN_QUIZZES } from "../../types/constants";
import type { QuizDoc, QuizRunner } from "../../types/quiz";
import { AUTH_PAGE_PATH } from "../router";
import type { User } from "firebase/auth";
import {
  Q_TYPE_CHOOSE_MULTIPLE,
  type QuestionRunnerView,
  type SelectedAnswerType,
} from "../../types/questionTypes";

const QUIZ_LOADING = "quiz-loading";
const QUIZ_LOADED = "quiz-loaded";
const QUIZ_STARTED = "quiz-started";

const ViewQuizPage: React.FunctionComponent = () => {
  const user = useContext(UserContext);
  const { id } = useParams();
  const [quiz, setQuiz] = useState<QuizDoc>();
  const [error, setError] = useState<Error>();
  const [started, setStarted] = useState<boolean>(false);
  // const [uiState, setUisState] = useState<string>(QUIZ_LOADING);

  let title = "";
  let subtitle = "";
  if (quiz) {
    title = quiz.title;
    subtitle = `By ${quiz.author}`;
  }
  if (error) {
    title = "Sorry!";
    subtitle = "Something went wrong";
  }

  let uiState = QUIZ_LOADING;
  if (quiz != undefined) {
    uiState = QUIZ_LOADED;
  }

  if (started) {
    uiState = QUIZ_STARTED;
  }

  useEffect(() => {
    const quizDocRef = doc(getFirestore(), `${COLXN_QUIZZES}/${id}`);
    getDoc(quizDocRef).then(
      (snapshot) => {
        if (snapshot.exists()) {
          const result = snapshot.data() as QuizDoc;
          setQuiz(result);
          console.log(result);
        } else {
          const err = new Error(`Quiz not found in our system.`);
          console.error(err);
          setError(err);
        }
      },
      (reason) => {
        console.error(reason);
      }
    );
  }, []);

  return (
    <>
      <PageHeader title={title} subTitle={subtitle} navBack={true}></PageHeader>
      <main className="page-content">
        {uiState == QUIZ_LOADING && <div>Please wait...</div>}

        {uiState == QUIZ_LOADED && quiz != undefined && (
          <>
            <p>{quiz.desc}</p>
            <div>
              You'll tackle {quiz.questions.length} questions in this quiz, with
              an estimated completion time of {quiz.questions.length * 2}{" "}
              minutes.
            </div>
            <div className="controls-container-h-c">
              <button
                className="btn btn-primary"
                disabled={user == null}
                onClick={() => {
                  setStarted(true);
                }}
              >
                <span className="material-symbols-rounded">play_arrow</span>
                <span>Start</span>
              </button>
            </div>

            {user == null && (
              <div>
                <p>
                  Please <NavLink to={AUTH_PAGE_PATH}>login</NavLink> to
                  BrainBox to participate in this Quiz.
                </p>
              </div>
            )}
          </>
        )}

        {uiState == QUIZ_STARTED && quiz != undefined && user != null && (
          <QuizRunner
            quiz={calculateQuizRunnerData(quiz)}
            user={user}
          ></QuizRunner>
        )}
      </main>
    </>
  );
};

export default ViewQuizPage;

type QuizRunnerProps = PropsWithChildren & {
  quiz: QuizRunner;
  user: User;
};

const QuizRunner: React.FunctionComponent<QuizRunnerProps> = ({ quiz }) => {
  //Question index
  const [index, setIndex] = useState(0);
  const [questions, setQuestions] = useState(quiz.questions);

  const curQuestion = questions[index];
  const numOfAnsweredQs = questions.filter(
    (q) => q.hasSomeSelectedAnswers == true
  ).length;

  // curQuestion.questionText
  const handleNextClick = () => {
    if (index < quiz.questions.length - 1) {
      setIndex((i) => i + 1);
    }
  };
  const handlePrevClick = () => {
    if (index > 0) {
      setIndex((i) => i - 1);
    }
  };
  //All time in milliseconds
  const estimatedTime = quiz.questions.length * 2 * 60 * 1000;
  const [startTime] = useState(new Date().getTime());
  const [runningTime, setRunningTime] = useState(0);

  const remainingTime = estimatedTime - runningTime;
  const remainingTimeStamp = `
  ${String(Math.floor(remainingTime / 1000 / 60 / 60) % 12).padStart(2, "0")}
  : ${String(Math.floor(remainingTime / 1000 / 60) % 60).padStart(2, "0")}
  : ${String(Math.floor(remainingTime / 1000) % 60).padStart(2, "0")}
  `;

  useEffect(() => {
    console.log(`QuizRunner started. ${startTime}`);

    const timeout = setInterval(() => {
      const n = new Date();
      const d = n.getTime() - startTime;
      setRunningTime(d);
    }, 500);

    return () => {
      console.log(`Cleanup QuizRunner`);
      clearTimeout(timeout);
    };
  }, []);

  const handleAnswerSelect = (answerId: number, checked: boolean) => {
    const updatedQuestions = questions.map((q) => {
      if (q.id == curQuestion.id) {
        //For the running question, calculate updated answers
        const updatedAnswers = q.selectedAnswers.map((ans) => {
          if (q.type == Q_TYPE_CHOOSE_MULTIPLE) {
            if (ans.id == answerId) {
              return { ...ans, checked };
            } else {
              return ans;
            }
          } else {
            if (ans.id == answerId) {
              return { ...ans, checked };
            } else {
              return { ...ans, checked: false };
            }
          }
        });

        const hasSomeSelectedAnswers = updatedAnswers.some((ans) => {
          return ans.checked == true;
        });

        return {
          ...q,
          selectedAnswers: updatedAnswers,
          hasSomeSelectedAnswers,
        };
      } else {
        return q;
      }
    });

    //
    setQuestions(updatedQuestions);
  };
  return (
    <div className="quiz-runner">
      <div className="header">
        <p>{remainingTimeStamp}</p>
      </div>

      <div className="question-body">
        <div className="question-n-answers" id={curQuestion.id}>
          <h3>{curQuestion.questionText}</h3>
          <ul className="answers-list">
            {curQuestion.selectedAnswers.map((ans, i) => {
              const groupKey = `radio-grp-${curQuestion.id}`;
              const fieldKey = `radio-grp-ans-${i}-${curQuestion.id}`;
              let formELm = (
                <>
                  <input
                    type="radio"
                    name={groupKey}
                    id={fieldKey}
                    onChange={(evt) => {
                      evt.stopPropagation();
                      handleAnswerSelect(i, evt.target.checked);
                    }}
                    checked={ans.checked}
                  ></input>
                  <label htmlFor={fieldKey}>{ans.answer}</label>
                </>
              );
              if (curQuestion.type == Q_TYPE_CHOOSE_MULTIPLE) {
                formELm = (
                  <>
                    <input
                      type="checkbox"
                      id={fieldKey}
                      checked={ans.checked}
                      onChange={(evt) => {
                        evt.stopPropagation();
                        handleAnswerSelect(i, evt.target.checked);
                      }}
                    ></input>
                    <label htmlFor={fieldKey}>{ans.answer}</label>
                  </>
                );
              }
              return <li key={`answer-${i}`}>{formELm}</li>;
            })}
          </ul>
        </div>

        <div className="nav-control">
          <button
            className="icon-btn"
            onClick={handlePrevClick}
            disabled={index == 0}
          >
            <span className="material-symbols-rounded">arrow_back_ios</span>
          </button>
          <div>
            {index + 1} of {quiz.questions.length} questions
          </div>
          <button
            className="icon-btn"
            onClick={handleNextClick}
            disabled={index == quiz.questions.length - 1}
          >
            <span className="material-symbols-rounded">arrow_forward_ios</span>
          </button>
        </div>
      </div>

      <div className="footer">
        <div className="progress-bar">
          <div
            className="completed"
            style={{ width: `${(numOfAnsweredQs / questions.length) * 100}%` }}
          ></div>
        </div>
        <button
          className="btn btn-primary"
          disabled={numOfAnsweredQs != questions.length}
        >
          Submit
        </button>
      </div>
    </div>
  );
};

function calculateQuizRunnerData(quizDoc: QuizDoc): QuizRunner {
  console.log(`Calculate SelectedAnswersMap`);

  const questions: QuestionRunnerView[] = quizDoc.questions.map((q) => {
    const selectedAnswers: SelectedAnswerType[] = q.availableAnswers.map(
      (answer, id) => {
        return { id, answer, checked: false };
      }
    );

    let quest: QuestionRunnerView = {
      id: q.id,
      questionText: q.questionText,
      type: q.type,
      selectedAnswers,
      hasSomeSelectedAnswers: false,
    };

    return quest;
  });

  const quizRunnerData: QuizRunner = {
    questions,
  };

  return quizRunnerData;
}

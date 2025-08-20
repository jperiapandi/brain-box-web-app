import type React from "react";
import { Link, useNavigate, useParams } from "react-router";
import PageHeader from "../../components/headers/PageHeader";
import {
  useContext,
  useEffect,
  useRef,
  useState,
  type JSX,
  type PropsWithChildren,
} from "react";
import { UserContext } from "../../contexts/UserContext";
import { doc, getDoc, getFirestore, updateDoc } from "firebase/firestore";
import { COLXN_QUIZZES, TIME_PER_QUESTION } from "../../types/constants";
import type {
  EvaluateQuizResponse,
  QuizDoc,
  QuizRunner,
} from "../../types/quiz";

import type { User } from "firebase/auth";
import {
  Q_TYPE_CHOOSE_MULTIPLE,
  type QuestionRunnerView,
  type SelectedAnswerType,
} from "../../types/questionTypes";
import Timer from "../../components/Timer";
import ScoreCard from "../../components/ScoreCard";

import QuizReviewCmp from "../../components/QuizReviewCmp";
import { AUTH_PAGE_PATH, HOME_PAGE_PATH } from "../router";
import { getFormattedDate, getFormattedTime } from "../../utils";
import { ClaimsContext } from "../../contexts/ClaimsContext";
import Dialog, { type DialogRef } from "../../components/Dialog";
import Spinner from "../../components/Spinner";
import RecentParticipants from "../../components/RecentParticipants";

const QUIZ_BEFORE_START = "quiz-before-start";
const QUIZ_STARTED = "quiz-started";
const QUIZ_TIMED_OUT = "quiz-timed-out";
const QUIZ_SUBMITTED = "quiz-submitted";
const QUIZ_RESULT = "quiz-result";
const QUIZ_EVALUATION_ERROR = "quiz-evaluation-error";

const ViewQuizPage: React.FunctionComponent = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const quizDocRef = doc(getFirestore(), `${COLXN_QUIZZES}/${id}`);
    getDoc(quizDocRef).then(
      (snapshot) => {
        if (snapshot.exists()) {
          const result = snapshot.data() as QuizDoc;
          setQuiz(result);
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

  const user = useContext(UserContext);
  const claims = useContext(ClaimsContext);
  const deleteDialog = useRef<DialogRef>(null);

  const { id } = useParams();
  const [quiz, setQuiz] = useState<QuizDoc>();
  const [error, setError] = useState<Error>();
  const [started, setStarted] = useState<boolean>(false);
  const [timedOut, setTimedOut] = useState<boolean>(false);
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [evaluated, setEvaluated] = useState<boolean>(false);
  const [evaluatedResp, setEvaluatedResp] = useState<EvaluateQuizResponse>();
  const [evaluationFailed, setEvaluationFailed] = useState<boolean>(false);
  const [startTime, setStartTime] = useState<Date>();

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

  let uiState = QUIZ_BEFORE_START;

  if (started) {
    uiState = QUIZ_STARTED;
  }

  if (timedOut) {
    uiState = QUIZ_TIMED_OUT;
  }

  if (submitted) {
    uiState = QUIZ_SUBMITTED;
  }

  if (evaluated) {
    uiState = QUIZ_RESULT;
  }

  if (evaluationFailed) {
    uiState = QUIZ_EVALUATION_ERROR;
  }

  const handleTimeOut = (answeredQuestions: QuestionRunnerView[]) => {
    setTimedOut(true);
    //Auto submit in 1 second
    setTimeout(() => {
      const numOfAnsweredQs = answeredQuestions.filter(
        (v) => v.hasSomeSelectedAnswers
      ).length;

      if (numOfAnsweredQs == 0) {
        //Nav Back to Home Page
        navigate(-1);
      } else {
        handleSubmit(answeredQuestions);
      }
    }, 1000);
  };
  const handleSubmit = async (answeredQuestions: QuestionRunnerView[]) => {
    setSubmitted(true);
    //Load answers and evaluate
    if (id) {
      //Evaluate the Completed Quiz by Calling Evaluate Quiz API
      try {
        const questions = answeredQuestions.map((q) => {
          return {
            questionId: q.id,
            selectedAnswers: q.selectedAnswers
              .filter((v) => v.checked)
              .map((v) => v.answer),
          };
        });
        const quizToValidate: any = {
          quizId: id,
          participant: {
            uid: user?.uid,
            displayName: user?.displayName,
            isAnonymous: user?.isAnonymous,
          },
          questions,
        };

        // "http://127.0.0.1:5001/jpp-brain-box/us-central1/evaluatequiz";
        const url = "https://evaluatequiz-uigtbg5fpa-uc.a.run.app";
        const resp = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(quizToValidate),
        });
        if (!resp.ok) {
          throw new Error(`API Call failed. ${await resp.text()}`);
        }

        //
        const respData = await resp.json();
        setEvaluated(true);
        setEvaluatedResp(respData);
      } catch (error) {
        console.log(error);
        setEvaluationFailed(true);
      }
    }
  };

  const deleteQuiz = async () => {
    try {
      if (id) {
        await updateDoc(doc(getFirestore(), COLXN_QUIZZES, id), {
          status: "deleted",
          approved: false,
        });

        console.log(`Quiz is SOFT Deleted.`);
        navigate(HOME_PAGE_PATH);
      }
    } catch (err) {
      console.error(err);
    }
  };

  let childrenToShow: JSX.Element = <></>;

  switch (uiState) {
    case QUIZ_BEFORE_START:
      if (quiz && id) {
        childrenToShow = (
          <>
            <p>{quiz.desc}</p>
            <div>
              You'll tackle {quiz.questions.length} questions in this quiz, with
              an estimated completion time of{" "}
              {getFormattedTime(quiz.questions.length * TIME_PER_QUESTION)}.
            </div>
            <div className="controls-container-h-c">
              {user && claims && claims.superAdmin == true && (
                <>
                  <button
                    className="btn btn-danger"
                    disabled={user == null}
                    onClick={() => {
                      deleteDialog.current?.open();
                    }}
                  >
                    <span className="material-symbols-rounded">delete</span>
                    <span>DELETE</span>
                  </button>
                </>
              )}

              <button
                className="btn btn-primary"
                disabled={user == null}
                onClick={() => {
                  setStartTime(new Date());
                  setStarted(true);
                }}
              >
                <span className="material-symbols-rounded">play_arrow</span>
                <span>Start</span>
              </button>
            </div>
            {user == null && (
              <div>
                Please <Link to={AUTH_PAGE_PATH}>login</Link> to attempt this
                Quiz.
              </div>
            )}

            <RecentParticipants quizId={id}></RecentParticipants>
          </>
        );
      } else {
        childrenToShow = (
          <>
            <div>Loading Quiz. Please wait.</div>
            <Spinner></Spinner>
          </>
        );
      }

      break;
    case QUIZ_STARTED:
      if (user && quiz) {
        childrenToShow = (
          <>
            <QuizRunner
              quiz={calculateQuizRunnerData(quiz)}
              user={user}
              onSubmit={handleSubmit}
              onTimeOut={handleTimeOut}
            ></QuizRunner>
          </>
        );
      }
      break;
    case QUIZ_TIMED_OUT:
      childrenToShow = (
        <div>
          <h1>TIMED OUT !!</h1>
          <p>Please wait while we auto submit your answers.</p>
        </div>
      );
      break;
    case QUIZ_SUBMITTED:
      childrenToShow = (
        <div className="evaluation-progress-container">
          <Spinner />
          <p>Please wait while we evaluate your answers.</p>
        </div>
      );
      break;
    case QUIZ_RESULT:
      if (evaluatedResp) {
        childrenToShow = <QuizReviewCmp data={evaluatedResp}></QuizReviewCmp>;
      } else {
        childrenToShow = <div>...</div>;
      }
      break;
    case QUIZ_EVALUATION_ERROR:
      childrenToShow = (
        <div>Sorry some error happened while evaluating your answers.</div>
      );
      break;
    default:
      <></>;
  }

  return (
    <>
      <PageHeader
        title={title}
        subTitle={subtitle}
        navBack={true}
        profile={false}
      ></PageHeader>

      <Dialog
        title="Delete this Quiz"
        labelCancel="No, I changed my mind"
        labelConfirm="Yes, Delete"
        ref={deleteDialog}
        onConfirm={deleteQuiz}
      >
        <div>Do you really want to delete this Quiz ?</div>
        <div>Deleted quizzes can not be recovered.</div>
      </Dialog>

      <main className="page-content">
        {started && (
          <div className="quiz-participation-detail">
            <div>
              <div className="name-value-pair">
                <span>Participant:</span>
                <span>{user?.displayName}</span>
              </div>

              <div className="name-value-pair">
                <span>Email:</span>
                {user?.isAnonymous ? (
                  <span>No Email (Anonymous user)</span>
                ) : (
                  <span>{user?.email}</span>
                )}
              </div>

              <div className="name-value-pair">
                <span>Start Time:</span>
                <span>{getFormattedDate(startTime)}</span>
              </div>
            </div>

            {evaluated != true && submitted != true && quiz && (
              <Timer totalTime={quiz.questions.length * TIME_PER_QUESTION} />
            )}
            {evaluated && evaluatedResp && (
              <ScoreCard
                score={evaluatedResp.scoreSum}
                total={evaluatedResp.questionsEvaluated.length}
              ></ScoreCard>
            )}
          </div>
        )}
        {childrenToShow}
      </main>
    </>
  );
};

export default ViewQuizPage;

type QuizRunnerProps = PropsWithChildren & {
  quiz: QuizRunner;
  user: User;
  onTimeOut: (answeredQuestions: QuestionRunnerView[]) => void;
  onSubmit: (answeredQuestions: QuestionRunnerView[]) => void;
};

const QuizRunner: React.FunctionComponent<QuizRunnerProps> = ({
  quiz,
  onTimeOut,
  onSubmit,
}) => {
  //Question index
  const [index, setIndex] = useState(0);
  const [questions, setQuestions] = useState(quiz.questions);

  const questionsLatest = useRef(quiz.questions);

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

  useEffect(() => {
    const timeout = setTimeout(() => {
      onTimeOut(questionsLatest.current);
    }, quiz.questions.length * TIME_PER_QUESTION);

    return () => {
      clearTimeout(timeout);
    };
  }, [quiz]);

  useEffect(() => {
    questionsLatest.current = questions;
  }, [questions]);

  return (
    <div className="quiz-runner">
      <div className="question-body">
        <div className="question-n-answers" id={curQuestion.id}>
          <h3>{`${index + 1}. ${curQuestion.questionText}`}</h3>
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
          onClick={() => {
            onSubmit(questions);
          }}
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

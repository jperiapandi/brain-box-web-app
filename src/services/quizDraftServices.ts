import {
  addDoc,
  collection,
  doc,
  getFirestore,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import {
  QUIZ_STATUS_DRAFT,
  QUIZ_STATUS_SUBMITTED,
  type QuizDraft,
} from "../types/quizDraft";
import { Q_TYPE_UNKNOWN } from "../types/questionTypes";

const validateQuizDraft = (data: QuizDraft) => {
  const hasValidTitle = data.title.trim() != "";
  const hasValidDesc = data.desc.trim() != "";

  if (!hasValidTitle) {
    throw new Error(`Title can not be empty.`);
  }
  if (!hasValidDesc) {
    throw new Error(`Description can not be empty.`);
  }

  if (data.questions.length == 0) {
    throw new Error(`There are no questions in the Quiz.`);
  }

  const invalidQuestions = data.questions.filter((q) => {
    const hasQType = q.type != Q_TYPE_UNKNOWN;
    const hasQText = q.questionText.trim() != "";

    const correctAnswers = q.answersMap[q.type].filter((ans) => ans.checked);
    const someAnswersSet = correctAnswers.length != 0;

    if (hasQType && hasQText && someAnswersSet) {
      //Valid Question
      return false;
    } else {
      //Invalid Question
      return true;
    }
  });

  const allQACorrect = invalidQuestions.length == 0;

  if (hasValidTitle && hasValidDesc && allQACorrect) {
    return true;
  } else {
    throw new Error(`Quiz Form has some errors. Please fix them.`);
  }
};

export const saveQuizDraft = (data: QuizDraft) => {
  return new Promise<string>(async (resolve, reject) => {
    try {
      validateQuizDraft(data);

      //Set createdAt timestamp
      data.status = QUIZ_STATUS_DRAFT;
      data.createdAt = serverTimestamp();
      data.updatedAt = serverTimestamp();

      //Create a new Doc in Firestore collection 'quiz-drafts'
      const nDocRef = await addDoc(
        collection(getFirestore(), "quiz-drafts"),
        data
      );
      console.log(`New Quiz is created in Firestore. `, nDocRef, nDocRef.id);
      resolve(nDocRef.id);
    } catch (error) {
      reject(error);
    }
  });
};

export const updateQuizDraft = (quizDraftId: string, data: QuizDraft) => {
  return new Promise<string>(async (resolve, reject) => {
    try {
      validateQuizDraft(data);
      //Update the existing document
      data.updatedAt = serverTimestamp();
      //
      const docRef = doc(getFirestore(), `quiz-drafts/${quizDraftId}`);
      await setDoc(docRef, data, { merge: true });
      console.log(`Existing Quiz is updated.`);
      resolve(docRef.id);
    } catch (error) {
      reject(error);
    }
  });
};
export const submitQuizDraft = (
  quizDraftId: string,
  isDirty: boolean,
  data: QuizDraft
) => {
  return new Promise<void>(async (resolve, reject) => {
    try {
      const docRef = doc(getFirestore(), `quiz-drafts/${quizDraftId}`);
      validateQuizDraft(data);
      if (isDirty) {
        //Save the doc
        const dataToUpdate: QuizDraft = {
          ...data,
          status: QUIZ_STATUS_SUBMITTED,
          submittedAt: serverTimestamp(),
        };
        await setDoc(docRef, dataToUpdate, { merge: true });
      } else {
        //Just update the field 'status' value to 'submitted'
        await updateDoc(docRef, {
          status: QUIZ_STATUS_SUBMITTED,
          submittedAt: serverTimestamp(),
        });
      }

      resolve();
    } catch (error) {
      reject(error);
    }
  });
};

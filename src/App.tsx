import { useEffect, useState } from "react";
import {
  getFirestore,
  getDocs,
  collection,
  query,
  where,
} from "firebase/firestore";
import { getApp } from "firebase/app";
import "./App.css";
import { type Quiz } from "./types/Quiz";

function App() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  useEffect(() => {
    //Load Quizzes
    const store = getFirestore(getApp());
    const quizzesColxn = collection(store, "quizzes");
    const q = query(quizzesColxn, where("approved", "==", true));
    getDocs(q).then((querySnapshot) => {
      if (querySnapshot.empty) {
        console.log(`Quizzes Collection Not Available.`);
      } else {
        const docs = querySnapshot.docs.map((d) => {
          return { ...d.data(), id: d.id } as Quiz;
        });
        setQuizzes(docs);
      }
    });
  }, []);

  return (
    <>
      <nav>
        <div>
          <span className="material-symbols-rounded">menu</span>
        </div>
        <h1>Brian Box</h1>
      </nav>

      <ul>
        {quizzes.map((quiz) => {
          return <li key={quiz.id}>{quiz.title}</li>;
        })}
      </ul>
    </>
  );
}

export default App;

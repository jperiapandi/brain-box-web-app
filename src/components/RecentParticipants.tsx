import {
  collection,
  getDocs,
  getFirestore,
  limit,
  query,
} from "firebase/firestore";
import { useEffect, useState, type PropsWithChildren } from "react";
import type React from "react";
import { COLXN_QUIZZES } from "../types/constants";
import { type QuizParticipant } from "../types/participation";
import { getFormattedDate } from "../utils";

type RecentParticipantsProps = PropsWithChildren & {
  quizId: string;
};
const RecentParticipants: React.FunctionComponent<RecentParticipantsProps> = ({
  quizId,
}) => {
  const [participants, setParticipants] = useState<QuizParticipant[]>([]);

  useEffect(() => {
    const p = `${COLXN_QUIZZES}/${quizId}/participants`;
    console.log(p);

    const q = query(collection(getFirestore(), p), limit(5));

    getDocs(q).then(
      (snapshot) => {
        if (snapshot.empty) {
          //No participants yet
          console.warn(`No Participants`);
        } else {
          const result = snapshot.docs.map((doc) => {
            return doc.data() as QuizParticipant;
          });

          result.sort((a, b) => {
            return b.participatedAt.toMillis() - a.participatedAt.toMillis();
          });

          setParticipants(result);
        }
      },
      (reason) => {
        console.error(reason);
        setParticipants([]);
      }
    );
  }, []);

  if (participants.length === 0) {
    return null;
  }

  return (
    <>
      <div className="recent-participants-container">
        <h3>Recent Participants</h3>
        <div className="participants-list">
          {participants.map((p) => {
            return (
              <div
                className="participant"
                key={p.uid + p.participatedAt.toString()}
              >
                <div className="display-name">{p.displayName}</div>
                <div className="participated-at">
                  Participated at {getFormattedDate(p.participatedAt)}
                </div>
                <div className="score">
                  Score {parseFloat(p.score.toFixed(2))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default RecentParticipants;

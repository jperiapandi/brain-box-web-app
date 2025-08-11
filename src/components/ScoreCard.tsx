import { type PropsWithChildren } from "react";
import type React from "react";

type ScoreCardProps = PropsWithChildren & {
  score: number;
  total: number;
};
const ScoreCard: React.FunctionComponent<ScoreCardProps> = ({
  score,
  total,
}) => {
  let appreciationMsg: string = "You can do better!";
  const percentage = (score / total) * 100;
  if (percentage > 50) {
    appreciationMsg = "Good job!";
  }
  if (percentage > 60) {
    appreciationMsg = "Well done! 💐";
  }
  if (percentage > 70) {
    appreciationMsg = "Great! 💐💐";
  }
  if (percentage > 90) {
    appreciationMsg = "Excellent! 💐💐💐";
  }
  return (
    <div className="score-card">
      <div>Score:</div>
      <div className="score-value">{score}</div>
      <div>{appreciationMsg}</div>
    </div>
  );
};

export default ScoreCard;

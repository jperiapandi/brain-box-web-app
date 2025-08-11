import { useEffect, useState, type PropsWithChildren } from "react";
import type React from "react";

type TimerProps = PropsWithChildren & {
  totalTime?: number; //In Milliseconds
  onTimeOut?: () => void;
};
const Timer: React.FunctionComponent<TimerProps> = ({
  totalTime = 5 * 1000,
  onTimeOut,
}) => {
  const [startTime] = useState(new Date().getTime());
  const [remaining, setRemaining] = useState(totalTime);

  useEffect(() => {
    const tick = 100;
    const timeout = setInterval(() => {
      const now = new Date().getTime();
      const elapsed = now - startTime;
      const remaining = totalTime - elapsed;
      if (remaining <= 0) {
        setRemaining(0);
        clearTimeout(timeout);
        //Timed Out
        if (onTimeOut) {
          onTimeOut();
        }
      } else {
        setRemaining(remaining);
      }
    }, tick);

    return () => {
      clearTimeout(timeout);
    };
  }, [totalTime]);

  const rSecs = remaining / 1000;
  const rMins = rSecs / 60;
  const rHrs = rMins / 60;

  const timeStamp = `
  ${String(Math.floor(rHrs % 12)).padStart(2, "0")} : 
  ${String(Math.floor(rMins % 60)).padStart(2, "0")} : 
  ${String(Math.floor(rSecs % 60)).padStart(2, "0")}
  `;
  //
  return <div>{timeStamp}</div>;
};

export default Timer;

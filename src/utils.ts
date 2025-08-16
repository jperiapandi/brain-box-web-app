import type { Timestamp } from "firebase/firestore";

export function getFormattedDate(timestamp: Timestamp) {
  if (!timestamp) {
    return "";
  }

  const date = timestamp.toDate();
  if (isNaN(date.getTime())) {
    return "";
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hh = String(date.getHours()).padStart(2, "0");
  const mm = String(date.getMinutes()).padStart(2, "0");
  const ss = String(date.getSeconds()).padStart(2, "0");
  return `${month}/${day}/${year} ${hh}:${mm}:${ss}`;
}

export function getFormattedTime(time: number) {
  const seconds = time / 1000;
  const minutes = seconds / 60;
  const hours = minutes / 60;

  const pSecs = Math.round(seconds) % 60;
  const pMins = Math.round(Math.floor(minutes)) % 60;
  const pHours = Math.round(Math.floor(hours));

  if (pHours > 0) {
    return `${Math.round(pHours)} hours, ${Math.round(
      pMins
    )} minutes & ${Math.round(pSecs)} seconds`;
  }

  if (pMins > 0) {
    if (pSecs) {
      return `${pMins} minutes & ${pSecs} seconds`;
    } else {
      return `${pMins} minutes`;
    }
  }
  if (pSecs > 0) {
    return `${pSecs} seconds`;
  }

  return ``;
}

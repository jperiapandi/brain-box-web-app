import { Timestamp } from "firebase/firestore";

export function getFormattedDate(ipValue: Timestamp | Date | unknown) {
  let date: Date | undefined;

  if (ipValue instanceof Date) {
    date = ipValue;
  } else if (ipValue instanceof Timestamp) {
    date = ipValue.toDate();
  } else {
    date = undefined;
  }

  if (date == undefined) {
    return "";
  }

  const now = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hh = String(date.getHours()).padStart(2, "0");
  const mm = String(date.getMinutes()).padStart(2, "0");
  // const ss = String(date.getSeconds()).padStart(2, "0");

  if (year == now.getFullYear()) {
    return `${month}/${day} ${hh}:${mm}`;
  }
  return `${month}/${day}/${year} ${hh}:${mm}`;
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

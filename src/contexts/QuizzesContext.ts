import { createContext } from "react";
import type { Quiz } from "../types/Quiz";

export const QuizzesContext = createContext<Quiz[]>([]);

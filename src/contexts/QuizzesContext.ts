import { createContext } from "react";
import type { QuizItem } from "../types/quiz";

export const QuizzesContext = createContext<QuizItem[]>([]);

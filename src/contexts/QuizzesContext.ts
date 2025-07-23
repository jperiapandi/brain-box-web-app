import { createContext } from "react";
import type { Quiz } from "../types/quiz";

export const QuizzesContext = createContext<Quiz[]>([]);

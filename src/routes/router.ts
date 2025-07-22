import { createBrowserRouter } from "react-router";
import HomePage from "./pages/HomePage";
import AuthPage from "./pages/AuthPage";
import CreateQuizPage from "./pages/CreateQuizPage";
import ViewQuizPage from "./pages/ViewQuizPage";
import App from "../App";
import EditQuizPage from "./pages/EditQuizPage";

export const HOME_PAGE_PATH = "/";
export const AUTH_PAGE_PATH = "auth";
export const CREATE_QUIZ_PAGE_PATH = "create-quiz";
export const VIEW_QUIZ_PAGE_PATH = "quiz/:id";
export const EDIT_QUIZ_PAGE_PATH = "quiz/edit/:id";

const router = createBrowserRouter([
  {
    path: HOME_PAGE_PATH,
    Component: App,
    children: [
      {
        index: true,
        Component: HomePage,
      },
      {
        path: AUTH_PAGE_PATH,
        Component: AuthPage,
      },
      {
        path: CREATE_QUIZ_PAGE_PATH,
        Component: CreateQuizPage,
      },
      {
        path: VIEW_QUIZ_PAGE_PATH,
        Component: ViewQuizPage,
      },
      {
        path: EDIT_QUIZ_PAGE_PATH,
        Component: EditQuizPage,
      },
    ],
  },
]);

export default router;

import { createBrowserRouter } from "react-router";
import HomePage from "./pages/HomePage";
import AuthPage from "./pages/AuthPage";
import CreateQuizPage from "./pages/CreateQuizPage";
import ViewQuizPage from "./pages/ViewQuizPage";
import App from "../App";
import ProfilePage from "./pages/ProfilePage";
import EditQuizPage from "./pages/EditQuizPage";
import ReviewQuizPage from "./pages/ReviewQuizPage";

export const HOME_PAGE_PATH = "/";
export const AUTH_PAGE_PATH = "/auth";
export const CREATE_QUIZ_PAGE_PATH = "create-quiz";
export const VIEW_QUIZ_PAGE_PATH = "quiz/:id";
export const EDIT_QUIZ_PAGE_PATH = "quiz/edit/:id";
export const PROFILE_PAGE_PATH = "/profile";
export const REVIEW_PAGE_PATH = "/review/:id";

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
      {
        path: PROFILE_PAGE_PATH,
        Component: ProfilePage,
      },
      {
        path: REVIEW_PAGE_PATH,
        Component: ReviewQuizPage,
      },
    ],
  },
]);

export default router;

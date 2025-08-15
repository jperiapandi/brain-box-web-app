import type React from "react";
import { useContext } from "react";
import { Navigate, Outlet } from "react-router";
import { UserContext } from "../contexts/UserContext";
import { AUTH_PAGE_PATH } from "../routes/router";

const ProtectedRoue: React.FunctionComponent = () => {
  console.log(`Rendering protected route`);

  const user = useContext(UserContext);
  if (user) {
    return <Outlet></Outlet>;
  } else {
    return <Navigate to={AUTH_PAGE_PATH}></Navigate>;
  }
};

export default ProtectedRoue;

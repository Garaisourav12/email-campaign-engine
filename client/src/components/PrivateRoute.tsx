import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useGlobalContext } from "../context";
import PageLoader from "./PageLoader";

type Props = {};

const PrivateRoute: React.FC<Props> = () => {
  const { user, checkingToken } = useGlobalContext();

  if (checkingToken) {
    return <PageLoader />;
  } else if (!user) {
    return <Navigate to="/" replace />;
  } else {
    return <Outlet />;
  }
};

export default PrivateRoute;

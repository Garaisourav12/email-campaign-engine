import React from "react";
import { Outlet } from "react-router-dom";

type Props = {};

const PrivateRoute: React.FC<Props> = () => {
  return <Outlet />;
};

export default PrivateRoute;

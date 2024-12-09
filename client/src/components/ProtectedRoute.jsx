/* eslint-disable react/prop-types */
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  const { currentUser } = useSelector((store) => store.user);

  return currentUser ? <Outlet /> : <Navigate to="/" />;
};
export default ProtectedRoute;

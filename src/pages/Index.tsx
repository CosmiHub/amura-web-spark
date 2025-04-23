
import { useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";

const Index = () => {
  const location = useLocation();
  
  useEffect(() => {
    console.log("Index component rendering", location.pathname);
  }, [location.pathname]);

  // Redirect to the home page
  return <Navigate to="/" replace />;
};

export default Index;

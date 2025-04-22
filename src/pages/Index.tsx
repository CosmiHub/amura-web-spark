
import { useEffect } from "react";
import { Navigate } from "react-router-dom";

const Index = () => {
  useEffect(() => {
    console.log("Index component rendering");
  }, []);

  // Redirect to the HomePage component
  return <Navigate to="/" replace />;
};

export default Index;

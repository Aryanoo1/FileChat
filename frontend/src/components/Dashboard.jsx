import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Typewriter from "typewriter-effect";
import "../css/Dashboard.css";

const Dashboard = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const sessionName = params.get("sessionName");

  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/chats");
    }, 15000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="dashboard">
      <Typewriter
        options={{
          strings: [`Welcome ${sessionName}!`, `Let's Get Started . . .`],
          autoStart: true,
          loop: false,
          onStringTyped: (index) => {
            if (index === 1) {
              navigate("/chats");
            }
          },
        }}
      />
    </div>
  );
};

export default Dashboard;

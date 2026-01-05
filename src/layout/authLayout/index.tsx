import "./style.scss";
import Banner from "../../assets/images/Frame.png";

import { Outlet } from "react-router";

const AuthLayout = () => {
  return (
    <div className="auth-layout">
      <div className="auth-container">
        <div className="auth-left">
          <div className="auth-left-content">
            <img src={Banner} alt="Banner" className="auth-banner" />
          </div>
        </div>

        <div className="auth-right">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;

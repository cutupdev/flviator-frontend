import React from "react";

import "../index.scss";
import Context from "../context";
export default function Header() {
  const { state } = React.useContext(Context);

  return (
    <div className="header flex-none items-center">
      <div className="header-container">
        <div className="second-block">
          <div className="d-flex">
            <div className="balance">
              <span className="amount">
                {Number(state.userInfo.balance).toFixed(2)}{" "}
              </span>
              <span className="currency">&nbsp;INR</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

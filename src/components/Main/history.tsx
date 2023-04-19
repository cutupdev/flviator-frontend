import React from "react";
// import { useCrashContext } from "./context";
import Context from "../../context";

export default function History() {
  const { history } = React.useContext(Context);

  const [showHistory, setShowHistory] = React.useState(false);

  return (
    <div className="stats">
      <div className="payouts-wrapper">
        <div className="payouts-block">
          {!!history.length && history.map((item, key) => (
            <div key={key} className="payout">
              <div className={`item opacity-${100 - 2 * key} ${Number(item) < 2 ? "blue" : Number(item) < 10 ? "purple" : "big"}`}>{Number(item).toFixed(2)}x</div>
            </div>
          ))}
        </div>
      </div>
      <div className="button-block" onClick={() => setShowHistory(!showHistory)}>
        <div className="button dropdown-toggle">
          <div className="trigger">
            <div className="history-icon"></div>
            <div className={`dd-icon ${showHistory ? "up" : ""}`}></div>
          </div>
        </div>
      </div>
      {!!showHistory && <div className="dropdown-menu">
        <div className="wrapper">
          <div className="header-2">
            <div> Round history </div>
          </div>
          <div className="payouts-block">
            {!!history.length && history.map((item, key) => (key < 123 &&
              <div key={key} className="payout">
                <div className={`bubble-multiplier ${Number(item) < 2 ? "blue" : Number(item) < 10 ? "purple" : "big"}`}>{Number(item).toFixed(2)}x</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      }
    </div>
  );
}

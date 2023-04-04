import { useCrashContext } from "./Main/context";
import avatar from "../assets/images/av-5.png"
export default function BetsUsers() {
  const [state] = useCrashContext();

  return (
    <div className="info-board">
      <div className="bets-block">
        <div className="bet-block-nav">
          <div style={{ height: "24px" }}>
            <div className="navigation-switcher">
              <button className="tab">All</button>
              <button className="tab">My</button>
              <button className="tab">Top</button>
            </div>
          </div>
        </div>
        <div className="data-list">
          <div>
            <div className="all-bets-block">
              <div className="uppercase">ALL BETS</div>
              <div className="previous-hand items-center flex justify-between">
                <div className="history-i"></div>
                <span className="ml-1">Previous hand</span>
              </div>
            </div>
            <div className="spacer"></div>
            <div className="total-bets-block">
              <div className="user-i"></div>
              <div>{state.bettedUsers?.length}</div>
            </div>
            <div className="spacer"></div>
            <div className="legend">
              <span className="user">User</span>
              <span className="bet">Bet, USD</span>
              <span>X</span>
              <span className="cash-out">Cash out, USD</span>
            </div>
          </div>
          <div className="cdk-virtual-scroll-viewport">
            <div className="cdk-virtual-scroll-content-wrapper">
              {state && state.bettedUsers && state.bettedUsers.map((user, key) => (
                <div className={`bet-item ${user.cashouted ? "celebrated" : ""}`} key={key}>
                  <div className="user">
                    <img className="avatar" src={avatar} alt="avatar" />
                    <div className="username">{user.username.slice(0, 1) + "***" + user.username.slice(-1)}</div>
                  </div>
                  <div className="bet">
                    {Number(user.betAmount).toFixed(2)}
                  </div>
                  {user.cashouted &&
                    <div className="multiplier-block">
                      <div className="bubble">{Number(user.target).toFixed(2)}</div>
                    </div>
                  }
                  <div className="cash-out">{Number(user.cashOut) > 0 ? Number(user.cashOut).toFixed(2) : ""}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

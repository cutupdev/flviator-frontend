import { useCrashContext } from "../Main/context";
import { useEffect, useState } from "react";
import AllData from "./allData";
import MyBets from "./myBets";
import TopHistory from "./topHistory";

export default function BetsUsers() {
  const [state, , , getMyBets] = useCrashContext();

  const [headerType, setHeaderType] = useState("all");
  const [allData, setAllData] = useState([]);
  const [pre, setPre] = useState(false);

  const header = [
    { type: "all", value: "All Bets" },
    { type: "my", value: "My Bets", onClick: "myBet" },
    { type: "top", value: "Top" }
  ]

  const getData = (e) => {
    if (e === "myBet")
      getMyBets();
  }

  useEffect(() => {
    if (pre) {
      setAllData(state.previousHand);
    } else {
      setAllData(state.bettedUsers);
    }
  }, [pre, state.bettedUsers, state.previousHand])

  return (
    <div className="info-board">
      <div className="bets-block">
        <div className="bet-block-nav">
          <div style={{ height: "24px" }}>
            <div className="navigation-switcher">
              {header.map((item, index) => (
                <button key={index} className={`tab ${headerType === item.type ? "click" : ""}`} onClick={() => { setHeaderType(item.type); item.onClick && getData(item.onClick) }}>{item.value}</button>
              ))}
            </div>
          </div>
        </div>
        <div className="data-list">
          {headerType === "all" ?
            <AllData setPre={setPre} pre={pre} allData={allData} /> : headerType === "my" ?
              <MyBets /> :
              <TopHistory />
          }
        </div>
      </div>
      <div className="bets-footer">
        <div className="provably-fair-block">
          <span>This game is </span>
          <div className="provably-fair">
            <div className="i-fair"></div>
            <span className="text-provably-fair">Provably Fair</span>
          </div>
        </div>
        <div className="logo-block">
          <span>Powered by</span>
          <a target="_blank" href="https://spribe.co">
            <div className="i-logo"></div>
          </a>
        </div>
      </div>
    </div>
  );
}

import React from "react";
import "./main.scss";
import History from "./history";
import Crash from "../crash/index";
import Bet from "./bet";

export default function Main() {
  const [addBetPanel, setAddBetPanel] = React.useState(true);
  return (
    <div className="game-play">
      <div className="result-history">
        <History />
      </div>
      <div className="stage-board">
        <div className="play-board-wrapper">
          <div className="stage-canvas">
            <Crash />
          </div>
          <div className="dom-container">
            <div className="fun-mode">FUN MODE</div>
          </div>
        </div>
      </div>
      <div className="bet-controls">
        <div className="controls">
          <Bet index={"f"} add={addBetPanel} setAdd={setAddBetPanel} />
          {addBetPanel &&
            <Bet index={"s"} add={addBetPanel} setAdd={setAddBetPanel} />
          }
        </div>
      </div>
    </div>
  );
}

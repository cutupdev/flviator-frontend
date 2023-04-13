import "./main.scss";
import History from "./history";
import Crash from "../crash/index";
import Bet from "./bet";

export default function Main() {
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
          <Bet index={"f"} />
          <Bet index={"s"} />
        </div>
      </div>
    </div>
  );
}

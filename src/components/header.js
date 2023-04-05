import logo from "../assets/images/logo.png";
import help from "../assets/images/help.svg";
import "../index.scss";
import { useCrashContext } from "./Main/context";
export default function Header() {
  const [state] = useCrashContext();
  return (
    <div className="header flex-none items-center">
      <div className="header-container">
        <div className="logo-container">
          <img src={logo} alt="logo" className="logo"></img>
        </div>
        <div className="second-block">
          <button className="howto">
            <div className="help-logo"></div>
            <div className="help-msg">How to play ?</div>
          </button>
          <div className="d-flex">
            <div className="balance">
              <span className="amount">{Number(state.balance).toFixed(2)} </span>
              <span className="currency">USD</span>
            </div>
          </div>
          <div className="dropdown">
            <div className="dropdown-toggle">
              <div className="burger"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

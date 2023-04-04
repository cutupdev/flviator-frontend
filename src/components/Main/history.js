import { useCrashContext } from "./context";

export default function History() {
  const [state] = useCrashContext();

  return (
    <div className="stats">
      <div className="payouts-wrapper">
        <div className="payouts-block">
          {state.history && state.history.map((item, key) => (
            <div key={key} className="payout">
              <div className={`item opacity-${100 - 2 * key} ${Number(item) < 2 ? "blue" : Number(item) < 10 ? "purple" : "big"}`}>{Number(item).toFixed(2)}x</div>
            </div>
          ))}
        </div>
      </div>
      <div className="button-block">
        <div className="button dropdown-toggle">
          <div className="trigger">
            <div className="history-icon"></div>
            <div className="dd-icon"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

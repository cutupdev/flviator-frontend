import React from "react";
// import { useCrashContext } from "../Main/context";
import Context from "../../context";

const MyBets = () => {
    const state = React.useContext(Context)
    // const [state] = useCrashContext();

    return (
        <>
            <div className="legend">
                <div className="date">Date</div>
                <div className="bet-100">
                    <span className="bet">Bet, INR</span>
                    <span>X</span>
                    <span className="cash-out"> Cash out, INR </span>
                </div>
                <div className="tools"></div>
            </div>
            <div className="cdk-virtual-scroll-viewport">
                <div className="cdk-virtual-scroll-content-wrapper">
                    {state && state.state.myBets.map((user, key) => (
                        <div className={`bet-item pr-2 ${user.cashouted ? "celebrated" : ""}`} key={key}>
                            <div className="user">
                                <div className="username">{new Date(user.date).getHours() + ":" + new Date(user.date).getMinutes()}</div>
                            </div>
                            <div className="bet">
                                {Number(user.betAmount).toFixed(2)}
                            </div>
                            {user.cashouted &&
                                <div className="multiplier-block">
                                    <div className="bubble">{Number(user.cashoutAt).toFixed(2)}</div>
                                </div>
                            }
                            <div className="cash-out">{user.cashouted ? Number(user.betAmount * user.cashoutAt).toFixed(2) : ""}</div>
                            <div className="tools">
                                <div className="fairness-i"></div>
                                <div className="share-i"></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    )
}

export default MyBets;
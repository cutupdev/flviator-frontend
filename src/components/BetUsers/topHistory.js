import { useState } from "react";
import bets from "./bets.scss"

const TopHistory = () => {
    const [type, setType] = useState(0);
    return (
        <>
            <div className="navigation-switcher-wrapper">
                <div className="navigation-switcher">
                    <div className="slider" style={{ transform: `translate(${100 * type}px)` }}></div>
                    <button onClick={() => setType(0)} className={`tab`}>
                        Day
                    </button>
                    <button onClick={() => setType(1)} className={`tab`}>
                        Month
                    </button>
                    <button onClick={() => setType(2)} className={`tab`}>
                        Year
                    </button>
                </div>
            </div>
            <div className="top-list-wrapper">
                <div className="top-items-list scroll-y">
                    <div className="bet-item">
                        <div className="main">
                            <div className="icon">
                                <img className="avatar"></img>
                                <div className="username">d***3</div>
                            </div>
                            <div className="w-100">
                                <div className="d-flex justify-content-center align-items-center w-100">
                                    <div className="d-flex align-items-center w-100">
                                        <div className="d-flex bets w-50">
                                            <span>Bet</span>
                                            <span>, INR:</span>
                                        </div>
                                        <span className="amount">1.00</span>
                                    </div>
                                </div>
                            </div>
                            <div className="d-flex align-items-center">
                                <div className="w-50 d-flex justify-content-end ml-3">
                                    <span> Cashed out: </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default TopHistory;
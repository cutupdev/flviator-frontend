import React from "react"
import Context, { BettedUserType, UserType } from "../../context";
// import { useCrashContext } from "../Main/context";

interface AllDataProps {
    pre: boolean
    setPre: React.Dispatch<React.SetStateAction<boolean>>
    allData: UserType[] | BettedUserType[]
}

const AllData = ({ pre, setPre, allData }: AllDataProps) => {
    const state = React.useContext(Context)
    // const [state] = useCrashContext();

    return (
        <>
            <div>
                <div className="all-bets-block">
                    <div>
                        <div className="uppercase">ALL BETS</div>
                        <div>{state.bettedUsers?.length}</div>
                    </div>
                    <div className={`previous-hand items-center flex justify-between ${pre ? "click" : ""}`}>
                        <div className="history-i"></div>
                        <span className="ml-1 " onClick={() => { setPre(!pre) }}>Previous hand</span>
                    </div>
                </div>
                <div className="spacer"></div>
                <div className="legend">
                    <span className="user">User</span>
                    <span className="bet">Bet, INR</span>
                    <span>X</span>
                    <span className="cash-out">Cash out, INR</span>
                </div>
            </div>
            <div className="cdk-virtual-scroll-viewport">
                <div className="cdk-virtual-scroll-content-wrapper">
                    {allData?.map((user, key) => (
                        <div className={`bet-item ${user.cashouted ? "celebrated" : ""}`} key={key}>
                            <div className="user">
                                {user.img ?
                                    <img className="avatar" src={user.img} alt="avatar" /> :
                                    <img className="avatar" src="./avatars/av-5.png" alt="avatar" />
                                }
                                <div className="username">{user.name?.slice(0, 1) + "***" + user.name?.slice(-1)}</div>
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
        </>
    )
};

export default AllData;
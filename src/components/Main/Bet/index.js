import React, { useEffect, useState } from "react";
import { useCrashContext } from "../context";
import { toast } from 'react-toastify';

export default function Bet(props) {
    const [state, dispatch, callCashOut] = useCrashContext();
    const [gameType, setGameType] = useState("manual");
    const [betOpt, setBetOpt] = useState("1");
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        console.log(showModal);
    }, [showModal])
    const { index } = props;

    const minus = (type) => {
        if (state[`${index + type}`] - 0.1 < 0.1) {
            dispatch({
                type: `${index + type}`,
                payload: 0.1
            })
        } else {
            dispatch({
                type: `${index + type}`,
                payload: (Number(state[`${index + type}`]) - 0.1).toFixed(2)
            })
        }
    }

    const plus = (type) => {
        if (state[`${index + type}`] + 0.1 > state.balance) {
            dispatch({
                type: `${index + type}`,
                payload: Number(state.balance).toFixed(2)
            })
        } else {
            dispatch({
                type: `${index + type}`,
                payload: (Number(state[`${index + type}`]) + 0.1).toFixed(2)
            })
        }
    }

    const manualPlus = (amount, btnNum) => {
        if (betOpt === btnNum) {
            dispatch({
                type: `${index}betAmount`,
                payload: (Number(state[`${index}betAmount`]) + amount).toFixed(2)
            })
        } else {
            dispatch({
                type: `${index}betAmount`,
                payload: Number(amount).toFixed(2)
            })
            setBetOpt(btnNum);
        }
    }

    const changeBetType = (e) => {
        dispatch({
            type: "betState",
            payload: false
        });
        setGameType(e);
    }

    const onChangeBlur = (e, type) => {
        if (type === "cashOutAt") {
            if (e < 1.01) {
                dispatch({
                    type: index + type,
                    payload: 1.01
                })
            } else {
                dispatch({
                    type: index + type,
                    payload: Number(e).toFixed(2)
                })
            }
        } else {
            if (e < 0.1) {
                dispatch({
                    type: index + type,
                    payload: 0.1
                })
            } else {
                dispatch({
                    type: index + type,
                    payload: e
                })
            }
        }
    }

    const onBetClick = () => {
        dispatch({
            type: `${index}betState`,
            payload: !state[`${index}betState`]
        });
    }
    const setCount = (amount) => {
        dispatch({
            type: `${index}autoCound`,
            payload: amount
        })
    }

    const reset = () => {
        dispatch({
            type: `${index}autoCound`,
            payload: 0
        });
        dispatch({
            type: `${index}decrease`,
            payload: 0
        });
        dispatch({
            type: `${index}deState`,
            payload: false
        });
        dispatch({
            type: `${index}increase`,
            payload: 0
        });
        dispatch({
            type: `${index}inState`,
            payload: false
        });
        dispatch({
            type: `${index}singleAmount`,
            payload: 0
        });
        dispatch({
            type: `${index}single`,
            payload: false
        });
    }

    const onAutoBetClick = (state) => {
        dispatch({
            type: `${index}betState`,
            payload: state
        });
        dispatch({
            type: `${index}auto`,
            payload: !state[`${index}auto`]
        })

        if (!state) {
            setCount(0);
        }
    }

    const onStartBtnClick = () => {
        console.log(state[`${index}autoCound`]);
        if (state[`${index}autoCound`] > 0) {
            if (state[`${index}deState`] || state[`${index}inState`]) {
                onAutoBetClick(true);
                setShowModal(false);
            } else {
                toast.error("Please, specify decrease or exceed stop point");
            }
        } else {
            toast.error("Please, set number of rounds");
        }
    }
    return (
        <div className="bet-control">
            <div className="controls">
                <div className="navigation">
                    <div className="navigation-switcher">
                        {state[`${index}betted`] || state[`1${index}betState`] ?
                            <>
                                <button className={gameType === "manual" ? "active" : ""} >MANUAL</button>
                                <button className={gameType === "auto" ? "active" : ""} >AUTO</button>
                            </> :
                            <>
                                <button className={gameType === "manual" ? "active" : ""} onClick={() => changeBetType("manual")}>MANUAL</button>
                                <button className={gameType === "auto" ? "active" : ""} onClick={() => changeBetType("auto")}>AUTO</button>
                            </>
                        }
                    </div>
                </div>
                <div className="first-row">
                    <div className="bet-block">
                        <div className="bet-spinner">
                            <div className={`spinner ${state[`${index}betState`] || state[`${index}betted`] ? "disabled" : ""}`}>
                                <div className="buttons">
                                    <button className="minus" onClick={() => minus("betAmount")}></button>
                                </div>
                                <div className="input">
                                    {state[`${index}betState`] || state[`${index}betted`] ?
                                        <input type="number" value={state[`${index}betAmount`]} readOnly ></input>
                                        :
                                        <input type="number" value={state[`${index}betAmount`]} onChange={(e) => dispatch({ type: `${index}betAmount`, payload: e.target.value })}></input>
                                    }
                                </div>
                                <div className="buttons">
                                    <button className="plus" onClick={() => plus("betAmount")}></button>
                                </div>
                            </div>
                        </div>
                        {state[`${index}betState`] || state[`${index}betted`] ?
                            <div className="bet-opt-list">
                                <button className="bet-opt disabled">
                                    <span>1</span>
                                </button>
                                <button className="bet-opt disabled">
                                    <span>2</span>
                                </button>
                                <button className="bet-opt disabled">
                                    <span>5</span>
                                </button>
                                <button className="bet-opt disabled">
                                    <span>10</span>
                                </button>
                            </div>
                            :
                            <div className="bet-opt-list">
                                <button onClick={() => manualPlus(1, "1")} className="bet-opt">
                                    <span>1</span>
                                </button>
                                <button onClick={() => manualPlus(2, "2")} className="bet-opt">
                                    <span>2</span>
                                </button>
                                <button onClick={() => manualPlus(5, "5")} className="bet-opt">
                                    <span>5</span>
                                </button>
                                <button onClick={() => manualPlus(10, "10")} className="bet-opt">
                                    <span>10</span>
                                </button>
                            </div>
                        }
                    </div>
                    <div className="buttons-block">
                        {state[`${index}betted`] ? state.gameState.GameState === "PLAYING" ?
                            <button className="btn-waiting" onClick={() => { callCashOut(state.gameState.currentNum, index) }}>
                                <span>
                                    <label>CASHOUT</label>
                                    <label className="amount">
                                        <span>{Number(state[`${index}betAmount`] * state.gameState.currentNum).toFixed(2)}</span>
                                        <span className="currency">USD</span>
                                    </label>
                                </span>
                            </button>
                            : <button className="btn-danger">WAITING</button> : state[`${index}betState`] ?
                            <>
                                <div className="btn-tooltip">Waiting for next round</div>
                                <button className="btn-danger h-[70%]" onClick={() => {
                                    onBetClick();
                                    dispatch({
                                        type: `${index}auto`,
                                        payload: false
                                    })
                                }}><label>CANCEL</label></button>
                            </> :
                            <button onClick={onBetClick} className="btn-success">
                                <span>
                                    <label>BET</label>
                                    <label className="amount">
                                        <span>{Number(state[`${index}betAmount`]).toFixed(2)}</span>
                                        <span className="currency">USD</span>
                                    </label>
                                </span>
                            </button>
                        }
                    </div>
                </div>
                {
                    gameType === "auto" &&
                    <>
                        <div className="border-line"></div>
                        <div className="second-row">
                            <div className="auto-bet-wrapper">
                                <div className="auto-bet">
                                    {state[`${index}auto`] ? (
                                        <button onClick={() => onAutoBetClick(false)} className="auto-play-btn btn-danger" >{state[`${index}autoCound`]}</button>
                                    ) : (
                                        <button onClick={() => { setShowModal(true); }} className="auto-play-btn btn-primary">AUTO PLAY</button>
                                    )}
                                </div>
                            </div>
                            <div className="cashout-block">
                                <div className="cashout-switcher">
                                    <label className="label">Auto Cash Out</label>
                                    {state[`${index}betted`] || state[`${index}betState`] ? (
                                        <div className={`input-switch ${state[`${index}autoCashoutState`] ? "" : "off"}`}>
                                            <span className="oval"></span>
                                        </div>
                                    ) : (
                                        <div onClick={() => { dispatch({ type: `${index}autoCashoutState`, payload: !state[`${index}autoCashoutState`] }) }} className={`input-switch ${state[`${index}autoCashoutState`] ? "" : "off"}`}>
                                            <span className="oval"></span>
                                        </div>
                                    )}
                                </div>
                                <div className="cashout-snipper-wrapper">
                                    <div className="cashout-snipper">
                                        <div className={`snipper small ${state[`${index}autoCashoutState`] && !state[`${index}betState`] ? "" : "disabled"}`}>
                                            <div className="input">
                                                {state[`${index}autoCashoutState`] && !state[`${index}betState`] ? (
                                                    <input type="number"
                                                        onChange={(e) => dispatch({ type: `${index}cashOutAt`, payload: e.target.value })}
                                                        value={state[`${index}cashOutAt`]}
                                                        onBlur={(e) => onChangeBlur(e.target.value, "cashOutAt")}
                                                    />
                                                ) : (
                                                    <input type="number" value={Number(state[`${index}cashOutAt`]).toFixed(2)} readOnly />
                                                )}
                                            </div>
                                            <span className="text">x</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                }
            </div >
            {showModal &&
                <div className="modal">
                    <div onClick={() => setShowModal(false)} className="back"></div>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <span>Auto play options</span>
                                <button className="close" onClick={() => setShowModal(false)}>
                                    <span>x</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                <div className="content-part content-part-1">
                                    <span>Number of Rounds:</span>
                                    <div className="rounds-wrap">
                                        <button
                                            className={`btn-secondary ${state[`${index}autoCound`] === 10 ? "onClick" : ""}`}
                                            onClick={() => setCount(10)}>
                                            10</button>
                                        <button
                                            className={`btn-secondary ${state[`${index}autoCound`] === 20 ? "onClick" : ""}`}
                                            onClick={() => setCount(20)}>
                                            20</button>
                                        <button
                                            className={`btn-secondary ${state[`${index}autoCound`] === 50 ? "onClick" : ""}`}
                                            onClick={() => setCount(50)}>
                                            50</button>
                                        <button
                                            className={`btn-secondary ${state[`${index}autoCound`] === 100 ? "onClick" : ""}`}
                                            onClick={() => setCount(100)}>
                                            100</button>
                                    </div>
                                </div>
                                <div className="content-part">
                                    <div className={`input-switch ${state[`${index}deState`] ? "" : "off"}`}
                                        onClick={() => {
                                            dispatch({
                                                type: `${index}deState`,
                                                payload: !state[`${index}deState`]
                                            })
                                        }}
                                    >
                                        <span className="oval"></span>
                                    </div>
                                    <span className="title">Stop if cash decreases by</span>
                                    <div className="spinner">
                                        {state[`${index}deState`] ?
                                            <div className="m-spinner">
                                                <div className="buttons">
                                                    <button onClick={() => minus("decrease")} className="minus"></button>
                                                </div>
                                                <div className="input">
                                                    <input type="number" onChange={(e) => dispatch({ type: `${index}decrease`, payload: e.target.value })} value={state[`${index}decrease`]}
                                                        onBlur={(e) => onChangeBlur(e.target.value, "decrease")}
                                                    />
                                                </div>
                                                <div className="buttons">
                                                    <button onClick={() => plus("decrease")} className="plus"></button>
                                                </div>
                                            </div> :
                                            <div className="m-spinner disabled">
                                                <div className="buttons">
                                                    <button disabled onClick={() => minus("decrease")} className="minus"></button>
                                                </div>
                                                <div className="input">
                                                    <input type="number" readOnly value={Number(state[`${index}decrease`]).toFixed(2)} />
                                                </div>
                                                <div className="buttons">
                                                    <button disabled onClick={() => plus("decrease")} className="plus"></button>
                                                </div>
                                            </div>}
                                    </div>
                                    <span >USD</span>
                                </div>
                                <div className="content-part">
                                    <div className={`input-switch ${state[`${index}inState`] ? "" : "off"}`}
                                        onClick={() => {
                                            dispatch({
                                                type: `${index}inState`,
                                                payload: !state[`${index}inState`]
                                            })
                                        }}
                                    >
                                        <span className="oval"></span>
                                    </div>
                                    <span className="title">Stop if cash increases by</span>
                                    <div className="spinner">
                                        {state[`${index}inState`] ? <div className="m-spinner">
                                            <div className="buttons">
                                                <button onClick={() => minus("increase")} className="minus"></button>
                                            </div>
                                            <div className="input">
                                                <input type="number" onChange={(e) => dispatch({ type: `${index}increase`, payload: e.target.value })} value={state[`${index}increase`]}
                                                    onBlur={(e) => onChangeBlur(e.target.value, "increase")}
                                                />
                                            </div>
                                            <div className="buttons">
                                                <button onClick={() => plus("increase")} className="plus"></button>
                                            </div>
                                        </div> : <div className="m-spinner disabled">
                                            <div className="buttons">
                                                <button disabled onClick={() => minus("increase")} className="minus"></button>
                                            </div>
                                            <div className="input">
                                                <input type="number" readOnly value={Number(state[`${index}increase`]).toFixed(2)} />
                                            </div>
                                            <div className="buttons">
                                                <button disabled onClick={() => plus("increase")} className="plus"></button>
                                            </div>
                                        </div>}
                                    </div>
                                    <span >USD</span>
                                </div>
                                <div className="content-part">
                                    <div className={`input-switch ${state[`${index}single`] ? "" : "off"}`}
                                        onClick={() => {
                                            dispatch({
                                                type: `${index}single`,
                                                payload: !state[`${index}single`]
                                            })
                                        }}
                                    >
                                        <span className="oval"></span>
                                    </div>
                                    <span className="title">Stop if single win exceeds</span>
                                    <div className="spinner">
                                        {state[`${index}single`] ?
                                            <div className="m-spinner">
                                                <div className="buttons">
                                                    <button onClick={() => minus("singleAmount")} className="minus"></button>
                                                </div>
                                                <div className="input">
                                                    <input type="number" onChange={(e) => dispatch({ type: `${index}singleAmount`, payload: e.target.value })} value={state[`${index}singleAmount`]}
                                                        onBlur={(e) => onChangeBlur(e.target.value, "singleAmount")}
                                                    />
                                                </div>
                                                <div className="buttons">
                                                    <button onClick={() => plus("singleAmount")} className="plus"></button>
                                                </div>
                                            </div> :
                                            <div className="m-spinner disabled">
                                                <div className="buttons ">
                                                    <button disabled onClick={() => minus("singleAmount")} className="minus"></button>
                                                </div>
                                                <div className="input">

                                                    <input type="number" readOnly value={Number(state[`${index}singleAmount`]).toFixed(2)} />
                                                </div>
                                                <div className="buttons">
                                                    <button disabled onClick={() => plus("singleAmount")} className="plus"></button>
                                                </div>
                                            </div>
                                        }
                                    </div>
                                    <span >USD</span>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <div className="btns-wrapper">
                                    <button className="reset-btn btn-waiting" onClick={reset}>Reset</button>
                                    <button className="start-btn btn-success" onClick={onStartBtnClick}>Start</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            }
        </div >
    )
}
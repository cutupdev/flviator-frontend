import React from "react";
// import { useCrashContext } from "../context";
import { toast } from 'react-toastify';
import Context, { callCashOut } from "../../context";

interface BetProps {
	index: 'f' | 's'
}
type FieldNameType = 'betAmount' | 'decrease' | 'increase' | 'singleAmount'
type BetOptType = '20' | '50' | '100' | '1000'
type GameType = 'manual' | 'auto'

const Bet = ({ index }: BetProps) => {
	const state = React.useContext(Context)
	const {
		balance,
		fauto, sauto,
		fbetted, sbetted,
		fdeState, sdeState,
		finState, sinState,
		fbetState, sbetState,
		fdecrease, sdecrease,
		fincrease, sincrease,
		fautoCound, sautoCound,
		fbetAmount, sbetAmount,
		fautoCashoutState, sautoCashoutState,
		fcashOutAt, scashOutAt,
		fsingle, ssingle,
		fsingleAmount, ssingleAmount,
		GameState, currentNum,
		update, updateUserBetState } = state
	// const [state, dispatch, callCashOut] = useCrashContext();

	const auto = index === 'f' ? fauto : sauto
	const betted = index === 'f' ? fbetted : sbetted
	const deState = index === 'f' ? fdeState : sdeState
	const inState = index === 'f' ? finState : sinState
	const betState = index === 'f' ? fbetState : sbetState
	const decrease = index === 'f' ? fdecrease : sdecrease
	const increase = index === 'f' ? fincrease : sincrease
	const autoCound = index === 'f' ? fautoCound : sautoCound
	const betAmount = index === 'f' ? fbetAmount : sbetAmount
	const autoCashoutState = index === 'f' ? fautoCashoutState : sautoCashoutState
	const cashOutAt = index === 'f' ? fcashOutAt : scashOutAt
	const single = index === 'f' ? fsingle : ssingle
	const singleAmount = index === 'f' ? fsingleAmount : ssingleAmount

	const [gameType, setGameType] = React.useState<GameType>("manual");
	const [betOpt, setBetOpt] = React.useState<BetOptType>("20");
	const [showModal, setShowModal] = React.useState(false);
	// const { index } = props;

	const minus = (type: FieldNameType) => {
		// 'betAmount'|'decrease'|'increase'|'singleAmount'
		let value = 0

		if (state[`${index + type}`] - 0.1 < 0.1) {
			value = 0.1
			// update({[`${index + type}`]: 0.1})
			// dispatch({
			// 	type: `${index + type}`,
			// 	payload: 0.1
			// })
		} else {
			value = Number((Number(state[`${index + type}`]) - 0.1).toFixed(2))
			// update({[`${index + type}`]: value})
			// dispatch({
			// 	type: `${index + type}`,
			// 	payload: 
			// })
		}
		update({ [`${index + type}`]: value })
	}

	const plus = (type: FieldNameType) => {
		let value = 0
		if (state[`${index + type}`] + 0.1 > state.balance) {
			value = Math.round(balance * 100) / 100
			// /update({[`${index + type}`]: value})
			// dispatch({
			// 	type: `${index + type}`,
			// 	payload: Number(state.balance).toFixed(2)
			// })
		} else {
			value = Number((Number(state[`${index + type}`]) + 0.1).toFixed(2))
			// dispatch({
			// 	type: `${index + type}`,
			// 	payload: (Number(state[`${index + type}`]) + 0.1).toFixed(2)
			// })
		}
		update({ [`${index + type}`]: value })
	}

	const manualPlus = (amount: number, btnNum: BetOptType) => {
		let value = 0
		if (betOpt === btnNum) {
			value = Number((betAmount + amount).toFixed(2))
			// dispatch({
			// 	type: `${index}betAmount`,
			// 	payload: (Number(betAmount) + amount).toFixed(2)
			// })
		} else {
			value = Number(Number(amount).toFixed(2))
			// dispatch({
			// 	type: `${index}betAmount`,
			// 	payload: Number(amount).toFixed(2)
			// })
			setBetOpt(btnNum);
		}
		update({ [`${index}betAmount`]: value })
	}

	const changeBetType = (e: GameType) => {
		updateUserBetState({ [`${index}betState`]: false });
		// dispatch({
		// 	type: "betState",
		// 	payload: false
		// });
		setGameType(e);
	}

	const onChangeBlur = (e: number, type: 'cashOutAt' | 'decrease' | 'increase' | 'singleAmount') => {
		let value = 0
		if (type === "cashOutAt") {
			if (e < 1.01) {
				value = 1.01
				// dispatch({
				// 	type: index + type,
				// 	payload: 1.01
				// })
			} else {
				value = Math.round(e * 100) / 100
				// dispatch({
				// 	type: index + type,
				// 	payload: Number(e).toFixed(2)
				// })
			}
		} else {
			if (e < 0.1) {
				value = 0.1
				// dispatch({
				// 	type: index + type,
				// 	payload: 0.1
				// })
			} else {
				value = Math.round(e * 100) / 100
				// dispatch({
				// 	type: index + type,
				// 	payload: e
				// })
			}
		}
		update({ [`${index + type}`]: value })
	}

	const onBetClick = () => {
		updateUserBetState({ [`${index}betState`]: !betState })
		// dispatch({
		// 	type: `${index}betState`,
		// 	payload: !betState
		// });
	}
	const setCount = (amount: number) => {
		update({ [`${index}autoCound`]: amount })
		// dispatch({
		// 	type: `${index}autoCound`,
		// 	payload: amount
		// })
	}

	const reset = () => {
		// dispatch({
		// 	type: `${index}autoCound`,
		// 	payload: 0
		// });
		// dispatch({
		// 	type: `${index}decrease`,
		// 	payload: 0
		// });
		// dispatch({
		// 	type: `${index}deState`,
		// 	payload: false
		// });
		// dispatch({
		// 	type: `${index}increase`,
		// 	payload: 0
		// });
		// dispatch({
		// 	type: `${index}inState`,
		// 	payload: false
		// });
		// dispatch({
		// 	type: `${index}singleAmount`,
		// 	payload: 0
		// });
		// dispatch({
		// 	type: `${index}single`,
		// 	payload: false
		// });
		update({
			[`${index}autoCound`]: 0,
			[`${index}decrease`]: 0,
			[`${index}increase`]: 0,
			[`${index}singleAmount`]: 0,
			[`${index}deState`]: false,
			[`${index}inState`]: false,
			[`${index}single`]: false,
		})
	}

	const onAutoBetClick = (_betState: boolean) => {
		update({
			[`${index}auto`]: !auto
		})

		updateUserBetState({ [`${index}betState`]: _betState });
		// dispatch({
		// 	type: `${index}betState`,
		// 	payload: state
		// });
		// dispatch({
		// 	type: `${index}auto`,
		// 	payload: !auto
		// })

		if (!state) {
			setCount(0);
		}
	}

	const onStartBtnClick = () => {
		if (autoCound > 0) {
			if (deState || inState) {
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
						{(betted || betState) ?
							<>
								<button className={gameType === "manual" ? "active" : ""} >Bet</button>
								<button className={gameType === "auto" ? "active" : ""} >Auto</button>
							</> :
							<>
								<button className={gameType === "manual" ? "active" : ""} onClick={() => changeBetType("manual")}>Bet</button>
								<button className={gameType === "auto" ? "active" : ""} onClick={() => changeBetType("auto")}>Auto</button>
							</>
						}
					</div>
				</div>
				<div className="first-row">
					<div className="bet-block">
						<div className="bet-spinner">
							<div className={`spinner ${betState || betted ? "disabled" : ""}`}>
								<div className="buttons">
									<button className="minus" onClick={() => minus("betAmount")}></button>
								</div>
								<div className="input">
									{betState || betted ?
										<input type="number" value={betAmount} readOnly ></input>
										:
										<input type="number" value={betAmount} onChange={e => update({ [`${index}betAmount`]: Number(e.target.value) })}></input>
									}
								</div>
								<div className="buttons">
									<button className="plus" onClick={() => plus("betAmount")}></button>
								</div>
							</div>
						</div>
						{betState || betted ?
							<div className="bet-opt-list">
								<button className="bet-opt disabled">
									<span>20</span>
								</button>
								<button className="bet-opt disabled">
									<span>50</span>
								</button>
								<button className="bet-opt disabled">
									<span>100</span>
								</button>
								<button className="bet-opt disabled">
									<span>1000</span>
								</button>
							</div>
							:
							<div className="bet-opt-list">
								<button onClick={() => manualPlus(20, "20")} className="bet-opt">
									<span>20</span>
								</button>
								<button onClick={() => manualPlus(50, "50")} className="bet-opt">
									<span>50</span>
								</button>
								<button onClick={() => manualPlus(100, "100")} className="bet-opt">
									<span>100</span>
								</button>
								<button onClick={() => manualPlus(1000, "1000")} className="bet-opt">
									<span>1000</span>
								</button>
							</div>
						}
					</div>
					<div className="buttons-block">
						{betted ? GameState === "PLAYING" ?
							<button className="btn-waiting" onClick={() => { callCashOut(currentNum, index) }}>
								<span>
									<label>CASHOUT</label>
									<label className="amount">
										<span>{Number(betAmount * currentNum).toFixed(2)}</span>
										<span className="currency">INR</span>
									</label>
								</span>
							</button>
							: <button className="btn-danger">WAITING</button> : betState ?
							<>
								<div className="btn-tooltip">Waiting for next round</div>
								<button className="btn-danger h-[70%]" onClick={() => {
									onBetClick();
									update({ [`${index}auto`]: false })
									// dispatch({
									// 	type: `${index}auto`,
									// 	payload: false
									// })
								}}><label>CANCEL</label></button>
							</> :
							<button onClick={onBetClick} className="btn-success">
								<span>
									<label>BET</label>
									<label className="amount">
										<span>{Number(betAmount).toFixed(2)}</span>
										<span className="currency">INR</span>
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
									{auto ? (
										<button onClick={() => onAutoBetClick(false)} className="auto-play-btn btn-danger" >{autoCound}</button>
									) : (
										<button onClick={() => { setShowModal(true); }} className="auto-play-btn btn-primary">AUTO PLAY</button>
									)}
								</div>
							</div>
							<div className="cashout-block">
								<div className="cashout-switcher">
									<label className="label">Auto Cash Out</label>
									{betted || betState ? (
										<div className={`input-switch ${autoCashoutState ? "" : "off"}`}>
											<span className="oval"></span>
										</div>
									) : (
										<div onClick={() => { update({ [`${index}autoCashoutState`]: !autoCashoutState }) }} className={`input-switch ${autoCashoutState ? "" : "off"}`}>
											<span className="oval"></span>
										</div>
									)}
								</div>
								<div className="cashout-snipper-wrapper">
									<div className="cashout-snipper">
										<div className={`snipper small ${autoCashoutState && !betState ? "" : "disabled"}`}>
											<div className="input">
												{autoCashoutState && !betState ? (
													<input type="number"
														onChange={(e) => update({ [`${index}cashOutAt`]: Number(e.target.value) })}
														value={cashOutAt}
														onBlur={(e) => onChangeBlur(Number(e.target.value) || 0, "cashOutAt")}
													/>
												) : (
													<input type="number" value={cashOutAt.toFixed(2)} readOnly />
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
											className={`btn-secondary ${autoCound === 10 ? "onClick" : ""}`}
											onClick={() => setCount(10)}>
											10</button>
										<button
											className={`btn-secondary ${autoCound === 20 ? "onClick" : ""}`}
											onClick={() => setCount(20)}>
											20</button>
										<button
											className={`btn-secondary ${autoCound === 50 ? "onClick" : ""}`}
											onClick={() => setCount(50)}>
											50</button>
										<button
											className={`btn-secondary ${autoCound === 100 ? "onClick" : ""}`}
											onClick={() => setCount(100)}>
											100</button>
									</div>
								</div>
								<div className="content-part">
									<div className={`input-switch ${deState ? "" : "off"}`}
										onClick={() => {
											update({ [`${index}deState`]: !deState })
										}}
									>
										<span className="oval"></span>
									</div>
									<span className="title">Stop if cash decreases by</span>
									<div className="spinner">
										{deState ?
											<div className="m-spinner">
												<div className="buttons">
													<button onClick={() => minus("decrease")} className="minus"></button>
												</div>
												<div className="input">
													<input type="number" onChange={(e) => update({ [`${index}decrease`]: Number(e.target.value) })} value={decrease}
														onBlur={(e) => onChangeBlur(Number(e.target.value) || 0, "decrease")}
													/>
												</div>
												<div className="buttons">
													<button onClick={() => plus("decrease")} className="plus"></button>
												</div>
											</div> :
											<div className="m-spinner disabled">
												<div className="buttons">
													<button disabled className="minus"></button>
												</div>
												<div className="input">
													<input type="number" readOnly value={Number(decrease).toFixed(2)} />
												</div>
												<div className="buttons">
													<button disabled className="plus"></button>
												</div>
											</div>}
									</div>
									<span >INR</span>
								</div>
								<div className="content-part">
									<div className={`input-switch ${inState ? "" : "off"}`}
										onClick={() => {
											update({ [`${index}inState`]: !inState })
										}}
									>
										<span className="oval"></span>
									</div>
									<span className="title">Stop if cash increases by</span>
									<div className="spinner">
										{inState ? <div className="m-spinner">
											<div className="buttons">
												<button onClick={() => minus("increase")} className="minus"></button>
											</div>
											<div className="input">
												<input type="number" onChange={(e) => update({ [`${index}increase`]: Number(e.target.value) })} value={increase}
													onBlur={(e) => onChangeBlur(Number(e.target.value), "increase")}
												/>
											</div>
											<div className="buttons">
												<button onClick={() => plus("increase")} className="plus"></button>
											</div>
										</div> : <div className="m-spinner disabled">
											<div className="buttons">
												<button disabled className="minus"></button>
											</div>
											<div className="input">
												<input type="number" readOnly value={Number(increase).toFixed(2)} />
											</div>
											<div className="buttons">
												<button disabled className="plus"></button>
											</div>
										</div>}
									</div>
									<span >INR</span>
								</div>
								<div className="content-part">
									<div className={`input-switch ${single ? "" : "off"}`}
										onClick={() => {
											update({ [`${index}single`]: !single })
										}}
									>
										<span className="oval"></span>
									</div>
									<span className="title">Stop if single win exceeds</span>
									<div className="spinner">
										{!!single ?
											<div className="m-spinner">
												<div className="buttons">
													<button onClick={() => minus("singleAmount")} className="minus"></button>
												</div>
												<div className="input">
													<input type="number" onChange={(e) => update({ [`${index}singleAmount`]: Number(e.target.value) })} value={singleAmount}
														onBlur={(e) => onChangeBlur(Number(e.target.value), "singleAmount")}
													/>
												</div>
												<div className="buttons">
													<button onClick={() => plus("singleAmount")} className="plus"></button>
												</div>
											</div> :
											<div className="m-spinner disabled">
												<div className="buttons ">
													<button disabled className="minus"></button>
												</div>
												<div className="input">

													<input type="number" readOnly value={singleAmount.toFixed(2)} />
												</div>
												<div className="buttons">
													<button disabled className="plus"></button>
												</div>
											</div>
										}
									</div>
									<span >INR</span>
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

export default Bet
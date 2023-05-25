/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import { UnityContext } from "react-unity-webgl";
import { useLocation } from "react-router";
import { io } from 'socket.io-client';
import axios from "axios";
import uniqid from 'uniqid';
import { toast } from 'react-toastify';

import config from './config.json';

export interface BettedUserType {
	auto: boolean
	type: string
	balance: number
	betted: boolean
	name: string
	betAmount: number
	cashOut: number
	cashouted: boolean
	target: number
	img: string
}

export interface UserType {
	auto: boolean
	betted: boolean
	cashouted: boolean
	name: string
	socketId: string
	bot: boolean
	betAmount: number
	cashAmount: number
	target: number
	balance: number
	type: 'f' | 's'
	img: string
	userType: boolean
}

interface GameStatusType {
	currentNum: number
	currentSecondNum: number
	GameState: string
	time: number
}

interface GameBetLimit {
	maxBet: number
	minBet: number
}

declare interface GameHistory {
	_id: number
	name: string
	betAmount: number
	cashoutAt: number
	cashouted: boolean
	date: number
}

interface UserStatusType {
	fbetState: boolean
	fbetted: boolean
	sbetState: boolean
	sbetted: boolean
}

let newStatus = {} as UserStatusType;

interface ContextDataType {
	myBets: GameHistory[]
	width: number
	fbetAmount: number
	fcashOutAt: number
	fautoCashoutState: boolean
	fautoCound: number
	finState: boolean
	fdeState: boolean
	fsingle: boolean
	fincrease: number
	fdecrease: number
	fsingleAmount: number
	fauto: boolean
	fbetState: boolean
	fdefaultBetAmount: number
	sbetAmount: number
	scashOutAt: number
	sautoCashoutState: boolean
	sautoCound: number
	sincrease: number
	sdecrease: number
	ssingleAmount: number
	sinState: boolean
	sdeState: boolean
	ssingle: boolean
	sbetState: boolean
	sauto: boolean
	sdefaultBetAmount: number
	myUnityContext: UnityContext
}

interface ContextType extends ContextDataType, UserStatusType, GameBetLimit {
	unityState: boolean
	unityLoading: boolean
	currentProgress: number
	currentNum: number
	currentSecondNum: number
	GameState: string
	time: number
	bettedUsers: BettedUserType[]
	previousHand: UserType[]
	history: number[]
	balance: number
	userType: boolean
	userName: string
	rechargeState: boolean
	setBalance(number),
	update(attrs: Partial<ContextDataType>)
	getMyBets(),
	updateUserBetState(attrs: Partial<UserStatusType>),
}

interface StorageValueType {
	id: string
	token: string
	secondId: string
}

// const DEFAULT_USER = {
// 	betted: false,
// 	cashouted: false,
// 	auto: false,
// 	bot: false,
// 	name: '',
// 	betAmount: 0,
// 	balance: 0,
// 	cashAmount: 0,
// 	target: 0,
// 	socketId: '',
// 	type: '',
// 	img: ''
// }

const unityContext = new UnityContext({
	loaderUrl: "unity/AirCrash.loader.js",
	dataUrl: "unity/AirCrash.data.unityweb",
	frameworkUrl: "unity/AirCrash.framework.js.unityweb",
	codeUrl: "unity/AirCrash.wasm.unityweb"
});

const init_state = {
	myBets: [],
	width: 1500,
	fbetState: false,
	fbetted: false,
	fbetAmount: 20,
	fcashOutAt: 2,
	fautoCashoutState: false,
	fautoCound: 0,
	finState: false,
	fdeState: false,
	fsingle: false,
	fincrease: 0,
	fdecrease: 0,
	fsingleAmount: 0,
	fauto: false,
	fdefaultBetAmount: 1,
	sbetState: false,
	sbetted: false,
	sbetAmount: 20,
	scashOutAt: 2,
	sautoCashoutState: false,
	sautoCound: 0,
	sincrease: 0,
	sdecrease: 0,
	ssingleAmount: 0,
	sinState: false,
	sdeState: false,
	ssingle: false,
	sauto: false,
	sdefaultBetAmount: 1,
	myUnityContext: unityContext,

} as ContextDataType;

const Context = React.createContext<ContextType>(null!);

const setStorage = (v: StorageValueType) => {
	localStorage.setItem(config.appKey, JSON.stringify(v));
}

const socket = io(config.wss);
let id = "";
let secondId = "";
let myTokenId = "";

const initUser = () => {
	id = uniqid();
	secondId = uniqid();
	myTokenId = uniqid();
	setStorage({ id, secondId, token: myTokenId })
}

export const callCashOut = (at: number, index: 'f' | 's') => {
	let data = { token: index === 'f' ? id : secondId, at };
	// if (index === "f") {
	// 	data = {
	// 		token: id,
	// 		at: at
	// 	}
	// } else {
	// 	data = {
	// 		token: secondId,
	// 		at: at
	// 	}
	// }
	socket.emit("cashOut", data);
}

// let myTokenId = uniqid();
// let totalData;
initUser()

let newState: any;

export const Provider = ({ children }: any) => {
	const token = new URLSearchParams(useLocation().search).get('cert');
	const [state, setState] = React.useState<ContextDataType>(init_state);

	newState = state;

	const [unity, setUnity] = React.useState({
		unityState: false,
		unityLoading: false,
		currentProgress: 0
	})
	const [gameState, setGameState] = React.useState({
		currentNum: 0,
		currentSecondNum: 0,
		GameState: '',
		time: 0
	})

	const [bettedUsers, setBettedUsers] = React.useState<BettedUserType[]>([]);
	const update = (attrs: Partial<ContextDataType>) => {
		setState({ ...state, ...attrs })
	}
	const [previousHand, setPreviousHand] = React.useState<UserType[]>([]);
	const [history, setHistory] = React.useState<number[]>([]);
	const [userBetState, setUserBetState] = React.useState<UserStatusType>({
		fbetState: false,
		fbetted: false,
		sbetState: false,
		sbetted: false
	});

	// auto bet option
	let fdecrease = 0;
	let fincrease = 0;

	let sdecrease = 0;
	let sincrease = 0;
	let singleWin = 0;
	let decreaseState = false;
	let increaseState = false;
	let singleWinState = false;

	newStatus = userBetState;
	const updateUserBetState = (attrs: Partial<UserStatusType>) => {
		setUserBetState({ ...userBetState, ...attrs });
	}
	const [balance, setBalance] = React.useState(5000);
	const [userType, setUserType] = React.useState(false);
	const [userName, setUserName] = React.useState("");
	const [rechargeState, setRechargeState] = React.useState(false);
	const [betLimit, setBetLimit] = React.useState<GameBetLimit>({
		maxBet: 1000,
		minBet: 1
	});

	// React.useEffect(() => {
	// 	console.log(userBetState);
	// }, [userBetState])

	React.useEffect(function () {
		unityContext.on("GameController", function (message) {
			if (message === "Ready") {
				setUnity({ currentProgress: 100, unityLoading: true, unityState: true })
			}
		});
		unityContext.on("progress", (progression) => {
			const currentProgress = progression * 100
			if (progression === 1) {
				setUnity({ currentProgress, unityLoading: true, unityState: true })
			} else {
				setUnity({ currentProgress, unityLoading: false, unityState: false })
			}
		})
		return () => unityContext.removeAllEventListeners();
	}, []);

	React.useEffect(() => {
		const attrsUserBetStatus = { ...userBetState };
		const data = {
			token: id,
			name: id,
			type: "f",
			myToken: myTokenId,
		}
		const sData = {
			token: secondId,
			name: secondId,
			type: "s",
			myToken: myTokenId,
		}
		console.log(token, "TOken");
		socket.emit("enterRoom", { data, sData, token });

		socket.on("bettedUserInfo", (bettedUsers: BettedUserType[]) => {
			setBettedUsers(bettedUsers);
		});

		socket.on("myBetState", (user: UserType) => {
			const attrs = newStatus;
			if (!user.auto) {
				if (user.type === 'f') {
					attrs.fbetState = false
				} else {
					attrs.sbetState = false
				}
			}
			if (user.type === 'f') {
				attrs.fbetted = user.betted
			} else {
				attrs.sbetted = user.betted
			}
			updateUserBetState(attrs);
		})

		socket.on("myInfo", (user: UserType) => {
			setBalance(prev => user.balance);
			setUserType(prev => user.userType);
			setUserName(prev => user.name);
		})

		socket.on("history", (history: any) => {
			setHistory(history);
		});

		socket.on("gameState", (gameState: GameStatusType) => {
			setGameState(gameState);
			const attrs = { ...userBetState };
		});

		socket.on("previousHand", (previousHand: UserType[]) => {
			setPreviousHand(previousHand);
			// dispatch({
			// 	type: "previousHand",
			// 	payload: data
			// })
		});

		socket.on("finishGame", (user: UserType) => {

			const attrs = newStatus;
			let auto = false

			let defaultBetAmount = 0
			if (user.type === 'f') {
				attrs.fbetted = false
				auto = newState.fauto
				singleWin = newState.fbetAmount;
				defaultBetAmount = newState.fdefaultBetAmount
				increaseState = newState.finState
				decreaseState = newState.fdeState
				singleWinState = newState.fsingle

			} else {
				attrs.sbetted = false
				auto = newState.sauto
				singleWin = newState.sbetAmount
				defaultBetAmount = newState.sdefaultBetAmount
				increaseState = newState.sinState
				decreaseState = newState.sdeState
				singleWinState = newState.ssingle
			}

			setUserBetState(attrs);
			setBalance(prev => prev + user.cashAmount);
			if (auto) {
				const attrs = newStatus;
				attrs.fbetState = false
				attrs.sbetState = false
				if (user.cashouted) {
					if (user.type === 'f') {
						if (increaseState && newState.fincrease - fincrease <= 0) {
							updateUserBetState(attrs);
							update({ fauto: false })
						}
						console.log('newState.fsingleAmount : ', newState.fsingleAmount)
						console.log('user.cashAmount : ', user.cashAmount)
						if (singleWinState && newState.fsingleAmount <= user.cashAmount) {
							update({ fauto: false })
							updateUserBetState(attrs);
						}
						fincrease = fincrease + user.cashAmount;
					} else {
						if (increaseState && newState.sincrease - sdecrease <= 0) {
							updateUserBetState(attrs);
							update({ sauto: false })
						}
						if (singleWinState && newState.ssingleAmount <= user.cashAmount) {
							updateUserBetState(attrs);
							update({ sauto: false })
						}
						sincrease = sincrease + user.cashAmount;
					}
				} else {
					if (user.type === 'f') {
						fdecrease = fdecrease + singleWin;
						if (decreaseState && newState.fdecrease - fdecrease <= 0) {
							updateUserBetState({ [`fbetState`]: false })
							updateUserBetState(attrs);
							update({ fauto: false })
							fdecrease = 0
						}
					} else {
						sdecrease = sdecrease + singleWin
						if (decreaseState && newState.sdecrease - sdecrease <= 0) {
							updateUserBetState({ [`sbetState`]: false })
							updateUserBetState(attrs);
							update({ sauto: false })
							sdecrease = 0
						}
					}
					//  else {
					// 	if (user.type === 'f') {
					// 		update({ fbetAmount: defaultBetAmount })
					// 	} else {
					// 		update({ sbetAmount: defaultBetAmount })
					// 	}
					// }
				}
			}
		});

		socket.on("getBetLimits", (betAmounts: { max: number, min: number }) => {
			console.log("getBetLimits");
			setBetLimit({ maxBet: betAmounts.max, minBet: betAmounts.min })
		})

		socket.on('recharge', () => {
			alert(111);
			setRechargeState(true);
		});

		socket.on("error", (data) => {
			toast.error(data);
		})

		socket.on("success", (data) => {
			toast.success(data);
		})
		return () => {
			socket.off('connect');
			socket.off('disconnect');
			socket.off('myBetState');
			socket.off('myInfo');
			socket.off('history');
			socket.off('gameState');
			socket.off('previousHand');
			socket.off('finishGame');
			socket.off('getBetLimits');
			socket.off('recharge');
			socket.off('error');
			socket.off('success');
		}
	}, [socket]);

	React.useEffect(() => {
		const attrs = {} as Partial<ContextDataType>;
		const attrsUserBetStatus = { ...userBetState };
		if (gameState.GameState === "BET") {
			if (state.fauto) {
				if (state.fautoCound > 0) {
					if (userBetState.fbetState) {
						var data = {
							token: id,
							betAmount: state.fbetAmount,
							target: state.fcashOutAt,
							auto: state.fauto
						}
						setBalance(prev => prev - state.fbetAmount);
						socket.emit("playBet", data);
						attrs.fautoCound = state.fautoCound ? state.fautoCound - 1 : 0;


						// dispatch({
						// 	type: "fautoCound",
						// 	payload: state.fautoCound - 1
						// })
					}
				} else {
					attrs.fauto = false;
					// dispatch({
					// 	type: "fauto",
					// 	payload: false
					// });
					attrsUserBetStatus.fbetState = false;
					// dispatch({
					// 	type: "fbetState",
					// 	payload: false
					// })
				}
			} else if (userBetState.fbetState) {
				var fbetdata = {
					token: id,
					betAmount: state.fbetAmount,
					target: state.fcashOutAt,
					auto: state.fauto
				}
				setBalance(prev => prev - state.fbetAmount);
				socket.emit("playBet", fbetdata);
			}
			if (state.sauto) {
				if (state.sautoCound > 0) {
					if (userBetState.sbetState) {
						var betdata = {
							token: secondId,
							betAmount: state.sbetAmount,
							auto: state.sauto
						}
						setBalance(prev => prev - state.sbetAmount);
						socket.emit("playBet", betdata);
						attrs.sautoCound = state.sautoCound ? state.sautoCound - 1 : 0;
						// dispatch({
						// 	type: "sautoCound",
						// 	payload: state.sautoCound - 1
						// })
					}
				} else {
					attrs.sauto = false;
					// dispatch({
					// 	type: "sauto",
					// 	payload: false
					// });
					attrsUserBetStatus.sbetState = false;
					// dispatch({
					// 	type: "sbetState",
					// 	payload: false
					// })
				}
			} else if (userBetState.sbetState) {
				var sbetdata = {
					token: secondId,
					betAmount: state.sbetAmount,
					target: state.scashOutAt,
					auto: state.sauto
				}
				setBalance(prev => prev - state.sbetAmount);
				socket.emit("playBet", sbetdata);
			}

			update(attrs);
			setUserBetState(attrsUserBetStatus);
		}
	}, [gameState.GameState, userBetState.fbetState, userBetState.sbetState]);

	const getMyBets = async () => {
		try {
			let response = await axios.post(`${config.api}/my-info`, { name: myTokenId });
			if (response?.data?.status) {
				update({ myBets: response.data.data as GameHistory[] })
				// dispatch({
				// 	type: "myBets",
				// 	payload: result.data.data
				// })
				// console.log(result.data.data);
			}
		} catch (error) {
			console.log('getMyBets', error)
		}
	}

	return (
		<Context.Provider value={{
			...state,
			...unity,
			...gameState,
			...userBetState,
			...betLimit,
			balance,
			userType,
			userName,
			rechargeState,
			bettedUsers: [...bettedUsers],
			previousHand: [...previousHand],
			history: [...history],
			setBalance,
			getMyBets,
			update,
			updateUserBetState,
		}}>
			{children}
		</Context.Provider>
	);
};

export default Context


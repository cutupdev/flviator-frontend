/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import { UnityContext } from "react-unity-webgl";
import { io } from 'socket.io-client';
import axios from "axios";
import uniqid from 'uniqid';
import { toast } from 'react-toastify';
import config from './config.json'

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
	update(attrs: Partial<ContextDataType>)
	getMyBets(),
	updateUserBetState(attrs: Partial<BettedUserType>)
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


const getStorage = () => {
	try {
		const raw = localStorage.getItem(config.appKey)
		if (raw) {
			const json = JSON.parse(raw)
			return { id: json.id || '', token: json.token || '', secondId: json.secondId || '' } as StorageValueType
		}
	} catch (error) {
		console.log('getStorage', error)
	}
	return null
}

const setStorage = (v: StorageValueType) => {
	localStorage.setItem(config.appKey, JSON.stringify(v));
}

const socket = io(config.wss);
let id = "";
let secondId = "";
let myTokenId = "";

const initUser = () => {
	const v = getStorage()
	if (!!v) {
		id = v.id
		secondId = v.secondId
		myTokenId = v.token
	} else {
		id = uniqid();
		secondId = uniqid();
		myTokenId = uniqid();
		setStorage({ id, secondId, token: myTokenId })
	}
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
let fautoBetFinished = false;
let sautoBetFinished = false;
initUser()



export const Provider = ({ children }: any) => {
	const [state, setState] = React.useState<ContextDataType>(init_state);

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

	const updateUserBetState = (attrs: Partial<BettedUserType>) => {
		setUserBetState({ ...userBetState, ...attrs });
	}
	const [balance, setBalance] = React.useState(5000);
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

		const data = {
			token: id,
			name: id,
			type: "f",
			myToken: myTokenId
		}
		const sData = {
			token: secondId,
			name: secondId,
			type: "s",
			myToken: myTokenId
		}
		socket.emit("enterRoom", data);
		socket.emit("enterRoom", sData);

		socket.on("bettedUserInfo", (bettedUsers: BettedUserType[]) => {
			setBettedUsers(bettedUsers);
		});

		socket.on("myBetState", (user: UserType) => {
			const attrs = { ...userBetState };
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
			setUserBetState(attrs);
		})

		socket.on("myInfo", (user: UserType) => {
			setBalance(user.balance);
		})

		socket.on("history", (history: any) => {
			setHistory(history);
		});

		socket.on("gameState", (gameState: GameStatusType) => {
			setGameState(gameState);
			const attrs = { ...userBetState };
			// dispatch({
			// 	type: "gameState",
			// 	payload: data
			// });

			if (userBetState.fbetted) {
				if (state.fautoCashoutState) {
					if (state.fcashOutAt <= gameState.currentSecondNum) {
						attrs.fbetted = false
						setUserBetState(attrs);
						// dispatch({
						// 	type: "fbetted",
						// 	payload: false
						// })
						if (!fautoBetFinished) {
							callCashOut(state.fcashOutAt, "f");
							fautoBetFinished = true;
						}
					}
				}
			}
			if (userBetState.sbetted) {
				if (state.sautoCashoutState) {
					if (state.scashOutAt <= gameState.currentSecondNum) {
						attrs.sbetted = false
						setUserBetState(attrs);
						// dispatch({
						// 	type: "sbetted",
						// 	payload: false
						// })
						if (!sautoBetFinished) {
							callCashOut(state.scashOutAt, "s");
							sautoBetFinished = true;
						}
					}
				}
			}
		});

		socket.on("previousHand", (previousHand: UserType[]) => {
			setPreviousHand(previousHand);
			// dispatch({
			// 	type: "previousHand",
			// 	payload: data
			// })
		});

		socket.on("finishGame", (user: UserType) => {
			const attrs = { ...userBetState };
			let auto = false
			let increase = 0
			let decrease = 0
			let betAmount = 0
			let defaultBetAmount = 0
			if (user.type === 'f') {
				attrs.fbetted = false
				auto = state.fauto
				increase = state.fincrease
				decrease = state.fdecrease
				betAmount = state.fbetAmount
				defaultBetAmount = state.fdefaultBetAmount
			} else {
				attrs.sbetted = false
				auto = state.sauto
				increase = state.sincrease
				decrease = state.sdecrease
				betAmount = state.sbetAmount
				defaultBetAmount = state.sdefaultBetAmount
			}
			// dispatch({
			// 	type: `${data.type}betted`,
			// 	payload: false
			// })
			setUserBetState(attrs);
			setBalance(balance + user.cashAmount);
			// dispatch({
			// 	type: "balance",
			// 	payload: state.balance + data.cashAmount
			// })

			if (auto) {
				if (user.cashouted) {
					if (user.cashAmount > increase) {
						if (user.type === 'f') {
							update({ fauto: false })
						} else {
							update({ sauto: false })
						}
						// dispatch({
						// 	type: `${user.type}auto`,
						// 	payload: false
						// })
					}
				} else {
					if (betAmount > decrease) {
						if (user.type === 'f') {
							update({ fauto: false })
						} else {
							update({ sauto: false })
						}
						// dispatch({
						// 	type: `${user.type}auto`,
						// 	payload: false
						// })
					} else {
						if (user.type === 'f') {
							update({ fbetAmount: defaultBetAmount })
						} else {
							update({ sbetAmount: defaultBetAmount })
						}
						// dispatch({
						// 	type: `${user.type}betAmount`,
						// 	payload: state[`${user.type}defaultBetAmount`]
						// })
					}
				}
			}
		});

		socket.on("getBetLimits", (betAmounts: { max: number, min: number }) => {
			console.log("getBetLimits");
			setBetLimit({ maxBet: betAmounts.max, minBet: betAmounts.min })
		})

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
			socket.off('error');
			socket.off('success');
		}
	}, [socket]);

	React.useEffect(() => {
		const attrs = {} as Partial<ContextDataType>;
		const attrsUserBetStatus = { ...userBetState };
		if (gameState.GameState === "BET") {
			fautoBetFinished = false;
			sautoBetFinished = false;
			if (state.fauto) {
				if (state.fautoCound > 0) {
					if (userBetState.fbetState) {
						var data = {
							token: id,
							betAmount: state.fbetAmount,
							target: state.fcashOutAt,
							auto: state.fauto
						}
						socket.emit("playBet", data);
						attrs.fautoCound = attrs.fautoCound ? attrs.fautoCound - 1 : 0;
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
						socket.emit("playBet", betdata);
						attrs.sautoCound = attrs.sautoCound ? attrs.sautoCound - 1 : 0;
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
			bettedUsers: [...bettedUsers],
			previousHand: [...previousHand],
			history: [...history],
			getMyBets,
			update,
			updateUserBetState,
		}}>
			{children}
		</Context.Provider>
	);
};

export default Context


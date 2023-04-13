/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import { UnityContext } from "react-unity-webgl";
import { io } from 'socket.io-client';
import axios from "axios";
import uniqid from 'uniqid';
import { toast } from 'react-toastify';
import config from './config.json'

export interface BettedUserType {
	auto?: boolean
	type?: 'f'|'s'
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
    type: 'f'|'s'
    img: string
}

interface GameStatusType {
	currentNum: number
	currentSecondNum: number
	GameState: string
	time: number
}

declare interface GameHistory {
	_id: number
	name: string
	betAmount: number
	cashoutAt: number
	cashouted: boolean
	date: number
}

interface ContextDataType {
	history: number[]
	bettedUsers: BettedUserType[]
	gameState: GameStatusType
	previousHand: UserType[]
	myBets: GameHistory[]
	balance: number
	width: number
	fbetState: boolean
	fbetted: boolean
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
	sbetState: boolean
	sbetted: boolean
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


interface ContextType extends ContextDataType {
	unityState: boolean
	unityLoading: boolean
	currentProgress: number
	update(attrs: Partial<ContextDataType>)
	getMyBets()
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
	history: [],
	bettedUsers: [],
	gameState: {currentNum: 0, currentSecondNum: 0, GameState: '', time: 0},
	previousHand: [],
	myBets: [],
	balance: 5000,
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
			return {id: json.id || '', token: json.token || '', secondId: json.secondId || ''} as StorageValueType
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
		setStorage({id, secondId, token: myTokenId})
	}
}

export const callCashOut = (at: number, index: 'f'|'s') => {
	let data = {token: index==='f' ? id : secondId, at};
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
	const [state, setState] = React.useState<ContextDataType>(init_state)
	const [unity, setUnity] = React.useState({
		unityState: false,
		unityLoading: false,
		currentProgress: 0
	})
	const update = (attrs: Partial<ContextDataType>) => {
		setState({...state, ...attrs})
	}

	React.useEffect(function () {
		unityContext.on("GameController", function (message) {
			if (message === "Ready") {
				setUnity({currentProgress: 100, unityLoading: true, unityState: true})
			}
		});
		unityContext.on("progress", (progression) => {
			// console.log('progression', unity)
			const currentProgress = progression * 100
			if (progression === 1) {
				setUnity({currentProgress, unityLoading: true, unityState: true})
			} else {
				setUnity({currentProgress, unityLoading: false, unityState: false})
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

		// socket.on('disconnect', onDisconnect);

		socket.on("bettedUserInfo", (bettedUsers: BettedUserType[]) => {
			console.log("bettedUsers.length", bettedUsers.length)
			if (!!bettedUsers.length)update({bettedUsers})
		});

		socket.on("myBetState", (user: UserType) => {
			const attrs = {balance: user.balance} as Partial<ContextDataType>
			if (!user.auto) {
				if (user.type==='f') {
					attrs.fbetState = false
				} else {
					attrs.sbetState = false
				}
			}
			if (user.type==='f') {
				attrs.fbetted = user.betted
			} else {
				attrs.sbetted = user.betted
			}
			update(attrs)

			// dispatch({
			// 	type: `${data.type}betted`,
			// 	payload: data.betted
			// });
			// dispatch({
			// 	type: "balance",
			// 	payload: data.balance
			// })
		})

		socket.on("myInfo", (user: UserType) => {
			update({balance: user.balance})
			// dispatch({
			// 	type: "balance",
			// 	payload: data.balance
			// })
		})

		socket.on("history", (history: number[]) => {
			update({history})
			// dispatch({
			// 	type: "history",
			// 	payload: data.history
			// })
		});

		socket.on("gameState", (gameState: GameStatusType) => {
			const attrs = {gameState} as Partial<ContextDataType>
			// dispatch({
			// 	type: "gameState",
			// 	payload: data
			// });

			if (state.fbetted) {
				if (state.fautoCashoutState) {
					if (state.fcashOutAt <= gameState.currentSecondNum) {
						attrs.fbetted = false
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
			if (state.sbetted) {
				if (state.sautoCashoutState) {
					if (state.scashOutAt <= gameState.currentSecondNum) {
						attrs.sbetted = false
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
			update(attrs)
		});

		socket.on("previousHand", (previousHand: UserType[]) => {
			console.log(data, "previous hand");
			update({previousHand})
			// dispatch({
			// 	type: "previousHand",
			// 	payload: data
			// })
		})

		socket.on("finishGame", (user: UserType) => {
			const attrs = {} as Partial<ContextDataType>
			let auto = false
			let increase = 0
			let decrease = 0
			let betAmount = 0
			let defaultBetAmount = 0
			if (user.type==='f') {
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
			attrs.balance = state.balance + user.cashAmount
			// dispatch({
			// 	type: "balance",
			// 	payload: state.balance + data.cashAmount
			// })

			if (auto) {
				if (user.cashouted) {
					if (user.cashAmount > increase) {
						if (user.type==='f') {
							update({fauto: false})
						} else {
							update({sauto: false})
						}
						// dispatch({
						// 	type: `${user.type}auto`,
						// 	payload: false
						// })
					}
				} else {
					if (betAmount > decrease) {
						if (user.type==='f') {
							update({fauto: false})
						} else {
							update({sauto: false})
						}
						// dispatch({
						// 	type: `${user.type}auto`,
						// 	payload: false
						// })
					} else {
						if (user.type==='f') {
							update({fbetAmount: defaultBetAmount})
						} else {
							update({sbetAmount: defaultBetAmount})
						}
						// dispatch({
						// 	type: `${user.type}betAmount`,
						// 	payload: state[`${user.type}defaultBetAmount`]
						// })
					}
				}
			}
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
			socket.off('success');
			socket.off('error');
			socket.off('finishGame');
			socket.off('gameState');
			socket.off('history');
			socket.off('myBetState');
		}
	}, [socket])

	const getMyBets = async () => {
		try {
			let response = await axios.post(`${config.api}/my-info`, { name: myTokenId });
			if (response?.data?.status) {
				update({myBets: response.data.data as GameHistory[]})
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
		<Context.Provider value={{ ...state, ...unity, getMyBets, update}}>
			{children}
		</Context.Provider>
	);
};

export default Context


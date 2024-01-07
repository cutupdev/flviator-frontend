/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { UnityContext } from "react-unity-webgl";
import { useLocation } from "react-router";
import { Socket, io } from "socket.io-client";
import axios from "axios";
import toast from "react-hot-toast";

import config from "./config.json";
import toaster from "./components/Toast";

export interface BettedUserType {
  name: string;
  betAmount: number;
  cashOut: number;
  cashouted: boolean;
  target: number;
  img: string;
}

export interface BetResults {
  members: number;
  betAmount: number;
  cashouted: number;
}

export interface UserType {
  balance: number;
  userType: boolean;
  avatar: string;
  userId: string;
  currency: string;
  userName: string;
  isSoundEnable: boolean;
  isMusicEnable: boolean;
  msgVisible: boolean;
  f: {
    auto: boolean;
    betted: boolean;
    cashouted: boolean;
    betAmount: number;
    cashAmount: number;
    target: number;
  };
  s: {
    auto: boolean;
    betted: boolean;
    cashouted: boolean;
    betAmount: number;
    cashAmount: number;
    target: number;
  };
}

export interface PlayerType {
  auto: boolean;
  betted: boolean;
  cashouted: boolean;
  betAmount: number;
  cashAmount: number;
  target: number;
}

interface GameStatusType {
  currentNum: number;
  currentSecondNum: number;
  GameState: string;
  time: number;
}

interface GameBetLimit {
  maxBet: number;
  minBet: number;
}

declare interface GameHistory {
  _id: number;
  name: string;
  betAmount: number;
  cashoutAt: number;
  cashouted: boolean;
  date: number;
}

interface UserStatusType {
  fbetState: boolean;
  fbetted: boolean;
  sbetState: boolean;
  sbetted: boolean;
}

interface ContextDataType {
  myBets: GameHistory[];
  width: number;
  seed: string;
  userInfo: UserType;
  fautoCashoutState: boolean;
  fautoCound: number;
  finState: boolean;
  fdeState: boolean;
  fsingle: boolean;
  fincrease: number;
  fdecrease: number;
  fsingleAmount: number;
  fdefaultBetAmount: number;
  sautoCashoutState: boolean;
  sautoCound: number;
  sincrease: number;
  sdecrease: number;
  ssingleAmount: number;
  sinState: boolean;
  sdeState: boolean;
  ssingle: boolean;
  sdefaultBetAmount: number;
  myUnityContext: UnityContext;
}

interface ContextType extends GameBetLimit, UserStatusType, GameStatusType {
  state: ContextDataType;
  socket: Socket;
  msgData: MsgUserType[];
  platformLoading: boolean;
  msgTab: boolean;
  errorBackend: boolean;
  unityState: boolean;
  unityLoading: boolean;
  currentProgress: number;
  bettedUsers: BettedUserType[];
  previousHand: UserType[];
  history: number[];
  rechargeState: boolean;
  msgReceived: boolean;
  myUnityContext: UnityContext;
  currentTarget: number;
  setCurrentTarget(attrs: Partial<number>);
  setMsgReceived(attrs: Partial<boolean>);
  update(attrs: Partial<ContextDataType>);
  getMyBets();
  updateUserBetState(attrs: Partial<UserStatusType>);
  setMsgData(attrs: MsgUserType[]);
  handleGetSeed();
  toggleMsgTab();
}

interface MsgUserType {
  _id?: string;
  userId: string;
  userName: string;
  avatar: string;
  message: string;
  img: string;
  likes: number;
  likesIDs: string[];
  disLikes: number;
  disLikesIDs: string[];
}

const unityContext = new UnityContext({
  loaderUrl: "unity/AirCrash.loader.js",
  dataUrl: "unity/AirCrash.data.unityweb",
  frameworkUrl: "unity/AirCrash.framework.js.unityweb",
  codeUrl: "unity/AirCrash.wasm.unityweb",
});

const init_state = {
  myBets: [],
  width: 1500,
  seed: "",
  userInfo: {
    balance: 0,
    userType: false,
    userId: "",
    avatar: "",
    userName: "",
    currency: "INR",
    isSoundEnable: true,
    isMusicEnable: true,
    msgVisible: false,
    f: {
      auto: false,
      betted: false,
      cashouted: false,
      cashAmount: 0,
      betAmount: 20,
      target: 2,
    },
    s: {
      auto: false,
      betted: false,
      cashouted: false,
      cashAmount: 0,
      betAmount: 20,
      target: 2,
    },
  },
  fautoCashoutState: false,
  fautoCound: 0,
  finState: false,
  fdeState: false,
  fsingle: false,
  fincrease: 0,
  fdecrease: 0,
  fsingleAmount: 0,
  fdefaultBetAmount: 20,
  sautoCashoutState: false,
  sautoCound: 0,
  sincrease: 0,
  sdecrease: 0,
  ssingleAmount: 0,
  sinState: false,
  sdeState: false,
  ssingle: false,
  sdefaultBetAmount: 20,
  myUnityContext: unityContext,
} as ContextDataType;

const Context = React.createContext<ContextType>(null!);

const socket = io(
  process.env.REACT_APP_DEVELOPMENT === "true"
    ? config.development_wss
    : config.production_wss
);

export const callCashOut = (at: number, index: "f" | "s") => {
  let data = { type: index, endTarget: at };
  socket.emit("cashOut", data);
};

let fIncreaseAmount = 0;
let fDecreaseAmount = 0;
let sIncreaseAmount = 0;
let sDecreaseAmount = 0;

let newState;
let newBetState;

export const Provider = ({ children }: any) => {
  const token = new URLSearchParams(useLocation().search).get("token");
  const UserID = new URLSearchParams(useLocation().search).get("UserID");
  const currency = new URLSearchParams(useLocation().search).get("currency");
  const returnurl = new URLSearchParams(useLocation().search).get("returnurl");

  const [msgData, setMsgData] = useState<MsgUserType[]>([]);

  const [secure, setSecure] = React.useState<boolean>(false);
  const [msgReceived, setMsgReceived] = React.useState<boolean>(false);
  const [errorBackend, setErrorBackend] = React.useState<boolean>(false);
  const [platformLoading, setPlatformLoading] = React.useState<boolean>(true);
  const [state, setState] = React.useState<ContextDataType>(init_state);
  const [msgTab, setMsgTab] = React.useState<boolean>(
    state.userInfo.msgVisible
  );

  const toggleMsgTab = () => {
    setMsgTab(!msgTab);
  };

  newState = state;
  const [unity, setUnity] = React.useState({
    unityState: false,
    unityLoading: false,
    currentProgress: 0,
  });
  const [gameState, setGameState] = React.useState({
    currentNum: 0,
    currentSecondNum: 0,
    GameState: "",
    time: 0,
  });

  const [bettedUsers, setBettedUsers] = React.useState<BettedUserType[]>([]);
  const update = (attrs: Partial<ContextDataType>) => {
    setState({ ...state, ...attrs });
  };
  const [previousHand, setPreviousHand] = React.useState<UserType[]>([]);
  const [history, setHistory] = React.useState<number[]>([]);
  const [userBetState, setUserBetState] = React.useState<UserStatusType>({
    fbetState: false,
    fbetted: false,
    sbetState: false,
    sbetted: false,
  });
  newBetState = userBetState;
  const [rechargeState, setRechargeState] = React.useState(false);
  const [currentTarget, setCurrentTarget] = React.useState(0);
  const updateUserBetState = (attrs: Partial<UserStatusType>) => {
    setUserBetState({ ...userBetState, ...attrs });
  };
  const handleServerSeed = (seed: string) => {
    setState({ ...state, seed });
  };

  const [betLimit, setBetLimit] = React.useState<GameBetLimit>({
    minBet: 10,
    maxBet: 100000,
  });

  const handleGetSeed = () => {
    socket.emit("getSeed");
  };

  const updateUserMsg = (
    _id: string,
    userId: string,
    userName: string,
    avatar: string,
    message: string,
    img: string,
    likes: number,
    likesIDs: string[],
    disLikes: number,
    disLikesIDs: string[],
  ) => {
    setMsgData([
      ...msgData,
      {
        _id,
        userId,
        userName,
        avatar,
        message,
        img,
        likes,
        likesIDs,
        disLikes,
        disLikesIDs
      },
    ]);
  };

  React.useEffect(
    function () {
      if (secure) {
        setPlatformLoading(false);
        unityContext.on("GameController", function (message) {
          if (message === "Ready") {
            setUnity({
              currentProgress: 100,
              unityLoading: true,
              unityState: true,
            });
          }
        });
        unityContext.on("progress", (progression) => {
          const currentProgress = progression * 100;
          if (progression === 1) {
            setUnity({ currentProgress, unityLoading: true, unityState: true });
          } else {
            setUnity({
              currentProgress,
              unityLoading: false,
              unityState: false,
            });
          }
        });
        return () => unityContext.removeAllEventListeners();
      }
    },
    [secure]
  );

  React.useEffect(() => {
    socket.on("connect", () =>
      console.log(`Socket connection is ${socket.connected}`)
    );
    if (token && UserID && currency && returnurl) {
      socket.emit("sessionCheck", { token, UserID, currency, returnurl });
      socket.on("sessionSecure", (data) => {
        if (data.sessionStatus === true) {
          socket.emit("enterRoom", { token, UserID, currency });
        } else {
          toast.error(data.message);
          setErrorBackend(true);
        }
      });

      socket.on("myInfo", (user: UserType) => {
        localStorage.setItem("aviator-audio", "");
        let attrs = state;
        attrs.userInfo.balance = user.balance;
        attrs.userInfo.userType = user.userType;
        attrs.userInfo.userId = user.userId;
        attrs.userInfo.userName = user.userName;
        attrs.userInfo.avatar = user.avatar;
        attrs.userInfo.currency = user.currency;
        attrs.userInfo.isSoundEnable = user.isSoundEnable;
        attrs.userInfo.isMusicEnable = user.isMusicEnable;
        update(attrs);
        setSecure(true);
      });
    }

    if (secure) {
      socket.on("bettedUserInfo", (bettedUsers: BettedUserType[]) => {
        setBettedUsers(bettedUsers);
      });

      socket.on("myBetState", (userInfo: { user: UserType; type: string }) => {
        var { user } = userInfo;
        var attrs = { ...userBetState };
        attrs.fbetState = false;
        attrs.fbetted = user.f.betted;
        attrs.sbetState = false;
        attrs.sbetted = user.s.betted;
        setUserBetState(attrs);
      });

      socket.on("history", (history: any) => {
        setHistory(history);
      });

      socket.on("gameState", (gameState: GameStatusType) => {
        setGameState(gameState);
      });

      socket.on("serverSeed", (seed: string) => {
        handleServerSeed(seed);
      });

      socket.on("previousHand", (previousHand: UserType[]) => {
        setPreviousHand(previousHand);
      });

      socket.on("finishGame", (user: UserType) => {
        let attrs = newState;
        let fauto = attrs.userInfo.f.auto;
        let sauto = attrs.userInfo.s.auto;
        let fbetAmount = attrs.userInfo.f.betAmount;
        let sbetAmount = attrs.userInfo.s.betAmount;
        let betStatus = newBetState;
        attrs.userInfo = user;
        attrs.userInfo.f.betAmount = fbetAmount;
        attrs.userInfo.s.betAmount = sbetAmount;
        attrs.userInfo.f.auto = fauto;
        attrs.userInfo.s.auto = sauto;
        if (!user.f.betted) {
          betStatus.fbetted = false;
          if (attrs.userInfo.f.auto) {
            if (user.f.cashouted) {
              fIncreaseAmount += user.f.cashAmount;
              if (attrs.finState && attrs.fincrease - fIncreaseAmount <= 0) {
                attrs.userInfo.f.auto = false;
                betStatus.fbetState = false;
                fIncreaseAmount = 0;
              } else if (
                attrs.fsingle &&
                attrs.fsingleAmount <= user.f.cashAmount
              ) {
                attrs.userInfo.f.auto = false;
                betStatus.fbetState = false;
              } else {
                attrs.userInfo.f.auto = true;
                betStatus.fbetState = true;
              }
            } else {
              fDecreaseAmount += user.f.betAmount;
              if (attrs.fdeState && attrs.fdecrease - fDecreaseAmount <= 0) {
                attrs.userInfo.f.auto = false;
                betStatus.fbetState = false;
                fDecreaseAmount = 0;
              } else {
                attrs.userInfo.f.auto = true;
                betStatus.fbetState = true;
              }
            }
          }
        }
        if (!user.s.betted) {
          betStatus.sbetted = false;
          if (user.s.auto) {
            if (user.s.cashouted) {
              sIncreaseAmount += user.s.cashAmount;
              if (attrs.sinState && attrs.sincrease - sIncreaseAmount <= 0) {
                attrs.userInfo.s.auto = false;
                betStatus.sbetState = false;
                sIncreaseAmount = 0;
              } else if (
                attrs.ssingle &&
                attrs.ssingleAmount <= user.s.cashAmount
              ) {
                attrs.userInfo.s.auto = false;
                betStatus.sbetState = false;
              } else {
                attrs.userInfo.s.auto = true;
                betStatus.sbetState = true;
              }
            } else {
              sDecreaseAmount += user.s.betAmount;
              if (attrs.sdeState && attrs.sdecrease - sDecreaseAmount <= 0) {
                attrs.userInfo.s.auto = false;
                betStatus.sbetState = false;
                sDecreaseAmount = 0;
              } else {
                attrs.userInfo.s.auto = true;
                betStatus.sbetState = true;
              }
            }
          }
        }
        update(attrs);
        setUserBetState(betStatus);
      });

      socket.on("getBetLimits", (betAmounts: { max: number; min: number }) => {
        setBetLimit({ maxBet: betAmounts.max, minBet: betAmounts.min });
      });

      socket.on("recharge", () => {
        setRechargeState(true);
      });

      socket.on("error", (data) => {
        setUserBetState({
          ...userBetState,
          [`${data.index}betted`]: false,
        });
        toast.error(data.message);
      });

      socket.on("success", (data) => {
        toaster(
          "success",
          data.msg,
          data.currency,
          data.point,
          data.cashoutAmount
        );
      });
      return () => {
        socket.off("connect");
        socket.off("disconnect");
        socket.off("myBetState");
        socket.off("sessionSecure");
        socket.off("myInfo");
        socket.off("newMsg");
        socket.off("myInfo");
        socket.off("history");
        socket.off("gameState");
        socket.off("previousHand");
        socket.off("finishGame");
        socket.off("getBetLimits");
        socket.off("recharge");
        socket.off("error");
        socket.off("success");
      };
    }
    // eslint-disable-next-line
  }, [socket, secure, token]);

  React.useEffect(() => {
    socket.on("newMsg", ({
      _id,
      userId,
      userName,
      avatar,
      message,
      img,
      likes,
      likesIDs,
      disLikes,
      disLikesIDs
    }) => {
      setMsgReceived(!msgReceived);
      updateUserMsg(
        _id,
        userId,
        userName,
        avatar,
        message,
        img,
        likes,
        likesIDs,
        disLikes,
        disLikesIDs
      );
    });
    return () => {
      socket.off("newMsg");
    };
  }, [socket, msgReceived, msgData]);

  React.useEffect(() => {
    let attrs = state;
    let betStatus = userBetState;
    if (gameState.GameState === "BET") {
      if (betStatus.fbetState) {
        if (state.userInfo.f.auto) {
          if (state.fautoCound > 0) attrs.fautoCound -= 1;
          else {
            attrs.userInfo.f.auto = false;
            betStatus.fbetState = false;
            return;
          }
        }
        let data = {
          betAmount: state.userInfo.f.betAmount,
          target: state.userInfo.f.target,
          type: "f",
          auto: state.userInfo.f.auto,
        };
        if (attrs.userInfo.balance - state.userInfo.f.betAmount < 0) {
          toast.error("Your balance is not enough");
          betStatus.fbetState = false;
          betStatus.fbetted = false;
          return;
        }
        attrs.userInfo.balance -= state.userInfo.f.betAmount;
        socket.emit("playBet", data);
        betStatus.fbetState = false;
        betStatus.fbetted = true;
        // update(attrs);
        setUserBetState(betStatus);
      }
      if (betStatus.sbetState) {
        if (state.userInfo.s.auto) {
          if (state.sautoCound > 0) attrs.sautoCound -= 1;
          else {
            attrs.userInfo.s.auto = false;
            betStatus.sbetState = false;
            return;
          }
        }
        let data = {
          betAmount: state.userInfo.s.betAmount,
          target: state.userInfo.s.target,
          type: "s",
          auto: state.userInfo.s.auto,
        };
        if (attrs.userInfo.balance - state.userInfo.s.betAmount < 0) {
          toast.error("Your balance is not enough");
          betStatus.sbetState = false;
          betStatus.sbetted = false;
          return;
        }
        attrs.userInfo.balance -= state.userInfo.s.betAmount;
        socket.emit("playBet", data);
        betStatus.sbetState = false;
        betStatus.sbetted = true;
        // update(attrs);
        setUserBetState(betStatus);
      }
    }
  }, [gameState.GameState, userBetState.fbetState, userBetState.sbetState]);

  const getMyBets = async () => {
    try {
      let response = await axios.post(
        `${process.env.REACT_APP_DEVELOPMENT === "true"
          ? config.development_api
          : config.production_api
        }/my-info`,
        {
          userId: state.userInfo.userId,
        }
      );
      if (response?.data?.status) {
        update({ myBets: response.data.data as GameHistory[] });
      }
    } catch (error) {
      console.log("getMyBets", error);
    }
  };

  useEffect(() => {
    if (gameState.GameState === "BET") getMyBets();
  }, [gameState.GameState]);

  return (
    <Context.Provider
      value={{
        state: state,
        ...betLimit,
        ...userBetState,
        ...unity,
        ...gameState,
        socket,
        msgData,
        msgReceived,
        platformLoading,
        msgTab,
        errorBackend,
        currentTarget,
        rechargeState,
        myUnityContext: unityContext,
        bettedUsers: [...bettedUsers],
        previousHand: [...previousHand],
        history: [...history],
        setMsgData,
        setCurrentTarget,
        setMsgReceived,
        update,
        getMyBets,
        updateUserBetState,
        handleGetSeed,
        toggleMsgTab,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export default Context;

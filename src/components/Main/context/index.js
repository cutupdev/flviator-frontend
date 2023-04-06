import React, { createContext, useContext, useEffect, useReducer } from "react";
import uniqid from 'uniqid';
import { io } from 'socket.io-client';
import { toast } from 'react-toastify';
import Unity, { UnityContext } from "react-unity-webgl";

const unityContext = new UnityContext({
  loaderUrl: "build/Build/myBuild.loader.js",
  dataUrl: "build/Build/myBuild.data",
  frameworkUrl: "build/Build/myBuild.framework.js",
  codeUrl: "build/Build/myBuild.wasm"
});

// const URL = 'http://192.168.115.178:5000/';
const URL = 'http://52.23.171.79/';
let id = uniqid();
let secondId = uniqid();
let totalData;
let fautoBetFinished = false;
let sautoBetFinished = false;

const socket = io(URL);
const CrashContext = createContext();
export function useCrashContext() {
  return useContext(CrashContext);
}
// const socket = socketIOClient(URL);
function reducer(state, { type, payload }) {
  return {
    ...state,
    [type]: payload,
  };
}

const init_state = {
  history: [],
  bettedUsers: [],
  gameState: [],
  balance: 3000,
  width: 1500,
  fbetState: false,
  fbetted: false,
  fbetAmount: 1,
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
  sbetAmount: 1,
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
  unityState: false,
  myUnityContext: unityContext
};
export default function Provider({ children }) {
  const [state, dispatch] = useReducer(reducer, init_state);

  totalData = state;

  useEffect(() => {
    var data = {
      token: id,
      name: id,
      type: "f"
    }
    var sData = {
      token: secondId,
      name: secondId,
      type: "s"
    }
    socket.emit("enterRoom", data);
    socket.emit("enterRoom", sData);

    socket.on("bettedUserInfo", (data) => {
      dispatch({
        type: "bettedUsers",
        payload: data
      })
    });

    socket.on("myBetState", (data) => {
      if (!data.auto) {
        dispatch({
          type: `${data.type}betState`,
          payload: false
        })
      }
      dispatch({
        type: `${data.type}betted`,
        payload: data.betted
      });
      dispatch({
        type: "balance",
        payload: data.balance
      })
    })

    socket.on("history", (data) => {
      dispatch({
        type: "history",
        payload: data.history
      })
    });

    socket.on("gameState", (data) => {
      dispatch({
        type: "gameState",
        payload: data
      });

      if (totalData.fbetted) {
        if (totalData.fautoCashoutState) {
          if (totalData.fcashOutAt <= data.currentSecondNum) {
            dispatch({
              type: "fbetted",
              payload: false
            })
            if (!fautoBetFinished) {
              callCashOut(totalData.fcashOutAt, "f");
              fautoBetFinished = true;
            }
          }
        }
      }
      if (totalData.sbetted) {
        if (totalData.sautoCashoutState) {
          if (totalData.scashOutAt <= data.currentSecondNum) {
            dispatch({
              type: "sbetted",
              payload: false
            })
            if (!sautoBetFinished) {
              callCashOut(totalData.scashOutAt, "s");
              sautoBetFinished = true;
            }
          }
        }
      }
    });

    socket.on("finishGame", (data) => {
      dispatch({
        type: `${data.type}betted`,
        payload: false
      })

      dispatch({
        type: "balance",
        payload: totalData.balance + data.cashAmount
      })
      if (state[`${data.type}auto`]) {
        if (data.cashouted) {
          if (data.cashAmount > Number(totalData[`${data.type}increase`])) {
            dispatch({
              type: `${data.type}auto`,
              payload: false
            })
          }
        } else {
          if (totalData[`${data.type}betAmount`] > Number(totalData[`${data.type}decrease`])) {
            dispatch({
              type: `${data.type}auto`,
              payload: false
            })
          } else {
            dispatch({
              type: `${data.type}betAmount`,
              payload: totalData[`${data.type}defaultBetAmount`]
            })
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

    unityContext.on("GameController", function (message) {
      if (message === "Ready") {
        dispatch({
          type: "unityState",
          payload: true
        });
        console.log(unityContext);
      }
    });

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
  }, [])

  useEffect(() => {
    if (state.gameState.GameState === "BET") {
      fautoBetFinished = false;
      sautoBetFinished = false;
      if (state.fauto) {
        if (state.fautoCound > 0) {
          if (state.fbetState) {
            var data = {
              token: id,
              betAmount: state.fbetAmount,
              target: state.fcashOutAt,
              auto: state.fauto
            }
            socket.emit("playBet", data);
            dispatch({
              type: "fautoCound",
              payload: state.fautoCound - 1
            })
          }
        } else {
          dispatch({
            type: "fauto",
            payload: false
          });
          dispatch({
            type: "fbetState",
            payload: false
          })
        }
      } else if (state.fbetState) {
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
          if (state.fbetState) {
            var betdata = {
              token: secondId,
              betAmount: state.sbetAmount,
              auto: state.sauto
            }
            socket.emit("playBet", betdata);

            dispatch({
              type: "sautoCound",
              payload: state.sautoCound - 1
            })
          }
        } else {
          dispatch({
            type: "sauto",
            payload: false
          });
          dispatch({
            type: "sbetState",
            payload: false
          })
        }
      } else if (state.sbetState) {
        var sbetdata = {
          token: secondId,
          betAmount: state.sbetAmount,
          target: state.scashOutAt,
          auto: state.sauto
        }
        socket.emit("playBet", sbetdata);
      }
    }
  }, [state.gameState.GameState, state.fbetState, state.sbetState]);

  const callCashOut = (at, index) => {
    let data;
    if (index === "f") {
      data = {
        token: id,
        at: at
      }
    } else {
      data = {
        token: secondId,
        at: at
      }
    }
    socket.emit("cashOut", data);
  }

  return (
    <CrashContext.Provider value={[state, dispatch, callCashOut]}>
      {children}
    </CrashContext.Provider>
  );
}

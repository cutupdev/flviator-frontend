import React, { useEffect } from "react";
import axios from "axios";
import { Oval } from "react-loader-spinner";
import "./bets.scss";
import config from "../../config.json";
import Context from "../../context";
import { displayName } from "../utils";

const TopHistory = () => {
  const { state } = React.useContext(Context);
  const [type, setType] = React.useState(0);
  const [history, setHistory] = React.useState([]);
  const [loadingEffect, setLoadingEffect] = React.useState(false);
  const [headerType, setHeaderType] = React.useState("day");

  const header = [
    { type: 0, value: "day", label: "Day" },
    { type: 1, value: "month", label: "Month" },
    { type: 2, value: "year", label: "Year" },
  ];

  const callDate = async (date: string) => {
    try {
      setLoadingEffect(true);
      let response = await axios.get(
        `${
          process.env.REACT_APP_DEVELOPMENT === "true"
            ? config.development_api
            : config.production_api
        }/get-${date}-history`
      );
      if (response?.data?.status) {
        setHistory(response.data.data);
        setTimeout(() => {
          setLoadingEffect(false);
        }, 500);
      }
    } catch (error: any) {
      console.log("callDate", error);
    }
  };
  useEffect(() => {
    // Request of Day data
    callDate("day");
  }, []);
  return (
    <>
      <div className="navigation-switcher-wrapper">
        <div className="navigation-switcher">
          <div
            className="slider"
            style={{ transform: `translate(${100 * type}px)` }}
          ></div>
          {header.map((item, index) => (
            <button
              key={index}
              onClick={() => {
                if (headerType !== item.value) {
                  setType(item.type);
                  callDate(item.value);
                  setHeaderType(item.value);
                }
              }}
              className={`tab ${
                headerType === item.value ? "active" : "inactive"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
      <div className="top-list-wrapper">
        <div className="top-items-list scroll-y h-100">
          {loadingEffect ? (
            <div className="flex items-center justify-center">
              <Oval
                height={35}
                width={35}
                color="red"
                wrapperStyle={{ marginTop: "60px" }}
                wrapperClass=""
                visible={true}
                ariaLabel="oval-loading"
                secondaryColor="#990000"
                strokeWidth={3}
                strokeWidthSecondary={4}
              />
            </div>
          ) : (
            <>
              {history.map((item: any, index: number) => (
                <div key={index} className="bet-item">
                  <div className="main">
                    <div className="icon">
                      {item.userinfo[0]?.img ? (
                        <img
                          className="avatar"
                          alt={item.userinfo[0]?.img}
                          src={item.userinfo[0]?.img}
                        ></img>
                      ) : (
                        <img
                          className="avatar"
                          alt="avatar"
                          src="/avatars/av-5.png"
                        ></img>
                      )}
                      <div className="username">
                        {displayName(item.userinfo[0]?.name)}
                      </div>
                    </div>
                    <div className="score">
                      <div className="flex">
                        <div className="">
                          <span>
                            Bet,{" "}
                            {`${
                              state?.userInfo?.currency
                                ? state?.userInfo?.currency
                                : "INR"
                            }`}
                            :&nbsp;
                          </span>
                          <span></span>
                        </div>
                        <span className="amount">
                          {item.betAmount.toFixed(2)}
                        </span>
                      </div>
                      <div className="flex">
                        <div className="">
                          <span>Cashed out:&nbsp;</span>
                        </div>
                        <span
                          className={`amount cashout ${
                            Number(item.cashoutAt) < 2
                              ? "blue"
                              : Number(item.cashoutAt) < 10
                              ? "purple"
                              : "big"
                          }`}
                        >
                          {Number(item.cashoutAt).toFixed(2)}x
                        </span>
                        {/* <span className="amount cashout">
                          {item.cashoutAt.toFixed(2)}x
                        </span> */}
                      </div>
                      <div className="flex">
                        <div className="">
                          <span>
                            Win,{" "}
                            {`${
                              state?.userInfo?.currency
                                ? state?.userInfo?.currency
                                : "INR"
                            }`}
                            : &nbsp;
                          </span>
                        </div>
                        <span className="amount">
                          {(item.cashoutAt * item.betAmount).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default TopHistory;

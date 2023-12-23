import React, { useEffect } from "react";
import AllData from "./all-data";
import MyBets from "./my-bets";
import TopHistory from "./top-history";
import Context, { BettedUserType, UserType, BetResults } from "../../context";

export default function BetsUsers() {
  const { previousHand, bettedUsers, getMyBets } = React.useContext(Context);

  const [headerType, setHeaderType] = React.useState("my");
  const [allData, setAllData] = React.useState<UserType[] | BettedUserType[]>(
    []
  );
  const [pre, setPre] = React.useState(false);
  const [betsResults, setBetResults] = React.useState<BetResults>({
    members: 0,
    betAmount: 0,
    cashouted: 0,
  });

  const header = [
    { type: "all", value: "All Bets" },
    { type: "my", value: "My Bets", onClick: "myBet" },
    { type: "top", value: "Top" },
  ];

  const getData = (e) => {
    if (e === "myBet") getMyBets();
  };

  const handleSetBets = () => {
    let allUsers = [...bettedUsers];
    if (allUsers.length > 0) {
      var sum = allUsers.reduce(function (sum, b) {
        return sum + b.betAmount;
      }, 0);
      var cashedOutSum = allUsers.reduce(function (sum, b) {
        return sum + b.cashOut;
      }, 0);

      setBetResults({
        members: bettedUsers.length,
        betAmount: sum,
        cashouted: cashedOutSum,
      });
    }
  };

  React.useEffect(() => {
    if (pre) {
      setAllData(previousHand);
    } else {
      if (!!bettedUsers.length) setAllData(bettedUsers);
    }
  }, [pre, bettedUsers, previousHand]);

  useEffect(() => {
    let flag = false;
    if (allData.length != bettedUsers.length) {
      flag = true;
    } else {
      for (let i = 0; i < allData.length; i++) {
        let perItem: any = { ...allData[i] };
        if (
          perItem?.name !== bettedUsers[i].name ||
          perItem?.betAmount !== bettedUsers[i].betAmount ||
          perItem?.cashOut !== bettedUsers[i].cashOut
        ) {
          flag = true;
          break;
        }
      }
    }
    if (flag === true) handleSetBets();
  }, [allData, bettedUsers]);

  return (
    <div className="info-board">
      <div className="bets-block">
        <div className="bet-block-nav">
          <div style={{ height: "24px" }}>
            <div className="navigation-switcher">
              {header.map((item, index) => (
                <button
                  key={index}
                  className={`tab ${
                    headerType === item.type ? "click active" : "inactive"
                  }`}
                  onClick={() => {
                    setHeaderType(item.type);
                    item.onClick && getData(item.onClick);
                  }}
                >
                  {item.value}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="data-list">
          {headerType === "all" ? (
            <AllData
              setPre={setPre}
              pre={pre}
              allData={allData}
              betsResults={betsResults}
            />
          ) : headerType === "my" ? (
            <MyBets />
          ) : (
            <TopHistory />
          )}
        </div>
        <div className="bets-footer">
          <div className="provably-fair-block">
            <span>This game is </span>
            <div className="provably-fair">
              <div className="i-fair"></div>
              <span className="text-provably-fair">Provably Fair</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

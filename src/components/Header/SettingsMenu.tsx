import React, { useCallback, useEffect, useState } from "react";
import { PiListBold } from "react-icons/pi";
import { GiServerRack } from "react-icons/gi";

import {
  HiOutlineSpeakerWave,
  HiOutlineMusicalNote,
  HiOutlineShieldCheck,
  HiOutlineDocumentText,
  HiOutlineComputerDesktop,
  HiOutlineHome,
} from "react-icons/hi2";
import { CiMoneyBill } from "react-icons/ci";
import { ImCopy } from "react-icons/im";
import { RxAvatar } from "react-icons/rx";
import copy from "copy-to-clipboard";

import Context from "../../context";
import axios from "axios";
import config from "../../config.json";
import ChatImg from "../../assets/images/chat.svg";
import { displayName, generateRandomString } from "../utils";

const settingItems: { label: string; handleType: string }[] = [
  {
    label: "Provably Fair Settings",
    handleType: "fair",
  },
  {
    label: "Game Rules",
    handleType: "rules",
  },
  {
    label: "Game Limits",
    handleType: "limits",
  },
];

const Menu = ({ setHowto }) => {
  const {
    state,
    update,
    handleGetSeed,
    toggleMsgTab,
    msgReceived,
    setMsgReceived,
  } = React.useContext(Context);
  const [showDropDown, setShowDropDown] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [modalType, setModalType] = useState<string>("");
  const [clientSeedType, setClientSeedType] = useState<number>(0);
  const [mouseCursorStatus, setMouseCursorStatus] = useState<boolean>(false);
  const [changeSeed, setChangeSeed] = useState<boolean>(false);
  const [changeAvatar, setChangeAvatar] = useState<boolean>(false);

  const [key, setKey] = useState<string>(generateRandomString(20));
  const [customKey, setCustomKey] = useState<string>(generateRandomString(20));
  const [imgNums, setImgNums] = useState<number[]>([]);

  /**
   * Toggle the drop down menu
   */
  const toggleDropDown = () => {
    setShowDropDown(!showDropDown);
  };

  /**
   * Hide the drop down menu if click occurs
   * outside of the drop-down element.
   *
   * @param event  The mouse event
   */
  const dismissHandler = (event: React.FocusEvent<HTMLButtonElement>): void => {
    if (event.currentTarget === event.target && mouseCursorStatus === false) {
      setShowDropDown(false);
    }
  };

  const Icons = ({ type }: { type: string }) => {
    if (type === "fair") {
      return <HiOutlineShieldCheck color="#83878e" size={20} />;
    } else if (type === "rules") {
      return <HiOutlineDocumentText color="#83878e" size={20} />;
      // } else if (type === "history") {
      //   return <MdHistory color="#83878e" size={20} />;
    } else {
      return <CiMoneyBill color="#83878e" size={20} />;
    }
  };

  const handleToggleSound = useCallback(
    async (checked) => {
      let takeOffAudioEle: any = document.getElementById("takeOffAudio");
      let flewAwayAudioEle: any = document.getElementById("flewAwayAudio");
      if (checked === false) {
        takeOffAudioEle.pause();
        flewAwayAudioEle.pause();
      }
      await axios.post(
        `${
          process.env.REACT_APP_DEVELOPMENT === "true"
            ? config.development_api
            : config.production_api
        }/update-info`,
        {
          userId: state.userInfo.userId,
          updateData: { soundStatus: checked },
        }
      );
      update({
        userInfo: {
          ...state.userInfo,
          soundStatus: checked,
        },
      });
    },
    [state]
  );

  const handleToggleMusic = useCallback(
    async (checked) => {
      let mainEle: any = document.getElementById("mainAudio");
      mainEle.volume = 0.2;
      if (checked === true) {
        mainEle.play();
      } else {
        mainEle.pause();
      }
      await axios.post(
        `${
          process.env.REACT_APP_DEVELOPMENT === "true"
            ? config.development_api
            : config.production_api
        }/update-info`,
        {
          userId: state.userInfo.userId,
          updateData: { musicStatus: checked },
        }
      );
      update({
        userInfo: {
          ...state.userInfo,
          musicStatus: checked,
        },
      });
    },
    [state]
  );

  const handleOpenSettings = (type: string) => {
    if (type === "fair") {
      handleGetSeed();
    }
    if (type === "rules") {
      setHowto("more");
    } else {
      setModalType(type);
      setShowModal(true);
      setShowDropDown(false);
    }
  };

  const handleImgClick = async (avatar: string) => {
    console.log("avatar", avatar);
    const response: any = await axios.post(
      `${
        process.env.REACT_APP_DEVELOPMENT === "true"
          ? config.development_api
          : config.production_api
      }/update-info`,
      {
        userId: state.userInfo.userId,
        updateData: { avatar },
      }
    );

    if (response.data?.status) {
      update({
        userInfo: {
          ...state.userInfo,
          avatar,
        },
      });
    }
  };

  const toggleChangeAvatar = () => {
    setChangeAvatar(!changeAvatar);
  };

  useEffect(() => {
    window?.addEventListener("click", () => {
      let num: number[] = [];
      for (let i = 1; i < 73; i++) {
        num.push(i);
      }
      setImgNums(num);

      try {
        if (
          localStorage.getItem("aviator-audio") !== "true" &&
          state.userInfo.musicStatus === true
        ) {
          let mainEle: any = document.getElementById("mainAudio");
          mainEle.volume = 0.2;
          mainEle.play();
          localStorage.setItem("aviator-audio", "true");
        }
      } catch (error) {
        handleToggleSound(true);
        handleToggleMusic(true);
      }
    });
  }, []);

  return (
    <div
      tabIndex={0}
      onBlur={() => {
        if (mouseCursorStatus === false) setShowDropDown(false);
      }}
      className="flex"
    >
      <button
        className={`setting-button ${showDropDown ? "active" : ""}`}
        onClick={(): void => toggleDropDown()}
        onBlur={(e: React.FocusEvent<HTMLButtonElement>): void =>
          dismissHandler(e)
        }
      >
        <PiListBold color="#83878e" size={20} />
      </button>
      <button
        className={`setting-button ${showDropDown ? "active" : ""}`}
        onClick={() => {
          toggleMsgTab();
          setMsgReceived(!msgReceived);
        }}
      >
        <img src={ChatImg} alt="chat section" />
      </button>
      <div
        className="aviator-dropdown-menu"
        onMouseLeave={() => setMouseCursorStatus(false)}
        onMouseEnter={() => setMouseCursorStatus(true)}
      >
        {showDropDown && (
          <div>
            <div
              className={
                showDropDown ? "setting-dropdown" : "setting-dropdown active"
              }
            >
              <div className="first-block">
                <div className="user-info">
                  <div className="avatar">
                    <img
                      className="avatar"
                      src={`${
                        state.userInfo?.avatar
                          ? state.userInfo?.avatar
                          : "./avatars/av-5.png"
                      }`}
                      alt="avatar"
                    />
                  </div>
                  <div className="name">
                    {displayName(state?.userInfo?.userName)}
                  </div>
                </div>
                <div
                  className="avatar-change"
                  onClick={() => {
                    toggleChangeAvatar();
                    setShowDropDown(false);
                  }}
                >
                  <div className="avatar-logo">
                    <RxAvatar color="#83878e" size={20} />
                  </div>
                  <div className="change-text">
                    <div>Change</div>
                    <div>Avatar</div>
                  </div>
                </div>
              </div>
              <div className="setting-second-block">
                <div className="setting-dropdown-item">
                  <div className="icon-section">
                    <HiOutlineSpeakerWave color="#83878e" size={20} />
                    <span className="setting-title-text">Sound</span>
                  </div>
                  <div className="aviator-main-audio">
                    <label className="aviator-switch">
                      <input
                        className="aviator-input"
                        type="checkbox"
                        checked={state.userInfo.soundStatus || false}
                        onChange={(e) => handleToggleSound(e.target.checked)}
                      />
                      <span className="aviator-slider round"></span>
                    </label>
                  </div>
                </div>
                <div className="setting-dropdown-item">
                  <div className="icon-section">
                    <HiOutlineMusicalNote color="#83878e" size={20} />
                    <span className="setting-title-text">Music</span>
                  </div>
                  <div className="aviator-main-audio">
                    <label className="aviator-switch">
                      <input
                        className="aviator-input"
                        type="checkbox"
                        checked={state.userInfo.musicStatus || false}
                        onChange={(e) => handleToggleMusic(e.target.checked)}
                      />
                      <span className="aviator-slider round"></span>
                    </label>
                  </div>
                </div>
                <div className="devider"></div>

                {settingItems.map((item, index) => {
                  return (
                    <div
                      key={index}
                      className="setting-dropdown-item"
                      onClick={() => handleOpenSettings(item.handleType)}
                    >
                      <div className="icon-section">
                        {<Icons type={item.handleType} />}
                        <span className="setting-title-text">{item.label}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
              {/* <a href={config.production_wss} className="logout">
                <span>
                  <HiOutlineHome size={16} />
                </span>
                <span>Home</span>
              </a> */}
            </div>
          </div>
        )}
      </div>
      {showModal && modalType === "fair" && (
        <div className="modal">
          <div onClick={() => setShowModal(false)} className="back"></div>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <span className="modal-title">Provably Fair Settings</span>
                <button className="close" onClick={() => setShowModal(false)}>
                  <span>x</span>
                </button>
              </div>
              <div className="modal-body">
                <div className="main-desc">
                  This game uses Provably Fair technology to determine game
                  result. This tool gives you ability to change your seed and
                  check fairness of the game.
                </div>
                <div className="client-seed">
                  <div className="client-seed-title">
                    <HiOutlineComputerDesktop color="#83878e" size={30} />
                    <span className="setting-title-text">
                      Client (your) seed:
                    </span>
                  </div>
                  <div>
                    Round result is determined form combination of server seed
                    and first 3 bets of the round.
                  </div>
                  <div
                    className={`client-seed-custom ${
                      clientSeedType === 1 && "block-key"
                    }`}
                  >
                    <div
                      className="label"
                      onClick={() => {
                        setClientSeedType(0);
                      }}
                    >
                      <label>
                        <span className="radio">
                          {clientSeedType === 0 ? (
                            <span className="dot"></span>
                          ) : (
                            <></>
                          )}
                        </span>
                        <span>Random on every new game</span>
                      </label>
                    </div>
                    <div className="key-container">
                      <div className="key">
                        <span className="current"> Current: </span>
                        <span className="main-key">{key}</span>
                      </div>
                      <span className="copy-icon">
                        <ImCopy
                          color="#868b8d"
                          size={16}
                          onClick={() => copy(key)}
                        />
                      </span>
                    </div>
                  </div>
                  <div
                    className={`client-seed-custom ${
                      clientSeedType === 0 && "block-key"
                    }`}
                  >
                    <div
                      className="label"
                      onClick={() => {
                        setClientSeedType(1);
                      }}
                    >
                      <label>
                        <span className="radio">
                          {clientSeedType === 1 ? (
                            <span className="dot"></span>
                          ) : (
                            <></>
                          )}
                        </span>
                        <span>Enter manually</span>
                      </label>
                    </div>
                    <div className="key-container">
                      <div className="key">
                        <span className="current"> Current: </span>
                        <span className="main-key">{customKey}</span>
                      </div>
                      <span className="copy-icon">
                        <ImCopy
                          color="#868b8d"
                          size={16}
                          onClick={() => copy(customKey)}
                        />
                      </span>
                    </div>
                    <div className="key-change">
                      <button
                        className="btn btn-success"
                        onClick={() => {
                          setChangeSeed(true);
                        }}
                        disabled={clientSeedType === 0}
                      >
                        CHANGE
                      </button>
                    </div>
                  </div>
                </div>
                <div className="server-seed">
                  <div className="server-seed-title">
                    <GiServerRack color="#83878e" size={30} />
                    <span className="setting-title-text">
                      Server seed SHA256:
                    </span>
                  </div>
                  <div className="server-seed-value-block">
                    <div className="key-container">
                      <div className="key">{state.seed}</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                You can check fairness of each bet from bets history
              </div>
            </div>
          </div>

          {changeSeed === true && (
            <div className="seed-wrapper">
              <div className="seed-change">
                <div className="seed-header">
                  <div>CHANGE SEED</div>
                  <button
                    type="button"
                    data-dismiss="modal"
                    aria-label="Close"
                    className="close"
                    onClick={() => setChangeSeed(false)}
                  >
                    <span aria-hidden="true">×</span>
                  </button>
                </div>
                <div className="seed-body">
                  <div className="seed-body-title">Enter new seed:</div>
                  <div className="seed-value">
                    <input
                      type="text"
                      title="Seed"
                      className="ng-untouched ng-pristine ng-valid"
                      value={customKey}
                      onChange={(e) => setCustomKey(e.target.value)}
                    />
                    <button
                      type="button"
                      className="btn btn-warning btn-random"
                      onClick={() => setCustomKey(generateRandomString(20))}
                    >
                      <span className="text-uppercase">Random</span>
                    </button>
                  </div>
                  <div className="actions">
                    <button
                      type="button"
                      className="btn btn-success"
                      onClick={() => setChangeSeed(false)}
                    >
                      <span className="text-uppercase">Save</span>
                    </button>
                    <button
                      type="button"
                      className="btn btn-danger"
                      onClick={() => setChangeSeed(false)}
                    >
                      <span className="text-uppercase">Cancel</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {showModal && modalType === "limits" && (
        <div className="modal">
          <div onClick={() => setShowModal(false)} className="back"></div>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <span className="modal-title">Game Limits</span>
                <button className="close" onClick={() => setShowModal(false)}>
                  <span>x</span>
                </button>
              </div>
              <div className="modal-body special-modal-body">
                <ul className="list-group">
                  <li className="list-group-item pl-2 pr-1">
                    <div>
                      <span>Minimum bet</span>
                      <span>(INR):</span>
                    </div>
                    <span className="badge badge-success px-2 font-weight-normal">
                      10
                    </span>
                  </li>
                  <li className="list-group-item pl-2 pr-1">
                    <div>
                      <span>Maximum bet</span>
                      <span>(INR):</span>
                    </div>
                    <span className="badge badge-success px-2 font-weight-normal">
                      100000
                    </span>
                  </li>
                  <li className="list-group-item pl-2 pr-1">
                    <div>
                      <span>Maximum win for one bet</span>
                      <span>(INR):</span>
                    </div>
                    <span className="badge badge-success px-2 font-weight-normal">
                      8000000
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {changeAvatar && (
        <div className="modal">
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <span>CHOOSE GAME AVATAR</span>
                <button
                  type="button"
                  className="close"
                  onClick={() => setChangeAvatar(false)}
                >
                  <span aria-hidden="true">×</span>
                </button>
              </div>
              <div className="modal-body">
                <div className="content">
                  {imgNums.map((item) => {
                    let imgURL = `/avatars/av-${item}.png`;
                    let flag = imgURL === state.userInfo?.avatar;
                    return (
                      <span key={item} className="img-item">
                        <button
                          type="button"
                          className="img-btn"
                          onClick={() => handleImgClick(imgURL)}
                        >
                          <img
                            className={`game-img mr-2 mb-2 ng-star-inserted ${
                              flag ? "active" : ""
                            }`}
                            src={imgURL}
                            alt={imgURL}
                          />
                        </button>
                      </span>
                    );
                  })}
                </div>
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-outline-secondary"
                  onClick={() => setChangeAvatar(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Menu;

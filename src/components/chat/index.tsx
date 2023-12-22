import React, { useContext, useEffect, useRef, useState } from "react";
import { HiOutlineFaceSmile, HiOutlineGif } from "react-icons/hi2";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import GifPicker, { Theme } from "gif-picker-react";
import axios from "axios";

import Context from "../../context";
import "./chat.scss";
import config from "../../config.json";

export default function PerfectLiveChat() {
  const {
    state,
    socket,
    msgTab,
    msgReceived,
    setMsgReceived,
    msgData,
    setMsgData,
    toggleMsgTab,
  } = useContext(Context);
  const [msgContent, setMsgContent] = useState<string>("");
  const [emojiPicker, setEmojiPicker] = useState<boolean>(false);
  const [gifPicker, setGifPicker] = useState<boolean>(false);
  const tenorApiKey = "AIzaSyAgrtott_iV2sRi-9cH_BKAdLKxpzbsIJY";

  const msgContentRef = useRef(null);

  const scrollToLastFruit = () => {
    let msgRef: any = msgContentRef.current;
    const lastChildElement = msgRef?.lastElementChild;
    lastChildElement?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToLastFruit();
  }, [msgTab, msgReceived]);

  const handleInputText = (e) => {
    if (e.keyCode === 13) {
      handleSendMsg();
      setMsgContent("");
    }
  };

  const handleTextChange = (text) => {
    setMsgContent(text);
  };

  const handleSendMsg = () => {
    if (msgContent !== "") {
      socket.emit("sendMsg", { msgType: "normal", msgContent });
    } else {
      console.log("message empty");
    }
    setEmojiPicker(false);
  };

  const handleChooseGif = (item) => {
    let gif: any = { ...item };
    if (item) {
      socket.emit("sendMsg", { msgType: "gif", msgContent: gif.url });
    } else {
      console.log("message empty");
    }
    setGifPicker(false);
  };

  const handleEmojiSelect = (emoji) => {
    setMsgContent(`${msgContent}${emoji.native}`);
  };

  const getAllChats = async (flag: boolean) => {
    let response: any = await axios.post(
      `${
        process.env.REACT_APP_DEVELOPMENT === "true"
          ? config.development_api
          : config.production_api
      }/get-all-chat`
    );
    setMsgData(response?.data?.data || []);
    if (flag === false) {
      setMsgReceived(!msgReceived);
    }
  };

  const handleLikeChat = async (chatItem: any) => {
    let response = await axios.post(
      `${
        process.env.REACT_APP_DEVELOPMENT === "true"
          ? config.development_api
          : config.production_api
      }/like-chat`,
      {
        chatID: chatItem._id,
        userId: state.userInfo.userId,
      }
    );
    if (response?.data?.status) {
      getAllChats(true);
    }
  };

  useEffect(() => {
    getAllChats(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="chat-info-board">
      <div className="chat-block">
        <div className="wrapper">
          <div className="header">
            <div className="online-wrapper position-absolute d-flex align-items-center">
              <div className="green-circle"></div>
              <span>11</span>
            </div>
            <div className="buttons">
              <button
                type="button"
                aria-label="Close"
                className="close"
                onClick={() => toggleMsgTab()}
              >
                <span aria-hidden="true">×</span>
              </button>
            </div>
          </div>

          <div className="cdk-virtual-scroll-viewport">
            <div
              className="cdk-virtual-scroll-content-wrapper"
              ref={msgContentRef}
            >
              {msgData?.map((item, index) => {
                let active = item?.likesIDs?.filter(
                  (item) => item === state.userInfo.userId
                ).length;
                let userid =
                  item.userId?.slice(0, 1) + "***" + item.userId?.slice(-1);
                return (
                  <div key={index} className="message-wrapper ng-star-inserted">
                    <div className="avatar-block">
                      <img
                        className="avatar"
                        src={item.avatar || "./avatars/av-6.png"}
                        alt={item.avatar || "./avatars/av-6.png"}
                      />
                    </div>
                    <div className="msg-block">
                      <div className="msg-data">
                        <span className="text canSelect">
                          <span
                            className="name-wrapper"
                            onClick={() =>
                              handleTextChange(`${msgContent}@${userid} `)
                            }
                          >
                            <span className="name canSelect">{userid}</span>
                          </span>
                          {item.msgType === "gif" ? (
                            <div>
                              <img
                                src={item.msg}
                                className="gif-preview"
                                alt="Selected GIF"
                              />
                            </div>
                          ) : (
                            <span className="ng-star-inserted">{item.msg}</span>
                          )}
                        </span>
                      </div>
                    </div>
                    <div className="likes-block">
                      <div
                        className="btn-block"
                        onClick={() => handleLikeChat(item)}
                      >
                        {item?.likesIDs?.length > 0 && (
                          <div className="font-weight-bold likes-number ng-star-inserted">
                            {` ${item.likesIDs.length} `}
                          </div>
                        )}
                        <div className={`btn-like ${active && "active"}`}></div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          {emojiPicker && (
            <div className="emoji-picker">
              <div className="modal-header">
                <div className="modal-title text-uppercase">Emoji</div>
                <button
                  type="button"
                  className="close"
                  onClick={() => setEmojiPicker(false)}
                >
                  <span aria-hidden="true">×</span>
                </button>
              </div>
              <Picker
                set={"emojione"}
                theme={"dark"}
                emojiSize={20}
                perLine={8}
                data={data}
                onEmojiSelect={(emoji) => handleEmojiSelect(emoji)}
              />
            </div>
          )}
          {gifPicker && (
            <div className="gif-picker">
              <div className="modal-header">
                <div className="modal-title text-uppercase">Gif</div>
                <button
                  type="button"
                  className="close"
                  onClick={() => setGifPicker(false)}
                >
                  <span aria-hidden="true">×</span>
                </button>
              </div>
              <GifPicker
                width={270}
                height={320}
                theme={Theme.DARK}
                tenorApiKey={tenorApiKey}
                onGifClick={(item) => handleChooseGif(item)}
              />
            </div>
          )}
          <div className="input-message">
            <textarea
              minLength={1}
              className="scroll-y"
              placeholder="Reply"
              maxLength={160}
              value={msgContent}
              onKeyUp={(e) => handleInputText(e)}
              onChange={(e) => handleTextChange(e.target.value)}
            ></textarea>
            <div className="tools">
              <div
                className="smiles"
                onClick={() => {
                  setGifPicker(false);
                  setEmojiPicker(!emojiPicker);
                }}
              >
                <HiOutlineFaceSmile cursor={"pointer"} size={14} />
              </div>
              <div
                className="gif"
                onClick={() => {
                  setEmojiPicker(false);
                  setGifPicker(!gifPicker);
                }}
              >
                <HiOutlineGif cursor={"pointer"} size={14} />
              </div>
              <div className="left-length">{160 - msgContent.length}</div>
            </div>
            <button className="enter" onClick={() => handleSendMsg()}></button>
          </div>
        </div>
      </div>
    </div>
  );
}

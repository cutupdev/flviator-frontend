import React, { useContext, useState } from "react";
import { HiOutlineFaceSmile, HiOutlineGif } from "react-icons/hi2";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import GifPicker, { TenorImage, Theme } from "gif-picker-react";

import Context from "../../context";
import "./chat.scss";

export default function PerfectLiveChat() {
  const { socket, msgData, toggleMsgTab } = useContext(Context);
  const [msgContent, setMsgContent] = useState<string>("");
  const [emojiPicker, setEmojiPicker] = useState<boolean>(false);
  const [gifPicker, setGifPicker] = useState<boolean>(false);
  const tenorApiKey = "AIzaSyAgrtott_iV2sRi-9cH_BKAdLKxpzbsIJY";

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
    if (msgContent) {
      socket.emit("sendMsg", { msgType: "normal", msgContent });
      console.log("send message");
    } else {
      console.log("message empty");
    }
    setEmojiPicker(false);
  };

  const handleChooseGif = (item) => {
    let gif: any = { ...item };
    if (item) {
      socket.emit("sendMsg", { msgType: "gif", msgContent: gif.url });
      console.log("send message");
    } else {
      console.log("message empty");
    }
    setGifPicker(false);
  };

  const handleEmojiSelect = (emoji) => {
    setMsgContent(`${msgContent}${emoji.native}`);
  };

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
            <div className="cdk-virtual-scroll-content-wrapper">
              {msgData.map((item, index) => (
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
                        <span className="name-wrapper">
                          <span className="name canSelect">
                            {item.userId?.slice(0, 1) +
                              "***" +
                              item.userId?.slice(-1)}
                          </span>
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
                    <div className="btn-block">
                      <div className="btn-like"></div>
                    </div>
                  </div>
                </div>
              ))}
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

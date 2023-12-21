import React, { useContext, useState } from "react";
import { HiOutlineFaceSmile, HiOutlineGif } from "react-icons/hi2";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import GifPicker, { TenorImage, Theme } from "gif-picker-react";

import Context from "../../context";
import "./chat.scss";

export default function PerfectLiveChat() {
  const { socket, msgData, toggleMsgTab } = useContext(Context);
  const [selectedGif, setSelectedGif] = useState<TenorImage>(null!);
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
      socket.emit("sendMsg", msgContent);
      console.log("send message");
    } else {
      console.log("message empty");
    }
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
              <span>91</span>
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
                        <span className="ng-star-inserted">{item.msg}</span>
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
              <>
                <img
                  src={selectedGif.url}
                  className="gif-preview"
                  alt="Selected GIF"
                />
                <a
                  href={selectedGif.shortTenorUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  {selectedGif.shortTenorUrl}
                </a>
              </>
            </div>
          </div>
          {emojiPicker && (
            <div
              className="emoji-picker"
              tabIndex={0}
              onBlur={() => setEmojiPicker(!emojiPicker)}
            >
              <Picker
                set={"emojione"}
                emojiSize={20}
                perLine={8}
                data={data}
                onEmojiSelect={(emoji) => handleEmojiSelect(emoji)}
              />
            </div>
          )}
          {gifPicker && (
            <div
              className="gif-picker"
              // tabIndex={0}
              // onBlur={() => setGifPicker(!gifPicker)}
            >
              <GifPicker
                width={278}
                height={320}
                theme={Theme.DARK}
                tenorApiKey={tenorApiKey}
                onGifClick={setSelectedGif}
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
                onClick={() => setEmojiPicker(!emojiPicker)}
              >
                <HiOutlineFaceSmile cursor={"pointer"} size={14} />
              </div>
              <div className="gif" onClick={() => setGifPicker(!gifPicker)}>
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

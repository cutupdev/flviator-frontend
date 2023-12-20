import React, { useContext, useState } from "react";
import EmojiPicker, { EmojiStyle, Theme } from "emoji-picker-react";

import { HiOutlineFaceSmile, HiOutlineGif } from "react-icons/hi2";

import Context from "../../context";
import "./chat.scss";
import GifPicker from "gif-picker-react";

export default function PerfectLiveChat() {
  const { socket, toggleMsgTab } = useContext(Context);
  const [msgContent, setMsgContent] = useState<string>("");
  const [emojiPicker, setEmojiPicker] = useState<boolean>(false);
  const [gifPicker, setGifPicker] = useState<boolean>(false);
  const tenorApiKey = "AIzaSyAgrtott_iV2sRi-9cH_BKAdLKxpzbsIJY";

  const handleInputText = (e) => {
    if (e.keyCode === 13) {
      socket.emit("sendMsg", msgContent);
      setMsgContent("");
    }
  };

  const handleTextChange = (text) => {
    setMsgContent(text);
  };

  const handleSendMsg = () => {
    console.log("send message");
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
              <div>This is Chat Content</div>
            </div>
          </div>
          <div
            tabIndex={0}
            className="emoji-picker"
            // onBlur={() => setEmojiPicker(false)}
          >
            {emojiPicker && (
              <EmojiPicker
                width={"268px"}
                height={"320px"}
                theme={Theme.DARK}
                emojiStyle={EmojiStyle.NATIVE}
                onEmojiClick={(emoji) => {
                  console.log(emoji.imageUrl);
                }}
              />
            )}
          </div>
          <div
            tabIndex={0}
            className="gif-picker"
            // onBlur={() => setGifPicker(false)}
          >
            {gifPicker && (
              <GifPicker
                width={"268px"}
                height={"320px"}
                theme={Theme.DARK}
                tenorApiKey={tenorApiKey}
                onGifClick={(gif) => console.log(gif)}
              />
            )}
          </div>
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

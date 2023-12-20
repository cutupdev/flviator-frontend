import React, { useContext, useState } from "react";

import { HiOutlineFaceSmile, HiOutlineGif } from "react-icons/hi2";

import Context from "../../context";
import "./chat.scss";

export default function PerfectLiveChat() {
  const { socket, toggleMsgTab } = useContext(Context);
  const [msgContent, setMsgContent] = useState<string>("");

  const handleInputText = (e) => {
    setMsgContent(e.target.value);
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

          <div className="input-message">
            <textarea
              minLength={1}
              className="scroll-y"
              placeholder="Reply"
              maxLength={160}
              value={msgContent}
              onChange={(e) => handleInputText(e)}
            ></textarea>
            <div className="tools">
              <div className="smiles ng-star-inserted">
                <HiOutlineFaceSmile cursor={"pointer"} size={14} />
              </div>
              <div className="gif ng-star-inserted">
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

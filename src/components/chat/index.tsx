import React from "react";

import { HiOutlineFaceSmile, HiOutlineGif } from "react-icons/hi2";

import "./chat.scss";

export default function PerfectLiveChat() {
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
              <button type="button" aria-label="Close" className="close">
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
            ></textarea>
            <div className="tools">
              <div className="smiles ng-star-inserted">
                <HiOutlineFaceSmile size={18} />
              </div>
              <div className="gif ng-star-inserted">
                <HiOutlineGif size={18} />
              </div>
              <div className="left-length">160</div>
            </div>
            <button className="enter"></button>
          </div>
        </div>
      </div>
    </div>
  );
}

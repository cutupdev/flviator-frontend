import * as React from "react";
import { toast } from "react-hot-toast";
import "./toast.scss";

const toaster = (
  type: string,
  msg: string,
  currency: string,
  point: number,
  cashoutAmount: number
) => {
  switch (type) {
    case "success":
      toast.custom(
        <div className="alert-win celebrated ng-trigger ng-trigger-messageState ng-star-inserted ng-animating">
          <div className="multiplier ">
            <div className="label ">{msg}</div>
            <div className="value ">{point}x</div>
          </div>
          <div className="win celebrated">
            <div className="label no-wrap ">
              <span>Win</span>
              <span className="currency ">, {currency}</span>
            </div>
            <div className="value ">
              <span>{cashoutAmount}</span>
            </div>
          </div>
          <button
            type="button"
            className="close"
            onClick={() => toast.dismiss()}
          >
            ×
          </button>
        </div>
      );
      break;
    case "error":
      toast.error(msg);
      break;

    default:
      break;
  }
};

export default toaster;

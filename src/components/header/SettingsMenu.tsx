import React, { useState } from "react";
import { PiListBold } from "react-icons/pi";

import DropDown from "./DropDown";

const Menu = ({ audioStatus, setAudioStatus }) => {
  const [showDropDown, setShowDropDown] = useState<boolean>(false);

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
    if (event.currentTarget === event.target) {
      setShowDropDown(false);
    }
  };

  return (
    <>
      <button
        className={`setting-button ${showDropDown ? "active" : ""}`}
        onClick={(): void => toggleDropDown()}
        onBlur={(e: React.FocusEvent<HTMLButtonElement>): void =>
          dismissHandler(e)
        }
      >
        <PiListBold color="#fff" size={20} />
      </button>
      <div className="aviator-dropdown-menu">
        {showDropDown && (
          <DropDown audioStatus={audioStatus} setAudioStatus={setAudioStatus} />
        )}
      </div>
    </>
  );
};

export default Menu;

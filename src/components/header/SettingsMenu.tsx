import React, { useState } from "react";
import { PiListBold } from "react-icons/pi";

import DropDown from "./DropDown";

const Menu: React.FC = (): JSX.Element => {
  const [showDropDown, setShowDropDown] = useState<boolean>(false);
  const [selectCity, setSelectCity] = useState<string>("");
  const cities = () => {
    return ["Hong Kong", "London", "New York City", "Paris"];
  };

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

  /**
   * Callback function to consume the
   * city name from the child component
   *
   * @param city  The selected city
   */
  const citySelection = (city: string): void => {
    setSelectCity(city);
  };

  return (
    <>
      <button
        className={`setting-button ${showDropDown ? "active" : ""}`}
        onClick={(): void => toggleDropDown()}
        // onBlur={(e: React.FocusEvent<HTMLButtonElement>): void =>
        //   dismissHandler(e)
        // }
      >
        <PiListBold color="#fff" size={20} />
      </button>
      <div className="aviator-dropdown-menu">
        {showDropDown && (
          <DropDown
            cities={cities()}
            showDropDown={false}
            toggleDropDown={(): void => toggleDropDown()}
            citySelection={citySelection}
          />
        )}
      </div>
    </>
  );
};

export default Menu;

import React, { useEffect, useState } from "react";
import { HiSpeakerWave, HiOutlineMusicalNote } from "react-icons/hi2";

type DropDownProps = {
  cities: string[];
  showDropDown: boolean;
  toggleDropDown: Function;
  citySelection: Function;
};

const DropDown: React.FC<DropDownProps> = ({
  cities,
  citySelection,
}: DropDownProps): JSX.Element => {
  const [showDropDown, setShowDropDown] = useState<boolean>(false);

  /**
   * Handle passing the city name
   * back to the parent component
   *
   * @param city  The selected city
   */
  const onClickHandler = (city: string): void => {
    citySelection(city);
  };

  useEffect(() => {
    setShowDropDown(showDropDown);
  }, [showDropDown]);

  const handleToggleMainAudio = async (e) => {
    let mainEle: any = document.getElementById("mainAudio");
    if (e.target.checked === true) {
      mainEle.muted = false;
      mainEle.play();
    } else {
      mainEle.muted = true;
      mainEle.pause();
    }
  };

  const handleToggleMusicAudio = async (e) => {
    let takeOffAudioEle: any = document.getElementById("takeOffAudio");
    let flewAwayAudioEle: any = document.getElementById("flewAwayAudio");
    if (e.target.checked === true) {
      takeOffAudioEle.muted = false;
      takeOffAudioEle.playbackRate = 10;
      takeOffAudioEle.play();
      setTimeout(() => {
        takeOffAudioEle.playbackRate = 1;
        takeOffAudioEle.muted = false;
      }, 200);
      flewAwayAudioEle.muted = false;
      flewAwayAudioEle.playbackRate = 10;
      flewAwayAudioEle.play();
      setTimeout(() => {
        flewAwayAudioEle.playbackRate = 1;
        flewAwayAudioEle.muted = false;
      }, 200);
    } else {
      takeOffAudioEle.muted = true;
      takeOffAudioEle.pause();
      flewAwayAudioEle.muted = true;
      flewAwayAudioEle.pause();
    }
  };

  return (
    <div
      className={showDropDown ? "setting-dropdown" : "setting-dropdown active"}
    >
      <div className="setting-dropdown-item">
        <div className="icon-section">
          <HiSpeakerWave color="#fff" size={20} />
          <span className="setting-title-text">Sound</span>
        </div>
        <div className="aviator-main-audio">
          <label className="aviator-switch">
            <input
              className="aviator-input"
              type="checkbox"
              onChange={(e) => handleToggleMainAudio(e)}
            />
            <span className="aviator-slider round"></span>
          </label>
        </div>
      </div>
      <div className="setting-dropdown-item">
        <div className="icon-section">
          <HiOutlineMusicalNote color="#fff" size={20} />
          <span className="setting-title-text">Music</span>
        </div>
        <div className="aviator-main-audio">
          <label className="aviator-switch">
            <input
              className="aviator-input"
              type="checkbox"
              onChange={(e) => handleToggleMusicAudio(e)}
            />
            <span className="aviator-slider round"></span>
          </label>
        </div>
      </div>
    </div>
  );
};

export default DropDown;

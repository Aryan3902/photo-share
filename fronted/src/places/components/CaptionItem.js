import React, { useState } from "react";
import { BsClipboard, BsFillClipboardFill } from "react-icons/bs";

export const CaptionItem = (props) => {
  const [touch, setTouch] = useState(false);

  const showFilled = async () => {
    try{
      await navigator.clipboard.writeText(props.caption);
      setTouch(true);
      setTimeout(() => {
        setTouch(false);
      }, 2500);
        }
    catch{
      console.error('Failed to copy text');
    }
  }

  return (
    <li>
      <div className="caption-item__container">
        <p className="caption-item__text">{props.caption}</p>
        <div className="caption-item__icon__container">
          {touch ? (
            <BsFillClipboardFill className="caption-item__icon" size={21} />
          ) : (
            <BsClipboard
              className="caption-item__icon"
              size={21}
              onClick={showFilled}
            />
          )}
        </div>
      </div>
    </li>
  );
};

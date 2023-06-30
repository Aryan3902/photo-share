import React from 'react'
import { FiClipboard } from "react-icons/fi";

export const CaptionItem = (props) => {
  return (
    <li>
        <div>
            <p>{props.caption}</p>
            <FiClipboard/>
        </div>
        
    </li>
  )
}

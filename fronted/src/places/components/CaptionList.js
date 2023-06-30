import React from 'react'
import { CaptionItem } from './CaptionItem'

import "./CaptionList.css"

export const CaptionList = (props) => {
  return (
    <ul className='caption-lists'>
    {props.captions.map(caption => {
        return <CaptionItem caption={caption}/>

    })}
    </ul>
  )
}

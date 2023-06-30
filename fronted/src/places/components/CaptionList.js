import React from 'react'
import { CaptionItem } from './CaptionItem'

export const CaptionList = (props) => {
  return (
    <ul>
    {props.captions.map(caption => {
        return <CaptionItem caption={caption}/>

    })}
    </ul>
  )
}

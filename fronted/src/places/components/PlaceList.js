import React, { useContext } from "react"; 

import "./PlaceList.css"

import PlaceItem from "./PlaceItem";
import { AuthContext } from "../../shared/context/auth-context";



const PlaceList = props => {
    const auth = useContext(AuthContext)
    
    return(
        <ul className="places-list">
            {props.user.map(place => {
                return (<PlaceItem
                    key={place._id}
                    id={place._id}
                    name={place.name}
                    image={`http://localhost:5000/${place.image}`}
                    caption={place.caption}
                    showEdit = {props.showEdit}
                    onDelete={props.onDelete}
                    upvotes={place.Upvotes}
                />
            )})}
        </ul>
        // <div>{UserData[props.user].name}</div>
    )
}

export default PlaceList;

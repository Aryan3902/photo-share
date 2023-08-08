import React, { useState } from "react";
import UserItem from "./UserItem";
import "./UsersList.css"

function UsersList(props){
    const [searchString, setSearchString] = useState("")

    if(props.items.length === 0){
        return( 
            <div>
                <h2>No Users found</h2>
            </div>
        )
    }

    const searchStringHandler = (e) => {
        setSearchString(e.target.value)
    }
    
    return <ul className="user-list">
       <input value={searchString} onChange={searchStringHandler} style={{width: "40%", padding: "10px", marginTop: "30px", fontSize: "30px"}}/>
        {props.items.map(x => {
            
            const {id, name, age, image, occupation, city, place, places } = x  
            if (name.toLowerCase().includes(searchString.toLowerCase())) {
                return (
                    <UserItem
                        key={id}
                        id={id}
                        name={name}
                        age={age} 
                        image={image}
                        occupation={occupation}
                        city={city}
                        place={place}
                        places={places}
                    />)
            }  
            })}

        
    </ul>
}

export default UsersList;
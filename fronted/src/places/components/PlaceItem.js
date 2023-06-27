import React, { useContext, useState } from "react"; 
import Button from "../../shared/Components/FormElements/Button";
import Map from "../../shared/Components/UIElements/Map";
import Modal from "../../shared/Components/UIElements/Modal";
import LoadingSpinner from "../../shared/Components/UIElements/LoadingSpinner";
import ErrorModal from "../../shared/Components/UIElements/ErrorModal";
import { TbArrowBigUp, TbArrowBigUpFilled, TbArrowBigDown, TbArrowBigDownFilled } from "react-icons/tb";

import { useHttpClient } from "../../shared/hooks/http-hook";

import "./PlaceItem.css"
import { AuthContext } from "../../shared/context/auth-context";
import { UserContext } from "../../shared/context/user-context";

const PlaceItem = props => {
    const auth = useContext(AuthContext)
    const userDetails = useContext(UserContext)
    const {isLoading,error, sendRequest, clearError} = useHttpClient();

    const [showMap, setShowMap] =useState(false);
    const [deleteMessage, setDeleteMessage] = useState(false)
    console.log(userDetails)
    const [isUpvote, setIsUpvote] = useState(userDetails.upVotes.has(props.id))
    const [isDownvote, setIsDownvote] = useState(userDetails.downVotes.has(props.id))
    const [upvotes, setUpvotes] = useState(props.upvotes)

    const opendeleteMessageHandler = () => setDeleteMessage(true)
    const closedeleteMessageHandler = () => setDeleteMessage(false)

    const openMapHandler = () => setShowMap(true)
    const closeMapHandler = () => setShowMap(false)
    const upvoteHandler = async (actionType) => {
        const existingUpvotes = userDetails.upVotes
        const existingDownvotes = userDetails.downVotes
        try{
            let voteMethod;
            if (actionType === "UPVOTE") {
                if (isUpvote && !isDownvote) {
                    voteMethod = "REMOVE UPVOTE"
                    existingUpvotes.delete(props.id)
                    setIsUpvote(false)
                    setIsDownvote(false)
                    setUpvotes(prevState => prevState - 1)
                }
                else if (isDownvote && !isUpvote) {
                    voteMethod =  "REMOVE DOWNVOTE ADD UPVOTE"
                    existingDownvotes.delete(props.id)
                    existingUpvotes.add(props.id)
                    setIsUpvote(true)
                    setIsDownvote(false)
                    setUpvotes(prevState => prevState + 2)
                }
                else{
                    existingUpvotes.add(props.id)
                    voteMethod = "ADD UPVOTE"
                    setUpvotes(prevState => prevState + 1)
                    setIsUpvote(true)
                    setIsDownvote(false)
                }
            }
            else{
                if (isUpvote  && !isDownvote) {
                    voteMethod =  "ADD DOWNVOTE REMOVE UPVOTE"
                    existingDownvotes.add(props.id)
                    existingUpvotes.delete(props.id)
                    setUpvotes(prevState => prevState - 2)
                    setIsDownvote(true)
                    setIsUpvote(false)
                }
                else if (isDownvote && !isUpvote) {
                    existingDownvotes.delete(props.id)
                    voteMethod = "REMOVE DOWNVOTE"
                    setIsDownvote(false)
                    setIsUpvote(false)
                    setUpvotes(prevState => prevState + 1)
                }
                else{
                    voteMethod = "ADD DOWNVOTE"
                    existingDownvotes.add(props.id)
                    setIsDownvote(true)
                    setIsUpvote(false)
                    setUpvotes(prevState=>prevState-1)
                    
                }
            }
            localStorage.setItem(
                "UserInfo", 
                JSON.stringify({
                  upvotes: existingUpvotes,
                  downvotes: existingDownvotes,
                })
              )
              console.log("Upvote Action")
            await sendRequest(`http://localhost:5000/api/places/${props.id}/upvote`,
                "POST",
                JSON.stringify({
                    actionType: voteMethod
                }) 
                ,{
                    'Content-Type': 'application/json',
                Authorization: "Bearer " + auth.token
            })
        }
        catch(err){
            console.log(err)
        }
    }

    const deletePlaceHandler = async () => {
        try{
            await sendRequest(`http://localhost:5000/api/places/${props.id}`, "DELETE",{},{
                Authorization: "Bearer " + auth.token
            })
            // closedeleteMessageHandler()
            props.onDelete(props.id)
        }
        catch(err){
            console.log(err)
        }
    }

    return(
    <>
        <ErrorModal error={error} onClear={clearError} />
        <Modal 
            show={showMap} 
            onCancel={closeMapHandler} 
            header={props.name} 
            contentClass=""
            footerClass=""
            footer={<Button onClick={closeMapHandler}>Close</Button>}
        >
            <div className="map-container">
                <Map location={props.name} zoom={8}/>
            </div>
        </Modal>
        <Modal 
            show={deleteMessage}
            onCancel={closedeleteMessageHandler}
            header="Confirm?" 
            footer={isLoading ? <LoadingSpinner/> : <div>
                    <Button danger onClick={deletePlaceHandler}>Yes</Button>
                    <Button onClick={closedeleteMessageHandler} inverse>Cancel</Button>
                </div>
            }
        >
            <p>
                Do you really want to delete this post? Please note that this action is irreversible.
            </p>
        </Modal>
        <li>
            <div className="post-container">
                {auth.token &&<div className="post__options-tab">
                    {isUpvote ? <TbArrowBigUpFilled  className="place__post-options" onClick={() => upvoteHandler("UPVOTE")}/> : <TbArrowBigUp className="place__post-options" onClick={() => upvoteHandler("UPVOTE")}/>}
                    <p className="place__post-options">{upvotes}</p>
                    {isDownvote ? <TbArrowBigDownFilled  className="place__post-options" onClick={() => upvoteHandler("DOWNVOTE")}/> : <TbArrowBigDown className="place__post-options" onClick={() => upvoteHandler("DOWNVOTE")}/>}

                </div>}
                <div className="card">
                    <img src={props.image} alt={props.name}/>
                    <div className="card-content">
                        <h2 className="card-title">{props.name}</h2>
                        <p className="card-caption">{props.caption}</p>
                        <hr className="card-line"/>
                        <div className="card-buttons">
                            <Button inverse onClick={openMapHandler}>View on Map</Button>
                            {props.showEdit &&
                            <>
                            <Button to={`edit/${props.id}`}>Edit</Button>
                            <Button inverse onClick={opendeleteMessageHandler}>Delete</Button>
                            </>
                            }
                        </div>
                    </div>
                </div>
            </div>
        </li>
    </>    
      
    )
}

export default PlaceItem;
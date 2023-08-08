const HttpError = require("../models/httpError")
const fs = require("fs")
const Place = require("../models/place")
const User = require("../models/user")

const {validationResult} = require("express-validator")
const mongoose  = require("mongoose")
const { error } = require("console")

const getPlacebyId = async (req, res, next) => {
    const placeId = req.params.pid
    let place

    try{
        place = await Place.findById(placeId)
    }
    catch{
        return next(new HttpError("Something went wrong...", 500))
    }

    if(!place){
        return next(new HttpError("Could not find the place.", 404))
    }

    res.json({place: place.toObject( {getters: true} )})
}

const getUserPlacesbyId = async (req, res, next) => {
    const userId = req.params.uid

    let user

    try{
        user = await Place.find({creator: userId})
    }
    catch(err){
        console.log(err)
        return next(new HttpError("Something went wrong...", 500))
    }

    if(!user){
        return next(new HttpError("Could not find the user.", 404))
    }

    res.json({user})
}

const createPlace = async (req,res,next) => {
    const errors = validationResult(req);

    if(!errors.isEmpty()){
        return next(new HttpError("Input not correct. Checkk again", 422))
    }

    const {name, caption} = req.body
    const NewPlace = new Place({
        name,
        caption,
        image: req.file.path,
        creator: req.userData.userId,
        Upvotes: 0
    })

    // UserData[0].places.push(NewPlace)
    let user;

    try{
        user = await User.findById(req.userData.userId)
    }catch{
        return next(new HttpError("Creating a new place failed, please try again", 500))
    }

    if (!user) {
        return next(new HttpError("Could not find user for provided id", 404))
    }

    console.log(user)

    try{
        const session = await mongoose.startSession()
        session.startTransaction(); 
        await NewPlace.save({ session: session})
        user.places.push(NewPlace)
        await user.save({session: session})
        await session.commitTransaction()
    }
    catch(err){
        console.log(err)
        return next(new HttpError("Creating a new place failed, please try again", 500))
    }

    res.status(201).json({place: NewPlace})
}

const upvotePlace = async(req, res, next) => {
    const placeId = req.params.pid
    let place
    try{
        place = await Place.findById(placeId)
        // console.log(place)
    }
    catch{
        return next(new HttpError("Something went wrong, could not upvote this place.", 500))
    }

    let user
    try{
        user = await User.findById(req.userData.userId)
        if (!user) {
            throw error;
        }
    }catch{
        return next(new HttpError("Something went wrong, could not upvote this place.", 500))
    }

    // if (place.creator.toString() !== req.userData.userId) {
    //     return next(new HttpError("Invalid user! You are not allowed to update this place.", 401))
    // }

    if(!place){
        return next(new HttpError("Could not find place for this id.", 404))
    }

    try{
        const session = await mongoose.startSession()
        session.startTransaction();
        switch (req.body.actionType) {
            case "ADD UPVOTE":
                user.postsUpvoted.push(placeId)
                place.Upvotes++;
                break;

            case "REMOVE UPVOTE":
                user.postsUpvoted.pull(placeId)
                place.Upvotes--;
                break;

            case "REMOVE DOWNVOTE ADD UPVOTE":
                user.postsUpvoted.push(placeId)
                user.postsDownvoted.pull(placeId)
                place.Upvotes+=2;
                break;

            case "ADD DOWNVOTE REMOVE UPVOTE":
                user.postsDownvoted.push(placeId)
                user.postsUpvoted.pull(placeId)
                place.Upvotes-=2;
                break;
                
            case "REMOVE DOWNVOTE":
                user.postsDownvoted.pull(placeId)
                place.Upvotes++;
                break;

            case "ADD DOWNVOTE":
                user.postsDownvoted.push(placeId)
                place.Upvotes--;
                break;

            default:
                break;
        }
        await place.save()
        await user.save({session: session})
        await session.commitTransaction()
    }
    catch(err){
        console.log(err)
        return next(new HttpError("Something went wrong, could not upvote the place.", 500))
    }

    res.status(200).json({"message": "Removed"})
}

const updatePlace = async (req, res, next) => {
    const errors = validationResult(req);

    if(!errors.isEmpty()){
        return next(new HttpError("Input not correct. Checkk again", 422))
    }

    const placeId = req.params.pid
    const {name, image, caption} = req.body

    // const oldPlaceIndex = UserData[0].places.findIndex(x => x.id == id)

    let place;
    try{
        place = await Place.findById(placeId)
    }
    catch{
        return next(new HttpError("Could not find the place.", 404))
    }

    // Check if the user sending the request is actually the one who made the place
    if (place.creator.toString() !== req.userData.userId) {
        return next(new HttpError("Invalid user! You are not allowed to update this place.", 401))
    }

    place.name = name
    place.caption = caption

    try{
        place.save()
    }catch{
        return next(new HttpError("Something went wrong...", 500))
    }

    res.status(201).json({place: place.toObject({ getters: true})})
}

const deletePlace = async (req, res, next) => {
    const placeId = req.params.pid
    // const PlaceIndex = UserData[0].places.findIndex(x => x.id == id)

    // if (PlaceIndex === -1) {
    //     return next(new HttpError("Place requested to delete doesn't exist.", 422))
    // }
    let place
    try{
        place = await Place.findById(placeId).populate('creator')
        console.log(place)
    }
    catch{
        return next(new HttpError("Something went wrong, could not delete the place.", 500))
    }

    if (place.creator.id !== req.userData.userId) {
       
        return next(new HttpError("Invalid user! You are not allowed to update this place.", 401))
    }

    if(!place){
        return next(new HttpError("Could not find place for this id.", 404))
    }

    // Deletion of image is placed under no restriction as even if it fails, there is no issue
    // And we can always perform a manual deletion
    const imgPath = place.image
    fs.unlink(imgPath, err => {
        console.log(err)
    })

    try{
        const session = await mongoose.startSession()
        session.startTransaction(); 
        await place.deleteOne({_id : placeId, session: session})
        place.creator.places.pull(place)
        await place.creator.save({session: session})
        await session.commitTransaction()
    }
    catch(err){
        console.log(err)
        return next(new HttpError("Something went wrong, could not delete the place.", 500))
    }

    // console.log(PlaceIndex)
    // const newArr = UserData[0].places.filter(x => x.id != id)
    // console.log(newArr)
    // UserData[0].places = newArr

    res.status(200).json({"message": "Removed"})
}

exports.getUserPlacesbyId = getUserPlacesbyId
exports.getPlacebyId = getPlacebyId
exports.createPlace = createPlace
exports.upvotePlace = upvotePlace
exports.updatePlace = updatePlace
exports.deletePlace = deletePlace
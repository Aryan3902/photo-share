const HttpError = require("../models/httpError")
const bcrypt = require("bcryptjs")
const {validationResult} = require("express-validator")
const jwt = require("jsonwebtoken")

const user = require("../models/user");

const getUsers = async (req, res, next) => {

    let users;
    try{
        users = await user.find({}, '-password')
    }catch(err){
        console.log(err)
        return next(new HttpError("Fetching Users failed, Please try again", 500))
    }
    
    res.status(200).json({users: users.map((x) => x.toObject({getters: true}))})
}

const signUp = async (req, res, next) => {
    const errors = validationResult(req);

    if(!errors.isEmpty()){
        return next(new HttpError("Input not correct. Checkk again", 422))
    }

    const { name, password, email } = req.body

    let existingUser

    try{
        existingUser = await user.findOne({email: email})
    }
    catch{
        return next(new HttpError("Signing up Failed", 500))
    }

    if (existingUser) {
        return next(new HttpError("Email already exists", 422))
    }

    let hashedPassword
    try{
        hashedPassword = await bcrypt.hash(password, 12)
    } catch(err){
        console.log(err)
        return next(new HttpError("Creating a new user failed, please try again", 500))
    }

    // "https://img.favpng.com/12/24/20/user-profile-get-em-cardiovascular-disease-zingah-png-favpng-9ctaweJEAek2WaHBszecKjXHd.jpg"
    const NewUser = new user({ 
        name,
        email,
        password: hashedPassword,
        // File path stored as https://localhost:5000/uploads/images/filename.ext
        image: req.file.path,
        places: []
    })

    // UserData.push(newUser);

    try{
        await NewUser.save()
    }
    catch(err){
        console.log(err)
        return next(new HttpError("Creating a new user failed, please try again", 500))
    }

    // A token can not be manipualted, because it is signed with the secret key.
    let token
    try{
        token = jwt.sign({
        userId: NewUser.id,
        email: NewUser.email
    }, process.env.JWT_SECRET, {
        expiresIn: '1h',
    })
    } catch (err){
        return next(new HttpError("Signing up failed, please try again", 500))
    }
    

    res.status(201).json({ userId: NewUser.id, email: NewUser.email, token: token})
}

const login = async (req, res, next) => {
    const errors = validationResult(req);

    if(!errors.isEmpty()){
        return next(new HttpError("Input not correct. Checkk again", 422))
    }
    
    const { password, email } = req.body

    // const IdentifiedUser = UserData.find(x => x.email === email)
    let existingUser

    try{
        existingUser = await user.findOne({email: email})
    }
    catch{
        return next(new HttpError("Logging in Failed", 500))
    }

    if(!existingUser){
        return next(new HttpError("Logging in Failed, Check your credentials and try again...", 401))
    }

    let isValidPassword = false;
    try{
        isValidPassword = await bcrypt.compare(password, existingUser.password)
    }
    catch{
        return next(new HttpError("Logging in Failed... Please try again after some time", 500))
    }

    if (!isValidPassword) {
        return next(new HttpError("Logging in Failed, Check your credentials and try again...", 401))
    }

    let token
    try{
        token = jwt.sign({
        userId: existingUser.id,
        email: existingUser.email
    }, process.env.JWT_SECRET, {
        expiresIn: '1h',
    })
    } catch (err){
        return next(new HttpError("Signing up failed, please try again", 500))
    }
    console.log(existingUser)
    res.json({
        userId: existingUser.id, 
        email: existingUser.email,
        token: token,
        upvotes: existingUser.postsUpvoted.toObject(),
        downvotes: existingUser.postsDownvoted.toObject()
    })
}

exports.getUsers = getUsers
exports.signUp = signUp
exports.login = login
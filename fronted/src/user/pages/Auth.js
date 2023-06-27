import React, {useState, useContext} from 'react'

import Input from '../../shared/Components/FormElements/Input'
import Button from '../../shared/Components/FormElements/Button'

import { VALIDATOR_EMAIL, VALIDATOR_MINLENGTH, VALIDATOR_REQUIRE } from '../../shared/util/validators'
import { useForm } from '../../shared/hooks/form-hook'

import "./Auth.css"
import LoadingSpinner from '../../shared/Components/UIElements/LoadingSpinner'
import ErrorModal from '../../shared/Components/UIElements/ErrorModal'
import { useHttpClient } from '../../shared/hooks/http-hook'
import ImageUpload from '../../shared/Components/FormElements/ImageUpload'

import { AuthContext } from '../../shared/context/auth-context'
import {UserContext } from '../../shared/context/user-context'

const Auth = () => {
    const Auth = useContext(AuthContext)
    const UserDetails = useContext(UserContext)
    const [isLoginMode, setIsLoginMode] = useState(true)
    const {isLoading ,error, sendRequest, clearError} = useHttpClient()

    const [formState, InputHandler, setFormValue] = useForm({
        Email:{
            value: '',
            isValid: false
        },
        Password:{
            value: '',
            isValid: false
        }
    }, false)
    const switchModeHandler = () => {
        if(!isLoginMode){
            setFormValue({
                ...formState.inputs,
                Name: undefined,
                image: undefined
            },formState.inputs.Email.isValid && formState.inputs.Password.isValid   )
        }
        else{
            setFormValue({
                ...formState.inputs,
                Name: {
                    value: "",
                    isValid: false
                },
                image: {
                    value: null,
                    isValid: false
                }
            }, false)
        }
        setIsLoginMode(prevMode => !prevMode)
    }

    const submitHandler = async event => {
        event.preventDefault()

        if (isLoginMode) {
            try{
                const responseData = await sendRequest("http://localhost:5000/api/users/login", 
                'POST',
                JSON.stringify({
                    email: formState.inputs.Email.value,
                    password: formState.inputs.Password.value
                }),
                {
                    'Content-Type': 'application/json'
                }
                )
                UserDetails.setUpvotes(responseData.upvotes) 
                UserDetails.setDownvotes(responseData.downvotes)
                Auth.login(responseData.userId, responseData.token, responseData.upvotes, responseData.downvotes)
            }
            catch(err){
                console.log(err)
            }
        }
        else{
            try{
                // FormData is the data type provided in regular js to handle form data apart from regular js (like file for ex)
                // Files are stored as binary so we cant share them in json
                const formData = new FormData()
                formData.append('email', formState.inputs.Email.value)
                formData.append('name', formState.inputs.Name.value)
                formData.append('password', formState.inputs.Password.value)
                formData.append('image', formState.inputs.image.value)
                const responseData = await sendRequest("http://localhost:5000/api/users/signup",'POST',
                // The Form Data automatically sets the right headers for the request and hence we dont need to specify them manually
                formData
                )
                Auth.login(responseData.userId, responseData.token)
            }
            catch(err){
                console.log(err)
            }
        }
        }
        
    

  return (
    <>
    <ErrorModal error={error} onClear={clearError}/>
    <div className='place-form authentication'>
    {isLoading && <LoadingSpinner asOverlay/>}
    <form onSubmit={submitHandler}>
        {!isLoginMode && (
            <>
            <Input
            id="Name"
            type="name"
            element="input"
            label="Your Name"
            validators={[VALIDATOR_REQUIRE()]}
            errorText="Please provide a name."
            onInput={InputHandler}
        />
        <ImageUpload center id="image" onInput={InputHandler} errorText="Please provide an image"/>
        </>
        )
        }
        <Input
            id="Email"
            type="email"
            element="input"
            label="Email"
            validators={[VALIDATOR_EMAIL()]}
            errorText="Please provide a correct email."
            onInput={InputHandler}
        />
        <Input
            id="Password"
            type="password"
            element="input"
            label="Password"
            validators={[VALIDATOR_MINLENGTH(3)]}
            errorText="Please provide a correct password."
            onInput={InputHandler}
        />
        <Button type="submit" disabled={!formState.isValid}>
            {!isLoginMode ? "Sign up" : "Log in" }
        </Button>
        
    </form>
    <hr style={{marginBottom: "20px"}}/>
    <Button  onClick={switchModeHandler}>
        Switch to {isLoginMode ? "Sign up" : "Log in" }
    </Button> 
    </div>
    </>
  )
}

export default Auth
import {useCallback, useState, useEffect} from 'react';

let expirationTimer

export const useAuth = () => {
  // Instead of check for isLoggedin we now check if the token exists
  const [token, setToken] = useState(false);
  const [userId, setUserId] = useState(null);
  const [tokenExpirationDate, setTokenExpirationDate] = useState();
  const [upvotes, setUpvotes] = useState(new Set())
  const [downvotes, setDownvotes] = useState(new Set())

  const Login = useCallback((uid, token, upvotes = new Set(), downvotes = new Set(), expirationDate) => {
    // For token expiration, we maintain a token expiration date in our fronted
    // and check for the timer, the below expiration creates a new Date which is
    // 1 hr after the current time
    const tokenExpirationDate = expirationDate || new Date(new Date().getTime() + 1000 * 60 * 60);
    setTokenExpirationDate(tokenExpirationDate);
    setToken(token);
    setUserId(uid);
    setUpvotes(upvotes)
    setDownvotes(downvotes)
    // console.log(upvotes)
    // console.log(downvotes)
    // To local storage we can only write text or data that can be converted to text
    // Hence we use stringify
    localStorage.setItem(
      "UserData",
      JSON.stringify({
        userId: uid,
        token,
        expiration: tokenExpirationDate.toISOString()
      })
    );
    localStorage.setItem(
      "UserInfo", 
      JSON.stringify({
        upvotes: upvotes,
        downvotes: downvotes,
      })
    )
  }, []);

  const Logout = useCallback(() => {
    setToken(null);
    setTokenExpirationDate(null);
    setUserId(null);
    setUpvotes(new Set())
    setDownvotes(new Set())
    localStorage.removeItem("UserData");
    localStorage.removeItem("UserInfo");
  }, []);

  useEffect(() => {
    // Checking for Login case
    if (token) {
      const remainingTime =
        tokenExpirationDate.getTime() - new Date().getTime();
      expirationTimer = setTimeout(Logout, remainingTime);
    } else {
      clearTimeout(expirationTimer);
    }
  }, [token, Logout, tokenExpirationDate]);

  // After storing the token in localStorage, we want to check if the
  // token exists in there or not when the component mounts [renders first time]
  useEffect(() => {
    // useEffect runs after the render cycle, when the components fully loads
    // We can add a state to confirm the useEffect has completed its work
    // and meanwhile we can show some other page
    const storedData = JSON.parse(localStorage.getItem("UserData"))
    const storedUserData = JSON.parse(localStorage.getItem("UserInfo"));
    console.log(typeof(storedUserData.downvotes))
    console.log((Object.keys(storedUserData.upvotes)).length)

    storedUserData.upvotes=new Set((Object.keys(storedUserData.upvotes)).length ? storedUserData.upvotes : storedUserData.upvotes.keys)
    storedUserData.downvotes=new Set((Object.keys(storedUserData.downvotes)).length ? storedUserData.downvotes : storedUserData.downvotes.keys)
    console.log(typeof(storedUserData.downvotes))
    if (
      storedData &&
      storedData.token &&
      new Date(storedData.expiration) > new Date()
    ) {
      // We are also passing the expiraton date to our login function to check
      // wether there is already a expiration Date, so that we dont always increase
      // the expiration time by 1hr on each render cycle
      Login(
        storedData.userId,
        storedData.token,
        storedUserData.upvotes,
        storedUserData.downvotes,
        new Date(storedData.expiration),
      );
    }
  }, [Login]);

  return{
    token,
    Login,
    Logout,
    userId,
    upvotes,
    downvotes,
    setUpvotes,
    setDownvotes
  }
};

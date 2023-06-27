import {createContext} from "react";

// The variable token in useContext is stored in memory and hence on reload
// the variable also gets refreshed back to null again (because the React app restarts),
// so we need to store the token in a more concrete place to survive page reloads.

// Session storage is cleared whenever we close the browser
// IndexedDb is a much more complex place to store a basic token
// Local Storage is the best case here
export const AuthContext = createContext({
    isLoggedin: false, 
    userId: null,
    token: null,
    login: () => {}, 
    logout: () => {}
})



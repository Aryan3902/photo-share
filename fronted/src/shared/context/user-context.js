import {createContext} from "react";

export const UserContext = createContext({
    upVotes: new Set(),
    downVotes: new Set(),
    setUpvotes: () => {},
    setDownvotes: () => {},
})



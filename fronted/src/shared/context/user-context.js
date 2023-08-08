import {createContext} from "react";

export const UserContext = createContext({
    upVotes: [],
    downVotes: [],
    setUpvotes: () => {},
    setDownvotes: () => {},
})

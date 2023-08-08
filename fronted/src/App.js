import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate} from 'react-router-dom';
// import Users from './user/pages/Users';
// import NewPlace from './places/pages/NewPlace';
import './App.css';
import NavMain from './shared/Components/NavElements/MainNavigation';
import Clock from './shared/Components/Clock/Clock';
// import UserPlaces from './places/pages/UserPlaces';
// import UserPlace from './places/pages/UserPlace';
// import UpdatePlace from './places/pages/UpdatePlace';
// import Auth from './user/pages/Auth';
import { useAuth } from './shared/hooks/auth-hook';
import LoadingSpinner from './shared/Components/UIElements/LoadingSpinner';

const Users = React.lazy(() => import("./user/pages/Users"))
const NewPlace = React.lazy(() => import("./places/pages/NewPlace"))
const UserPlace = React.lazy(() => import("./places/pages/UserPlace"))
const UserPlaces = React.lazy(() => import("./places/pages/UserPlaces"))
const UpdatePlace = React.lazy(() => import("./places/pages/UpdatePlace"))
const Auth = React.lazy(() => import("./user/pages/Auth"))

export const SuspenseElement = (props) => {
  return(
    <Suspense fallback={<div className="center"><LoadingSpinner/></div>}>
      {props.comp}
    </Suspense>
  )
}

import { UserContext } from './shared/context/user-context';
import { AuthContext } from './shared/context/auth-context';


function App() {
  const {token, Login, Logout, userId, upvotes, downvotes, setDownvotes, setUpvotes} = useAuth()
  
  let routes;

  

  if(token){
    routes= (
      <>
        <Route path="/" element={<SuspenseElement comp={<Users/>}/>} exact/>
        <Route path="/places/new" element={<SuspenseElement comp={<NewPlace/>}/>} exact/>
        <Route path="/:userId/place/edit/:placeId" element={<SuspenseElement comp={<UpdatePlace/>}/>} exact/>
        <Route path="/:userId/places" element={<SuspenseElement comp={<UserPlaces/>}/>} exact/>
        <Route path="/:userId/place" element={<SuspenseElement comp={<UserPlace/>}/>} exact/>
        <Route path='/*' element={<Navigate to="/"/>}/>
      </>
    );
  }
  else{
    routes = (
      <>
        <Route path="/" element={<SuspenseElement comp={<Users/>}/>} exact/>
        <Route path="/:userId/places" element={<SuspenseElement comp={<UserPlaces/>}/>} exact/>
        <Route path="/auth" element={<SuspenseElement comp={<Auth/>}/>} exact/>
        <Route path='/*' element={<Navigate to="/auth"/>}/>
      </>
    )
  }

  return (
    <AuthContext.Provider value={{isLoggedin: !!token, token: token, userId: userId, login: Login, logout: Logout}}>
      <UserContext.Provider value={{ upVotes: upvotes, downVotes: downvotes, setDownvotes: setDownvotes, setUpvotes: setUpvotes}}>
      <Router>
        <NavMain/>
        <Routes>
            {routes}
        </Routes>
        <Clock/>
      </Router>
      </UserContext.Provider>
    </AuthContext.Provider>
  );
}

export default App;

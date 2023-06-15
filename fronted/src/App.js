import React, {useCallback, useState} from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate} from 'react-router-dom';
import Users from './user/pages/Users';
import NewPlace from './places/pages/NewPlace';
import './App.css';
import { AuthContext } from './shared/context/auth-context';
// import MainHeader from './shared/Components/MainHeader';
import NavMain from './shared/Components/NavElements/MainNavigation';
import Clock from './shared/Components/Clock/Clock';
import UserPlaces from './places/pages/UserPlaces';
import UserPlace from './places/pages/UserPlace';
import UpdatePlace from './places/pages/UpdatePlace';
import Auth from './user/pages/Auth';


function App() {
  // Instead of check for isLoggedin we now check if the token exists
  const [token, setToken] = useState(false)
  const [userId, setUserId] = useState(null)
   
  const Login = useCallback((uid, token) => {
    setToken(token)
    setUserId(uid)
  }, [])

  
  const Logout = useCallback(() => {
    setToken(null)
    setUserId(null)
  }, [])

  let routes;

  if(token){
    routes= (
      <>
        <Route path="/" element={<Users/>} exact/>
        <Route path="/places/new" element={<NewPlace/>} exact/>
        <Route path="/:userId/place/edit/:placeId" element={<UpdatePlace/>} exact/>
        <Route path="/:userId/places" element={<UserPlaces/>} exact/>
        <Route path="/:userId/place" element={<UserPlace/>} exact/>
        <Route path='/*' element={<Navigate to="/"/>}/>
      </>
    );
  }
  else{
    routes = (
      <>
        <Route path="/" element={<Users/>} exact/>
        <Route path="/:userId/places" element={<UserPlaces/>} exact/>
        <Route path="/auth" element={<Auth/>} exact/>
        <Route path='/*' element={<Navigate to="/auth"/>}/>
      </>
    )
  }

  return (
    <AuthContext.Provider value={{isLoggedin: !!token, token: token, userId: userId, login: Login, logout: Logout}}>
      <Router>
        <NavMain/>
        <Routes>
          {routes}
        </Routes>
        <Clock/>
      </Router>
    </AuthContext.Provider>
  );
}

export default App;

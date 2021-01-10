import './App.css';
import  home from './screen/home'
import React, { useEffect, useState, useRef } from "react";
import  {  BrowserRouter as Router, Route,Redirect } from 'react-router-dom'
import Login from './screen/login';

function App() {
  
  return (
   <Router>
     <Route exact path ={'/login'} component={Login}/>
     <Route exact path ={'/home'} component={home}/>
   </Router>
    
  );
}

export default App;

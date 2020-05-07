import React, {useContext} from 'react';
import {DataContext} from '../../Context/DataProvider';
import {Button} from '@material-ui/core';
import "./Auth.css"
import {
  Link
} from "react-router-dom";

function Auth(){
  let data = useContext(DataContext);

  return (
    data.state.username ? 
      <div className="Auth">
        <Button variant="contained" onClick={data.logout}>Logout</Button>
        <p>Welcome, {data.state.username}</p>
      </div>
      : 
      <div className="Auth">
        <Link to="/login">
          <Button variant="contained">Login</Button>
        </Link>
        <Link to="/register">
          <Button variant="contained">Register</Button>
        </Link>
      </div>
  );
}

export default Auth;

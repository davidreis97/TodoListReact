import React, {useContext, useState} from 'react';
import {TextField, Button, FormControl} from '@material-ui/core';
import { useHistory } from "react-router-dom";
import {DataContext} from '../../Context/DataProvider';

function Login(){
    let data = useContext(DataContext);
    const history = useHistory();

    let [state, changeState] = useState();

    function changePassword(password){
      changeState({...state,password:password.target.value});
    }

    function changeUsername(username){
      changeState({...state,username:username.target.value});
    }

    async function getCSRFToken(){
      changeState({...state,csrf_token:await data.getCSRFToken()});
    }

    async function login(){
      await data.login(state);
      history.push("/");
    }

    if(!state || !state.csrf_token){
      getCSRFToken();
    }

    return (
      <FormControl>
        <TextField id="username" label="Username" onChange={changeUsername} />
        <TextField id="password" label="Password" onChange={changePassword} type="password"/>
        <Button onClick={login} variant="contained">Login</Button>
      </FormControl>
    );
  }
  
  export default Login;
  


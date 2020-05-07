import React, {useState} from 'react'
import axios from 'axios';

export const DataContext = React.createContext();
const SERVER_URL = "http://localhost:3000";

function DataProvider(props){
  const [state, changeState] = useState({});

  const getCSRFToken = () => {
    return -1;
  };

  const login = async (data) => {
    let res = await axios.post(`${SERVER_URL}/login`, data);

    if(!res.data.err){
      changeState({
        username: res.data.username,
        token: res.data.token
      });
    }
  };

  const register = async (data) => {
    let res = await axios.post(`${SERVER_URL}/register`, data);

    if(!res.data.err){
      changeState({
        username: res.data.username,
        token: res.data.token
      });
    }
  };

  const logout = () => {
    changeState({});
  };

  const userRequest = async (method, path, data, params) => {
    let res = await axios({
      method: method,
      url: `${SERVER_URL}${path}`,
      data: data,
      params: params,
      headers: {
        "Username": state.username,
        "Authorization": state.token
      }
    });

    if(res.status === 401){
      logout();
      return [];
    }else{
      return res;
    }
  }

  const getAllProjects = async () => {
    let res = await userRequest("get","/user/projects");

    if(res.status === 200){
      return res.data;
    }else{
      return [];
    }
  }

  const addProject = async (title) => {
    let res = await userRequest("post","/user/project",{title:title});

    if(res.status === 201){
      return res.data.id;
    }else{
      return null;
    }
  }

  const removeProject = async (id) => {
    let res = await userRequest("delete","/user/project",{id:id});

    if(res.status === 200){
      return true;
    }else{
      return false;
    }
  }

  const addTodoItem = async (project, title) => {
    let res = await userRequest("post","/user/item",{listId:project, title:title});

    if(res.status === 201){
      return res.data.id;
    }else{
      return null;
    }
  }

  const removeTodoItem = async (id) => {
    let res = await userRequest("delete","/user/item",{id:id});

    if(res.status === 200){
      return true;
    }else{
      return false;
    }
  }

  const editTodoItem = async (id, title, done) => {
    let res = await userRequest("patch","/user/item",{id:id, title:title, done:done});

    if(res.status === 200){
      return true;
    }else{
      return false;
    }
  }

  return (
    <DataContext.Provider value={{state, login, logout, register, getAllProjects, addProject, removeProject, addTodoItem, removeTodoItem, editTodoItem, getCSRFToken}} {...props} />
  );
}

export default DataProvider;
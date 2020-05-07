import React, {useContext, useState} from 'react';
import { CircularProgress } from '@material-ui/core';
import {DataContext} from '../../Context/DataProvider';
import TodoList from '../TodoList/TodoList';
import NewTodoList from '../NewTodoList/NewTodoList';
import "./ListTodoLists.css";

function ListTodoLists(){
  let data = useContext(DataContext);
  let [state, changeState] = useState();

  if(!state){
    initialize();
  }

  async function initialize(){
    changeState(await data.getAllProjects());
  }

  async function addList(title){
    let id = await data.addProject(title);
    if(id){
      changeState([...state,{title: title, id: id, todoItems: []}]);
    }
  }

  async function deleteList(listId){
    if(await data.removeProject(listId)){
      changeState(state.filter((list,_i,_a) => list.id !== listId));
    }
  }

  return (
    data.state.username ? 
      state ?
        <div className="todoListContainer">
          {state.map((list,_i,_a) => (<TodoList key={list.id} deleteList={deleteList} list={list}></TodoList>))}
          <NewTodoList addList={addList}></NewTodoList>
        </div>
      :
      <CircularProgress/>
    :
    <p>
      Please Login Or Register
    </p>
  )
}

export default ListTodoLists;

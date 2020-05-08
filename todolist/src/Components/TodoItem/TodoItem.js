import React, {useContext, useState} from 'react';
import {DataContext} from '../../Context/DataProvider';
import { Checkbox, Tooltip } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import IconButton from '@material-ui/core/IconButton';
import "./TodoItem.css";

function TodoItem({item, deleteItem}){
  let data = useContext(DataContext);
  let [state,changeState] = useState(item);

  async function toggleDone(evt){
    let newItem = await data.editTodoItem(state.id, state.title, evt.target.checked);
    if(newItem){
      changeState(newItem);
    };
  }

  return (
    <div className="TodoItem">
      {state.done ? 
      <Tooltip title={"Finish Date: " + new Date(state.finishDate).toString()}>
        <span className="TodoItemName TodoItemNameDone">{state.title}</span>
      </Tooltip>
      :
      <Tooltip title={"Creation Date: " + new Date(state.creationDate).toString()}>
        <span className="TodoItemName">{state.title}</span>
      </Tooltip>
      }
      <Checkbox onClick={toggleDone} checked={state.done}></Checkbox>
      <IconButton onClick={()=>{deleteItem(state.id)}} className="TodoDeleteIconButton">
        <DeleteIcon></DeleteIcon>
      </IconButton>
    </div>
  );
}

export default TodoItem;
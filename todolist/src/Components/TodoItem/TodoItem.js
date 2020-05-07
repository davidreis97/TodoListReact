import React, {useContext, useState} from 'react';
import {DataContext} from '../../Context/DataProvider';
import { Checkbox } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import IconButton from '@material-ui/core/IconButton';
import "./TodoItem.css";

function TodoItem({item, deleteItem}){
  let data = useContext(DataContext);
  let [state,changeState] = useState(item);

  async function toggleDone(evt){
    if(await data.editTodoItem(state.id, state.title, evt.target.checked)){
      changeState({...item, done: !state.done});
    };
  }

  return (
    <div className="TodoItem">
      {state.done ? 
        <span className="TodoItemName TodoItemNameDone">{state.title}</span>
      :
        <span className="TodoItemName">{state.title}</span>
      }
      <Checkbox onClick={toggleDone} checked={state.done}></Checkbox>
      <IconButton onClick={()=>{deleteItem(state.id)}} className="TodoDeleteIconButton">
        <DeleteIcon></DeleteIcon>
      </IconButton>
    </div>
  );
}

export default TodoItem;
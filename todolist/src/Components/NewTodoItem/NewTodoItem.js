import React, {useState} from 'react';
import { TextField, Button } from '@material-ui/core';
import "./NewTodoItem.css";

function NewTodoItem({addItem}){
  let [state,changeState] = useState("");

  function updateItemName(evt){
    changeState(evt.target.value);
  }

  function add(){
    if (state && state.length > 0){
      addItem(state);
    }
  }

  return (
    <div className="NewTodoItem">
      <TextField placeholder="New Item Name" onChange={updateItemName}></TextField>
      <Button variant="contained" onClick={add}>Add</Button>
    </div>
  );
}

export default NewTodoItem;

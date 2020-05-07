import React, {useState} from 'react';
import CardContent from '@material-ui/core/CardContent';
import Card from '@material-ui/core/Card';
import "./NewTodoList.css";
import { TextField, Button } from '@material-ui/core';

function NewTodoList({addList}){
  let [state,changeState] = useState("");

  function changeTitle(evt){
    changeState(evt.target.value);
  }

  function create(){
    if(state && state.length > 0){
      addList(state);
    }
  }

  return (
    <Card className="TodoList">
      <CardContent>
        <TextField id="listTitle" label="Project Title" onChange={changeTitle}></TextField>
        <Button onClick={create} variant="contained">Create New Project</Button>
      </CardContent>
    </Card>
  );
}

export default NewTodoList;

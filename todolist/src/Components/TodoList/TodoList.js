import React, {useContext, useState} from 'react';
import DeleteIcon from '@material-ui/icons/Delete';
import CardContent from '@material-ui/core/CardContent';
import Card from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';
import "./TodoList.css";
import IconButton from '@material-ui/core/IconButton';
import NewTodoItem from '../NewTodoItem/NewTodoItem';
import TodoItem from '../TodoItem/TodoItem';
import {DataContext} from '../../Context/DataProvider';

function TodoList({list, deleteList}){
  let data = useContext(DataContext);
  let [state,changeState] = useState(list);
  
  async function addItem(itemName){
    let newID = await data.addTodoItem(state.id,itemName);
    if(newID){
      changeState({...state,todoItems: [...state.todoItems,{id:newID, title: itemName, done: false}]});
    }
  }

  async function deleteItem(itemId){
    if(await data.removeTodoItem(itemId)){
      changeState({...state,todoItems: state.todoItems.filter((item,_i,_a) => item.id !== itemId)});
    }
  }

  return (
    <Card className="TodoList">
      <CardContent>
        <div className="todoListHeader">
          <Typography variant="h5" component="h2"  className="todoListTitle">
            {state.title}
          </Typography>
          <IconButton onClick={()=>{deleteList(state.id)}}>
            <DeleteIcon></DeleteIcon>
          </IconButton>
        </div>
        {state.todoItems.map((item,_i,_a) => (<TodoItem item={item} key={item.id} deleteItem={deleteItem}></TodoItem>))}
        <NewTodoItem addItem={addItem}></NewTodoItem>
      </CardContent>
    </Card>
  );
}

export default TodoList;

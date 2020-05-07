import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import './App.css';
import Auth from '../Auth/Auth';
import DataProvider from '../../Context/DataProvider';
import '../Auth/Auth';
import Login from '../Login/Login';
import Register from '../Register/Register';
import ListTodoLists from '../ListTodoLists/ListTodoLists';

function App() {
  return (
    <div className="App">
      <DataProvider>
        <Router>
          <Auth></Auth>

          <Switch>
            <Route path="/login">
              <Login></Login>
            </Route>
            <Route path="/register">
              <Register></Register>
            </Route>
            <Route path="/">
              <ListTodoLists></ListTodoLists>
            </Route>
          </Switch>
        </Router>
      </DataProvider>
    </div>
  );
}

export default App;

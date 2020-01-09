import React from 'react';
import { connect } from "react-redux";
import * as actions from './actions';
import UserList from './components/userList/index';
import AddUser from './components/addUser/index';
import EditUser from './components/editUser/index';
import './App.css';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
class App extends React.Component{
  constructor(props){
    super(props)
  }


  render(){
    return(
        <BrowserRouter>
          <Switch>
            <Route exact = {true} path = '/' render = {(props) => 
              <UserList {...props} 
                users = {this.props.users}
                getUsers = {this.props.getUsers}
                deleteUser = {this.props.deleteUser}
                getSup = {this.props.getSup}
                getCount = {this.props.getCount}
                moreUsers = {this.props.moreUsers}
                />}/>
            <Route exact = {true} path = '/users/add' render = {(props) =>
              <AddUser {...props}
            />}/>
            <Route exact = {true} path = '/users/edit/:id' render = {(props) =>
              <EditUser {...props}
                editUser = {this.props.editUser}
            />}/>
          </Switch>
        </BrowserRouter>
    )
  }
}

const mapStateToProps = state => {
  return {
    users: state.users,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    getUsers : (searchText, sortBy, page, dir, limit) => {
      dispatch(actions.getUsers(searchText, sortBy, page, dir, limit));
    },
    deleteUser: (id, state, user, query) => {
      dispatch(actions.deleteUsers(id, state, user, query));
    },
    editUser: (id, newUser, history) => {
      dispatch(actions.editUsers(id, newUser, history));
    },
    getSup: (id) => {
      dispatch(actions.getSup(id));
    },
    getCount: (id) => {
      dispatch(actions.getCount(id));
    },
    moreUsers: (searchText, sortBy, page, dir,limit) => {
      dispatch(actions.moreUsers(searchText, sortBy, page, dir, limit));
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
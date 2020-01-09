import {combineReducers} from 'redux';
import users from './users';
import userQuery from './userQuery';
import addUser from './addUser';
import editUser from './editUser';

const reducers = combineReducers({users, userQuery, addUser, editUser});

export default reducers;


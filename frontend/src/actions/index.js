import axios from 'axios';
import { PromiseProvider } from 'mongoose';

const GET_URL = 'http://localhost:8080/api/users';
const NOR_GET_URL = 'http://localhost:8080/api';

function requestStart() {
    return {
      type: 'REQUEST_USERS_START'
    };
  }
function requestSuccess(users) {
    return {
      type: 'REQUEST_USERS_SUCCESS',
      users: users
    };
  }
function requestFail(error) {
    return {
      type: 'REQUEST_USERS_FAIL',
      error
    };
  }

export function getUsers(searchText, sortBy, page, dir, limit) {
    return (dispatch, getState) => {
        dispatch(requestStart());
        console.log('begin,getuser', searchText, sortBy, page, dir, limit);
        axios.get(`${GET_URL}?search=${searchText}&sortBy=${sortBy}&page=${page}&dir=${dir}&limit=${limit}`)
            .then(res => {
              dispatch(requestSuccess(res.data));
            })
            .catch(err => {
              dispatch(requestFail(err.response));
            })
    }
}

function supStart() {
  return {
    type: 'REQUEST_SUP_START'
  };
}
function supSuccess(users) {
  return {
    type: 'REQUEST_SUP_SUCCESS',
    users: users
  };
}
function supFail(error) {
  return {
    type: 'REQUEST_SUP_FAIL',
    error
  };
}

export function getSup(id) {
  return (dispatch, getState) => {
      dispatch(supStart());
      console.log('begin,getSUP');
      dispatch(editPage(1));
      const query = getState().userQuery;
      axios.get(`${GET_URL}?search=${query.searchText}&sortBy=${query.orderBy}&page=${query.page}&dir=${query.order}&limit=${query.limit}&sup=${id}`)
          .then(res => {
            console.log("sup_data",res.data);
            dispatch(supSuccess(res.data));
          })
          .catch(err => {
            dispatch(supFail(err.response));
          })
  }
}

function countStart() {
  return {
    type: 'REQUEST_COUNT_START'
  };
}
function countSuccess(users) {
  return {
    type: 'REQUEST_COUNT_SUCCESS',
    users: users
  };
}
function countFail(error) {
  return {
    type: 'REQUEST_COUT_FAIL',
    error
  };
}

export function getCount(id) {
  return (dispatch, getState) => {
      dispatch(countStart());
      console.log('begin,getCOUNT');
      dispatch(editPage(1));
      const query = getState().userQuery;
      axios.get(`${GET_URL}?search=${query.searchText}&sortBy=${query.orderBy}&page=${query.page}&dir=${query.order}&limit=${query.limit}&count=${id}`)
          .then(res => {
            console.log("count_data",res.data);
            dispatch(countSuccess(res.data));
          })
          .catch(err => {
            dispatch(countFail(err.response));
          })
  }
}

function moreStart() {
  return {
    type: 'MORE_USERS_START'
  };
}
function moreSuccess(users) {
  return {
    type: 'MORE_USERS_SUCCESS',
    users: users
  };
}
function moreFail(error) {
  return {
    type: 'MORE_USERS_FAIL',
    error
  };
}

export function moreUsers(searchText, sortBy, page, dir, limit, state, user) {
  return (dispatch, getState) => {
      dispatch(moreStart());
      console.log('begin,moreuser');
      console.log(searchText, sortBy, page, dir);
      if (state === "sup"){
        axios.get(`${GET_URL}/?search=${searchText}&sortBy=${sortBy}&page=${page}&dir=${dir}&limit=${limit}&sup=${user}`)
          .then(res => {
            dispatch(moreSuccess(res.data));
          })
          .catch(err => {
            dispatch(moreFail(err.response));
          })
      }
      else if(state === "count"){
        axios.get(`${GET_URL}/?search=${searchText}&sortBy=${sortBy}&page=${page}&dir=${dir}&limit=${limit}&count=${user}`)
          .then(res => {
            dispatch(moreSuccess(res.data));
          })
          .catch(err => {
            dispatch(moreFail(err.response));
          })
      }
      else{
        axios.get(`${GET_URL}/?search=${searchText}&sortBy=${sortBy}&page=${page}&dir=${dir}&limit=${limit}`)
          .then(res => {
            dispatch(moreSuccess(res.data));
          })
          .catch(err => {
            dispatch(moreFail(err.response));
          })
      }
      
  }
}

function deleteStart() {
    return {
      type: 'DELETE_USERS_START'
    };
  }
function deleteSuccess() {
    return {
      type: 'DELETE_USERS_SUCCESS',
    };
  }
function deleteFail(error) {
    return {
      type: 'DELETE_USERS_FAIL',
      error
    };
  }

export function deleteUsers(id, state, user, query) {
    return (dispatch, getState)=> {
        var res_copy;
        dispatch(deleteStart());
        console.log(`begin delete${id}`)
        axios.delete(`${GET_URL}/${id}`)
            .then(res => {
              dispatch(editPageWrapper(1));
              console.log('delete sucess');
        })
            .then(res =>{
              dispatch(deleteSuccess());    
        })
            .then(() => {
              const {searchText, page, orderBy, order, limit} = getState().userQuery;;
              if(state === "sup"){
                console.log("firedelete getsup")
                dispatch(getSup(user));
              }
              else if(state === "count"){
                console.log("firedelete getcount")
                dispatch(getCount(user));
              }
              else{
                console.log("firedelete getnormal")
                dispatch(getUsers(searchText, orderBy, page, order, limit));
              }
            })
            .catch(err => {
              dispatch(deleteFail(err.response));  
        })
    }
}

//User Edit 
function editGetStart() {
  return {
    type: 'REQUEST_SINGLE_START'
  };
}
function editGetSuccess(users) {
  return {
    type: 'REQUEST_SINGLE_SUCCESS',
    users: users
  };
}
function editGetFail(error) {
  return {
    type: 'REQUEST_SINGLE_FAIL',
    error
  };
}

export function editUserList(id, history, view, currentSelect) {
  return (dispatch, getState) => {
      dispatch(editGetStart());
      console.log('begin,editUserList');
      axios.get(`${GET_URL}/${id}`)
          .then(res => {
            console.log("res.data",res.data);
            dispatch(editGetSuccess(res.data));
          })
          .then(res => {
            history.push({pathname: `/users/edit/${id}`, state: { currUser : getState().editUser.currUser, view : view, currentSelect: currentSelect}});
            //history.push({pathname : `/users/edit/${id}`,});
            console.log("pushhisotry")
          })
          .catch(err => {
            dispatch(editGetFail(err.response));
          })
  }
}


function editStart() {
    return {
      type: 'EDIT_USERS_START'
    };
  }
function editSuccess() {
    return {
      type: 'EDIT_USERS_SUCCESS',
    };
  }
function editFail(error) {
    return {
      type: 'EDIT_USERS_FAIL',
      error
    };
  }

export function editUsers(id, newUser, history, view, currentSelect) {
    return (dispatch, getState) => {
        dispatch(editStart());
        axios.put(`${GET_URL}/${id}`, newUser)
            .then(res => {
              dispatch(editSuccess());  
              console.log("Edit Success");
        })
            .then(res => {
              console.log("editUser", view, currentSelect);
              history.push({pathname: `/`, state: {view : view, currentSelect: currentSelect}});
        })
            .catch(err => {
              dispatch(editFail(err.response));
        })
    }
}

function addStart() {
    return {
      type: 'ADD_USERS_START'
    };
  }
function addSuccess() {
    return {
      type: 'ADD_USERS_SUCCESS',
    };
  }
function addFail(error) {
    return {
      type: 'ADD_USERS_FAIL',
      error
    };
  }

export function addUsers(newUser,history, view, user) {
    return (dispatch, getState) => {
        dispatch(addStart());
        console.log("begin add");
        axios.post(`${GET_URL}`, newUser)
            .then(res => {
                dispatch(addSuccess());
                console.log("add Success");
        })
            .then(res => {
                history.push('/');
        })
            .catch(err => {
                dispatch(addFail(err.response));
        })
    }
}

//User Query Actions
function editSearch(text) {
  return {
    type: 'EDIT_SEARCH',
    text
  };
}

export function editSearchGet(text) {
  return (dispatch, getState) => {
    dispatch(editSearch(text));
    dispatch(editPageWrapper(1)).then(()=>{
      const query = getState().userQuery;
      dispatch(getUsers(text, query.orderBy, query.page, query.order, query.limit));
    })

  }
}

function editOrder(order) {
  return {
    type: 'EDIT_ORDER',
    order
  };
}

function editOrderBy(orderBy) {
  return {
    type: 'EDIT_ORDER_BY',
    orderBy
  };
}

export function sortAction(order, orderBy, state, user){
  return (dispatch, getState) => {
    dispatch(editOrder(order));
    dispatch(editOrderBy(orderBy));
    dispatch(editPage(1));
    const query = getState().userQuery;
    if(state === "sup"){
      console.log("firedelete getsup")
      dispatch(getSup(user));
    }
    else if(state === "count"){
      console.log("firedelete getcount")
      dispatch(getCount(user));
    }
    else{
      console.log("firedelete getnormal")
      dispatch(getUsers(query.searchText, query.orderBy, query.page, query.order, query.limit));
    }
  }
}

export function loadMoreAction(state, user){
  return (dispatch, getState) => {
    var query = getState().userQuery;
    dispatch(editPage(query.page + 1));
    query = getState().userQuery;
    console.log("loading,",query.page);
    dispatch(moreUsers(query.searchText, query.orderBy, query.page, query.order, query.limit, state, user));
  }
}

export function resetAction(){
  return (dispatch, getState) => {
    dispatch(editPageWrapper(1));
    dispatch(editOrder('desc'));
    dispatch(editOrderBy('_id'));
    dispatch(editSearch(""));
    const query = getState().userQuery;
    dispatch(getUsers(query.searchText, query.orderBy, query.page, query.order, query.limit));
  
  }
}

export function editPage(page) {
  return {
    type: 'EDIT_PAGE',
    page
  };
}

export function editPageWrapper(page){
  return (dispatch, getState) => {
    console.log("dispatch page", page)
    dispatch(editPage(page));
    return Promise.resolve();
  }
}

export function editLimit(limit) {
  console.log("setLimit", limit);
  return {
    type: 'EDIT_LIMIT',
    limit
  };
}

//User Add Actions
function addListStart() {
  return {
    type: 'ADD_USERS_LIST_START'
  };
}
function addListSuccess(users) {
  return {
    type: 'ADD_USERS_LIST_SUCCESS',
    users: users
  };
}
function addListFail(error) {
  return {
    type: 'ADD_USERS_LIST_FAIL',
    error
  };
}

export function addUserList(searchText, sortBy, page, dir) {
  return (dispatch, getState) => {
      dispatch(addListStart());
      console.log('begin,addUserList');
      dispatch(editPage(1));
      dispatch(editOrder('desc'));
      dispatch(editOrderBy('_id'));
      dispatch(editSearch(""));
      axios.get(`${GET_URL}?search=${searchText}&sortBy=${sortBy}&page=${page}&dir=${dir}&limit=${100}`)
          .then(res => {
            console.log("res.data",res.data);
            dispatch(addListSuccess(res.data));
          })
          .catch(err => {
        
            dispatch(addListFail(err.response));
          })
  }
}


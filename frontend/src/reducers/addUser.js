
const initState = { userList: [], searchText: "", order: 'asc', orderBy: 'id', page: 0, error : "", limit: 100}

const addUser = (state = initState, action) => {
    switch (action.type) {
        case 'ADD_SEARCH':
            return {
                ...state,
                searchText: action.text
            };
        case 'ADD_ORDER':
            return {
                ...state,
                order: action.order
            }
        case 'ADD_ORDER_BY':
            return {
                ...state,
                orderBy: action.orderBy
            }
        case 'ADD_PAGE':
            return {
                ...state,
                page: action.page
            }
        case 'ADD_LIMIT':
            return {
                ...state,
                limit: action.limit
            }
        case 'ADD_USERS_LIST_START':
                console.log("request add user list start");
                return {
                    ...state,
                };
        case 'ADD_USERS_LIST_SUCCESS':
            return {
            ...state,
            userList : action.users.docs
            };
        case 'ADD_USERS_LIST_FAIL':
            return {
                ...state,
            };
      default:
        return state;
    }
  };

export default addUser;
const initState = { userList : [], docs: "", isLoading: true, moreLoading: false,error : ""}

const users = (state = initState, action) => {
    switch (action.type) {
        case 'REQUEST_USERS_START':
            console.log("request start");
            return {
                ...state,
                isLoading: true
            };
        case 'REQUEST_USERS_SUCCESS':
            return {
            ...state,
            isLoading: false,
            docs: action.users,
            userList : action.users.docs
            };
        case 'REQUEST_USERS_FAIL':
            return {
              ...state,
              error: action.error,
              isLoading: false
            };

        case 'REQUEST_SUP_START':  
            return {
                ...state,
                isLoading: true
            };
        case 'REQUEST_SUP_SUCCESS':
            return {
            ...state,
            isLoading: false,
            docs: action.users,
            userList : action.users.docs
            };
        case 'REQUEST_SUP_FAIL':
            return {
                ...state,
                error: action.error,
                isLoading: false
            };
        case 'REQUEST_COUNT_START':
            return {
                ...state,
                isLoading: true
            };
        case 'REQUEST_COUNT_SUCCESS':
            return {
            ...state,
            isLoading: false,
            docs: action.users,
            userList : action.users.docs
            };
        case 'REQUEST_COUNT_FAIL':
            return {
                ...state,
                error: action.error,
                isLoading: false
            };
        case 'MORE_USERS_START':
            console.log("request start");
            return {
                ...state,
                moreLoading: true
            };
        case 'MORE_USERS_SUCCESS':
            
            return {
            ...state,
            moreLoading: false,
            docs: action.users,
            userList: [...state.userList, ...action.users.docs]
            };
        case 'MORE_USERS_FAIL':
            return {
              ...state,
              error: action.error,
              moreLoading: false
            };
        case 'DELETE_USERS_START':
            return {
                ...state,
                isLoading: true,
            };
        case 'DELETE_USERS_SUCCESS':
            return {
            ...state,
            isLoading: false,
            };
        case 'DELETE_USERS_FAIL':
            return {
              ...state,
              error: action.error,
              isLoading: false
            };
        case 'EDIT_USERS_START':
                return {
                    ...state,
                    isLoading: true
            };
        case 'EDIT_USERS_SUCCESS':
                return {
                ...state,
                isLoading: false,
            };
        case 'EDIT_USERS_FAIL':
                return {
                  ...state,
                  error: action.error,
                  isLoading: false
            };
        case 'ADD_USERS_START':
                return {
                    ...state,
                    isLoading: true
            };
        case 'ADD_USERS_SUCCESS':
                return {
                ...state,
                isLoading: false,
            };
        case 'ADD_USERS_FAIL':
                return {
                  ...state,
                  error: action.error,
                  isLoading: false
            };
      default:
        return state;
    }
  };
  export default users;
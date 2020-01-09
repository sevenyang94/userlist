
const initState = { currUser: {}, error: "", isLoading: true}

const editUser = (state = initState, action) => {
    switch (action.type) {
        case 'REQUEST_SINGLE_START':
            return {
                ...state,
                isLoading: true
            };
        case 'REQUEST_SINGLE_SUCCESS':
            return {
            ...state,
            isLoading: false,
            currUser: action.users
            };
        case 'REQUEST_SINGLE_FAIL':
            return {
              ...state,
              error: action.error,
              isLoading: false
            };
      default:
        return state;
    }
  };

  export default editUser;
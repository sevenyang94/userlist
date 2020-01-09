
const initState = { searchText: "", order: 'desc', orderBy: '_id', page: 1, error : "", limit: 3}

const userQuery = (state = initState, action) => {
    switch (action.type) {
        case 'EDIT_SEARCH':
            return {
                ...state,
                searchText: action.text
            };
        case 'EDIT_ORDER':
            return {
                ...state,
                order: action.order
            }
        case 'EDIT_ORDER_BY':
            return {
                ...state,
                orderBy: action.orderBy
            }
        case 'EDIT_PAGE':
            return {
                ...state,
                page: action.page
            }
        case 'EDIT_LIMIT':
            return {
                ...state,
                limit: action.limit
            }
      default:
        return state;
    }
  };

  export default userQuery;
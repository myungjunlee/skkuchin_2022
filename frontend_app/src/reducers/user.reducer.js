import { userConstants } from "../actions/constants"

const intiState = {
    users: [],
    conversations: []
}

export default (state = intiState, action) => {

    switch(action.type){
        case `${userConstants.GET_REALTIME_USER}_REQUEST`:
        case `${userConstants.GET_REALTIME_USERS}_REQUEST`:
        case `${userConstants.GET_ID_CHECK}_REQUEST`:
        case `${userConstants.GET_REALTIME_LISTS}_REQUEST`:
            break;
        case `${userConstants.GET_REALTIME_USER}_SUCCESS`:
        case `${userConstants.GET_REALTIME_USERS}_SUCCESS`:
        case `${userConstants.GET_ID_CHECK}_SUCCESS`:
        case `${userConstants.GET_POST_USER}_SUCCESS`:
            state = {
                ...state,
                users: action.payload.users
            }
            break;
        case `${userConstants.GET_REALTIME_MESSAGES}_SUCCESS`:
        case `${userConstants.GET_REALTIME_LISTS}_SUCCESS`:
        case `${userConstants.GET_CONVERSATIONS}_SUCCESS`:
            state = {
                ...state,
                conversations: action.payload.conversations
            }
            break;
        case `${userConstants.EXIT_CHAT}_SUCCESS`:
        case `${userConstants.USER_BLOCK}_SUCCESS`:
        case `${userConstants.USER_UNBLOCK}_SUCCESS`:
            state = {
                ...state
            }
            break;
        case `${userConstants.LOGOUT_CHAT}_SUCCESS`:
            state = {
                ...state,
                users: [],
                conversations: []
            }
            break;
        case `${userConstants.GET_REALTIME_USER}_FAILURE`:
        case `${userConstants.GET_REALTIME_USERS}_FAILURE`:
        case `${userConstants.GET_ID_CHECK}_FAILURE`:
        case `${userConstants.GET_POST_USER}_FAILURE`:
            state = {
                ...state,
                users: []
            }
            break;
        case `${userConstants.GET_REALTIME_MESSAGES}_FAILURE`:
        case `${userConstants.GET_REALTIME_LISTS}_FAILURE`:
        case `${userConstants.GET_CONVERSATIONS}_FAILURE`:
            state = {
                ...state,
                conversations: []
            }
            break;
        case `${userConstants.EXIT_CHAT}_FAILURE`:
        case `${userConstants.USER_BLOCK}_FAILURE`:
        case `${userConstants.USER_UNBLOCK}_FAILURE`:
            state = {
                ...state
            }
            break;
        case `${userConstants.LOGOUT_CHAT}_FAILURE`:
            state = {
                ...state
            }
            break;
        
    }


    return state;

}
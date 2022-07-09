import { authConstants } from '../actions/constants';

const initState = {
    isAuthenticated: false,
    user: null
}

export default (state = initState, action) => {

    const { type, payload } = action;

    switch(type){

        case `${authConstants.AUTHENTICATED}_SUCCESS`:
            state = {
                ...state
            }
            break;
        case `${authConstants.REFRESH}_SUCCESS`:
            localStorage.setItem('access', payload.access);
            state = {
                ...state
            }
            break;
        case `${authConstants.LOGIN}_SUCCESS`:
            localStorage.setItem('access', payload.access);
            localStorage.setItem('refresh', payload.refresh);
            state = {
                ...state
            }
            break;
        case `${authConstants.SIGNUP}_SUCCESS`:
        case `${authConstants.RESEND_ACTIVATION}_SUCCESS`:
            state = {
                ...state,
                isAuthenticated: false
            }
            break;
        case `${authConstants.USER_LOADED}_SUCCESS`:
            state = {
                ...state,
                user: payload,
                isAuthenticated: true
            }
            break;
        case `${authConstants.ACCOUNT_EDIT}_SUCCESS`:
            state = {
                ...state,
                user: payload
            }
            break;
        case `${authConstants.USER_LOADED}_FAILURE`:
            state = {
                ...state,
                user: null
            }
            break;
        case `${authConstants.LOGIN}_FAILURE`:
        case `${authConstants.SIGNUP}_FAILURE`:
        case `${authConstants.RESEND_ACTIVATION}_FAILURE`:
        case `${authConstants.LOGOUT}_SUCCESS`:
        case `${authConstants.USER_DELETE}_SUCCESS`:
            localStorage.removeItem('access');
            localStorage.removeItem('refresh');
            state = {
                ...state,
                isAuthenticated: false,
                user: null
            }
            break;
        case `${authConstants.ACTIVATION}_SUCCESS`:
            state = {
                ...state
            }
            break;
        case `${authConstants.PASSWORD_RESET}_SUCCESS`:
        case `${authConstants.PASSWORD_RESET_CONFIRM}_SUCCESS`:
        case `${authConstants.PASSWORD_SET}_SUCCESS`:
        case `${authConstants.LOGOUT}_FAILURE`:
        case `${authConstants.PASSWORD_RESET}_FAILURE`:
        case `${authConstants.PASSWORD_SET}_FAILURE`:
        case `${authConstants.PASSWORD_RESET_CONFIRM}_FAILURE`:
        case `${authConstants.ACTIVATION}_FAILURE`:
        case `${authConstants.ACCOUNT_EDIT}_FAILURE`:
        case `${authConstants.USER_DELETE}_FAILURE`:
            state = {
                ...state
            }
    }

    return state;
}
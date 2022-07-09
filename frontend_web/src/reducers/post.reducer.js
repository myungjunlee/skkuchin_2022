import { postConstants } from "../actions/constants"

const intiState = {
    data: null
}

export default (state = intiState, action) => {
    const { type, payload } = action;

    switch(type){
        case `${postConstants.READ}_SUCCESS`:
        case `${postConstants.UPDATE}_SUCCESS`:
        case `${postConstants.GET_DETAIL}_SUCCESS`:
            state = {
                ...state,
                data: payload
            }
            break;
        case `${postConstants.LOGOUT_POST}_SUCCESS`:
            state = {
                ...state,
                data: null
            }
            break;
        case `${postConstants.CREATE}_SUCCESS`:
        case `${postConstants.CREATE}_FAILURE`:
        case `${postConstants.READ}_FAILURE`:
        case `${postConstants.UPDATE}_FAILURE`:
        case `${postConstants.REMOVE}_SUCCESS`:
        case `${postConstants.REMOVE}_FAILURE`:            
        case `${postConstants.GET_DETAIL}_FAILURE`:
        case `${postConstants.FINISH}_SUCCESS`:
        case `${postConstants.FINISH}_FAILURE`:
        case `${postConstants.LOGOUT_POST}_FAILURE`:
            state = {
                ...state
            }
            break;
        
    }


    return state;

}
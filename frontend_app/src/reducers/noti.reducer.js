import { notiConstants } from "../actions/constants"

const intiState = {
    data: null
}

export default (state = intiState, action) => {
    const { type, payload } = action;

    switch(type){
        case `${notiConstants.READ_NOTIS}_SUCCESS`:
        case `${notiConstants.GET_NOTI}_SUCCESS`:
            state = {
                ...state,
                data: payload
            }
            break;
        case `${notiConstants.LOGOUT_NOTI}_SUCCESS`:
            state = {
                ...state,
                data: null
            }
            break;
        case `${notiConstants.READ_NOTIS}_FAILURE`:        
        case `${notiConstants.GET_NOTI}_FAILURE`:
        case `${notiConstants.LOGOUT_NOTI}_FAILURE`:
            state = {
                ...state
            }
            break;
        
    }


    return state;

}
import { combineReducers } from "redux";
import authReducer from './auth.reducer';
import userReducer from './user.reducer';
import postReducer from './post.reducer';
import notiReducer from './noti.reducer';

const rootReducer = combineReducers({
    auth: authReducer,
    user: userReducer,
    post: postReducer,
    noti: notiReducer
});

export default rootReducer;
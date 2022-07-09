import axios from 'axios';
import { firestore } from 'firebase';
import { authConstants } from './constants';

export const signup = (signupData, user) => {

    return async (dispatch) => {

        const db = firestore();

        const config = {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        };

        const res = await axios.post(`${process.env.REACT_APP_API_URL}/auth/users/`, signupData, config);

        db.collection('users')
        .doc(user.uid)
        .set({
            uid: user.uid,
            username: user.username,
            email: user.email,
            name: user.name,
            major: user.major,
            student_id: user.student_id,
            mbti: user.mbti,
            image: null,
            block_uid: [],
            post_uid: [],
            post_blocking: [],
            token: '',
            createdAt: new Date().getTime()
        })

        if (res.data.verification) {
            db.collection('checks')
            .doc(user.uid)
            .set({
                username: user.username,
                verification: res.data.verification
            })
        }

        dispatch({
            type: `${authConstants.SIGNUP}_SUCCESS`,
            payload: res.data
        });
    }
}

export const login = (username, password) => {
    return async (dispatch) => {
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        };
    
        const body = JSON.stringify({ username, password });
    
        const res = await axios.post(`${process.env.REACT_APP_API_URL}/auth/jwt/create/`, body, config);

        dispatch({
            type: `${authConstants.LOGIN}_SUCCESS`,
            payload: res.data
        });
    }
}

export const logout = () => {
    return async (dispatch) => {

        dispatch({
            type: `${authConstants.LOGOUT}_SUCCESS`
        });
    }
};

export const checkAuthenticated = () => {
    return async (dispatch) => {

        if (localStorage.getItem('access')) {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            }; 
    
            const body = JSON.stringify({ token: localStorage.getItem('access') });
    
            await axios.post(`${process.env.REACT_APP_API_URL}/auth/jwt/verify/`, body, config);

            dispatch({
                type: `${authConstants.AUTHENTICATED}_SUCCESS`
            });
    
        } else {
            dispatch(logout());
        }

    }
};

export const refreshToken = () => {
    return async (dispatch) => {
        
        if (localStorage.getItem('refresh')) {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            }; 

            const body = JSON.stringify({ refresh: localStorage.getItem('refresh') });
            const res = await axios.post(`${process.env.REACT_APP_API_URL}/auth/jwt/refresh/`, body, config)

            dispatch({
                type: `${authConstants.REFRESH}_SUCCESS`,
                payload: res.data
            });

        } else {
            dispatch(logout());
        }
    }
};

export const load_user = () => {
    return async (dispatch) => {

        if (localStorage.getItem('access')) {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `JWT ${localStorage.getItem('access')}`,
                    'Accept': 'application/json'
                }
            }; 
    
            try {
                const res = await axios.get(`${process.env.REACT_APP_API_URL}/auth/users/me/`, config);
    
                dispatch({
                    type: `${authConstants.USER_LOADED}_SUCCESS`,
                    payload: res.data
                });

                return res.data;
                
            } catch (err) {
                console.log(err);
                dispatch({
                    type: `${authConstants.USER_LOADED}_FAILURE`
                });
            }
        } else {
            dispatch({
                type: `${authConstants.USER_LOADED}_FAILURE`
            });
        }
    }
};

export const verify = (uid, token) => {
    return async (dispatch) => {

        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        };
    
        const body = JSON.stringify({ uid, token });

        await axios.post(`${process.env.REACT_APP_API_URL}/auth/users/activation/`, body, config)
        
        dispatch({
            type: `${authConstants.ACTIVATION}_SUCCESS`
        });
    };
};

export const edit_account = (user, formData) => {
    return async (dispatch) => {
        const config = {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `JWT ${localStorage.getItem('access')}`
            }
        };

        await axios.patch(`${process.env.REACT_APP_API_URL}/auth/users/me/`, formData, config)
        .then((res) => {
            const db = firestore();
            const user_info = db.collection("users").doc(user.uid);

            user_info
            .update({
                mbti: user.mbti,
                major: user.major,
                image: res.data.image
            })

            dispatch({
                type: `${authConstants.ACCOUNT_EDIT}_SUCCESS`,
                payload: res.data
            });
        })
    }
};

export const set_password = (current_password, new_password, re_new_password) => {
    return async (dispatch) => {
        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `JWT ${localStorage.getItem('access')}`
            }
        };
    
        const body = JSON.stringify({ current_password, new_password, re_new_password });

        await axios.post(`${process.env.REACT_APP_API_URL}/auth/users/set_password/`, body, config);

        dispatch({
            type: `${authConstants.PASSWORD_SET}_SUCCESS`
        });
    }
};


export const resend_activation = (email) => {
    return async (dispatch) => {
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        };
    
        const body = JSON.stringify({ email });

        await axios.post(`${process.env.REACT_APP_API_URL}/auth/users/resend_activation/`, body, config);

        dispatch({
            type: `${authConstants.RESEND_ACTIVATION}_SUCCESS`
        });
    }
};

export const reset_password = (email) => {
    return async (dispatch) => {
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        };
    
        const body = JSON.stringify({ email });

        await axios.post(`${process.env.REACT_APP_API_URL}/auth/users/reset_password/`, body, config);

        dispatch({
            type: `${authConstants.PASSWORD_RESET}_SUCCESS`
        });
    }
};

export const reset_password_confirm = (uid, token, new_password, re_new_password) => {
    return async (dispatch) => {
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        };
        const body = JSON.stringify({ uid, token, new_password, re_new_password });
            
        await axios.post(`${process.env.REACT_APP_API_URL}/auth/users/reset_password_confirm/`, body, config);
    
        dispatch({
            type: `${authConstants.PASSWORD_RESET_CONFIRM}_SUCCESS`
        });
    }
};

export const user_delete = (uid, current_password) => {
    return async (dispatch) => {

        const config = {
            data: {
                current_password: current_password
            },
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `JWT ${localStorage.getItem('access')}`
            }
        };

        await axios.delete(`${process.env.REACT_APP_API_URL}/auth/users/me/`, config);

        const db = firestore();
        db.collection("users").doc(uid).delete()
        .then(() => {
            db.collection("checks").doc(uid).delete()
        })

        dispatch({
            type: `${authConstants.USER_DELETE}_SUCCESS`
        });
    }
};
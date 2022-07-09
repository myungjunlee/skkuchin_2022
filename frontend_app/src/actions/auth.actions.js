import axios from 'axios';
import { authConstants } from './constants';

export const signup = (signupData, user) => {

    return async (dispatch) => {

        const config = {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        };

        const res = await axios.post(`${process.env.REACT_APP_API_URL}/auth/users/`, signupData, config);
    
        const document1 = {
            'uid': user.uid,
            'username': user.username,
            'email': user.email,
            'name': user.name,
            'major': user.major,
            'student_id': user.student_id,
            'mbti': user.mbti,
            'image': null,
            'block_uid': [],
            'post_uid': [],
            'post_blocking': [],
            'token': '',
            'createdAt': new Date().getTime()
        };

        window.FirebasePlugin.setDocumentInFirestoreCollection(user.uid, document1, "users", () => {
            // 푸쉬 알림 토큰 등록
            window.FirebasePlugin.getToken(function(fcmToken) {
                const documentFragment = {
                    'token': fcmToken
                };
                window.FirebasePlugin.updateDocumentInFirestoreCollection(user.uid, documentFragment, "users");
            }, function(error) {
                console.error(error);
            });
        });

        if (res.data.verification) {
            const document2 = {
                'username': user.username,
                'verification': res.data.verification
            };
    
            window.FirebasePlugin.setDocumentInFirestoreCollection(user.uid, document2, "checks");    
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
    
        const res = await axios.post(`${process.env.REACT_APP_API_URL}/auth/jwt/create/`, body, config)

        dispatch({
            type: `${authConstants.LOGIN}_SUCCESS`,
            payload: res.data
        });
    }
}

export const logout = (uid) => {
    return async (dispatch) => {

        window.FirebasePlugin.fetchDocumentInFirestoreCollection(uid, "users", function(document){
            if (document.token !== 'deny') {
                window.FirebasePlugin.unregister();
        
                const documentFragment = {
                    'token': ''
                };
        
                window.FirebasePlugin.updateDocumentInFirestoreCollection(uid, documentFragment, "users", () => {
                    dispatch({
                        type: `${authConstants.LOGOUT}_SUCCESS`
                    });
                });
            } else {
                dispatch({
                    type: `${authConstants.LOGOUT}_SUCCESS`
                });
            }
        }, function(error){
            console.error("Error fetching document: "+error);
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

        if (window.localStorage.getItem('access')) {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `JWT ${window.localStorage.getItem('access')}`,
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

            const documentFragment = {
                'mbti': user.mbti,
                'major': user.major,
                'image': res.data.image
            };

            window.FirebasePlugin.updateDocumentInFirestoreCollection(user.uid, documentFragment, "users");

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

        await axios.delete(`${process.env.REACT_APP_API_URL}/auth/users/me/`, config)

        window.FirebasePlugin.deleteDocumentFromFirestoreCollection(uid, "users", function() {
            try {
                window.FirebasePlugin.deleteDocumentFromFirestoreCollection(uid, "checks");
            } catch (error) {
                console.log(error);
            }
        })

        dispatch({
            type: `${authConstants.USER_DELETE}_SUCCESS`
        });
    }
};
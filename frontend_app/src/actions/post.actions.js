import axios from 'axios';
import { postConstants } from './constants';

export const create = (formData) => {

    return async (dispatch) => {

        const config = {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `JWT ${window.localStorage.getItem('access')}`,
                'Accept': 'application/json'
            }
        }; 
    
        try {
            await axios.post(`${process.env.REACT_APP_API_URL}/api/post/`, formData, config);

            dispatch({
                type: `${postConstants.CREATE}_SUCCESS`
            });
        } catch (error) {
            console.log(error);
            dispatch({
                type: `${postConstants.CREATE}_FAILURE`
            });
        }
    }
}

export const read = () => {
    return async (dispatch) => {

        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        };

        try {
            const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/post/`, config);

            if (res.data && res.data.length > 1) {
                if (res.data[0].id < res.data[1].id) {
                    res.data.sort((a, b) => b.id - a.id);
                }
            }

            dispatch({
                type: `${postConstants.READ}_SUCCESS`,
                payload: res.data
            });

            return res.data;

        } catch (error) {
            console.log(error);
            dispatch({
                type: `${postConstants.READ}_FAILURE`
            });
        }
    }
};

export const update = (id, formData) => {
    return async (dispatch) => {

        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `JWT ${window.localStorage.getItem('access')}`,
                'Accept': 'application/json'
            }
        }; 

        try {
            const res = await axios.put(`${process.env.REACT_APP_API_URL}/api/post/${id}/`, formData, config);

            dispatch({
                type: `${postConstants.UPDATE}_SUCCESS`,
                payload: res.data
            });
            
            return res.data;

        } catch (error) {
            console.log(error);
            dispatch({
                type: `${postConstants.UPDATE}_FAILURE`
            });
        }
    }
}

export const remove = (id) => {
    return async (dispatch) => {

        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `JWT ${window.localStorage.getItem('access')}`
            }
        };
    
        try {
            const res = await axios.delete(`${process.env.REACT_APP_API_URL}/api/post/${id}/`, config);

            dispatch({
                type: `${postConstants.REMOVE}_SUCCESS`,
                payload: res.data
            });
        } catch (err) {
            console.log(err);
            dispatch({
                type: `${postConstants.REMOVE}_FAILURE`
            })
        }
    }
};

export const detail = (id) => {
    return async (dispatch) => {

        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        };
    
        try {
            const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/post/${id}/`, config);

            dispatch({
                type: `${postConstants.GET_DETAIL}_SUCCESS`,
                payload: res.data
            });

            return res.data;

        } catch (err) {
            console.log(err);
            dispatch({
                type: `${postConstants.GET_DETAIL}_FAILURE`
            })
        }
    }
};

export const finish = (id) => {
    return async (dispatch) => {

        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `JWT ${window.localStorage.getItem('access')}`
            }
        };

        const body = JSON.stringify(
            {
                option : false
            }
        );
    
        try {
            await axios.patch(`${process.env.REACT_APP_API_URL}/api/post/${id}/`, body, config);

            dispatch({
                type: `${postConstants.FINISH}_SUCCESS`
            });

        } catch (err) {
            console.log(err);
            dispatch({
                type: `${postConstants.FINISH}_FAILURE`
            })
        }
    }
};

export const logoutPost = () => {
    return async (dispatch) => {
    
        try {
            dispatch({
                type: `${postConstants.LOGOUT_POST}_SUCCESS`
            });
        } catch (err) {
            console.log(err);
            dispatch({
                type: `${postConstants.LOGOUT_POST}_FAILURE`
            })
        }
    }
};

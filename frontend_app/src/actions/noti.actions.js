import axios from 'axios';
import { notiConstants } from './constants';

export const noti_read = () => {
    return async (dispatch) => {

        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        };

        try {
            const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/noti/`, config);

            if (res.data && res.data.length > 1) {
                if (res.data[0].id < res.data[1].id) {
                    res.data.sort((a, b) => b.id - a.id);
                }
            }

            dispatch({
                type: `${notiConstants.READ_NOTIS}_SUCCESS`,
                payload: res.data
            });

            return res.data;

        } catch (error) {
            console.log(error);
            dispatch({
                type: `${notiConstants.READ_NOTIS}_FAILURE`
            });
        }
    }
};

export const noti_detail = (id) => {
    return async (dispatch) => {

        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        };
    
        try {
            const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/noti/${id}/`, config);

            dispatch({
                type: `${notiConstants.GET_NOTI}_SUCCESS`,
                payload: res.data
            });

            return res.data;

        } catch (err) {
            console.log(err);
            dispatch({
                type: `${notiConstants.GET_NOTI}_FAILURE`
            })
        }
    }
};

export const logoutNoti = () => {
    return async (dispatch) => {
    
        try {
            dispatch({
                type: `${notiConstants.LOGOUT_NOTI}_SUCCESS`
            });
        } catch (err) {
            console.log(err);
            dispatch({
                type: `${notiConstants.LOGOUT_NOTI}_FAILURE`
            })
        }
    }
};

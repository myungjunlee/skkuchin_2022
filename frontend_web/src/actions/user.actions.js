import { userConstants } from './constants'
import { firestore } from 'firebase';

export const getRealtimeUser = (uid) => {

    return async (dispatch) => {

        dispatch({ type: `${userConstants.GET_REALTIME_USER}_REQUEST` });

        const db = firestore();

        const un_subscribe = db.collection("users")
        .onSnapshot((querySnapshot) => {
            const users = {
                uid_1: '',
                uid_2: ''
            };
            querySnapshot.forEach((doc) => {
                if(doc.data().uid === uid.uid_1){
                    users.uid_1 = doc.data();
                } else if(doc.data().uid === uid.uid_2){
                    users.uid_2 = doc.data();
                }
            })

            dispatch({ 
                type: `${userConstants.GET_REALTIME_USER}_SUCCESS`,
                payload: { users }
            });
        }, (error) => {
            console.log(error);
            dispatch({ 
                type: `${userConstants.GET_REALTIME_USER}_FAILURE`
            });
        })

        return un_subscribe;
    }
}

export const getRealtimeUsers = (uid) => {

    return async (dispatch) => {

        dispatch({ type: `${userConstants.GET_REALTIME_USERS}_REQUEST` });

        const db = firestore();

        const un_subscribe = db.collection("users")
        .onSnapshot((querySnapshot) => {
            const users = [];
            querySnapshot.forEach((doc) => {
                if(doc.data().uid != uid){
                    users.push(doc.data());
                }
            })

            dispatch({ 
                type: `${userConstants.GET_REALTIME_USERS}_SUCCESS`,
                payload: { users }
            });
        }, (error) => {
            console.log(error);
            dispatch({ 
                type: `${userConstants.GET_REALTIME_USERS}_FAILURE`
            });
        })

        return un_subscribe;
    }
}

export const getIDCheck = () => {

    return async (dispatch) => {

        dispatch({ type: `${userConstants.GET_ID_CHECK}_REQUEST` });

        const db = firestore();

        db.collection("users")
        .get()
        .then((querySnapshot) => {
            const users = [];
            querySnapshot.forEach((doc) => {
                users.push(doc.data());
            })

            dispatch({ 
                type: `${userConstants.GET_ID_CHECK}_SUCCESS`,
                payload: { users }
            });
        }, (error) => {
            console.log(error);
        })

    }

}

export const updateMessage = (msgObj) => {
    return async dispatch => {

        const db = firestore();

        try {
            db.collection('conversations')
            .add({
                ...msgObj,
                isView: false,
                createdAt: new Date().getTime()
            })
        } catch (error) {
            console.log(error)
        }
    }
}

export const getRealtimeConversations = (user) => {
    return async dispatch => {

        const db = firestore();

        const unsubscribe = db.collection('conversations')
        .orderBy('createdAt', 'asc')
        .onSnapshot((querySnapshot) => {

            const conversations = [];

            querySnapshot.forEach(doc => {
                
                if (
                    (doc.data().user_uid_1 === user.uid_1 && doc.data().user_uid_2 === user.uid_2)
                    &&
                    (doc.data().exit_uid_1 !== user.uid_1)
                ) {

                    conversations.push(doc.data());

                } 
                else if (
                    (doc.data().user_uid_1 === user.uid_2 && doc.data().user_uid_2 === user.uid_1)
                    &&
                    (doc.data().exit_uid_2 !== user.uid_1)
                ) {

                    if (!doc.data().isView) {
                        db.collection("conversations").doc(doc.id).update({
                            isView: true
                        });
                    }

                    conversations.push(doc.data());

                }
            });

            dispatch({
                type: `${userConstants.GET_REALTIME_MESSAGES}_SUCCESS`,
                payload: { conversations }
            });

        }, (error) => {
            console.log(error);
            dispatch({
                type: `${userConstants.GET_REALTIME_MESSAGES}_FAILURE`
            })
        });

        return unsubscribe;
    }
}

export const getRealtimeLists = (uid) => {
    return async dispatch => {

        const db = firestore();

        const unsubscribe = db.collection('conversations')
        .orderBy('createdAt', 'desc')
        .onSnapshot((querySnapshot) => {

            const conversations = [];
            const duplicate = [];

            querySnapshot.forEach(doc => {
                
                if (doc.data().user_uid_1 === uid) {
                    if (!duplicate.includes(doc.data().user_uid_2)){
                        
                        conversations.push(doc.data());
                        duplicate.push(doc.data().user_uid_2);
                    }
                } else if (doc.data().user_uid_2 === uid) {
                    if (!duplicate.includes(doc.data().user_uid_1)){
                        
                        conversations.push(doc.data());
                        duplicate.push(doc.data().user_uid_1);
                    }
                }

                if (conversations && !doc.data().isView && (doc.data().user_uid_2 === uid)) {
                    conversations.map(con => {
                        if (
                            (con.user_uid_1 === doc.data().user_uid_1 && con.user_uid_2 === doc.data().user_uid_2)
                            ||
                            (con.user_uid_1 === doc.data().user_uid_2 && con.user_uid_2 === doc.data().user_uid_1)
                            ) {
                                if ('unread' in con){
                                    con.unread++;
                                } else {
                                    con.unread = 1;
                                }
                            }
                    });
                }
            });

            dispatch({
                type: `${userConstants.GET_REALTIME_LISTS}_SUCCESS`,
                payload: { conversations }
            });

        }, (error) => {
            console.log(error);
            dispatch({
                type: `${userConstants.GET_REALTIME_LISTS}_FAILURE`
            })
        });
        
        return unsubscribe;
    }
}

export const getConversations = () => {

    return async (dispatch) => {

        const db = firestore();

        db.collection("conversations")
        .orderBy('createdAt', 'desc')
        .get()
        .then((querySnapshot) => {

            const conversations = [];
            const duplicate = [];

            querySnapshot.forEach((doc) => {

                if (
                !duplicate.includes(doc.data().user_uid_1+doc.data().user_uid_2)
                &&
                !duplicate.includes(doc.data().user_uid_2+doc.data().user_uid_1)
                ){
                    
                    conversations.push(doc.data());
                    duplicate.push(doc.data().user_uid_1+doc.data().user_uid_2);
                }
            })

            dispatch({ 
                type: `${userConstants.GET_CONVERSATIONS}_SUCCESS`,
                payload: { conversations }
            });
        }, (error) => {
            console.log(error);
        })

    }

}

export const exitChatRoom = (user) => {
    return async dispatch => {

        const db = firestore();

        db.collection("conversations")
        .get()
        .then((querySnapshot) => {

            querySnapshot.forEach((doc) => {

                if (
                    doc.data().user_uid_1 === user.uid_1 && doc.data().user_uid_2 === user.uid_2
                    &&
                    doc.data().exit_uid_1 !== user.uid_1
                    ) 
                {

                    db.collection("conversations").doc(doc.id).update({
                        exit_uid_1: user.uid_1
                    });

                } else if (
                    doc.data().user_uid_1 == user.uid_2 && doc.data().user_uid_2 == user.uid_1
                    &&
                    doc.data().exit_uid_2 !== user.uid_1
                    ) 
                {

                    db.collection("conversations").doc(doc.id).update({
                        exit_uid_2: user.uid_1
                    });
                }
            });

            dispatch({
                type: `${userConstants.EXIT_CHAT}_SUCCESS`
            })
        })
        .catch((error) => {
            console.log(error);
            dispatch({
                type: `${userConstants.EXIT_CHAT}_FAILURE`
            })
        });
    }
}

export const getPostUser = (uid) => {

    return async (dispatch) => {

        const users = {
            user: ''
        }
        const db = firestore();
        const doc_block = db.collection("users").doc(uid)

        doc_block
        .get()
        .then((doc) => {
            users.user = doc.data();

            dispatch({ 
                type: `${userConstants.GET_POST_USER}_SUCCESS`,
                payload: { users }
            });

        }).catch((err) => {
            console.log(err);
            dispatch({
                type: `${userConstants.GET_POST_USER}_FAILURE`
            })
        });
    }
}

export const unBlockUser = (user) => {
    return async dispatch => {

        const db = firestore();
        const doc_unblock = db.collection("users").doc(user.uid_1)

        doc_unblock
        .get()
        .then((doc) => {
            const arr = doc.data().block_uid;
            const filtered = arr.filter((e) => e !== user.uid_2);

            doc_unblock.update({
                block_uid: filtered
            });

            dispatch({
                type: `${userConstants.USER_UNBLOCK}_SUCCESS`
            })

        }).catch((err) => {
            console.log(err);
            dispatch({
                type: `${userConstants.USER_UNBLOCK}_FAILURE`
            })
        });
    }
}

export const blockUser = (user) => {
    return async dispatch => {

        const db = firestore();
        const doc_block = db.collection("users").doc(user.uid_1)

        doc_block
        .get()
        .then((doc) => {
            const arr = doc.data().block_uid;
            arr.push(user.uid_2)

            doc_block.update({
                block_uid: arr
            });

            dispatch({
                type: `${userConstants.USER_BLOCK}_SUCCESS`
            })

        }).catch((err) => {
            console.log(err);
            dispatch({
                type: `${userConstants.USER_BLOCK}_FAILURE`
            })
        });
    }
}

export const unBlockPost = (user) => {
    return async dispatch => {

        const db = firestore().collection("users");

        db.doc(user.uid_2)
        .get()
        .then((doc) => {
            const arr2 = doc.data().post_blocking;
            const filtered2 = arr2.filter((e) => e !== user.uid_1);

            db.doc(user.uid_2).update({
                post_blocking: filtered2
            });
        });

        db.doc(user.uid_1)
        .get()
        .then((doc) => {
            const arr = doc.data().post_uid;
            const filtered = arr.filter((e) => e !== user.uid_2);

            db.doc(user.uid_1).update({
                post_uid: filtered
            })
            .then(() => {
                dispatch({
                    type: `${userConstants.USER_UNBLOCK}_SUCCESS`
                })
                dispatch(getPostUser(user.uid_1));
            })
            .catch((err) => {
                console.log(err);
                dispatch({
                    type: `${userConstants.USER_UNBLOCK}_FAILURE`
                })
            })
        });
    }
}

export const blockPost = (user) => {
    return async dispatch => {

        const db = firestore().collection("users");

        db.doc(user.uid_2)
        .get()
        .then((doc) => {
            const arr2 = doc.data().post_blocking;
            arr2.push(user.uid_1);

            db.doc(user.uid_2).update({
                post_blocking: arr2
            });
        });

        db.doc(user.uid_1)
        .get()
        .then((doc) => {
            const arr = doc.data().post_uid;
            arr.push(user.uid_2);

            db.doc(user.uid_1).update({
                post_uid: arr
            })
            .then(() => {
                dispatch({
                    type: `${userConstants.USER_BLOCK}_SUCCESS`
                })
                dispatch(getPostUser(user.uid_1));
            })
            .catch((err) => {
                console.log(err);
                dispatch({
                    type: `${userConstants.USER_BLOCK}_FAILURE`
                })
            })
        });
    }
}

export const reportPost = (content, uid_1, id) => {
    return async dispatch => {

        const db = firestore();

        db.collection('post_reports')
        .add({
            reason: content,
            reporter: uid_1,
            post_id: id,
            createdAt: new Date().getTime()
        })
        .then(() => {
            alert('신고가 접수되었습니다.');
        })
        .catch((err) => {
            console.log(err);
        })
    }
}

export const reportChat = (user) => {
    return async dispatch => {

        const db = firestore();

        db.collection('chat_reports')
        .add({
            reporter: user.uid_1,
            user_uid_2: user.uid_2,
            createdAt: new Date().getTime()
        })
        .then(() => {
            alert('신고가 접수되었습니다.');
        })
        .catch((err) => {
            console.log(err);
        })
    }
}

export const logoutChat = () => {
    return async dispatch => {

        try {
            dispatch({
                type: `${userConstants.LOGOUT_CHAT}_SUCCESS`
            })
        } catch (error) {
            console.log(error)
            dispatch({
                type: `${userConstants.LOGOUT_CHAT}_FAILURE`
            })
        }

    }
}

import { userConstants } from './constants'

let unsubscribe = null;
let un_subscribe = null;

export const getRealtimeUser = (uid) => {

    return async (dispatch) => {

        dispatch({ type: `${userConstants.GET_REALTIME_USER}_REQUEST` });

        const collection = "users";
        const filters = [];
        const includeMetadata = false;

        const users = {
            uid_1: '',
            uid_2: ''
        };

        window.FirebasePlugin.listenToFirestoreCollection(function(event){
            switch(event.eventType){
                case "id":
                    unsubscribe = event.id;
                    break;
                case "change":
                    if(event.documents){

                        for (const documentId in event.documents) {
                            if (
                                event.documents[documentId].type === "new"
                                ||
                                event.documents[documentId].type === "modified"
                                ) 
                            {
                                if(documentId === uid.uid_1){
                                    users.uid_1 = event.documents[documentId].snapshot;
                                } else if(documentId === uid.uid_2){
                                    users.uid_2 = event.documents[documentId].snapshot;
                                }
                            }
                            else if (event.documents[documentId].type === "removed") {
                                if(documentId === uid.uid_1){
                                    users.uid_1 = '';
                                } else if(documentId === uid.uid_2){
                                    users.uid_2 = '';
                                }
                            }
                        }
        
                        dispatch({ 
                            type: `${userConstants.GET_REALTIME_USER}_SUCCESS`,
                            payload: { users }
                        });
                    }
                    break;
            }
        }, function(error){
            console.log(error);
            dispatch({ 
                type: `${userConstants.GET_REALTIME_USER}_FAILURE`
            });
        }, collection, filters, includeMetadata);
    }
}

export const getRealtimeUsers = (uid) => {

    return async (dispatch) => {

        dispatch({ type: `${userConstants.GET_REALTIME_USERS}_REQUEST` });

        const collection = "users";
        const filters = [];
        const includeMetadata = false;

        const users = [];

        window.FirebasePlugin.listenToFirestoreCollection(function(event){
            switch(event.eventType){
                case "id":
                    unsubscribe = event.id;
                    break;
                case "change":
                    if(event.documents){
                        let index;
                        for (const documentId in event.documents) {
                            const doc = event.documents[documentId].snapshot;

                            if (documentId != uid) {
                                if (event.documents[documentId].type === "new") {
                                    users.push(doc);
                                } else if (event.documents[documentId].type === "modified") {
                                    index = 0;
                                    users.forEach(user => {
                                        if (user.uid === documentId) {
                                            users[index] = doc;
                                        }
                                        index++;
                                    });
                                } else if (event.documents[documentId].type === "removed") {
                                    index = 0;
                                    users.forEach(user => {
                                        if (user.uid === documentId) {
                                            users.splice(index, 1);
                                        }
                                        index++;
                                    });
                                }
                            }
                        }

                        dispatch({ 
                            type: `${userConstants.GET_REALTIME_USERS}_SUCCESS`,
                            payload: { users }
                        });
                    }
                    break;
            }
        }, function(error){
            console.log(error);
            dispatch({ 
                type: `${userConstants.GET_REALTIME_USERS}_FAILURE`
            });
        }, collection, filters, includeMetadata);
    }
}

export const getIDCheck = () => {

    return async (dispatch) => {

        dispatch({ type: `${userConstants.GET_ID_CHECK}_REQUEST` });

        const collection = "users";
        const filters = [];
        const users = [];

        window.FirebasePlugin.fetchFirestoreCollection(collection, filters, function(documents){
            for (const documentId in documents) {
                users.push(documents[documentId]);
            }

            dispatch({ 
                type: `${userConstants.GET_ID_CHECK}_SUCCESS`,
                payload: { users }
            });

        }, function(error){
            console.log(error);
            dispatch({ 
                type: `${userConstants.GET_ID_CHECK}_FAILURE`
            });
        });
    }
}

export const updateMessage = (msgObj) => {
    return async dispatch => {

        try {
            const document = {
                ...msgObj,
                isView: false,
                createdAt: new Date().getTime()
            };
            
            const collection = "conversations";
    
            window.FirebasePlugin.addDocumentToFirestoreCollection(document, collection);
        } catch (error) {
            console.log(error);
        }
    }
}

export const getRealtimeConversations = (user) => {
    return async dispatch => {
        const collection = "conversations";
        const filters = [];
        const includeMetadata = false;

        const doc_array = [];

        window.FirebasePlugin.listenToFirestoreCollection(function(event){
            switch(event.eventType){
                case "id":
                    un_subscribe = event.id;
                    break;
                case "change":
                    if(event.documents){
                        let index = 0;

                        for (const documentId in event.documents) {
                            if (event.documents[documentId].type === "new") {
                                doc_array.push([documentId, event.documents[documentId]]);
                            } else if (event.documents[documentId].type === "modified") {
                                doc_array.forEach(doc_each => {
                                    if (doc_each[0] === documentId) {
                                        doc_array[index] = [documentId, event.documents[documentId]];
                                    }
                                    index++;
                                });
                            }
                        }

                        if (doc_array.length > 1) {
                            doc_array.sort((a, b) => a[1].snapshot.createdAt - b[1].snapshot.createdAt);
                        }

                        const conversations = [];
                        doc_array.forEach(doc_each => {

                            const doc = doc_each[1].snapshot;

                            if (
                                (doc.user_uid_1 === user.uid_1 && doc.user_uid_2 === user.uid_2)
                                &&
                                (doc.exit_uid_1 !== user.uid_1)
                            ) {
        
                                conversations.push(doc);
        
                            } 
                            else if (
                                (doc.user_uid_1 === user.uid_2 && doc.user_uid_2 === user.uid_1)
                                &&
                                (doc.exit_uid_2 !== user.uid_1)
                            ) {
                                if (!doc.isView) {

                                    const documentFragment = {
                                        "isView" : true
                                    };
    
                                    window.FirebasePlugin
                                    .updateDocumentInFirestoreCollection(doc_each[0], documentFragment, collection);
                                }

                                conversations.push(doc);
                            }
                        });
                        dispatch({ 
                            type: `${userConstants.GET_REALTIME_MESSAGES}_SUCCESS`,
                            payload: { conversations }
                        });
                    }
                    break;
                }
        }, function(error){
            console.log(error);
            dispatch({
                type: `${userConstants.GET_REALTIME_MESSAGES}_FAILURE`
            })
        }, collection, filters, includeMetadata);
    }
}

export const getRealtimeLists = (uid) => {
    return async dispatch => {

        dispatch({ type: `${userConstants.GET_REALTIME_LISTS}_REQUEST` });

        const collection = "conversations";
        const filters = [];
        const includeMetadata = false;

        const doc_array = [];

        window.FirebasePlugin.listenToFirestoreCollection(function(event){
            switch(event.eventType){
                case "id":
                    un_subscribe = event.id;
                    break;
                case "change":
                    if(event.documents){
                        let index = 0;

                        for (const documentId in event.documents) {
                            if (event.documents[documentId].type === "new") {
                                doc_array.push([documentId, event.documents[documentId]]);
                            } else if (event.documents[documentId].type === "modified") {
                                doc_array.forEach(doc_each => {
                                    if (doc_each[0] === documentId) {
                                        doc_array[index] = [documentId, event.documents[documentId]];
                                    }
                                    index++;
                                });
                            }
                        }

                        if (doc_array.length > 1) {
                            doc_array.sort((a, b) => b[1].snapshot.createdAt - a[1].snapshot.createdAt);
                        }
                            
                        const conversations = [];
                        const duplicate = [];

                        doc_array.forEach(doc_each => {

                            const doc = doc_each[1].snapshot;

                            if (doc.user_uid_1 === uid) {
                                if (!duplicate.includes(doc.user_uid_2)){
                                    delete doc['unread'];
                                    conversations.push(doc);
                                    duplicate.push(doc.user_uid_2);
                                }
                            } else if (doc.user_uid_2 === uid) {
                                if (!duplicate.includes(doc.user_uid_1)){
                                    delete doc['unread'];
                                    conversations.push(doc);
                                    duplicate.push(doc.user_uid_1);
                                }
                            }

                            if (conversations && !doc.isView && (doc.user_uid_2 === uid)) {
                                conversations.map(con => {
                                    if (
                                        (con.user_uid_1 === doc.user_uid_1 && con.user_uid_2 === doc.user_uid_2)
                                        ||
                                        (con.user_uid_1 === doc.user_uid_2 && con.user_uid_2 === doc.user_uid_1)
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
                    }
                    break;
                }
            }, function(error){
                console.log(error);
                dispatch({
                    type: `${userConstants.GET_REALTIME_LISTS}_FAILURE`
                })
            }, collection, filters, includeMetadata);
    }
}

export const getConversations = () => {

    return async (dispatch) => {

        const filters = [];
        
        window.FirebasePlugin.fetchFirestoreCollection("conversations", filters, function(documents){

            const conversations = [];
            const duplicate = [];

            for (const documentId in documents) {
                if (
                    !duplicate.includes(documents[documentId].user_uid_1+documents[documentId].user_uid_2)
                    &&
                    !duplicate.includes(documents[documentId].user_uid_2+documents[documentId].user_uid_1)
                    ){
                        
                        conversations.push(documents[documentId]);
                        duplicate.push(documents[documentId].user_uid_1+documents[documentId].user_uid_2);
                    }
            }

            dispatch({ 
                type: `${userConstants.GET_CONVERSATIONS}_SUCCESS`,
                payload: { conversations }
            });

        }, function(error){
            dispatch({ 
                type: `${userConstants.GET_CONVERSATIONS}_FAILURE`
            });
            console.error("Error fetching collection: "+error);
        });
    }
}

export const exitChatRoom = (user) => {
    return async dispatch => {
        const collection = "conversations";
        const filters = [];

        window.FirebasePlugin.fetchFirestoreCollection(collection, filters, function(documents){
            for (const documentId in documents) {
                const doc = documents[documentId];

                if (
                    doc.user_uid_1 === user.uid_1 && doc.user_uid_2 === user.uid_2
                    &&
                    doc.exit_uid_1 !== user.uid_1   
                    ) 
                {

                    const documentFragment = {
                        "exit_uid_1": user.uid_1
                    };
                    window.FirebasePlugin.updateDocumentInFirestoreCollection(documentId, documentFragment, collection, function(){
                        
                    }, function(error){
                        console.log(error);
                    });

                } else if (
                    doc.user_uid_1 === user.uid_2 && doc.user_uid_2 === user.uid_1
                    &&
                    doc.exit_uid_2 !== user.uid_1
                    ) 
                {

                    const documentFragment = {
                        "exit_uid_2": user.uid_1
                    };
                    window.FirebasePlugin.updateDocumentInFirestoreCollection(documentId, documentFragment, collection, function(){
                        
                    }, function(error){
                        console.log(error);
                    });
                }
            }

            dispatch({
                type: `${userConstants.EXIT_CHAT}_SUCCESS`
            })

        }, function(error){
            console.log(error);
            dispatch({
                type: `${userConstants.EXIT_CHAT}_FAILURE`
            })
        });
    }
}

export const getPostUser = (uid) => {

    return async (dispatch) => {

        const documentId = uid;
        const collection = "users";
        const users = {
            user: ''
        }

        window.FirebasePlugin.fetchDocumentInFirestoreCollection(documentId, collection, function(doc){
            users.user = doc;
            dispatch({ 
                type: `${userConstants.GET_POST_USER}_SUCCESS`,
                payload: { users }
            });

        }, function(error){
            console.log(error);
            dispatch({ 
                type: `${userConstants.GET_POST_USER}_FAILURE`
            });
        });
    }
}

export const unBlockUser = (user) => {
    return async dispatch => {

        const documentId = user.uid_1;
        const collection = "users";

        window.FirebasePlugin.fetchDocumentInFirestoreCollection(documentId, collection, function(doc){
            const arr = doc.block_uid;
            const filtered = arr.filter((e) => e !== user.uid_2);

            const documentFragment = {
                "block_uid": filtered
            };

            window.FirebasePlugin.updateDocumentInFirestoreCollection(documentId, documentFragment, collection);

            dispatch({
                type: `${userConstants.USER_UNBLOCK}_SUCCESS`
            })

        }, function(error){
            console.log(error);
            dispatch({
                type: `${userConstants.USER_UNBLOCK}_FAILURE`
            })
        });

    }
}

export const blockUser = (user) => {
    return async dispatch => {

        const documentId = user.uid_1;
        const collection = "users";

        window.FirebasePlugin.fetchDocumentInFirestoreCollection(documentId, collection, function(doc){
            const arr = doc.block_uid;
            arr.push(user.uid_2);

            const documentFragment = {
                "block_uid": arr
            };

            window.FirebasePlugin.updateDocumentInFirestoreCollection(documentId, documentFragment, collection);

            dispatch({
                type: `${userConstants.USER_BLOCK}_SUCCESS`
            })

        }, function(error){
            console.log(error);
            dispatch({
                type: `${userConstants.USER_BLOCK}_FAILURE`
            })
        });
    }
}

export const unBlockPost = (user) => {
    return async dispatch => {

        const documentId = user.uid_1;
        const collection = "users";

        window.FirebasePlugin.fetchDocumentInFirestoreCollection(user.uid_2, collection, (doc) => {
            const arr2 = doc.post_blocking;
            const filtered2 = arr2.filter((e) => e !== documentId);

            const documentFragment = {
                "post_blocking": filtered2
            };

            window.FirebasePlugin.updateDocumentInFirestoreCollection(user.uid_2, documentFragment, collection);
        });

        window.FirebasePlugin.fetchDocumentInFirestoreCollection(documentId, collection, function(doc){
            const arr = doc.post_uid;
            const filtered = arr.filter((e) => e !== user.uid_2);

            const documentFragment = {
                "post_uid": filtered
            };

            window.FirebasePlugin.updateDocumentInFirestoreCollection(documentId, documentFragment, collection, () => {
                dispatch({
                    type: `${userConstants.USER_UNBLOCK}_SUCCESS`
                })
                dispatch(getPostUser(user.uid_1));
            },(err) => {
                console.log(err);  
            });

        }, (err) => {
            console.log(err);
        });

    }
}

export const blockPost = (user) => {
    return async dispatch => {

        const documentId = user.uid_1;
        const collection = "users";

        window.FirebasePlugin.fetchDocumentInFirestoreCollection(user.uid_2, collection, (doc) => {
            const arr2 = doc.post_blocking;
            arr2.push(documentId);

            const documentFragment = {
                "post_blocking": arr2
            };

            window.FirebasePlugin.updateDocumentInFirestoreCollection(user.uid_2, documentFragment, collection);
        });

        window.FirebasePlugin.fetchDocumentInFirestoreCollection(documentId, collection, function(doc){
            const arr = doc.post_uid;
            arr.push(user.uid_2);

            const documentFragment = {
                "post_uid": arr
            };

            window.FirebasePlugin.updateDocumentInFirestoreCollection(documentId, documentFragment, collection, () => {
                dispatch({
                    type: `${userConstants.USER_BLOCK}_SUCCESS`
                })
                dispatch(getPostUser(user.uid_1));
            }, (err) => {
                console.log(err);
            });
        }, (err) => {
            console.log(err);
        });
    }
}

export const reportPost = (content, uid_1, id) => {
    return async dispatch => {

        const document = {
            "reason": content,
            "reporter": uid_1,
            "post_id": id,
            "createdAt": new Date().getTime()
        };
        
        const collection = "post_reports";

        window.FirebasePlugin.addDocumentToFirestoreCollection(document, collection, () => {
            alert('신고가 접수되었습니다.');
        }, (err) => {
            console.log(err);
        });
    }
}

export const reportChat = (user) => {
    return async dispatch => {

        const document = {
            "reporter": user.uid_1,
            "user_uid_2": user.uid_2,
            "createdAt": new Date().getTime()
        };
        
        const collection = "chat_reports";

        window.FirebasePlugin.addDocumentToFirestoreCollection(document, collection, () => {
            alert('신고가 접수되었습니다.');
        }, (err) => {
            console.log(err);
        });

    }
}

export const logoutChat = () => {
    return async dispatch => {

        try {
            if (unsubscribe) {
                window.FirebasePlugin.removeFirestoreListener(function(){
                    
                }, function(error){
                    console.error("Error removing listener: "+error);
                }, unsubscribe);
            }

            if (un_subscribe) {
                window.FirebasePlugin.removeFirestoreListener(function(){
                    
                }, function(error){
                    console.error("Error removing listener: "+error);
                }, un_subscribe);      
            }

            unsubscribe = null;
            un_subscribe = null;

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

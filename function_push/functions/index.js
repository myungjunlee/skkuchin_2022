const admin = require("firebase-admin");
const functions = require("firebase-functions");

admin.initializeApp({
    credential: admin.credential.applicationDefault()
});

const db = admin.firestore();
const messaging = admin.messaging();

exports.messagePush = functions.region('asia-northeast3').firestore
.document('conversations/{conversationId}')
.onCreate(async (snap, context) => {
    // Get an object representing the document
    const newValue = snap.data();

    const receiver = db.doc(`users/${newValue.user_uid_2}`);
    const sender = db.doc(`users/${newValue.user_uid_1}`);

    await receiver.get()
    .then((doc_rec) => {
        const token = doc_rec.data().token;
        if (token && token !== 'deny') {
            // This registration token comes from the client FCM SDKs.
            const registrationToken = token;
            sender.get()
            .then((doc_sen) => {
                const message = {
                    notification: {
                        title: doc_sen.data().name,
                        body: newValue.message,
                    },
                    apns: {
                        payload: {
                            aps: {
                                sound: 'default',
                            }
                        },
                    },
                    android: {
                        notification: {
                            color: "#ffffff",
                            sound: "default",
                        }
                    },
                    token: registrationToken
                };
                // Send a message to the device corresponding to the provided
                // registration token.
                messaging.send(message)
                .then((response) => {
                    // Response is a message ID string.
                    console.log('Successfully sent message:', response);
                })
                .catch((error) => {
                    console.log('Error sending message:', error);
                });
            })
            .catch((err) => {
                console.log(err);
            })
        }
        return 'sent message';
    })
    .catch((err) => {
        console.log(err);
    })
});

exports.signinPush = functions.region('asia-northeast3').firestore
.document('checks/{checkId}')
.onCreate(async (snap, context) => {
    // Get an object representing the document
    const newValue = snap.data();
    const receiver = db.doc('users/8jjAEWEcO3XVPtibkRWSRfti2xa2');

    await receiver.get()
    .then((doc_rec) => {
        const token = doc_rec.data().token;
        if (token && token !== 'deny') {
            const registrationToken = token;
            const message = {
                notification: {
                    title: '계정 활성화 요청',
                    body: newValue.username,
                },
                apns: {
                    payload: {
                        aps: {
                            sound: 'default',
                        }
                    },
                },
                android: {
                    notification: {
                        color: "#ffffff",
                        sound: "default",
                    }
                },
                token: registrationToken
            };
            // Send a message to the device corresponding to the provided
            // registration token.
            messaging.send(message)
            .then((response) => {
                // Response is a message ID string.
                console.log('Successfully sent message:', response);
            })
            .catch((error) => {
                console.log('Error sending message:', error);
            });
        }
        return 0;
    })
    .catch((error) => {
        console.log(error);
    });
});

exports.activePush = functions.region('asia-northeast3').https.onRequest(async (req, res) => {
    // Grab the text parameter.
    const uid = req.query.text;

    const receiver = db.doc(`users/${uid}`);

    await receiver.get()
    .then((doc_rec) => {
        const token = doc_rec.data().token;
        if (token && token !== 'deny') {
            // This registration token comes from the client FCM SDKs.
            const registrationToken = token;

            const message = {
                notification: {
                    title: '환영합니다',
                    body: '계정이 활성화되었습니다',
                },
                apns: {
                    payload: {
                        aps: {
                            sound: 'default',
                        }
                    },
                },
                android: {
                    notification: {
                        color: "#ffffff",
                        sound: "default",
                    }
                },
                token: registrationToken
            };
            // Send a message to the device corresponding to the provided
            // registration token.
            messaging.send(message)
            .then((response) => {
                // Response is a message ID string.
                res.json({result: '전송 완료!'});
                console.log('Successfully sent message:', response);
            })
            .catch((error) => {
                console.log('Error sending message:', error);
            });
        }
        return 0;
    })
    .catch((err) => {
        console.log(err);
    })
});
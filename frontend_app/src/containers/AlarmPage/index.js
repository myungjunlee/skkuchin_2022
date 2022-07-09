import './style.css';
import { useSelector } from 'react-redux';
import { Redirect, useHistory } from 'react-router-dom';
import icon_back_arrow from '../../image/drawable-xxxhdpi/icon_back_arrow.png';
import { useEffect, useRef, useState } from 'react';

const AlarmPage = (props) => {

    const history = useHistory();
    const auth = useSelector(state => state.auth);

    const alarmRef = useRef(null);

    const goBack = () => {
        history.goBack();
    };

    useEffect(() => {
        document.documentElement.scrollTop = 0;

        if (auth.user && alarmRef.current) {
            window.FirebasePlugin.hasPermission(function(hasPermission){
                if (!hasPermission) {
                    alarmRef.current.checked = false;
                    const documentFragment = {
                        'token': 'deny'
                    };
                    window.FirebasePlugin.updateDocumentInFirestoreCollection(auth.user.uid, documentFragment, "users");
                } else {
                    window.FirebasePlugin.fetchDocumentInFirestoreCollection(auth.user.uid, "users", function(document){
                        if (document.token === 'deny') {
                            alarmRef.current.checked = false;
                        } else if (document.token !== 'deny') {
                            alarmRef.current.checked = true;
                        }
                    }, function(error){
                        console.error("Error fetching document: "+error);
                    });
                }
            });
        }
    }, [])

    const AlarmSwitch = () => {
        if (alarmRef.current.checked) {
            window.FirebasePlugin.hasPermission(function(hasPermission){
                if (!hasPermission) {
                    alarmRef.current.checked = false;
                    alert('알림 허용을 원하시는 경우 [설정 > 알림 > 스꾸친 > 알림 허용] 해주시기 바랍니다.');
                }
                window.FirebasePlugin.getToken(function(fcmToken) {
                    const documentFragment = {
                        'token': fcmToken
                    };
                    window.FirebasePlugin.updateDocumentInFirestoreCollection(auth.user.uid, documentFragment, "users");
                }, function(error) {
                    console.error(error);
                });
            });
        } else {
            const documentFragment = {
                'token': 'deny'
            };
            window.FirebasePlugin.updateDocumentInFirestoreCollection(auth.user.uid, documentFragment, "users", () => {
                window.FirebasePlugin.unregister();
            });
        }
    }

    // 로그인 안 했을 시 로그인 페이지로
    if (!auth.isAuthenticated) {
        return <Redirect to = '/login' />
    }

    return (
        <div className="alarm_wrapper">
            <div className="alarm_top">
                <div className="alarm_top2">
                    <img src={icon_back_arrow} style={{marginTop: "2.12px", width: "15px", height: "14px", paddingRight: "15px", cursor:"pointer"}} onClick={goBack} />
                    <h4>알림설정</h4>
                </div>
            </div>
            <div className="alarm_item">
                <div className="alarm_content">
                    공지/채팅 알림을 켜고 끌 수 있습니다.
                </div>
                <div className="alarm_right_content">
                    <input className='alarm_input' type="checkbox" id="switch" ref={alarmRef} onChange={AlarmSwitch} /><label for="switch" className='alarm_switch'>Toggle</label>
                </div>
            </div>
        </div>
    );
}

export default AlarmPage;
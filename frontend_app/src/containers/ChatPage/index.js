import React, { useEffect, useState, useRef } from 'react';
import './style.css';
import { useDispatch, useSelector } from 'react-redux';
import { detail, getRealtimeUser, updateMessage, getRealtimeConversations, exitChatRoom, blockUser, unBlockUser, reportChat, logoutChat, logoutPost } from '../../actions';
import { Redirect } from 'react-router';
import { useHistory } from 'react-router';
import icon_back_arrow from '../../image/drawable-xxxhdpi/icon_back_arrow.png'
import icon_dotdotdot from '../../image/drawable-xxxhdpi/icon_dotdotdot.png'
import chat_enheng from '../../image/drawable-xxxhdpi/chat_enheng.png'
import chat_send_button from '../../image/drawable-xxxhdpi/chat_send_button.png'
import chat_profile from '../../image/drawable-xxxhdpi/chat_profile.png'
import Popup from '../../components/Popup';
import ProfilePage from '../ProfilePage';

const ChatPage = (props) => {

    const history = useHistory();
    const dispatch = useDispatch();
    const auth = useSelector(state => state.auth);
    const user = useSelector(state => state.user);
    const [message, setMessage] = useState('');
    const [exitRoom, setExitRoom] = useState(false);
    const [blocked, setBlocked] = useState(false);
    const [blocking, setBlocking] = useState(false);
    const user_uid = props.location.state.uid;
    const user_name = props.location.state.name;
    const user_major = props.location.state.major;
    const user_student_id = props.location.state.student_id;
    const user_image = props.location.state.image;
    const user_mbti = props.location.state.mbti;
    const post_id = props.location.state.post_id;
    const post = useSelector(state => state.post.data);

    // 차단 팝업
    const [blockPopup, setBlockPopup] = useState(false);
    // 차단 해제 팝업
    const [unblockPopup, setUnblockPopup] = useState(false);
    // 나가기 팝업
    const [exitPopup, setExitPopup] = useState(false);
    // 프로필 팝업
    const [profilePopup, setProfilePopup] = useState(false);
    // 신고 팝업
    const [reportPopup, setReportPopup] = useState(false);

    const messageRef = useRef(null);
    const turnBtn = useRef(null);

    const tx = messageRef.current;

    let time_before = null;

    useEffect(() => {

        if (auth.user && user_uid) {
            dispatch(getRealtimeUser({ uid_1: auth.user.uid, uid_2: user_uid }));
            dispatch(getRealtimeConversations({ uid_1: auth.user.uid, uid_2: user_uid }));
        }

        dispatch(detail(post_id));

    }, [])

    useEffect(() => {
        OnInput();
    }, [message])

    // 스크롤 맨 아래로 향하기
    useEffect(() => {
        if (document.documentElement.scrollHeight !== 0 && document.getElementById('chatpage_messageIn') !== document.activeElement) {
            document.documentElement.scrollTop = document.documentElement.scrollHeight;
        }
    }, [user.conversations])

    // 메세지 창 자동 크기 조절 기능
    const OnInput = () => {
        if (tx) {
            tx.style.overflowY = "hidden";
            tx.style.height = "auto";
            tx.style.height = (tx.scrollHeight) + "px";
        }
    }

    // componentWillUnmount
    useEffect(() => {
        return () => {
            // cleanup
            dispatch(logoutChat());
            dispatch(logoutPost());
        }
    }, [])

    const submitMessage = (e) => {
        const msgObj = {
            user_uid_1: auth.user.uid,
            user_uid_2: user_uid,
            message,
            post_id: post_id,
            exit_uid_1: null,
            exit_uid_2: null
        }

        if (message !== "") {
            dispatch(updateMessage(msgObj))
                .then(() => {
                    setMessage('');
                })
        }
    }

    const messageTime = (con) => {
        const date = new Date(con.createdAt)

        let full_date = '';

        if (date.getHours() === 0) {
            full_date = '오전 12:';
        } else if (date.getHours() < 12) {
            full_date = `오전 ${date.getHours()}:`;
        } else if (date.getHours() === 12) {
            full_date = '오후 12:';
        } else {
            full_date = `오후 ${date.getHours() - 12}:`;
        }

        if (date.getMinutes() < 10) {
            full_date += `0${date.getMinutes()}`;
        } else {
            full_date += `${date.getMinutes()}`;
        }

        return full_date;
    }

    const getContent = (con) => {

        const timestamp = con.createdAt;
        const current = new Date(timestamp);

        let date = '';
        let message_time = '';

        if (time_before) {

            const minute_before = new Date(time_before).getMinutes();

            if ((current.getMinutes() !== minute_before)
                ||
                ((current.getMinutes() === minute_before) && (timestamp / 1000 - time_before / 1000 >= 60))
            ) {
                const day_before = new Date(time_before).getDate();

                if (
                    (current.getDate() !== day_before)
                    ||
                    (current.getDate() === day_before) && (timestamp / 1000 - time_before / 1000 >= 86400)
                ) {
                    date = `${current.getFullYear()}년 ${current.getMonth() + 1}월 ${current.getDate()}일`;
                }

                message_time = messageTime(con);
                time_before = timestamp;
            }

        } else {
            date = `${current.getFullYear()}년 ${current.getMonth() + 1}월 ${current.getDate()}일`;
            message_time = messageTime(con);
            time_before = timestamp;
        }

        return (
            <div>
                {/* 날짜 */}
                {
                    date ?
                        <div className="chatpage_date1">
                            <div className="chatpage_date2">{date}</div>
                        </div>
                        : null
                }
                {/* 내용 */}
                {
                    con.user_uid_1 === auth.user.uid
                        ?
                        <div className="chatpage_content_r">
                            <div className="chatpage_time_r">
                                <div className="chatpage_time">{message_time}</div>
                            </div>
                            <div className="chatpage_words_r">{con.message}</div>
                        </div>
                        :
                        <div className="chatpage_content_l">
                            <div className="chatpage_profile">
                                {
                                    user_image ?
                                        <div style={{ backgroundImage: `url(${user_image})` }} ></div>
                                        :
                                        <div style={{ backgroundImage: `url(${chat_profile})` }} ></div>
                                }
                            </div>
                            <div>
                                <div className="chatpage_profile_name">{user_name ? user_name : '??'}</div>
                                <div className="chatpage_words_l">{con.message}</div>
                            </div>
                            <div className="chatpage_time_l">
                                <div className="chatpage_time">{message_time}</div>
                            </div>
                        </div>
                }
            </div>
        );
    }

    if (auth.user && !Array.isArray(user.users) && user.users.uid_2) {
        if (
            !blocking
            &&
            user.users.uid_1.block_uid.includes(user_uid)
        ) {
            setBlocking(true);
        }
        else if (
            blocking
            &&
            !user.users.uid_1.block_uid.includes(user_uid)
        ) {
            setBlocking(false);
        }
        else if (
            !blocked
            &&
            user.users.uid_2.block_uid.includes(auth.user.uid)
        ) {
            setBlocked(true);
        }
        else if (
            blocked
            &&
            !user.users.uid_2.block_uid.includes(auth.user.uid)
        ) {
            setBlocked(false);
        }
    }

    // 뒤로 가기 버튼
    const goBack = () => {
        dispatch(logoutChat());
        history.goBack();
    };

    // 신고 팝업 열기
    const openReportPopup = () => {
        menuOff();
        setReportPopup(true);
    }

    // 신고 팝업 닫기
    const closeReportPopup = () => {
        setReportPopup(false);
    }

    // 차단 팝업 열기
    const openBlockPopup = () => {
        menuOff();
        setBlockPopup(true);
    }

    // 차단 팝업 닫기
    const closeBlockPopup = () => {
        setBlockPopup(false);
    }

    // 차단 해제 팝업 열기
    const openUnblockPopup = () => {
        menuOff();
        setUnblockPopup(true);
    }

    // 차단 해제 팝업 닫기
    const closeUnblockPopup = () => {
        setUnblockPopup(false);
    }

    // 나가기 팝업 열기
    const openExitPopup = () => {
        menuOff();
        setExitPopup(true);
    }

    // 나가기 팝업 닫기
    const closeExitPopup = () => {
        setExitPopup(false);
    }

    // 프로필 팝업 열기
    const openProfilePopup = () => {
        menuOff();
        setProfilePopup(true);
    }

    // 프로필 팝업 닫기
    const closeProfilePopup = () => {
        setProfilePopup(false);
    }

    // 나가기 기능
    const exit = () => {
        dispatch(logoutChat());
        dispatch(exitChatRoom({ uid_1: auth.user.uid, uid_2: user_uid }))
            .then(() => {
                setExitRoom(true);
            })
            .catch((err) => {
                console.log(err);
            })
    }

    // 신고 기능 작동
    const report = () => {
        dispatch(reportChat({ uid_1: auth.user.uid, uid_2: user_uid }));
    }

    const block = () => {
        dispatch(blockUser({ uid_1: auth.user.uid, uid_2: user_uid }));
    }

    const unblock = () => {
        dispatch(unBlockUser({ uid_1: auth.user.uid, uid_2: user_uid }));
    }

    const menuOff = () => {
        turnBtn.current.checked = false;
    }

    if (exitRoom) {
        return <Redirect to='/chat_list' />
    }

    if (!auth.isAuthenticated) {
        return <Redirect to='/login' />
    }

    return (
        <div className='chatpage_container'>
            {/* 헤더 */}
            <div className="chatpage_header">
                <div className="chatpage_header2">
                    <img className="chatpage_arrow" src={icon_back_arrow} style={{ width: "15px", height: "14px", cursor: 'pointer' }} onClick={goBack} />
                    <center className="chatpage_name">{user_name ? user_name : '??'}</center>
                    <div className="chatpage_menu">
                        <input type="checkbox" id="chatpage_checkbox" ref={turnBtn} />
                        <label class="chatpage_checkBtn" for="chatpage_checkbox"><img src={icon_dotdotdot} style={{ height: "14px", width: '3px', padding: '0 10px 0 20px' }} /></label>
                        <div className="chatpage_background" onClick={menuOff}></div>
                        <div class="chatpage_menu">
                            <ul>
                                <li onClick={openProfilePopup}>프로필 보기</li>
                                {
                                    blocking ?
                                        <li onClick={openUnblockPopup}>차단 해제하기</li>
                                        :
                                        <li onClick={openBlockPopup}>차단하기</li>
                                }
                                <li onClick={openExitPopup}>채팅방 나가기</li>
                                <li onClick={openReportPopup}>신고하기</li>
                            </ul>
                        </div>
                    </div>
                </div>
                <center className="chatpage_info">{user_major ? user_major : '??'}/{user_student_id ? user_student_id.slice(2, 4) : '??'}</center>
                {/* 게시물 내용 */}
                <div className="chatpage_post">
                    <p>[밥약게시판]</p>
                    <br />
                    <p>{post ? post.title : '게시물 삭제됨'}</p>
                </div>
            </div>
            {/* 채팅 전 내용 */}
            {
                user.conversations.length > 0
                    ?
                    <div id="chatpage_afterChat">
                        {user.conversations.map(con => getContent(con))}
                    </div>
                    :
                    <div className="chatpage_beforeChat">
                        <img className="chatpage_beforeLogo" src={chat_enheng} width="76.5px" height="53.8px" />
                        <div className="chatpage_beforeInfo">
                            {user_name ? user_name : '??'}님께 메세지를 보내실 경우 상대방에게
                            <br />
                            실명/학과/학번이 공개됩니다.
                            <br />
                            이외의 정보 보호에 유의해주시기 바랍니다!
                        </div>
                    </div>
            }
            {/* 메시지 입력 */}
            <div className="chatpage_footer">
                {
                    blocking ?
                        <div className="chatpage_footer2">
                            <div className="chatpage_message block">
                                <textarea
                                    placeholder='차단한 사용자와는 대화할 수 없습니다.'
                                    id="chatpage_messageIn"
                                    rows="1"
                                    disabled
                                />
                            </div>
                        </div>
                        :
                        blocked ?
                            <div className="chatpage_footer2">
                                <div className="chatpage_message block">
                                    <textarea
                                        placeholder='차단되어 메시지를 보낼 수 없습니다.'
                                        id="chatpage_messageIn"
                                        rows="1"
                                        disabled
                                    />
                                </div>
                            </div>
                            :
                            <div className="chatpage_footer2">
                                <div className="chatpage_message unblock">
                                    <textarea
                                        id="chatpage_messageIn"
                                        rows="1"
                                        spellCheck={false}
                                        placeholder="메세지를 입력하세요"
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        ref={messageRef}
                                    />
                                </div>
                                <div className="chatpage_messageBtn">
                                    <img src={chat_send_button} width="44px" height="44px" onClick={submitMessage} />
                                </div>
                            </div>
                }
            </div>
            {profilePopup ? <ProfilePage name={user_name} major={user_major} student_id={user_student_id} mbti={user_mbti} image={user_image} popupOff={closeProfilePopup} /> : null}
            {blockPopup ? <Popup popupOff={closeBlockPopup} popupFunc={block} popupContent='차단 시 서로 채팅을 보낼 수 없습니다. &#13;&#10;차단하시겠습니까?' popupOk='차단' popupCancel='취소' /> : null}
            {unblockPopup ? <Popup popupOff={closeUnblockPopup} popupFunc={unblock} popupContent='차단을 해제하시겠습니까?' popupOk='해제' popupCancel='취소' /> : null}
            {exitPopup ? <Popup popupOff={closeExitPopup} popupFunc={exit} popupContent='채팅방을 나갈 시 채팅 목록 및 대화 내용을 더 이상 볼 수 없습니다. &#13;&#10;채팅방에서 나가시겠습니까?' popupOk='나가기' popupCancel='취소' /> : null}
            {reportPopup ? <Popup popupOff={closeReportPopup} popupFunc={report} popupContent='신고 내용 확인을 위해 쪽지 내용의 일부가 전송되어 검토될 수 있습니다. &#13;&#10;신고하시겠습니까?' popupOk='신고' popupCancel='취소' /> : null}
        </div>
    );
}

export default ChatPage;
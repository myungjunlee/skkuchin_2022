import React, { useEffect, useState } from 'react';
import './style.css';
import Layout from '../../components/Layout';
import { useDispatch, useSelector } from 'react-redux';
import { getRealtimeLists, getRealtimeUsers, logoutChat } from '../../actions';
import { Link } from 'react-router-dom';
import { Redirect } from 'react-router';
import chat_profile from '../../image/drawable-xxxhdpi/chat_profile.png'
import chat_enheng from '../../image/drawable-xxxhdpi/chat_enheng.png'
// import icon_dotdotdot from '../../image/drawable-xxxhdpi/icon_dotdotdot.png'
import loading04 from '../../image/drawable-xxxhdpi/loading04.png';

const User = (props) => {

    const { user } = props;

    return (
        <Link to={{
            pathname: '/chat',
            state: {
                uid : user.uid,
                name : user.name,
                major : user.major,
                student_id : user.student_id,
                post_id: user.post_id,
                image: user.image,
                mbti: user.mbti
            }
            }}>
            <div className="chatting_item">
                {/* 알림 이미지 */}
                <div className="chatting_img">
                    {
                        user.image ?
                        <div style={{backgroundImage: `url(${user.image})`}} ></div>
                        :
                        <div style={{backgroundImage: `url(${chat_profile})`}} ></div>
                    }
                </div>
                <div className="chatting_text">
                    <span className="chatting_name">{user.name}</span>
                    <span className="chatting_major">{user.major}</span>
                    <span className="chatting_dot">·</span>
                    <span className="chatting_stNum">{ user.student_id ? `${user.student_id.slice(2,4)}학번` : null }</span>
                    <p>{user.lastCon}</p>
                </div>
                {/* 알림 시간 */}
                <div className="chatting_alert">
                    <div className="chatting_time">
                        {user.lastTime}
                    </div>
                    { 
                        user.unread ? 
                        <div className="chatting_new">
                            <div className="chatting_count">{user.unread}</div>
                        </div>
                        : 
                        <div className="chatting_blank">
                        </div>
                    }
                </div>
            </div>
            <div className='chatting_end'></div>
        </Link>
        
    );
}

const ChatListPage = (props) => {

    const dispatch = useDispatch();
    const auth = useSelector(state => state.auth);
    const user = useSelector(state => state.user);
    const chatUser = [];
    // 로딩 활성화
    const [loading, setLoading] = useState(true);

    let unsubscribe;
    let un_subscribe;

    useEffect(() => {

        document.documentElement.scrollTop = 0;

        if (auth.user) {
            
            un_subscribe = dispatch(getRealtimeUsers(auth.user.uid))
            .then(un_subscribe => {
                return un_subscribe;
            })
            .catch(error => {
                console.log(error);
            })

            unsubscribe = dispatch(getRealtimeLists(auth.user.uid))
            .then(unsubscribe => {
                return unsubscribe;
            })
            .catch(error => {
                console.log(error);
            })
        }
    }, [])

    // componentWillUnmount
    useEffect(() => {
        return () => {
            // cleanup
            dispatch(logoutChat());
            unsubscribe.then(f => f()).catch(err => console.log(err));
            un_subscribe.then(f => f()).catch(err => console.log(err));
        }
    }, [])

    const calculateTime = (createdTime) => {
        const now_timestamp = new Date().getTime();
        const last_timestamp = createdTime;
        const now_time = new Date(now_timestamp);
        const last_time = new Date(last_timestamp);
        let time = '';
        if (
            (now_time.getDate() === last_time.getDate())
            &&
            (now_timestamp/1000 - last_timestamp/1000 < 86400)
        ) {
            if (last_time.getHours() === 0) {
                time = '오전 12:';
            } else if (last_time.getHours() < 12) {
                time = `오전 ${last_time.getHours()}:`;
            } else if (last_time.getHours() === 12) {
                time = '오후 12:';
            } else {
                time = `오후 ${last_time.getHours()-12}:`;
            }

            if (last_time.getMinutes() < 10) {
                time += `0${last_time.getMinutes()}`;
            } else {
                time += `${last_time.getMinutes()}`;
            }
        }
        else if (
            (now_time.getDate() - last_time.getDate() === 1)
            &&
            (now_timestamp/1000 - last_timestamp/1000 < 172800)
        ) {
            time = '어제';
        }
        else if (
            (now_time.getFullYear() === last_time.getFullYear())
        ) {
            time = `${last_time.getMonth()+1}월 ${last_time.getDate()}일`;
        } else {
            time = `${last_time.getFullYear()}. ${last_time.getMonth()+1}. ${last_time.getDate()}.`;
        }

        return time;
    }

    if (user.users.length > 0 && loading) {
        setLoading(false);
    }

    if (auth.user && user.users.length > 0 && user.conversations.length > 0) {

        user.conversations.map(con => {
            user.users.map(chat_user => {
                if (
                    (chat_user.uid === con.user_uid_1 || chat_user.uid === con.user_uid_2)
                    &&
                    (auth.user.uid !== con.exit_uid_1 && auth.user.uid !== con.exit_uid_2)
                )
                {
                    chat_user.lastTime = calculateTime(con.createdAt);
                    chat_user.lastCon = con.message;
                    chat_user.unread = null;
                    chat_user.post_id = con.post_id;

                    if ('unread' in con) {
                        chat_user.unread = con.unread;
                    }
                    chatUser.push(chat_user);
                }
            })
        })
    }

    if (!auth.isAuthenticated) {
        return <Redirect to = '/login' />
    }

    return (
        <Layout>
            <div className='chatting_container'>
                {/* 헤더 */}
                <div className="chatting_header">
                    <div className="chatting_header2">
                        <div className="upload_hleft">채팅목록</div>
                    </div>
                </div>
                {/* 채팅 목록 */}
                <div className="chatting_box">
                    {
                        chatUser && chatUser.length > 0 ?
                        chatUser.map(user => {
                            return (
                                <User
                                key={user.uid} 
                                user={user} 
                                />
                            );
                        })
                        :
                        <center className='chatting_noitem'>
                            <img src={chat_enheng} style={{width: '140px'}} />
                            <p>
                                채팅이 없습니다
                                <br/>
                                어서 밥약을 잡아보세요!    
                            </p>
                        </center> 
                    }
                </div>
            </div>
            { 
                loading ? 
                <div class="popup_wrap">
                    <div class="popup_box">
                        <div class="popup_content">
                            <div class="popup_text">
                                <img src={loading04} style={{width: '130px', height: 'auto', marginBottom: '15px' }} />
                                <div>로딩중</div>
                            </div>
                        </div>
                    </div>
                </div> 
                : 
                null 
            }
        </Layout>
    );
}

export default ChatListPage;
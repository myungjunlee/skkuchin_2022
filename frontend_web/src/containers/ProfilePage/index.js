import React, { useEffect } from 'react';
import './style.css';
import { useSelector } from 'react-redux';
import { Redirect, useHistory } from 'react-router-dom';
import icon_back_arrow from '../../image/drawable-xxxhdpi/icon_back_arrow.png';
import chat_profile from '../../image/drawable-xxxhdpi/chat_profile.png';
import Layout from '../../components/Layout';

const ProfilePage = (props) => {

    const user_name = props.location.state.name;
    const user_major = props.location.state.major;
    const user_student_id = props.location.state.student_id;
    const user_mbti = props.location.state.mbti;
    const user_image = props.location.state.image;
    
    const history = useHistory();
    const auth = useSelector(state => state.auth);

    useEffect(() => {
        document.documentElement.scrollTop = 0;
    }, [])

    const goBack = () => {
        history.goBack();
    };

    // 로그인 안 했을 시 로그인 페이지로
    if (!auth.isAuthenticated) {
        return <Redirect to = '/login' />
    }

    return (
        <Layout>
            <div className="profile">
                {/* header 헤더 : 뒤로가기 아이콘, 페이지 제목, 닫기 아이콘 */}
                <div className="profile_header">
                    <div className="profile_header2">
                        <img src={icon_back_arrow} style={{marginTop: '2.12px', width: "15px", height: "14px", paddingRight: '15px', cursor: 'pointer'}} onClick={goBack} />
                        프로필 보기
                    </div>
                </div>
                {/* 게시물 전체 틀 */}
                <div className="profile_content">
                    <div className="profile_top_part">
                        {
                            user_image ?
                            <div className='profile_frame' style={{backgroundImage: `url(${user_image})`}} ></div>
                            :
                            <div className='profile_frame' style={{backgroundImage: `url(${chat_profile})`}} ></div>
                        }
                        <div className="profile_name">{user_name}</div>
                    </div>
                    <div className="profile_bottom_part">
                        <div>
                            <div className="profile_major">학과</div>
                            <div className="profile_major_content">{user_major}</div>
                        </div>
                        <div>
                            <div className="profile_second_left">
                                <div className="profile_stuNum">학번</div>
                                <div className="profile_stuNum_content">{user_student_id ? `${user_student_id.slice(2,4)}학번` : null}</div>
                            </div>
                            <div className="profile_second_right">
                                <div className="profile_mbti">MBTI</div>
                                <div className="profile_mbti_content">{user_mbti}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}

export default ProfilePage;
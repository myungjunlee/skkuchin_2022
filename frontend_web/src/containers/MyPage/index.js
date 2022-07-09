import './style.css';
import Layout from '../../components/Layout';
import { useDispatch, useSelector } from 'react-redux';
import { logout, logoutChat, logoutPost } from '../../actions';
import { Link, Redirect } from 'react-router-dom';
// import icon_back_arrow from '../../image/drawable-xxxhdpi/icon_back_arrow.png';
import mypage_profile from '../../image/drawable-xxxhdpi/mypage_profile.png';
import icon_edit from '../../image/drawable-xxxhdpi/icon_edit.png';
import React, { useEffect } from 'react';

const MyPage = (props) => {

    const dispatch = useDispatch();
    const auth = useSelector(state => state.auth);

    useEffect(() => {
        document.documentElement.scrollTop = 0;
    }, [])

    const doLogout = () => {
        dispatch(logout())
        .then(() => {
            dispatch(logoutChat())
            .then(() => {
                dispatch(logoutPost())
            })
            .catch((err) => {
                console.log(err);
            })
        })
        .catch((err) => {
            console.log(err)
        })
    }

    // 로그인 안 했을 시 로그인 페이지로
    if (!auth.isAuthenticated) {
        return <Redirect to = '/login' />
    }

    return (
        <Layout>
            <div className="mypage_wrapper">
                <div className="mypage_top">
                    <div className="mypage_top2">
                        <h4>마이페이지</h4>
                    </div>
                </div>
                <div className="mypage_profileBox">
                    <div className="mypage_profileImage">
                        {
                            auth.user.image ?
                            <div style={{backgroundImage: `url(${auth.user.image})`}} ></div>
                            :
                            <div style={{backgroundImage: `url(${mypage_profile})`}} ></div>
                        }
                    </div>
                    <div className="mypage_profileText">
                        <div className="mypage_name">
                            <h2>{auth.user.name}님</h2>
                            <Link to="/account_edit">
                                <img src={icon_edit} />
                            </Link>
                        </div>
                        <table className="mypage_table">
                            <tr>
                                <td className="mypage_tableTitle">학번</td>
                                <td className="mypage_tableContent">{auth.user.student_id ? `${auth.user.student_id.slice(2,4)}학번` : null}</td>
                            </tr>
                            <tr>
                                <td className="mypage_tableTitle">학과</td>
                                <td className="mypage_tableContent">{auth.user.major}</td>
                            </tr>
                            <tr>
                                <td className="mypage_tableTitle">MBTI</td>
                                <td className="mypage_tableContent">{auth.user.mbti}</td>
                            </tr>
                        </table>
                    </div>
                </div>
                <div className="mypage_list">
                    <Link to="/mypage_list">   
                        <div className="mypage_item">
                            내 게시물 관리
                        </div>
                    </Link>
                    <Link to="/account_edit">
                        <div className="mypage_item">
                            계정설정
                        </div>
                    </Link>
                    <Link to="/change_password">   
                        <div className="mypage_item">
                            비밀번호 변경
                        </div>
                    </Link>
                    <div 
                        className="mypage_item" 
                        onClick={() => window.open('https://pf.kakao.com/_Ujaxjb/chat', '_blank')}
                    >
                        문의하기
                    </div>
                    <div className="mypage_item" onClick={doLogout}>
                        로그아웃 
                    </div>
                    <Link to={{
                        pathname: "/user_delete",
                        state: {
                            uid: auth.user.uid
                        }
                    }}>  
                        <div className="mypage_item">
                            회원탈퇴
                        </div>
                    </Link>
                </div>
            </div>
        </Layout>
    );
}

export default MyPage;
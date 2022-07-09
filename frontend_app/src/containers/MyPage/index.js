import './style.css';
import { useDispatch, useSelector } from 'react-redux';
import { logout, logoutChat, logoutPost } from '../../actions';
import { Link, Redirect } from 'react-router-dom';
import mypage_profile from '../../image/drawable-xxxhdpi/mypage_profile.png';
import icon_edit from '../../image/drawable-xxxhdpi/icon_edit.png';
import tabar_01 from '../../image/drawable-xxxhdpi/tabar_01.png';
import tabar_02 from '../../image/drawable-xxxhdpi/tabar_02.png';
import tabar_03 from '../../image/drawable-xxxhdpi/tabar_03.png';
import tabar_04_active from '../../image/drawable-xxxhdpi/tabar_04_active.png';
import { useEffect, useState } from 'react';
import PrivacyPage from '../PrivacyPage';
import ServiceAgreementPage from '../ServiceAgreementPage';

const MyPage = (props) => {

    const dispatch = useDispatch();
    const auth = useSelector(state => state.auth);

    // 약관 팝업
    const [privacy, setPrivacy] = useState(false);
    const [service, setService] = useState(false);

    // 개인정보처리방침 열기
    const openPrivacy = () => {
        setPrivacy(true);
    }
    // 개인정보처리방침 닫기
    const closePrivacy = () => {
        setPrivacy(false);
    }
    // 이용약관 열기
    const openService = () => {
        setService(true);
    }
    // 이용약관 닫기
    const closeService = () => {
        setService(false);
    }

    useEffect(() => {
        document.documentElement.scrollTop = 0;
    }, [])

    const doLogout = () => {
        dispatch(logout(auth.user.uid))
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

    // 홈 로고나 밥약게시판 클릭 시 위치 기록 삭제
    const removeHistory = () => {
        sessionStorage.removeItem('page');
        sessionStorage.removeItem('scroll_position');
        sessionStorage.removeItem('searchItem');
    }

    const openKakao = () => {
        let ref = window.cordova.InAppBrowser.open('https://pf.kakao.com/_Ujaxjb/chat', '_system', 'hidden=yes,location=no');
    }

    // 로그인 안 했을 시 로그인 페이지로
    if (!auth.isAuthenticated) {
        return <Redirect to = '/login' />
    }

    return (
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
                <Link to="/alarm">
                    <div className="mypage_item">
                        알림설정
                    </div>
                </Link>
                <Link to="/change_password">   
                    <div className="mypage_item">
                        비밀번호 변경
                    </div>
                </Link>
                <div 
                    className="mypage_item" 
                    onClick={openKakao}
                >
                    문의하기
                </div>
                <div className="mypage_item" onClick={openService}>
                    이용약관 
                </div>
                <div className="mypage_item" onClick={openPrivacy}>
                    개인정보처리방침 
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
            <nav className="bottom_navbar">
                <ul>
                    <li><Link to="/" onClick={removeHistory}><img src={tabar_01} style={{height: '40px', width: 'auto'}} /></Link></li>
                    <li><Link to="/restaurant"><img src={tabar_02} style={{height: '40px', width: 'auto'}} /></Link></li>
                    <li><Link to="/chat_list"><img src={tabar_03} style={{height: '40px', width: 'auto'}} /></Link></li>
                    <li><Link to="/mypage"><img src={tabar_04_active} style={{height: '40px', width: 'auto'}} /></Link></li>
                </ul>
            </nav>
            { privacy ? <PrivacyPage windowOff={closePrivacy} /> : null }
            { service ? <ServiceAgreementPage windowOff={closeService} /> : null }
        </div>
    );
}

export default MyPage;
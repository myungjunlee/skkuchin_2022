import React, { useRef } from 'react'
import { Link } from 'react-router-dom';
import { read, logout } from '../../actions';
import { useDispatch, useSelector } from 'react-redux';
import './style.css';
import home_logo from '../../image/drawable-xxxhdpi/home_logo.png';
// import icon_alarm from '../../image/drawable-xxxhdpi/icon_alarm.png';
import icon_menu_bar from '../../image/drawable-xxxhdpi/icon_menu_bar.png';
import icon_close from '../../image/drawable-xxxhdpi/icon_close.png';
import mypage_profile from '../../image/drawable-xxxhdpi/mypage_profile.png';
import icon_01 from '../../image/drawable-xxxhdpi/icon_01.png';
import icon_02 from '../../image/drawable-xxxhdpi/icon_02.png';
import icon_03 from '../../image/drawable-xxxhdpi/icon_03.png';
import icon_04 from '../../image/drawable-xxxhdpi/icon_04.png';
import icon_logout from '../../image/drawable-xxxhdpi/icon_logout.png';

/**
* @author
* @function Navbar
**/

const Navbar = () => {

    const navOffBtn = useRef(null);
    const dispatch = useDispatch();
    const auth = useSelector(state => state.auth);

    const doLogout = () => {
        try {
            dispatch(logout())
        } catch (error) {
            alert('로그아웃에 실패하셨습니다. 재접속 후 다시 시도해주시기 바랍니다.')
            console.log(error)
        }
    }

    // 홈 로고나 밥약게시판 클릭 시 위치 기록 삭제 && 새로고침
    const removeHistory = () => {
        sessionStorage.removeItem('page');
        sessionStorage.removeItem('scroll_position');
        dispatch(read())
        .then(() => {
            document.documentElement.scrollTop = 0;
        })
    }

    const navOff = () => {
        navOffBtn.current.checked = false;
    }

    return(
        // 상단 메뉴바
        <nav className="navbar">
            <div className="navbar_pagetitle">
                <Link to="/" onClick={removeHistory}>
                    <img src={home_logo} style={{width: "82px", height: "auto", marginBottom: "20px", cursor: "pointer"}} />
                </Link>
            </div>
            <div className="navbar_icons">
                {/* <img src={icon_alarm} style={{verticalAlign: "middle", width: "16.67px", height: "20px", marginBottom: "20px", paddingRight: "10px"}} /> */}
                <div>
                    {/* 사이드바 활성화 아이콘 버튼 */}
                    <input type="checkbox" id="checkbox" ref={navOffBtn} />
                    <label className="btn" for="checkbox"><img src={icon_menu_bar} style={{verticalAlign: "middle", width: "20.16px", height: "14px"}} /></label> 
                    <div className="background" onClick={navOff}></div>
                    {/* sidebar 사이드바 */}
                    <div className="sidebar">
                        <input type="checkbox" id="checkbox" />
                        <label className="btn" for="checkbox" style={{marginTop: "32px", marginLeft: "22px"}}><img src={icon_close} style={{verticalAlign: "middle", width: "13px", height: "14px"}} /></label>
                        {/* 프로필 (이미지, 이름) */}
                        <div className="navbar_my_info">
                            {auth.isAuthenticated ?
                                <div>
                                    <div className="profile_img">
                                        <center>
                                                {
                                                    auth.user.image ?
                                                    <div className='navbar_frame' style={{backgroundImage: `url(${auth.user.image})`}} ></div>
                                                    :
                                                    <div className='navbar_frame' style={{backgroundImage: `url(${mypage_profile})`}} ></div>
                                                }
                                        </center>
                                    </div>
                                    <h3>{auth.user.name}</h3>
                                </div>
                                :
                                <div>
                                    <Link to="/login">
                                        <div className="profile_img">
                                            <center>
                                                <div className='navbar_frame' style={{backgroundImage: `url(${mypage_profile})`}} ></div>
                                            </center>
                                        </div>
                                        <h3>로그인 해주세요</h3>
                                    </Link>
                                </div>
                            }
                        </div>
                        {/* 게시판 목록 */}
                        <ul>
                            <li><Link to="/" onClick={removeHistory}><img src={icon_02} style={{width: "21.76px", height: "17.18px", paddingRight: "17.56px"}} />밥약게시판</Link></li>
                            <li><Link to="/restaurant" onClick={removeHistory}><img src={icon_01} style={{width: "15.14px", height: "18.17px", paddingLeft: "3.3px", paddingRight: "20.56px"}} />학교근처식당</Link></li>
                            <li><Link to="/chat_list"><img src={icon_03} style={{width: "18.76px", height: "18.76px",  paddingLeft: "2px", paddingRight: "19.24px"}} />채팅목록</Link></li>
                            <li><Link to="/mypage"><img src={icon_04} style={{width: "15.47px", height: "18.55px", paddingLeft: "3.3px", paddingRight: "21.56px"}} />마이페이지</Link></li>
                        </ul>
                        {auth.isAuthenticated ? 
                        <div className="log_out" onClick={doLogout}>
                            로그아웃 <img src={icon_logout} style={{verticalAlign: "middle", width: "16.56px", height: "13.24px"}} />
                        </div>
                        :
                        <div className="log_out">
                            <Link to="/login">
                            로그인 <img src={icon_logout} style={{verticalAlign: "middle", width: "16.56px", height: "13.24px"}} />
                            </Link>
                        </div> 
                        }
                        
                    </div>
                </div>
            </div>
        </nav>
    )
}

export default Navbar;
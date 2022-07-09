import React, { useEffect, useRef } from 'react';
import './style.css';
import { useDispatch, useSelector } from 'react-redux';
import { read, noti_read, logoutNoti, logoutPost, getPostUser, getConversations, logoutChat } from '../../actions';
import { Link } from 'react-router-dom';
import icon_writing from '../../image/drawable-xxxhdpi/icon_writing.png'
import icon_search from '../../image/drawable-xxxhdpi/icon_search.png'
import profile01 from '../../image/drawable-xxxhdpi/profile01.png'
import icon_time01 from '../../image/drawable-xxxhdpi/icon_time01.png'
import icon_place02 from '../../image/drawable-xxxhdpi/icon_place02.png'
import home_logo from '../../image/drawable-xxxhdpi/home_logo.png';
import icon_notice from '../../image/drawable-xxxhdpi/icon_notice.png';
import icon_notice_active from '../../image/drawable-xxxhdpi/icon_notice_active.png';
import icon_chart from '../../image/drawable-xxxhdpi/icon_chart.png';
import icon_close from '../../image/drawable-xxxhdpi/icon_close.png';
import tabar_01_active from '../../image/drawable-xxxhdpi/tabar_01_active.png';
import tabar_02 from '../../image/drawable-xxxhdpi/tabar_02.png';
import tabar_03 from '../../image/drawable-xxxhdpi/tabar_03.png';
import tabar_04 from '../../image/drawable-xxxhdpi/tabar_04.png';
import tag_sazo from '../../image/drawable-xxxhdpi/tag_sazo.png';
import tag_sazul from '../../image/drawable-xxxhdpi/tag_sazul.png';
import tag_together from '../../image/drawable-xxxhdpi/tag_together.png';

const HomePage = () => {

    const dispatch = useDispatch();
    const navOffBtn = useRef(null);
    const post = useSelector(state => state.post.data);
    const auth = useSelector(state => state.auth);
    const post_user = useSelector(state => state.user);
    const noti = useSelector(state => state.noti.data);

    // 새로고침 로딩창 이벤트
    // document.addEventListener('touchstart', e => swipeStart(e), false);
    // document.addEventListener('touchmove', e => swipe(e), false);

    // const pStart = { x: 0, y: 0 };
    // const pCurrent = { x: 0, y: 0 };
    // const main = document.querySelector('.home_content');

    // const swipeStart = (e) => {
    //     if (typeof e['targetTouches'] !== "undefined") {
    //         let touch = e.targetTouches[0];
    //         pStart.x = touch.screenX;
    //         pStart.y = touch.screenY;
    //     } else {
    //         pStart.x = e.screenX;
    //         pStart.y = e.screenY;
    //     }
    // }

    // const swipe = (e) => {
    //     if (typeof e['changedTouches'] !== "undefined") {
    //         let touch = e.changedTouches[0];
    //         pCurrent.x = touch.screenX;
    //         pCurrent.y = touch.screenY;
    //     } else {
    //         pCurrent.x = e.screenX;
    //         pCurrent.y = e.screenY;
    //     }
    //     let changeY = pStart.y < pCurrent.y ? Math.abs(pStart.y - pCurrent.y) : 0;
    //     if (document.body.scrollTop === 0) {
    //         if (changeY > 100) {
    //             loading();
    //         }
    //     }
    // }

    // const loading = () => {
    //     dispatch(read());
    //     main.style.transform = 'translateY(0px)';
    //     setTimeout(() => {
    //         main.style.transform = 'translateY(-100px)';
    //     }, 1000);
    // }

    useEffect(() => {
        sessionStorage.removeItem('searchItem');
        dispatch(noti_read());
        dispatch(read())
        .then(() => {
            // 이전 페이지 스크롤 위치 유지
            if (sessionStorage.getItem('page') && sessionStorage.getItem('scroll_position')) {
                const page = sessionStorage.getItem('page');
                const scrollPosition = sessionStorage.getItem('scroll_position');
                if (page === 'homepage' && document.documentElement.scrollTop !== scrollPosition) {
                    document.documentElement.scrollTop = scrollPosition;
                    sessionStorage.removeItem('page');
                    sessionStorage.removeItem('scroll_position');
                }
            }
        })
        dispatch(getConversations());
    }, [])

    useEffect(() => {
        if (auth.user) {
            dispatch(getPostUser(auth.user.uid));
        }
    }, [auth])

    useEffect(() => {
        if (
            noti
            &&
            noti.length > 0 
            &&
            (
                (
                    localStorage.getItem('noti_new')
                    &&
                    localStorage.getItem('noti_new') !== noti[0].id
                )
                || 
                !localStorage.getItem('noti_new')

            )
            ) {
            localStorage.setItem('noti_new', noti[0].id);
        }
    }, [noti])

    // componentWillUnmount
    useEffect(() => {
        return () => {
            // cleanup
            dispatch(logoutPost());
            dispatch(logoutChat());
            dispatch(logoutNoti());
        }
    }, [])

    const navOff = () => {
        navOffBtn.current.checked = false;
        dispatch(getPostUser(auth.user.uid));
    }

    const infoOff = () => {
        dispatch(getPostUser(auth.user.uid));
    }

    const getDate = (date) => {
        const created_seconds = new Date(date)/1000;
        const now_seconds = new Date().getTime()/1000;
        const difference_time = now_seconds - created_seconds;
        let time;

        if (difference_time < 60) {
            time = `${Math.floor(difference_time)}초 전`;
        } else if (difference_time < 3600) {
            time = `${parseInt(difference_time/60)}분 전`;
        } else if (difference_time < 86400) {
            time = `${parseInt(difference_time/3600)}시간 전`
        } else if (difference_time < 2592000) {
            time = `${parseInt(difference_time/86400)}일 전`
        } else if (difference_time < 31104000) {
            time = `${parseInt(difference_time/2592000)}달 전`
        } else {
            time = `${parseInt(difference_time/31104000)}년 전`
        }

        return time;
    }

    // 이전 페이지 스크롤 위치 기억하기
    const postClick = () => {
        const scrollHeightPosition = document.documentElement.scrollTop
        sessionStorage.setItem('page', 'homepage');
        sessionStorage.setItem('scroll_position', scrollHeightPosition);
    }

    // 홈 로고 클릭 시 새로고침
    const refreshLogo = () => {
        dispatch(read())
        .then(() => {
            document.documentElement.scrollTop = 0;
        })
    }

    const notiList = () => {
        if (
            localStorage.getItem('noti_new')
            &&
            (
                !localStorage.getItem('noti_confirm')
                ||
                (
                    localStorage.getItem('noti_confirm')
                    &&
                    localStorage.getItem('noti_new') !== localStorage.getItem('noti_confirm')
                )
            )            
        ) {
            localStorage.setItem('noti_confirm', localStorage.getItem('noti_new'));
        }
    }

    const notiNew = () => {
        localStorage.setItem('noti', noti[0].id);
        if (
            localStorage.getItem('noti_new')
            &&
            (
                !localStorage.getItem('noti_confirm')
                ||
                (
                    localStorage.getItem('noti_confirm')
                    &&
                    localStorage.getItem('noti_new') !== localStorage.getItem('noti_confirm')
                )
            )            
        ) {
            localStorage.setItem('noti_confirm', localStorage.getItem('noti_new'));
        }
    }

    let renderList = null

    if (post && post.length > 0) {
        renderList = post.map((list) => {

            if (auth.user && !Array.isArray(post_user.users)) {
                if (
                    post_user.users.user.post_blocking.includes(list.uid)           
                )
                {
                    return null;
                } 
                else if (
                    post_user.users.user.post_uid.includes(list.uid)            
                )
                {
                    return (
                        <Link
                            to={{
                                pathname: `/detail/${list.id}`
                            }}
                            onClick={postClick}
                            >
                            <ul key={list.id} className="home_block">
                                {/* item 밥약 개별 게시글 */}
                                <div className="home_item">
                                    {/* item 밥약 개별 게시글 상단 부분 (회색 직선 기준으로 윗부분) */}
                                    <div id="home_top_part">
                                        <div className='home_frame' style={{backgroundImage: `url(${profile01})`}} ></div>
                                        <div>
                                            <div id="home_info">
                                                <div id="hname">이름 ??</div>
                                            </div>
                                            <div id="hmajor">학과 ??</div> 
                                        </div>
                                        <div id="htime">{getDate(list.create_date)}</div>
                                    </div>
                                    {/* item 밥약 개별 게시글 하단 부분 (회색 직선 기준으로 아랫부분) home_bottom_part */}
                                    <div className="home_bottom_part">
                                        <span>차단한 사용자의 게시물입니다</span>
                                        <div className="home_promise_info">
                                            <div className='home_promise_info2'><img src={icon_time01} style={{width: "10px", height: "10px", verticalAlign: "middle", paddingRight: "4px"}} />일시</div>
                                            <div className='home_promise_info2' id="hdate">??</div>
                                            <div className='home_promise_info2'><img src={icon_place02} style={{width: "8px", height: "11.5px", verticalAlign: "middle", paddingRight: "4px"}} />장소</div>
                                            <div className='home_promise_info2' id="hplace">??</div>
                                        </div>
                                    </div>
                                </div>
                            </ul>
                        </Link>
                    );
                }
            }

            return (
                <Link
                    to={{
                        pathname: `/detail/${list.id}`
                    }}
                    onClick={postClick}
                    >
                    <ul key={list.id} className="home_block">
                        {/* item 밥약 개별 게시글 */}
                        <div className="home_item">
                            {/* item 밥약 개별 게시글 상단 부분 (회색 직선 기준으로 윗부분) */}
                            <div id="home_top_part">
                                {
                                    list.image ?
                                    <div className='home_frame' style={{backgroundImage: `url(${list.image})`}} ></div>
                                    :
                                    <div className='home_frame' style={{backgroundImage: `url(${profile01})`}} ></div>
                                }
                                <div>
                                    <div id="home_info">
                                        <div id="hname">{list.name}</div>
                                        {
                                            list.category === '밥사주세요' ?
                                            <img id="hcategory" src={tag_sazo} />
                                            :
                                            list.category === '밥사줄게요' ?
                                            <img id="hcategory" src={tag_sazul} />
                                            :
                                            list.category === '같이먹어요' ?
                                            <img id="hcategory" src={tag_together} />
                                            :
                                            null
                                        }
                                    </div>
                                    <div id="hmajor">{list.major}</div> 
                                </div>
                                <div id="htime">{getDate(list.create_date)}</div>
                            </div>
                            {/* item 밥약 개별 게시글 하단 부분 (회색 직선 기준으로 아랫부분) home_bottom_part */}
                            <div className="home_bottom_part">
                                <span>{list.title}</span>
                                <div className="home_promise_info">
                                    {
                                        !list.option ?
                                        <div className='hclose'>마감</div>
                                        :
                                        null
                                    }
                                    <div className='home_promise_info2'><img src={icon_time01} style={{width: "10px", height: "10px", verticalAlign: "middle", paddingRight: "4px"}} />일시</div>
                                    <div className='home_promise_info2' id="hdate">{list.date}</div>
                                    <div className='home_promise_info2'><img src={icon_place02} style={{width: "8px", height: "11.5px", verticalAlign: "middle", paddingRight: "4px"}} />장소</div>
                                    <div className='home_promise_info2' id="hplace">{list.place}</div>
                                </div>
                            </div>
                        </div>
                    </ul>
                </Link>
            );
        });
    }
    
    return (
        <div>
            {/* 상단 메뉴바 */}
            <header className="navbar_main">
                <div className="navbar">
                    <div className="navbar_pagetitle">
                        <img src={home_logo} style={{width: "82px", height: "auto", marginBottom: "20px", cursor: "pointer"}} onClick={refreshLogo} />
                    </div>
                    <div className="navbar_icons">
                        {
                            !localStorage.getItem('noti_confirm')
                            ||
                            localStorage.getItem('noti_new') !== localStorage.getItem('noti_confirm')
                            ?
                            <Link
                                to={{
                                    pathname: `/noti_list`
                                }}
                                onClick={notiList}
                            >
                                <img src={icon_notice_active} style={{verticalAlign: "middle", width: "16.45px", height: "17.68px", marginBottom: "20px", marginRight: "23px"}} />
                            </Link>
                            :
                            <Link to="/noti_list">
                                <img src={icon_notice} style={{verticalAlign: "middle", width: "16.45px", height: "17.68px", marginBottom: "20px", marginRight: "23px"}} />
                            </Link>
                        }
                        <div>
                            {/* 사이드바 활성화 아이콘 버튼 */}
                            <input type="checkbox" id="checkbox" ref={navOffBtn} />
                            <label className="btn" for="checkbox"><img src={icon_chart} style={{verticalAlign: "middle", width: "15.85px", height: "16.96px"}} /></label> 
                            <div className="background" onClick={navOff}></div>
                            {/* sidebar 사이드바 */}
                            <div className="sidebar">
                                <input type="checkbox" id="checkbox" />
                                <label className="btn" for="checkbox" onClick={infoOff} style={{marginTop: "32px", marginLeft: "22px"}}><img src={icon_close} style={{verticalAlign: "middle", width: "13px", height: "14px"}} /></label>
                                {/* 현황판 */}
                                <div className="navbar_my_info">
                                    <div>
                                        <h3>채팅 성사 횟수</h3>
                                    </div>
                                </div>
                                <ul>
                                    <li>{post_user.conversations.length > 0  ? `${post_user.conversations.length}회` : null}</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </header>
            {/* 홈 페이지 전체 틀 (기본 margin) */}
            <div className="home">
                <div className="write_btn">
                    <Link to="/create">
                        <img src={icon_writing} style={{width: "48px", height: "48px"}} />
                    </Link>
                </div>
                {/* searchbar 검색창 */}
                {
                    noti && noti[0] ?
                    <Link 
                        to={{
                        pathname: `/noti/${noti[0].id}`
                        }}
                        onClick={notiNew}
                    >
                        <div className="home_noti1">
                            <div className="home_noti2">
                                <div>
                                    <div>{noti[0].title}</div>
                                    <div>NEW</div>
                                </div>
                            </div>
                        </div>
                    </Link>
                    :
                    null
                }
                <Link to="/search" onClick={postClick}>
                    <div className="home_searchbar1">
                        <div className="home_searchbar2">
                            <input type="text" placeholder="글 제목, 학과, 학번" style={{backgroundImage: "url(" + icon_search + ")", backgroundPosition: "15px", backgroundRepeat: "no-repeat", backgroundSize: "18.96px"}} />
                        </div>
                    </div>
                </Link>
                {/* content 밥약 게시글 전체 틀 */}
                <div className="home_content">
                    {/* <div className='home_loading_container'>
                        <div className='home_loading'></div>
                    </div> */}
                    {renderList}
                </div>
            </div>
            {/* 하단 네브바 bottom_navbar */}
            <nav className="bottom_navbar">
                <ul>
                    <li><Link to="/"><img src={tabar_01_active} style={{height: '40px', width: 'auto'}} /></Link></li>
                    <li><Link to="/restaurant"><img src={tabar_02} style={{height: '40px', width: 'auto'}} /></Link></li>
                    <li><Link to="/chat_list"><img src={tabar_03} style={{height: '40px', width: 'auto'}} /></Link></li>
                    <li><Link to="/mypage"><img src={tabar_04} style={{height: '40px', width: 'auto'}} /></Link></li>
                </ul>
            </nav>
        </div>

    );
}

export default HomePage;
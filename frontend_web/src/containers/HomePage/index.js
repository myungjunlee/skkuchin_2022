import React, { useEffect } from 'react';
import './style.css';
import Layout from '../../components/Layout';
import { useDispatch, useSelector } from 'react-redux';
import { read, logoutPost, getPostUser, logoutChat } from '../../actions';
import { Link } from 'react-router-dom';
import icon_writing from '../../image/drawable-xxxhdpi/icon_writing.png';
import icon_search from '../../image/drawable-xxxhdpi/icon_search.png';
import profile01 from '../../image/drawable-xxxhdpi/profile01.png';
import icon_time01 from '../../image/drawable-xxxhdpi/icon_time01.png';
import icon_place02 from '../../image/drawable-xxxhdpi/icon_place02.png';
import tag_sazo from '../../image/drawable-xxxhdpi/tag_sazo.png';
import tag_sazul from '../../image/drawable-xxxhdpi/tag_sazul.png';
import tag_together from '../../image/drawable-xxxhdpi/tag_together.png';

const HomePage = () => {

    const dispatch = useDispatch();
    const post = useSelector(state => state.post.data);    
    const auth = useSelector(state => state.auth);
    const post_user = useSelector(state => state.user);

    useEffect(() => {
        sessionStorage.removeItem('searchItem');
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
    }, [])

    useEffect(() => {
        if (auth.user) {
            dispatch(getPostUser(auth.user.uid));
        }
    }, [auth])

    // componentWillUnmount
    useEffect(() => {
        return () => {
            // cleanup
            dispatch(logoutPost());
            dispatch(logoutChat());
        }
    }, [])

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
                            <ul key={list.id}>
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
                    <ul key={list.id}>
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
        <Layout>
            {/* 홈 페이지 전체 틀 (기본 margin) */}
            <div className="home">
                <div className="write_btn">
                    <Link to="/create">
                        <img src={icon_writing} style={{width: "48px", height: "auto"}} />
                    </Link>
                </div>
                {/* searchbar 검색창 */}
                
                <Link to="/search" onClick={postClick}>
                    <div className="home_searchbar1">
                        <div className="home_searchbar2">
                            <input type="text" placeholder="글 제목, 학과, 학번" style={{backgroundImage: "url(" + icon_search + ")", backgroundPosition: "15px", backgroundRepeat: "no-repeat", backgroundSize: "18.96px"}} />
                        </div>
                    </div>
                </Link>
                {/* content 밥약 게시글 전체 틀 */}
                <div className="home_content">
                    {renderList}
                </div>
            </div>
        </Layout>
    );
}

export default HomePage;
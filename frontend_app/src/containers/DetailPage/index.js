import React, { useState, useEffect, useRef } from 'react';
import './style.css';
import { useDispatch, useSelector } from 'react-redux';
import { detail, remove, finish, checkAuthenticated, refreshToken, reportPost, getPostUser, blockPost, unBlockPost, logoutPost, logoutChat, logout } from '../../actions';
import { Link, Redirect, useHistory } from 'react-router-dom';
import icon_dotdotdot from '../../image/drawable-xxxhdpi/icon_dotdotdot.png';
import profile01 from '../../image/drawable-xxxhdpi/profile01.png';
import icon_time02 from '../../image/drawable-xxxhdpi/icon_time02.png';
import icon_place01 from '../../image/drawable-xxxhdpi/icon_place01.png';
import icon_send01 from '../../image/drawable-xxxhdpi/icon_send01.png';
import icon_back_arrow from '../../image/drawable-xxxhdpi/icon_back_arrow.png';
import ISTJ from '../../image/mbti/transparent/ISTJ.png';
import ISTP from '../../image/mbti/transparent/ISTP.png';
import ISFJ from '../../image/mbti/transparent/ISFJ.png';
import ISFP from '../../image/mbti/transparent/ISFP.png';
import INTJ from '../../image/mbti/transparent/INTJ.png';
import INTP from '../../image/mbti/transparent/INTP.png';
import INFJ from '../../image/mbti/transparent/INFJ.png';
import INFP from '../../image/mbti/transparent/INFP.png';
import ESTJ from '../../image/mbti/transparent/ESTJ.png';
import ESTP from '../../image/mbti/transparent/ESTP.png';
import ESFJ from '../../image/mbti/transparent/ESFJ.png';
import ESFP from '../../image/mbti/transparent/ESFP.png';
import ENTJ from '../../image/mbti/transparent/ENTJ.png';
import ENTP from '../../image/mbti/transparent/ENTP.png';
import ENFJ from '../../image/mbti/transparent/ENFJ.png';
import ENFP from '../../image/mbti/transparent/ENFP.png';
import Popup from '../../components/Popup';
import ProfilePage from '../ProfilePage';

const DetailPage = (props) => {

    const turnBtn = useRef(null);
    const history = useHistory();
    const dispatch = useDispatch();
    const id = props.match.params.id;
    const auth = useSelector(state => state.auth);
    const post = useSelector(state => state.post.data);
    const post_user = useSelector(state => state.user);
    // 차단 관련 발동
    const [blocking, setBlocking] = useState(false);
    // 게시물 삭제시 발동
    const [postRemoved, setPostRemoved] = useState(false);
    // 삭제 팝업
    const [delPopup, setDelPopup] = useState(false);
    // 마감 팝업
    const [endPopup, setEndPopup] = useState(false);
    // 신고 팝업
    const [reportPopup, setReportPopup] = useState(false);
    // 프로필 팝업
    const [profilePopup, setProfilePopup] = useState(false);
    // 차단 팝업
    const [blockPopup, setBlockPopup] = useState(false);
    // 차단 해제 팝업
    const [unblockPopup, setUnblockPopup] = useState(false);

    const [postDetail, setPostDetail] = useState({
        user: '',
        title: '',
        name: '',
        major: '',
        student_id: '',
        mbti: '',
        image: '',
        date:'',
        place:'',
        content: '',
        uid: '',
        option: '',
        create_date: ''
    });

    const { user, title, name, major, student_id, mbti, image, date, place, content, uid, option, create_date } = postDetail;

    useEffect(() => {
        document.documentElement.scrollTop = 0;
        dispatch(detail(id));
    }, [])


    useEffect(() => {
        if (auth.user && uid && auth.user.uid !== uid) {
            dispatch(getPostUser(auth.user.uid));
        }
    }, [uid])


    useEffect(() => {
        if (post) {
            setPostDetail({
                user: post.user,
                title: post.title,
                name: post.name,
                major: post.major,
                student_id: post.student_id,
                mbti: post.mbti,
                image: post.image,
                date: post.date,
                place: post.place,
                content: post.content,
                uid: post.uid,
                option: post.option,
                create_date: post.create_date
            });
        }
    }, [post])

    // componentWillUnmount
    useEffect(() => {
        return () => {
            // cleanup
            dispatch(logoutPost());
            dispatch(logoutChat());
        }
    }, [])

    // 신고 옵션
    const reportOption = (e, num) => {
        e.preventDefault();
        setReportPopup(false);
        if (num === 1) {
            if (window.confirm('게시물의 주제가 게시판의 성격에 크게 벗어나, 다른 이용자에게 불편을 끼칠 수 있는 게시물\r\n\r\n신고하시겠습니까?')) {
                dispatch(reportPost('게시판 성격에 부적절함', auth.user.uid, id));
            }
        } else if (num === 2) {
            if (window.confirm('비아냥, 비속어 등 예의범절에 벗어나거나, 특정인이나 단체, 지역을 비방하는 등 논란 및 분란을 일으킬 수 있는 게시물\r\n\r\n신고하시겠습니까?')) {
                dispatch(reportPost('욕설/비하', auth.user.uid, id));
            }
        } else if (num === 3) {
            if (window.confirm('청소년유해메체물, 외설, 음란물, 음담패설, 신체사진을 포함하거나, 불건전한 만남, 채팅, 대화, 통화를 위한 게시물\r\n\r\n신고하시겠습니까?')) {
                dispatch(reportPost('음란물/불건전한 만남 및 대화', auth.user.uid, id));
            }
        } else if (num === 4) {
            if (window.confirm('타 서비스, 앱, 사이트 등 게시판 외부로 회원을 유도하거나 공동구매, 할인 쿠폰, 홍보성 이벤트 등 허가되지 않은 광고/홍보 게시물\r\n\r\n신고하시겠습니까?')) {
                dispatch(reportPost('상업적 광고 및 판매', auth.user.uid, id));
            }
        } else if (num === 5) {
            if (window.confirm('게시물 무단 유출, 타인의 개인정보 유출, 관리자 사칭 등 타인의 권리를 침해하거나 관련법에 위배되는 게시물\r\n\r\n신고하시겠습니까?')) {
                dispatch(reportPost('유출/사칭/사기', auth.user.uid, id));
            }
        } else if (num === 6) {
            if (window.confirm('중복글, 도배글, 낚시글, 내용 없는 게시물\r\n\r\n신고하시겠습니까?')) {
                dispatch(reportPost('낚시/놀람/도배', auth.user.uid, id));
            }
        } else {
            if (window.confirm('특정 정당이나 정치인에 대한 비난/비하/모욕 또는 지지/홍보/선거운동 및 선거 관련법에 위배되는 게시물\r\n\r\n신고하시겠습니까?')) {
                dispatch(reportPost('정당/정치인 비하 및 선거운동', auth.user.uid, id));
            }
        }
    }

    if (auth.user && auth.user.uid !== uid && !Array.isArray(post_user.users)) {
        if (
            !blocking
            &&
            post_user.users.user.post_uid.includes(uid)            
        )
        {
            setBlocking(true);
        }
        else if (
            blocking
            &&
            !post_user.users.user.post_uid.includes(uid)
        ){
            setBlocking(false);
        }
    }

    const block = () => {
        dispatch(blockPost({uid_1: auth.user.uid, uid_2: uid}));
    }

    const unblock = () => {
        dispatch(unBlockPost({uid_1: auth.user.uid, uid_2: uid}));
    }

    // 신고 팝업 열기
    const openReportPopup = () => {
        menuOff();
        setReportPopup(true);
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

    // 삭제 팝업 열기
    const openDelPopup = () => {
        menuOff();
        setDelPopup(true);
    }

    // 삭제 팝업 닫기
    const closeDelPopup = () => {
        setDelPopup(false);
    }

    // 마감 팝업 열기
    const openEndPopup = () => {
        menuOff();
        setEndPopup(true);
    }

    // 마감 팝업 닫기
    const closeEndPopup = () => {
        setEndPopup(false);
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

    const deleteConfirm = () => {

        const apiDel = () => {
            dispatch(remove(id))
            .then(() => {
                setPostRemoved(true);
            })
            .catch((err) => {
                console.log(err);
            })
        }

        dispatch(checkAuthenticated())
        .then(() => {
            apiDel();
        })
        .catch((err) => {
            console.log(err);
            dispatch(refreshToken())
            .then(() => {
                apiDel();
            })
            .catch((err) => {
                console.log(err);
                dispatch(logout());
            })
        })
    };

    const goBack = () => {
        history.goBack();
    };

    const noOwner = () => {
        if (option) {
            return (
                <Link to={{
                    pathname: '/chat',
                    state: {
                        uid: uid,
                        post_id: id,
                        name: name,
                        major : major,
                        student_id : student_id,
                        image : image,
                        mbti: mbti
                    }
                }}>
                    <button className="notice_btn" style={{width: "100%", height: "44px"}}>
                        밥약 신청하기
                        <img src={icon_send01} style={{verticalAlign: "middle", width: "17px", height: "17.5px", paddingLeft: "7px"}} />
                    </button>
                </Link>
            )

        } else {
            return (
                <button className="notice_btnOver" style={{width: "100%", height: "44px"}} disabled>
                    마감되었습니다
                </button>
            ) 
        }
    }

    const optionCase = () => {
        if (option) {
            return (
                <button className="notice_btn" style={{width: "100%", height: "44px"}} onClick={openEndPopup}>
                    밥약 마감하기
                    {/* <img src={icon_send01} style={{verticalAlign: "middle", width: "17px", paddingLeft: "20px"}} /> */}
                </button>
            )
        } else {
            return (
                <button className="notice_btnOver" style={{width: "100%", height: "44px"}} disabled>
                    마감되었습니다
                </button>
            )
        }

    }

    const clickFinish = () => {

        const apiFin = () => {
            dispatch(finish(id))
            .then(() => {
                dispatch(detail(id));
            })
            .catch((err) => {
                console.log(err);
            })
        }

        dispatch(checkAuthenticated())
        .then(() => {
            apiFin();
        })
        .catch((err) => {
            console.log(err);
            dispatch(refreshToken())
            .then(() => {
                apiFin();
            })
            .catch((err) => {
                console.log(err);
                dispatch(logout());
            })
        })
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

    const menuOff = () => {
        turnBtn.current.checked = false;
    }

    if (!auth.isAuthenticated) {
        return <Redirect to = '/login' />
    }

    if (postRemoved) {
        return <Redirect to = '/' />
    }
    
    return (
        <div className="notice">
            {/* header 헤더 : 뒤로가기 아이콘, 페이지 제목, 설정 아이콘 */}
            <div className="notice_header">
                <div className="notice_header2">
                    <div className="notice_hleft">
                        <img src={icon_back_arrow} style={{marginTop: "2.12px", width: "15px", height: "14px", paddingRight: "15px", cursor:"pointer"}} onClick={goBack} />
                        밥약 게시판
                    </div>
                    {
                        user === auth.user.id ?
                        <div>
                            <input type="checkbox" id="notice_checkbox" ref={turnBtn} />
                            <label class="notice_checkBtn" for="notice_checkbox"><img src={icon_dotdotdot} style={{height: '14px', width: '3px', padding: '0 20px'}} /></label>
                            <div className="notice_background" onClick={menuOff}></div>
                            <div class="notice_menu">
                                <ul>
                                    <Link to={{pathname: `/edit/${id}`}}>
                                        <li>수정하기</li>
                                    </Link>
                                    <li onClick={openDelPopup}>삭제하기</li>
                                </ul>
                            </div>
                        </div>
                        :
                        <div>
                            <input type="checkbox" id="notice_checkbox" ref={turnBtn} />
                            <label class="notice_checkBtn" for="notice_checkbox"><img src={icon_dotdotdot} style={{height: '14px', width: '3px', padding: '0 20px'}} /></label>
                            <div className="notice_background" onClick={menuOff}></div>
                            <div class="notice_menu">
                                <ul>
                                    {
                                        blocking ?
                                        null
                                        :
                                        <li onClick={openProfilePopup}>프로필 보기</li>
                                    }
                                    {
                                        blocking ?
                                        <li onClick={openUnblockPopup}>차단 해제하기</li>
                                        :
                                        <li onClick={openBlockPopup}>차단하기</li>
                                    }
                                    <li onClick={openReportPopup}>신고하기</li>
                                </ul>
                            </div>
                        </div>
                    }
                </div>
            </div>
            {/* 게시글 틀 */}
            {
                blocking ? 
                <div class="notice_item">
                    <div class="notice_item_title" style={{marginLeft: '20px'}}>차단한 게시물입니다</div>
                </div>
                :
                <div className="notice_item">
                    {/* 게시물 상단 부분 (회색 직선 기준으로 윗부분) */}
                    {/* home 페이지와 공통 */}
                    <div id="notice_top_part">
                        {
                            image ?
                            <div className='notice_frame' style={{backgroundImage: `url(${image})`}} ></div>
                            :
                            <div className='notice_frame' style={{backgroundImage: `url(${profile01})`}} ></div>
                        }
                        <div>
                            <div id="notice_info">
                                <div id="notice_name">{name}</div>
                                {
                                    mbti ?
                                    <div id="notice_mbti">{mbti}</div>
                                    :
                                    null
                                }
                                <div id="notice_number">{student_id ? `${student_id.slice(2,4)}학번` : null}</div>
                            </div>
                            <div id="notice_major">{major}</div> 
                        </div>
                        <div id="notice_time">{create_date ? getDate(create_date) : null}</div>
                    </div>
                    {/* 게시물 하단 부분 (회색 직선 기준으로 아랫부분) notice_bottom_part */}
                    <div className="notice_bottom_part">
                        {/* 하단 부분 : 게시글 제목 / 본문 */}
                        <div className="notice_item">
                            <div className="notice_item_title">{title}</div>
                            <div className="notice_item_content">{content}</div>
                            {
                                mbti ?
                                <div className="notice_mbti_img">
                                    <img 
                                        src={
                                            mbti === 'ISTJ' ? ISTJ :
                                            mbti === 'ISTP' ? ISTP :
                                            mbti === 'ISFJ' ? ISFJ :
                                            mbti === 'ISFP' ? ISFP :
                                            mbti === 'INTJ' ? INTJ :
                                            mbti === 'INTP' ? INTP :
                                            mbti === 'INFJ' ? INFJ :
                                            mbti === 'INFP' ? INFP :
                                            mbti === 'ESTJ' ? ESTJ :
                                            mbti === 'ESTP' ? ESTP :
                                            mbti === 'ESFJ' ? ESFJ :
                                            mbti === 'ESFP' ? ESFP :
                                            mbti === 'ENTJ' ? ENTJ :
                                            mbti === 'ENTP' ? ENTP :
                                            mbti === 'ENFJ' ? ENFJ :
                                            ENFP
                                        }
                                        style={{width: "68px", height: "67px", padding: "13px 0 31px"}} 
                                    />
                                </div>
                                :
                                null
                            }
                        </div>
                        {/* 하단 부분 : 일시/장소 포함 밥약 신청박스 */}
                        <div className="notice_promise_info">
                            {/* 일시 */}
                            <div>
                                <div className="date"><img src={icon_time02} style={{verticalAlign: "middle", width: "12px", height: '12px', marginRight: "6px"}} />일시</div>
                                <div className="date_text">{date}</div>
                            </div>
                            {/* 장소 */}
                            <div>
                                <div className="place"><img src={icon_place01} style={{verticalAlign: "middle", width: "10px", height: '14px', paddingLeft: "1px", marginRight: "7px"}} />장소</div>
                                <div className="place_text">{place}</div>
                            </div> 
                            {/* 밥약 신청버튼 */}
                            { user === auth.user.id ? optionCase() : noOwner() }
                        </div>
                    </div>
                </div>
            }
            { delPopup ? <Popup popupOff={closeDelPopup} popupFunc={deleteConfirm} popupContent='게시물을 삭제하시겠습니까?' popupOk='확인' popupCancel='취소'  /> : null }
            { endPopup ? <Popup popupOff={closeEndPopup} popupFunc={clickFinish} popupContent='밥약을 마감하시겠습니까?' popupOk='확인' popupCancel='취소'  /> : null }
            { profilePopup ? <ProfilePage name={name} major={major} student_id={student_id} mbti={mbti} image={image} popupOff={closeProfilePopup} /> : null }
            { blockPopup ? <Popup popupOff={closeBlockPopup} popupFunc={block} popupContent='차단 시 서로 게시글을 볼 수 없습니다. &#13;&#10;차단하시겠습니까?' popupOk='차단' popupCancel='취소'  /> : null }
            { unblockPopup ? <Popup popupOff={closeUnblockPopup} popupFunc={unblock} popupContent='차단을 해제하시겠습니까?' popupOk='해제' popupCancel='취소'  /> : null }
            { 
                reportPopup ? 
                <div class="popup_wrap" onClick={() => setReportPopup(false)}>
                    <div class="report_box">
                        <div class="popup_content">
                            <div class="report_text">
                                <div>신고 사유 선택</div>
                            </div>
                            <div class="report_buttonDiv">
                                <div class="report_button" onClick={e => reportOption(e,1)}>게시판 성격에 부적절함</div>
                                <div class="report_button" onClick={e => reportOption(e,2)}>욕설/비하</div>
                                <div class="report_button" onClick={e => reportOption(e,3)}>음란물/불건전한 만남 및 대화</div>
                                <div class="report_button" onClick={e => reportOption(e,4)}>상업적 광고 및 판매</div>
                                <div class="report_button" onClick={e => reportOption(e,5)}>유출/사칭/사기</div>
                                <div class="report_button" onClick={e => reportOption(e,6)}>낚시/놀람/도배</div>
                                <div class="report_button" onClick={e => reportOption(e,7)}>정당/정치인 비하 및 선거운동</div>
                            </div>
                        </div>
                    </div>
                </div>
                : null 
            }
        </div>
    );
}

export default DetailPage;
import React, { useEffect, useState } from 'react';
import './style.css';
import Layout from '../../components/Layout';
import Popup from '../../components/Popup';
import { useSelector, useDispatch } from 'react-redux';
import { Link, Redirect, useHistory } from "react-router-dom";
import { read, finish, checkAuthenticated, logoutPost, refreshToken, logout } from '../../actions';
// import icon_back_arrow from '../../image/drawable-xxxhdpi/icon_back_arrow.png';
// import icon_close from '../../image/drawable-xxxhdpi/icon_close.png';

const MyListPage = (props) => {

    const dispatch = useDispatch();
    const history = useHistory();
    const auth = useSelector(state => state.auth);
    const post = useSelector(state => state.post.data);
    let newList = null;
    let renderList = null;

    // 마감 팝업
    const [endPopup, setEndPopup] = useState(false);

    useEffect(() => {
        document.documentElement.scrollTop = 0;
        dispatch(read());
    }, [])

    // componentWillUnmount
    useEffect(() => {
        return () => {
            // cleanup
            dispatch(logoutPost());
        }
    }, [])

    const getDate = (date) => {
        
        const created = new Date(date);
        let created_date = created.getDate();
        let created_month = created.getMonth()+1;
        let created_year = String(created.getFullYear()).slice(2,4);
        let time;

        if (created_date < 10) {
            created_date = '0'+created_date;
        }
        if (created_month < 10) {
            created_month = '0'+created_month;
        }
        
        time = `${created_year}.${created_month}.${created_date}`;

        return time;
    }

    if (auth.user && Array.isArray(post)) {
        newList = post.filter((list) => list.user === auth.user.id);

        renderList = newList.map((list) => {
            return (
                <div className="manage_content_item">
                    <Link 
                        to={{
                        pathname: `/detail/${list.id}`
                        }}
                    >
                        <div>
                            {/* 게시물 제목 / 게시 날짜 */}
                            <div className="manage_content_litem" key={list.id}>
                                <div className="manage_litem_text">{list.title}</div>
                                <div className="manage_litem_date">{list.create_date ? getDate(list.create_date) : null}</div>
                            </div>
                        </div>
                    </Link>
                    {/* 게시물 대기/마감 여부 */}
                    <div className="manage_content_ritem">
                        {
                            list.option ?
                            <button className="manage_state_wait" style={{width: "98px", border: "0"}} onClick={e => openEndPopup(list.id,e)}>
                                마감하기
                            </button>
                            : 
                            <button className="manage_state_done" style={{width: "98px", border: "0"}}>
                                마감
                            </button>
                        }
                    </div>
                </div>
            );
        });
    }

    const clickFinish = () => {

        const apiDispatch = () => {
            dispatch(finish(endPopup))
            .then(() => {
                dispatch(read());
            })
            .catch((err) => {
                console.log(err);
            })
        }

        dispatch(checkAuthenticated())
        .then(() => {
            apiDispatch();
        })
        .catch((err) => {
            console.log(err);
            dispatch(refreshToken())
            .then(() => {
                apiDispatch();
            })
            .catch((err) => {
                console.log(err);
                dispatch(logout());
            })
        })
    }

    // 마감 팝업 열기
    const openEndPopup = (id,e) => {
        e.preventDefault();
        setEndPopup(id);
    }

    // 마감 팝업 닫기
    const closeEndPopup = () => {
        setEndPopup(false);
    }

    // 뒤로 가기 버튼
    const goBack = () => {
        history.goBack();
    };

    if (!auth.isAuthenticated) {
        return <Redirect to = '/login' />
    } 

    return (
        <Layout>
            {/* 게시물 관리 페이지 전체 틀 (기본 margin) */}
            <div className="manage">
                {/* header 헤더 : 뒤로가기 아이콘, 페이지 제목, 닫기 아이콘 */}
                <div className="manage_header">
                    <div className="manage_hleft">
                        {/* <img src={icon_back_arrow} style={{marginTop: "2.12px", width: "15px", height: "14px", paddingRight: "15px"}} /> */}
                            게시물 관리
                    </div>
                    {/* <div className="manage_hright">
                        <img src={icon_close} style={{verticalAlign: "middle", width: "14px", height: "14px"}} />
                    </div> */}
                </div>
                {/* 게시물 전체 틀 */}
                <div className="manage_content">
                    {renderList}
                </div>
            </div>
            { endPopup ? <Popup popupOff={closeEndPopup} popupFunc={clickFinish} popupContent='밥약을 마감하시겠습니까?' popupOk='확인' popupCancel='취소'  /> : null }
        </Layout>
    );
}

export default MyListPage;
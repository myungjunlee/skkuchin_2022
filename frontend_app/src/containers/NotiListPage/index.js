import React, { useEffect } from 'react';
import './style.css';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from "react-router-dom";
import { noti_read, logoutNoti } from '../../actions';
import icon_back_arrow from '../../image/drawable-xxxhdpi/icon_back_arrow.png';
// import icon_close from '../../image/drawable-xxxhdpi/icon_close.png';

const NotiListPage = (props) => {

    const dispatch = useDispatch();
    const noti = useSelector(state => state.noti.data);
    let renderList = null;

    useEffect(() => {
        document.documentElement.scrollTop = 0;
        dispatch(noti_read());
    }, [])

    // componentWillUnmount
    useEffect(() => {
        return () => {
            // cleanup
            dispatch(logoutNoti());
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

    const notiNew = () => {
        localStorage.setItem('noti', noti[0].id);
    }

    if (noti && Array.isArray(noti)) {
        renderList = noti.map((list) => {
            return (
                <div className="noti_list_content_item">
                    <Link 
                        to={{
                        pathname: `/noti/${list.id}`
                        }}
                        onClick={notiNew}
                    >
                        {/* 게시물 제목 / 게시 날짜 */}
                        <div key={list.id}>
                            {
                                noti[0].id === list.id ?
                                <div className="noti_list_item_text">
                                    <div>{list.title}</div>
                                    <div className="noti_list_item_new">NEW</div>
                                </div>
                                :
                                <div className="noti_list_item_text">{list.title}</div>
                            }
                            <div className="noti_list_item_date">{list.create_date ? getDate(list.create_date) : null}</div>
                        </div>
                    </Link>
                </div>
            );
        });
    }

    return (
        <div className="noti_list">
            {/* header 헤더 : 뒤로가기 아이콘, 페이지 제목, 닫기 아이콘 */}
            <div className="noti_list_header">
                <div className="noti_list_hleft">
                    <Link to="/">
                        <img src={icon_back_arrow} style={{marginTop: "2.12px", width: "15px", height: "14px", paddingRight: "15px"}} />
                    </Link>
                        공지사항 & 이벤트
                </div>
            </div>
            {/* 게시물 전체 틀 */}
            <div className="noti_list_content">
                {renderList}
            </div>
        </div>
    );
}

export default NotiListPage;
import React, { useEffect } from 'react';
import './style.css';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useHistory } from "react-router-dom";
import { logoutNoti, noti_detail } from '../../actions';
import icon_back_arrow from '../../image/drawable-xxxhdpi/icon_back_arrow.png';
import logo_footer from '../../image/drawable-xxxhdpi/logo_footer.png';

const NotiPage = (props) => {

    const id = props.match.params.id;
    const dispatch = useDispatch();
    const history = useHistory();
    const noti = useSelector(state => state.noti.data);

    useEffect(() => {
        document.documentElement.scrollTop = 0;
        dispatch(noti_detail(id));
    }, [])

    // componentWillUnmount
    useEffect(() => {
        return () => {
            // cleanup
            dispatch(logoutNoti());
            localStorage.removeItem('noti');
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

    // 뒤로 가기 버튼
    const goBack = () => {
        history.goBack();
    };

    return (
        <div className="noti">
            {/* header 헤더 : 뒤로가기 아이콘, 페이지 제목, 닫기 아이콘 */}
            <div className="noti_header">
                <div className="noti_hleft">
                    <img src={icon_back_arrow} style={{marginTop: "2.12px", width: "15px", height: "14px", paddingRight: "15px"}} onClick={goBack} />
                        공지사항 & 이벤트
                </div>
            </div>
            {/* 게시물 전체 틀 */}
            <div className="noti_content">
                <div className="noti_content_item">
                    {
                        noti && localStorage.getItem('noti') === id ?
                        <div className="noti_item_text">
                            <div>{noti.title}</div>
                            <div className="noti_item_new">NEW</div>
                        </div>
                        :
                        <div className="noti_item_text">{noti && noti.title}</div>
                    }
                        <div className="noti_item_date">{noti && noti.create_date ? getDate(noti.create_date) : null}</div>
                </div>
                <div className='noti_content_text'>
                    {noti && noti.content ? noti.content : null}
                </div>
                <div className='noti_bottom_img'>
                    <img src={logo_footer} />
                </div>
            </div>
            <Link to='/noti_list'>
                <div className='noti_button'>
                    <button className="noti_button2">목록으로 돌아가기</button>
                </div>
            </Link>
        </div>
    );
}

export default NotiPage;
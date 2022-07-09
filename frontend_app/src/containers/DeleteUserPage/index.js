import React, { useEffect, useState } from 'react';
import { user_delete, checkAuthenticated, refreshToken, logout } from '../../actions';
import { useDispatch } from 'react-redux';
import './style.css';
import Popup from '../../components/Popup';
import DeleteConfirmPage from '../DeleteConfirmPage';
import { Redirect, useHistory } from 'react-router-dom';
import icon_back_arrow from '../../image/drawable-xxxhdpi/icon_back_arrow.png';
import loading04 from '../../image/drawable-xxxhdpi/loading04.png';

const DeleteUserPage = (props) => {

    const dispatch = useDispatch();
    const history = useHistory();
    const [confirmed, setConfirmed] = useState(0);

   // 버튼 활성화
    const [deleteBtn, setDeleteBtn] = useState(false);

    // 삭제 팝업
    const [delPopup, setDelPopup] = useState(false);
    // 로딩 활성화
    const [loading, setLoading] = useState(false);
    // 토큰 없음
    const [noToken, setNoToken] = useState(false);

    const [current_password, setPassword] = useState('');

    const uid = props.location.state.uid;

    const onChange = e => setPassword(e.target.value);

    useEffect(() => {
        document.documentElement.scrollTop = 0;
    }, [])

    // 다음 버튼 활성화
    useEffect(() => {
        if (!current_password) {
            if (deleteBtn) {
                setDeleteBtn(false);
            }
        } else 
        {
            if (!deleteBtn) {
                setDeleteBtn(true);
            }
        }
    }, [current_password])

    // 회원 탈퇴 버튼 클릭
    const deleteUser = () => {
        setLoading(true);

        const apiDispatch = () => {
            dispatch(user_delete(uid, current_password))
            .then(() => {
                setLoading(false);
                setConfirmed(1);
            })
            .catch((error) => {
                dispatch(logout());
                setLoading(false);
                console.log(error)
                setConfirmed(-1);
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
                setLoading(false);
                dispatch(logout());
                setNoToken(true);
            })
        })
    }

    // 삭제 팝업 열기
    const openDelPopup = () => {
        setDelPopup(true);
    }

    // 삭제 팝업 닫기
    const closeDelPopup = () => {
        setDelPopup(false);
    }

    // 뒤로 가기 버튼
    const goBack = () => {
        history.goBack();
    };

    if (noToken) {
        return <Redirect to='/login' />
    }

    return (
        <div className='delete'>
            <div className="delete_header">
                <div className="delete_header2">
                    <div className="upload_hleft">
                        <img src={icon_back_arrow} style={{marginTop: "2.12px", width: "15px", height: "14px", paddingRight: "15px", cursor: 'pointer'}} onClick={goBack}/> 
                        회원 탈퇴
                    </div>
                </div>
            </div>
            <div className="delete_noti">
                현재 비밀번호를 입력해주세요
            </div>
            <div className="delete_box">
                <input 
                    type="password" 
                    className="delete_int" 
                    maxlength="20"
                    placeholder="비밀번호"
                    name='current_password'
                    value={current_password}
                    onChange={e => onChange(e)}
                />
            </div>
            <div className="delete_btn">
                {
                    deleteBtn ?
                    <button className='delete_activate' onClick={openDelPopup}>탈퇴하기</button>
                    :
                    <button className='delete_deactivate' disabled>탈퇴하기</button>
                }
            </div>
            <div className="delete_explain">
                <p>
                    ※ 탈퇴 시 본인의 채팅 기록을 제외한 게시글 및 모든 정보가 소멸되며 복구할 수 없습니다.
                </p>
            </div>
            { 
                loading ? 
                <div class="popup_wrap">
                    <div class="popup_box">
                        <div class="popup_content">
                            <div class="popup_text">
                                <img src={loading04} style={{width: '132px', height: '28px', marginBottom: '15px' }} />
                                <div>로딩중</div>
                            </div>
                        </div>
                    </div>
                </div> 
                : 
                null 
            }
            { delPopup ? <Popup popupOff={closeDelPopup} popupFunc={deleteUser} popupContent='회원 탈퇴하시겠습니까?' popupOk='탈퇴' popupCancel='취소'  /> : null }
            { confirmed !== 0 ? <DeleteConfirmPage confirmedNum={confirmed} /> : null }
        </div>
    );
}

export default DeleteUserPage;
import React, { useEffect, useState } from 'react';
import { set_password, checkAuthenticated, refreshToken, logout } from '../../actions';
import { useDispatch, useSelector } from 'react-redux';
import ChangeConfirmPage from '../ChangeConfirmPage'
import './style.css';
import Layout from '../../components/Layout';
import loading04 from '../../image/drawable-xxxhdpi/loading04.png';
import { Redirect } from 'react-router-dom';

const PasswordChangePage = (props) => {

    const dispatch = useDispatch();
    const auth = useSelector(state => state.auth); 
    const [confirmed, setConfirmed] = useState(0);

    // 패스워드 체크
    const [pwValid, setPwValid] = useState(false);
    const [pwMatch, setPwMatch] = useState(false);

   // 버튼 활성화
   const [changeBtn, setChangeBtn] = useState(false);
    // 로딩 활성화
    const [loading, setLoading] = useState(false);
    // 토큰 없음
    const [noToken, setNoToken] = useState(false);

    const [formData, setFormData] = useState({
        current_password: '',
        new_password: '',
        re_new_password: ''
    });

    const { current_password, new_password, re_new_password } = formData;

    useEffect(() => {
        document.documentElement.scrollTop = 0;
    }, [])

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    //비밀번호 입력하는 동안 실행되는 함수
    const onPWChange = e => {
        e.preventDefault();
        const password = e.target.value;

        // 비밀번호 일치 여부
        if (!password || !re_new_password) {
            setPwMatch(false);
        } else if (password === re_new_password) {
            setPwMatch(true);
        } else {
            setPwMatch(false);
        }

        //길이 8 이상, 영어, 숫자, 특수문자 포함
        if (password.length < 8 || !(password.match(/[a-z]/) || password.match(/[A-Z]/))
        || !password.match(/\d/) || !password.match(/[~!@#$%^&*()_+|<>?:{}]/)) {
            setPwValid(false);
        }
        else {
            setPwValid(true);
        }
        setFormData({ ...formData, [e.target.name]: password });
    }

    //비밀번호 재입력하는동안 실행되는 함수
    const onConfirmChange = e => {
        e.preventDefault();
        const confirmValue = e.target.value;

        if (!new_password || !confirmValue) {
            setPwMatch(false);
        } else if (new_password === confirmValue) {
            setPwMatch(true);
        } else {
            setPwMatch(false);
        }
        setFormData({ ...formData, [e.target.name]: confirmValue });
    }

    // 다음 버튼 활성화
    if (
        !current_password||!pwMatch||!pwValid
    )
    {
        if (changeBtn) {
            setChangeBtn(false);
        }
    } 
    else 
    {
        if (!changeBtn) {
            setChangeBtn(true);
        }
    }

    // 최종 비밀번호 변경
    const changePassword = (e) => {
        
        setLoading(true);
        e.preventDefault();

        const apiDispatch = () => {
            dispatch(set_password(current_password, new_password, re_new_password))
            .then(() => {
                setLoading(false);
                setConfirmed(1);
            })
            .catch((error) => {
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

    if (noToken) {
        return <Redirect to='/login' />
    }

    return (
        <Layout>
            <div className='password_change'>
                <div className="password_change_header">
                    <div className="password_change_header2">
                        <div className="upload_hleft">비밀번호 변경</div>
                    </div>
                </div>
                <div className="password_change_noti">
                    현재 비밀번호, 새로운 비밀번호를 입력해주세요
                </div>
                <div clasclassNames="password_reset01">
                    <div className="password_change_text">
                        <div id="password_change_password">
                            <div className="password_change_box">
                                <input 
                                    type="password" 
                                    className="password_change_int" 
                                    maxlength="20"
                                    placeholder="현재 비밀번호"
                                    name='current_password'
                                    value={current_password}
                                    onChange={e => onChange(e)}
                                />
                            </div>
                        </div>
                        <div id="password_change_password">
                            <div className="password_change_box">
                                <input 
                                    type="password" 
                                    className="password_change_int" 
                                    maxlength="20"
                                    placeholder="새 비밀번호"
                                    name='new_password'
                                    value={new_password}
                                    onChange={e => onPWChange(e)}
                                />
                            </div>
                        </div>
                        <div id="password_change_passwordcheck">
                            <div className="password_change_box">
                                <input
                                    type="password" 
                                    className="password_change_int" 
                                    maxlength="20" 
                                    placeholder="새 비밀번호 확인"
                                    name='re_new_password'
                                    value={re_new_password}
                                    onChange={e => onConfirmChange(e)}
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="password_change_btn">
                    {
                        changeBtn ?
                        <button className='password_change_activate' onClick={changePassword}>변경하기</button>
                        :
                        <button className='password_change_deactivate' disabled>변경하기</button>
                    }
                </div>
                <div className="password_change_explain">
                    <p>
                        ※ 8자 이상 + 영문 + 숫자 + 특수문자로 조합해주세요.
                        <br/>
                        <br/>
                        ※ 현재 비밀번호와 다른 새로운 비밀번호로 입력해주세요.
                    </p>
                </div>
                { 
                    loading ? 
                    <div class="popup_wrap">
                        <div class="popup_box">
                            <div class="popup_content">
                                <div class="popup_text">
                                    <img src={loading04} style={{width: '132px', height: '28.5px',  marginBottom: '15px' }} />
                                    <div>로딩중</div>
                                </div>
                            </div>
                        </div>
                    </div> 
                    : 
                    null 
                }
                { 
                    confirmed !== 0 ? <ChangeConfirmPage confirmedNum={confirmed} />
                    : null
                }
            </div>
        </Layout>
    );
}

export default PasswordChangePage;
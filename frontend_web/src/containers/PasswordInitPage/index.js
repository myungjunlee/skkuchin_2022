import React, { useState } from 'react';
import { reset_password_confirm } from '../../actions';
import { useDispatch } from 'react-redux';
import ResetConfirmPage from '../ResetConfirmPage'
import './style.css';
import loading04 from '../../image/drawable-xxxhdpi/loading04.png';

const PasswordInitPage = ({ match }) => {

    const dispatch = useDispatch();
    const [confirmed, setConfirmed] = useState(0);
    const uid = match.params.uid;
    const token = match.params.token;

    // 패스워드,아이디 체크
    const [pwValid, setPwValid] = useState(false);
    const [pwMatch, setPwMatch] = useState(false);

   // 버튼 활성화
   const [resetBtn, setResetBtn] = useState(false);
    // 로딩 활성화
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        password: '',
        re_password: ''
    });

    const { password, re_password } = formData;

    //비밀번호 입력하는 동안 실행되는 함수
    const onPWChange = e => {
        e.preventDefault();
        const password = e.target.value;

        // 비밀번호 일치 여부
        if (!password || !re_password) {
            setPwMatch(false);
        } else if (password === re_password) {
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

        if (!password || !confirmValue) {
            setPwMatch(false);
        } else if (password === confirmValue) {
            setPwMatch(true);
        } else {
            setPwMatch(false);
        }
        setFormData({ ...formData, [e.target.name]: confirmValue });
    }

    // 다음 버튼 활성화
    if (
        !pwMatch||!pwValid
    )
    {
        if (resetBtn) {
            setResetBtn(false);
        }
    } 
    else 
    {
        if (!resetBtn) {
            setResetBtn(true);
        }
    }

    // 최종 회원 가입
    const resetPassword = (e) => {

        setLoading(true);
        e.preventDefault();

        dispatch(reset_password_confirm(uid, token, password, re_password))
        .then(() => {
        setLoading(false);
        setConfirmed(1);
        })
        .catch((error) => {
            setLoading(false);
            console.log(error);
            setConfirmed(-1);
        })

    }

    return (
        <div className='passwordReset01'>
            <div className="passwordReset01_A">
                <div className="passwordReset01_header">
                    <div className="passwordReset01_header2">
                        <div className="upload_hleft">비밀번호 재설정</div>
                    </div>
                </div>
            </div>
            <div className="passwordReset01_noti">
                새로운 비밀번호를 입력해주세요
            </div>
            <div clasclassNames="password_reset01">
                <div className="passwordReset01_text">
                    <div id="passwordReset01_password">
                        <div className="passwordReset01_box">
                            <input 
                                type="password" 
                                className="passwordReset01_int" 
                                maxlength="20"
                                placeholder="비밀번호"
                                name='password'
                                value={password}
                                onChange={e => onPWChange(e)}
                            />
                        </div>
                    </div>
                    <div id="passwordReset01_passwordcheck">
                        <div className="passwordReset01_box">
                            <input
                                type="password" 
                                className="passwordReset01_int" 
                                maxlength="20" 
                                placeholder="비밀번호 확인"
                                name='re_password'
                                value={re_password}
                                onChange={e => onConfirmChange(e)}
                            />
                        </div>
                    </div>
                </div>
            </div>
            <div className="passwordReset01_btn">
                {
                    resetBtn ?
                    <button className='passwordReset01_activate' onClick={resetPassword}>변경하기</button>
                    :
                    <button className='passwordReset01_deactivate' disabled>변경하기</button>
                }
            </div>
            <div className="passwordReset01_explain">
                <p>
                    ※ 8자 이상 + 영문 + 숫자 + 특수문자로 조합해주세요.
                    <br/>
                    <br/>
                    ※ 이전 비밀번호와 다른 비밀번호로 입력해주세요.
                </p>
            </div>
            { 
                loading ? 
                <div class="popup_wrap">
                    <div class="popup_box">
                        <div class="popup_content">
                            <div class="popup_text">
                                <img src={loading04} style={{width: '130px', height: '28.5px', marginBottom: '15px' }} />
                                <div>로딩중</div>
                            </div>
                        </div>
                    </div>
                </div> 
                : 
                null 
            }
            { 
                confirmed !== 0 ? <ResetConfirmPage confirmedNum={confirmed} />
                : null
            }
        </div>
    );
}

export default PasswordInitPage;
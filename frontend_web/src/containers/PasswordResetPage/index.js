import React, { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import './style.css';
// import icon_close from '../../image/drawable-xxxhdpi/icon_close.png';
import { useDispatch } from 'react-redux';
import { reset_password } from '../../actions'
import { Redirect } from 'react-router-dom';
import loading04 from '../../image/drawable-xxxhdpi/loading04.png';

const PasswordResetPage = (props) => {

    const dispatch = useDispatch();

    // 이메일 전송 완료 여부
    const [emailDone, setEmailDone] = useState(false);
    // 버튼 활성화
    const [emailBtn, setEmailtBtn] = useState(false);
    // 로딩 활성화
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        email_name: '',
        email_address: '이메일 선택'
    });

    const { email_name, email_address } = formData;

    useEffect(() => {
        document.documentElement.scrollTop = 0;
        alert('회원가입 방식이 이메일 인증이 아닌 경우 [스꾸친] 카카오톡 채널을 통해 문의 바랍니다.');
    }, [])

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    if (!email_name||email_address==='이메일 선택')
    {
        if (emailBtn) {
            setEmailtBtn(false);
        }
    } 
    else 
    {
        if (!emailBtn) {
            setEmailtBtn(true);
        }
    }

    // 최종 회원 가입
    const sendEmail = (e) => {
        setLoading(true);
        e.preventDefault();

        const email = email_name + email_address;

        dispatch(reset_password(email))
        .then(() => {
            setLoading(false);
            setEmailDone(true);
        })
        .catch((err) => {
            console.log(err);
            setLoading(false);
            alert('전송에 실패하였습니다. 다시 시도해주시기 바랍니다.');
        })
    }

    if (emailDone) {
        return <Redirect to = '/reset_guide' /> 
    }

    return (
        <Layout>
            <div className='passwordReset00'>
                <div className="passwordReset00_A">
                    <div className="passwordReset00_header">
                        <div className="passwordReset00_header2">
                            <div className="upload_hleft">비밀번호 초기화</div>
                            {/* <img src={icon_close} style={{verticalAlign: "middle", width: "14px", height: "14px"}} /> */}
                        </div>
                    </div>
                </div>
                <div className="passwordReset00_password_noti">
                    이메일 주소를 입력해주세요
                </div>
                <div id="passwordReset00_email">
                    <div id="passwordReset00_ID">
                        <span className="passwordReset00_box">
                            <input 
                                type="text" 
                                className="passwordReset00_int"
                                placeholder="킹고 이메일 주소"
                                maxlength="20"
                                name='email_name'
                                value={email_name}
                                onChange={e => onChange(e)}
                            />
                        </span>
                    </div>
                    <div id="passwordReset00_emailtype">
                        <span className="passwordReset00_box">
                            <select 
                                className="passwordReset00_sel"
                                value={email_address}
                                name='email_address'
                                onChange={e => onChange(e)}
                            >
                                <option value="이메일 선택">@ 이메일 선택</option>
                                <option value="@g.skku.edu">@ g.skku.edu</option>
                                <option value="@skku.edu">@ skku.edu</option>
                            </select>
                        </span>
                    </div>
                </div>
                <div className="passwordReset00_btn">
                    {
                        emailBtn ?
                        <button className='passwordReset00_activate' onClick={e => sendEmail(e)}>초기화하기</button>
                        :
                        <button className='passwordReset00_deactivate' disabled>초기화하기</button>
                    }
                </div>
                <div className="passwordReset00_explain">
                    <p>
                        ※ 가입시 등록한 이메일 주소를 입력하여주시기 바랍니다.
                        <br />
                        <br />
                        ※ 회원 가입 방식이 이메일 인증이 아닌 경우 [스꾸친] 카카오톡 채널로 문의 바랍니다.
                    </p>
                </div>
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
        </Layout>
    );
}

export default PasswordResetPage;
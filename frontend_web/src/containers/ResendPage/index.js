import React, { useState } from 'react';
import './style.css';
// import icon_close from '../../image/drawable-xxxhdpi/icon_close.png';
import { useDispatch } from 'react-redux';
import { resend_activation } from '../../actions'
import loading04 from '../../image/drawable-xxxhdpi/loading04.png';

const ResendPage = (props) => {

    const dispatch = useDispatch();

    // 버튼 활성화
    const [emailBtn, setEmailtBtn] = useState(false);

    const [formData, setFormData] = useState({
        email_name: '',
        email_address: '이메일 선택'
    });

    // 로딩 활성화
    const [loading, setLoading] = useState(false);

    const { email_name, email_address } = formData;

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

    // 인증 메일 재전송
    const sendEmail = (e) => {

        setLoading(true);
        e.preventDefault();

        const email = email_name + email_address;

        dispatch(resend_activation(email))
        .then(() => {
            setLoading(false);
            alert('인증메일이 재전송되었습니다.');
        })
        .catch((err) => {
            setLoading(false);
            console.log(err)
            alert('인증메일 전송에 실패했습니다. 다시 시도해주시기 바랍니다.');
        })

    }

    return (
        <div className='resend'>
            <div className="resend_A">
                <div className="resend_header">
                    <div className="resend_header2">
                        <div className="upload_hleft">인증 메일 재전송</div>
                        {/* <img src={icon_close} style={{verticalAlign: "middle", width: "14px", height: "14px"}} /> */}
                    </div>
                </div>
            </div>
            <div className="resend_password_noti">
                이메일 주소를 입력해주세요
            </div>
            <div id="resend_email">
                <div id="resend_ID">
                    <span className="resend_box">
                        <input 
                            type="text" 
                            className="resend_int"
                            placeholder="킹고 이메일 주소"
                            maxlength="20"
                            name='email_name'
                            value={email_name}
                            onChange={e => onChange(e)}
                        />
                    </span>
                </div>
                <div id="resend_emailtype">
                    <span className="resend_box">
                        <select 
                            className="resend_sel"
                            value={email_address}
                            name='email_address'
                            onChange={e => onChange(e)}
                        >
                            <option value="이메일 선택">@ 이메일 선택</option>
                            <option value="@skku.edu">@ skku.edu</option>
                            <option value="@g.skku.edu">@ g.skku.edu</option>
                        </select>
                    </span>
                </div>
            </div>
            <div className="resend_btn">
                {
                    emailBtn ?
                    <button className='resend_activate' onClick={e => sendEmail(e)}>재전송하기</button>
                    :
                    <button className='resend_deactivate' disabled>재전송하기</button>
                }
            </div>
            <div className="resend_explain">
                <p>
                    ※ 본인 이메일 인증을 하지 않은 경우, 
                    <br/><br/>
                    서비스 이용에 어려움이 있을 수 있습니다.
                </p>
            </div>
            { 
                loading ? 
                <div class="popup_wrap">
                    <div class="popup_box">
                        <div class="popup_content">
                            <div class="popup_text">
                                <img src={loading04} style={{width: '132px', height: "28.5px", marginBottom: '15px' }} />
                                <div>로딩중</div>
                            </div>
                        </div>
                    </div>
                </div> 
                : 
                null 
            }
        </div>
    );
}

export default ResendPage;
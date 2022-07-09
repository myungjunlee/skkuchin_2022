import React from 'react';
import '../GuidePage/style.css';
import { Link } from 'react-router-dom';
// import icon_close from '../../image/drawable-xxxhdpi/icon_close.png';
import email_enhang from '../../image/drawable-xxxhdpi/email_enhang.png';

const ResetGuidePage = () => {

    return (
        <div className="certification2_A">
            <div className="certification2_header">
                <div className="certification2_header2">
                    <div className="upload_hleft">비밀번호 초기화</div>
                    {/* <img src={icon_close} style={{verticalAlign: "middle", width: "14px", height: "14px"}} /> */}
                </div>
            </div>
            <div className="certification2_logo">
                <img src={email_enhang} width="152px" height="auto" />
            </div>
            <div className="certification2_title">
                <h1>메일을 확인해주세요!</h1>
            </div>
            <div className="certification2_text">
                <p>
                    비밀번호 초기화 메일이 발송되었습니다.
                    <br/>
                    <br/>
                    발송된 메일을 통해 비밀번호 변경 후
                    <br/>
                    <br/>
                    아래 확인 버튼을 눌러주세요.
                </p>
            </div>
            <div className="certification2_mailInfo">
                <p>
                    <div>KINGO-M 앱 접속</div>
                    [성균관대 홈페이지 로그인 {'>'} 우측 상단 Google 메일]
                </p>
            </div>
            <div className="certification2_explain">
                <p>
                    ※ 이메일이 수신되지 않을 경우, 스팸메일함을 확인해주세요.
                </p>
            </div>
            <div className="certification2_btn">
                <div className='certification2_btn2'>
                    <Link to="/login"><button>확인</button></Link>
                </div>
            </div>
        </div>
    );
}

export default ResetGuidePage;
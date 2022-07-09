import React from 'react';
import './style.css';
import { Link, Redirect } from 'react-router-dom';
// import icon_close from '../../image/drawable-xxxhdpi/icon_close.png';
import email_enhang from '../../image/drawable-xxxhdpi/email_enhang.png';
import Layout from '../../components/Layout';

const GuidePage = (props) => {

    const num = props.location.state.num

    if (!props.location.state.num) {
        return <Redirect to = '/' />
    }

    return (
        <Layout>
            {
                num === 3 ?
                <div className="certification2_A">
                    <div className="certification2_header">
                        <div className="certification2_header2">
                            <div className="upload_hleft">학생증 인증</div>
                            {/* <img src={icon_close} style={{verticalAlign: "middle", width: "14px", height: "14px"}} /> */}
                        </div>
                    </div>
                    <div className="certification2_logo">
                        <img src={email_enhang} width="152px" height="auto" />
                    </div>
                    <div className="certification2_title">
                        <h1>학생증이 전송되었습니다!</h1>
                    </div>
                    <div className="certification2_text">
                        <p>
                            평균적으로 하루 내에 관리자의 승인이 이루어집니다.
                            <br/>
                            <br/>
                            조금만 기다려주시면 감사하겠습니다.
                        </p>
                    </div>
                    <div className="certification2_btn">
                        <div className='certification2_btn2'>
                            <Link to="/login"><button>확인</button></Link>
                        </div>
                    </div>
                </div>
                :
                num === 4 ?
                <div className="certification2_A">
                    <div className="certification2_header">
                        <div className="certification2_header2">
                            <div className="upload_hleft">이메일 인증</div>
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
                            성균관대학교 인증 메일이 발송되었습니다.
                            <br/>
                            <br/>
                            발송된 메일을 확인하여 인증을 완료해주시기 바랍니다.
                            <br/>
                            <br/>
                            인증 완료 후 재접속 바랍니다.
                        </p>
                    </div>
                    <div className="certification2_mailInfo">
                        <p>
                            <div>홈페이지 접속</div>
                            [성균관대 홈페이지 로그인 {'>'} 우측 상단 Google 메일]
                        </p>
                    </div>
                    <div className="certification2_explain">
                        <p>
                            ※ 이메일이 수신되지 않을 경우, 스팸메일함을 확인해주세요.
                        </p>
                    </div>
                </div>
                :
                <div className="certification2_A">
                    <div className="certification2_header">
                        <div className="certification2_header2">
                            <div className="upload_hleft">증명서 인증</div>
                            {/* <img src={icon_close} style={{verticalAlign: "middle", width: "14px", height: "14px"}} /> */}
                        </div>
                    </div>
                    <div className="certification2_logo">
                        <img src={email_enhang} width="152px" height="auto" />
                    </div>
                    <div className="certification2_title">
                        <h1>증명서가 전송되었습니다!</h1>
                    </div>
                    <div className="certification2_text">
                        <p>
                            평균적으로 하루 내에 관리자의 승인이 이루어집니다.
                            <br/>
                            <br/>
                            조금만 기다려주시면 감사하겠습니다.
                        </p>
                    </div>
                    <div className="certification2_btn">
                        <div className='certification2_btn2'>
                            <Link to="/login"><button>확인</button></Link>
                        </div>
                    </div>
                </div>
                }
        </Layout>
    );
}

export default GuidePage;
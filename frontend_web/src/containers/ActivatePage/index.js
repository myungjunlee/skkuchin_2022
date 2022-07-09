import React, { useState, useEffect } from 'react';
import './style.css';
import { verify } from '../../actions';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import email_enhang from '../../image/drawable-xxxhdpi/email_enhang.png';
import email_enheng_wink from '../../image/drawable-xxxhdpi/email_enheng_wink.png';
import noinfo_enheng from '../../image/drawable-xxxhdpi/noinfo_enheng.png';

const ActivatePage = ({ match }) => {

    const dispatch = useDispatch();
    const [verified, setVerified] = useState(0);
    const uid = match.params.uid;
    const token = match.params.token;

    useEffect(() => {
        if (uid && token) {
            dispatch(verify(uid, token))
            .then(() => {
                setVerified(1);
            })
            .catch((err) => {
                console.log(err);
                setVerified(-1);
            })
        }
    }, [])

    return (
        <div>
            {
                verified === 1
                ?
                <div>
                    <div className="certification3_logo">
                        <img src={email_enheng_wink} width="152px" height="107px" />
                    </div>
                    <div className="certification3_title">
                        <h1>인증 완료!</h1>
                    </div>
                    <div className="certification3_btn">
                        <div className="certification3_btn2">
                            <Link to="/login"><button>스꾸친 이용하기</button></Link>
                        </div>
                    </div>
                </div>
                :
                verified === 0
                ?
                <div>
                    <div className="certification3_logo">
                        <img src={email_enhang} width="152px" height="107px" />
                    </div>
                    <div className="certification3_title">
                        <h1>인증 작업중</h1>
                        <br/>
                        <h3>잠시만 기다려주세요 :)</h3>
                    </div>
                </div>
                :
                <div>
                    <div className="certification3_logo">
                        <img src={noinfo_enheng} width="152px" height="107px" />
                    </div>
                    <div className="certification3_title">
                        <h1>인증 실패</h1>
                    </div>
                    <div className="certification3_btn">
                        <div className="certification3_btn2">
                            <Link to="/resend"><button>인증메일 재전송</button></Link>
                        </div>
                    </div>
                </div>
            }
        </div>
    );
}

export default ActivatePage;
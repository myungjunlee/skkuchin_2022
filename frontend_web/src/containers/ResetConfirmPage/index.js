import React, { useState, useEffect } from 'react';
import '../ActivatePage/style.css';
import { Link } from 'react-router-dom';
import email_enhang from '../../image/drawable-xxxhdpi/email_enhang.png';
import email_enheng_wink from '../../image/drawable-xxxhdpi/email_enheng_wink.png';
import noinfo_enheng from '../../image/drawable-xxxhdpi/noinfo_enheng.png';

const ResetConfirmPage = (props) => {

    const [confirmed, setConfirmed] = useState(0);

    useEffect(() => {
        setConfirmed(props.confirmedNum)
    }, [])

    return (
        <div className='reset_confirm'>
            {
                confirmed === 1
                ?
                <div>
                    <div className="certification3_logo">
                        <img src={email_enheng_wink} width="152px" height="107px" />
                    </div>
                    <div className="certification3_title">
                        <h1>변경 완료!</h1>
                    </div>
                </div>
                :
                confirmed === 0
                ?
                <div>
                    <div className="certification3_logo">
                        <img src={email_enhang} width="152px" height="107px" />
                    </div>
                    <div className="certification3_title">
                        <h1>변경 진행중</h1>
                    </div>
                </div>
                :
                <div>
                    <div className="certification3_logo">
                        <img src={noinfo_enheng} width="152px" height="107px" />
                    </div>
                    <div className="certification3_title">
                        <h1>변경 실패</h1>
                    </div>
                    <div className="certification3_subtitle">
                        <span>※ 이전과 같은 비밀번호를 입력하신 경우 다른 비밀번호로 재설정 바랍니다.</span>
                    </div>
                    <div className="certification3_btn">
                        <div className="certification3_btn2">
                            <Link to="/reset"><button>재설정하기</button></Link>
                        </div>
                    </div>
                </div>
            }
        </div>
    );
}

export default ResetConfirmPage;
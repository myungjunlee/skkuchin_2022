import React, { useState, useEffect } from 'react';
import '../ActivatePage/style.css';
import { Link } from 'react-router-dom';
import email_enhang from '../../image/drawable-xxxhdpi/email_enhang.png';
import email_enheng_wink from '../../image/drawable-xxxhdpi/email_enheng_wink.png';
import noinfo_enheng from '../../image/drawable-xxxhdpi/noinfo_enheng.png';

const ChangeConfirmPage = (props) => {

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
                    <div className="reset_logo">
                        <img src={email_enheng_wink} width="152px" height="107px" />
                    </div>
                    <div className="certification3_title">
                        <h1>변경 완료!</h1>
                    </div>
                    <div className="certification3_btn">
                        <div className="certification3_btn2">
                            <Link to="/"><button>스꾸친 이용하기</button></Link>
                        </div>
                    </div>
                </div>
                :
                confirmed === 0
                ?
                <div>
                    <div className="reset_logo">
                        <img src={email_enhang} width="152px" height="107px" />
                    </div>
                    <div className="certification3_title">
                        <h1>변경 진행중</h1>
                    </div>
                </div>
                :
                <div>
                    <div className="reset_logo">
                        <img src={noinfo_enheng} width="152px" height="107px" />
                    </div>
                    <div className="certification3_title">
                        <h1>변경 실패</h1>
                    </div>
                    <div className="certification3_subtitle">
                        <span>※ 현재 비밀번호가 정확히 기입되지 않았을 수 있습니다.</span>
                            <br/>
                            <br/>
                        <span>※ 다시 시도하여주시기 바랍니다.</span>
                    </div>
                    <div className="certification3_btn">
                        <div className="certification3_btn2">
                            <Link to="/mypage"><button>돌아가기</button></Link>
                        </div>
                    </div>
                </div>
            }
        </div>
    );
}

export default ChangeConfirmPage;
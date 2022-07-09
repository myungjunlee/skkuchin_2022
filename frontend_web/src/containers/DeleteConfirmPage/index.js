import React, { useState, useEffect } from 'react';
import '../ActivatePage/style.css';
import { Link } from 'react-router-dom';
import email_enhang from '../../image/drawable-xxxhdpi/email_enhang.png';
import email_enheng_wink from '../../image/drawable-xxxhdpi/email_enheng_wink.png';
import noinfo_enheng from '../../image/drawable-xxxhdpi/noinfo_enheng.png';

const DeleteConfirmPage = (props) => {

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
                        <img src={email_enheng_wink} width="152px" height= "107px"/>
                    </div>
                    <div className="certification3_title">
                        <h1>탈퇴 완료!</h1>
                    </div>
                    <div className="certification3_subtitle">
                        <span>스꾸친을 이용해주셔서 감사합니다 :)</span>
                    </div>
                    <div className="certification3_btn">
                        <div className="certification3_btn2">
                            <Link to="/login"><button>로그인 페이지</button></Link>
                        </div>
                    </div>
                </div>
                :
                confirmed === 0
                ?
                <div>
                    <div className="reset_logo">
                        <img src={email_enhang} width="152px" height= "107px" />
                    </div>
                    <div className="certification3_title">
                        <h1>탈퇴 진행중</h1>
                    </div>
                </div>
                :
                <div>
                    <div className="reset_logo">
                        <img src={noinfo_enheng} width="152px" height= "107px" />
                    </div>
                    <div className="certification3_title">
                        <h1>탈퇴 실패</h1>
                    </div>
                    <div className="certification3_subtitle">
                        <span>※ 비밀번호를 잘못 입력한 경우 탈퇴에 실패할 수 있습니다.</span>
                        <br/>
                        <br/>
                        <span>※ 로그인 후 다시 시도하여주시기 바랍니다.</span>
                    </div>
                    <div className="certification3_btn">
                        <div className="certification3_btn2">
                            <Link to="/login"><button>로그인 하러가기</button></Link>
                        </div>
                    </div>
                </div>
            }
        </div>
    );
}

export default DeleteConfirmPage;
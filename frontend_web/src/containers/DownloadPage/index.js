import React from 'react';
import './style.css';
import email_enheng_wink from '../../image/drawable-xxxhdpi/email_enheng_wink.png';

const DownloadPage = () => {

    return (
        <div>
            <div>
                <div className="download_logo">
                    <img src={email_enheng_wink} width="152px" height="107px" />
                </div>
                <div className="download_title">
                    <h3>스꾸친은 성균관대학교 학생들 간의 밥 약속을 성사시켜드립니다!</h3>
                </div>
                <div className="download_btn">
                    <div className="download_btn2">
                        <a href="https://apps.apple.com/kr/app/%EC%8A%A4%EA%BE%B8%EC%B9%9C/id1600835217"><button>IOS 앱 다운로드</button></a>
                    </div>
                    <div className="download_btn2">
                        <a href="https://play.google.com/store/apps/details?id=com.skkuchin.skkuchin"><button>Android 앱 다운로드</button></a>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DownloadPage;
import React, { useEffect, useRef, useState } from 'react';
import './style.css';
import { useDispatch, useSelector } from 'react-redux';
import { edit_account, checkAuthenticated, refreshToken, logout } from '../../actions';
import { Redirect, useHistory } from 'react-router-dom';
import icon_back_arrow from '../../image/drawable-xxxhdpi/icon_back_arrow.png';
import edit_profile from '../../image/drawable-xxxhdpi/edit_profile.png';
import loading04 from '../../image/drawable-xxxhdpi/loading04.png';

const AccountPage = (props) => {

    const major_items = [
        '글로벌경영학과', '글로벌경제학과', '글로벌리더학과', '글로벌바이오메디컬공학과', '글로벌융합학부',
        '유학동양학과', '국어국문학과', '영어영문학과', '프랑스어문학과', '러시아어문학과',
        '중어중문학과', '독어독문학과', '한문학과', '사학과', '철학과', '문헌정보학과',
        '행정학과', '정치외교학과', '미디어커뮤니케이션학과', '사회학과', '사회복지학과',
        '심리학과', '소비자학과', '아동청소년학과', '경제학과', '통계학과',
        '생명과학과', '수학과', '물리학과', '화학과',
        '식품생명공학과', '바이오메카트로닉스학과', '융합생명공학과', '유전공학과',
        '화학공학/고분자시스템공학부', '고분자시스템공학과', '신소재공학부', '기계공학부', '건설환경공학부', '건축토목공학부', '조경학과', '시스템경영공학과', '건축학과', '나노공학과',
        '경영학과',
        '교육학과', '한문교육과', '수학교육과', '컴퓨터교육과',
        '미술학과', '무용학과', '디자인학과', '영상학과', '연기예술학과', '의상학과',
        '전자전기공학부', '반도체시스템공학과', '컴퓨터공학과', '소프트웨어학과',
        '약학과', '스포츠과학과', '의예과', '의학과',
        '인공지능융합전공', '데이터사이언스융합전공', '컬처앤테크놀로지융합전공',
        '인문과학계열', '사회과학계열', '자연과학계열', '공학계열',
        ];
    
    const mbti_items = [
        'ENFJ', 'ESFJ', 'ENTJ', 'ESTJ', 'ENFP', 'ESFP', 'ENTP', 'ESTP',
        'INFJ', 'ISFJ', 'INTJ', 'ISTJ', 'INFP', 'ISFP', 'INTP', 'ISTP', 
    ];  
    
    const history = useHistory();
    const img_number = useRef(null);

    const mbtiValidation = useRef(null);
    const majorValidation = useRef(null);

    const dispatch = useDispatch();
    const auth = useSelector(state => state.auth);

    /* 사용자가 입력한 글자로 시작하는 전공을 담아두는 배열 */
    const [majorSuggestionsList, setMajorSuggestions] = useState([]);
    /* 사용자가 입력한 글자로 시작하는 mbti를 담아두는 배열 */
    const [mbtiSuggestionsList, setMbtiSuggestions] = useState([]);

    // 버튼 활성화
    const [changeBtn, setChangeBtn] = useState(false);
    // 계정 변경 완료
    const [accountChanged, setAccountChanged] = useState(false);
    // 로딩 활성화
    const [loading, setLoading] = useState(false);
    // 로딩 활성화
    const [selection, setSelection] = useState(false);

    // MBTI, 전공 체크
    const [mbtiValid, setMbtiValid] = useState(true);
    const [majorValid, setMajorValid] = useState(true);

    const [image, setImage] = useState(null);
    const [userData, setUserData] = useState({
        uid: '',
        username: '',
        major: '',
        student_id: '',
        mbti: ''
    });

    useEffect(() => {
        document.documentElement.scrollTop = 0;
    }, [])
    
    useEffect(() => {
        if (auth.user) {
            setUserData({
                uid: auth.user.uid,
                username: auth.user.username,
                major: auth.user.major,
                student_id: auth.user.student_id,
                mbti: auth.user.mbti
            });
            setImage(auth.user.image)
        }
    }, [auth.user])

    const { uid, username, major, student_id, mbti } = userData;

    const onChangeImage = (e) => {
        setImage(e.target.files[0]);
        img_number.current.textContent = '사진 선택됨';
        setSelection(false);
    };

    /* 사용자가 전공을 입력하는 동안 실행되는 함수 */
    const onMajorChange = e => {
        e.preventDefault();
        const value = e.target.value;
        let suggestions = [];
        if (value.length > 0) {
            const regex = new RegExp(`^${value}`, 'i');
            suggestions = major_items.sort().filter(v => regex.test(v));
        }

        // 전공을 올바르게 입력한 경우에만 majorValid = true
        const isValid = major_items.filter(major => major === value);
        if (isValid.length > 0) {
            setMajorValid(true);
            majorValidation.current.textContent = "";
        }

        setMajorSuggestions(suggestions);
        setUserData({ ...userData, [e.target.name]: value });
    }

    const onMajorFocusOut = e => {
        e.preventDefault();
        const value = e.target.value;
        const isValid = major_items.filter(major => major === value);
        if (isValid.length === 0) {
            setMajorValid(false);
            majorValidation.current.textContent = "정확한 전공명을 입력해주세요";
        }
    }

    /* 사용자가 MBTI를 입력하는동안 실행되는 함수 */
    const onMbtiChange = e => {
        e.preventDefault();
        const value = e.target.value;
        let suggestions = [];
        if (value.length > 0) {
            const regex = new RegExp(`^${value}`, 'i');
            suggestions = mbti_items.sort().filter(v => regex.test(v));
        }

        // MBTI 올바르게 입력한 경우에만 mbtiValid = true
        if (value.length === 4) {
            const isValid = mbti_items.filter(mbti => mbti === value);
            if (isValid.length > 0) {
                setMbtiValid(true);
                mbtiValidation.current.textContent = "";
            }
        }
        else{
            setMbtiValid(false);
        }

        setMbtiSuggestions(suggestions);
        setUserData({ ...userData, [e.target.name]: value });
    }

    const onMbtiFocusOut = e => {
        e.preventDefault();
        const value = e.target.value.toUpperCase();
        if (value) {
            const isValid = mbti_items.filter(mbti => mbti === value);
            // MBTI input 칸이 focus out 되었을 때, 정확한 전공명이 아닐 경우 경고 메시지 
            if (isValid.length === 0) {
                setMbtiValid(false);
                mbtiValidation.current.textContent = "MBTI를 올바르게 입력해주세요";
            }
        } else {
            setMbtiValid(true);
            mbtiValidation.current.textContent = "";
        }
    }

    const majorSuggestionSelected = (value) => {
        setUserData({...userData, major: value});
        setMajorSuggestions([]);
        setMajorValid(true);
        majorValidation.current.textContent = "";
    }

    const mbtiSuggestionSelected = (value) => {
        setUserData({...userData, mbti: value});
        setMbtiSuggestions([]);
        setMbtiValid(true);
        mbtiValidation.current.textContent = "";
    }

    const majorRenderSuggestions = () => {
        const suggestions = majorSuggestionsList;
        if (suggestions.length === 0) {
            return null;
        }
        return (
            <ul>
                {suggestions.map((item) => <li onClick={e => majorSuggestionSelected(item)}>{item}</li>)}
            </ul>
        )
    }

    const mbtiRenderSuggestions = () => {
        const suggestions = mbtiSuggestionsList;
        
        if (suggestions.length === 0) {
            return null;
        }
        return (
            <ul>
                {suggestions.map((item) => <li onClick={e => mbtiSuggestionSelected(item)}>{item}</li>)}
            </ul>
        )
    }

    if(!major||!mbtiValid||!majorValid) {
        if (changeBtn) {
            setChangeBtn(false);
        }
    } 
    else {
        if (!changeBtn) {
            setChangeBtn(true);
        }
    }
    
    const onSubmit = (e) => {
        setLoading(true);
        e.preventDefault();

        const user = { uid, major, mbti };
        const formData = new FormData();
        formData.append('major', major);
        formData.append('mbti', mbti);

        if (image !== auth.user.image) {
            formData.append('image', image);
        }

        const apiDispatch = () => {
            dispatch(edit_account(user, formData))
            .then(() => {
                setAccountChanged(true)
            })
            .catch((err) => {
                console.log(err);
                setLoading(false);
                alert('계정 변경에 실패하였습니다.');
            })
        }

        dispatch(checkAuthenticated())
        .then(() => {
            apiDispatch();
        })
        .catch((err) => {
            console.log(err);
            dispatch(refreshToken())
            .then(() => {
                apiDispatch();
            })
            .catch((err) => {
                console.log(err);
                dispatch(logout());
            })
        })
    }

    const goBack = () => {
        history.goBack();
    };

    const normalImage = () => {
        setImage('');
        img_number.current.textContent = '기본 이미지';
        setSelection(false);
    }

    // 로그인 안 했을 시 로그인 페이지로
    if (!auth.isAuthenticated) {
        return <Redirect to = '/login' />
    }

    // 계정 변경 완료 시 마이페이지로
    if (accountChanged) {
        return <Redirect to = '/mypage' />
    }

    return (
        <div className="accountSetting_wrapper">
            <form>
                <div className="accountSetting_top">
                    <div className="accountSetting_top2">
                        <img src={icon_back_arrow} onClick={goBack} style={{marginTop: "2.12px", width: "15px", height: "14px", paddingRight: "15px", cursor:"pointer"}}/>
                        <h4>계정설정</h4>
                    </div>
                </div>
                <div className="accountSetting_img">
                    <img src={edit_profile} width="116px" height="116px" onClick={() => {setSelection(true)}} />
                    <div className="accountSetting_img_number" ref={img_number}></div>
                </div>
                <div className="accountSetting_title">
                    <h2 id="accountSetting_titleTop">아이디</h2>
                </div>
                <div className="accountSetting_text">
                    <div id="accountSetting_ID">
                        <div className="accountSetting_box">
                            <input 
                                type="text"
                                className="accountSetting_int" 
                                id="accountSetting_disable"
                                name='username'
                                value={username} 
                                disabled
                            />
                        </div>
                    </div>
                </div>
                <div className="accountSetting_title">
                    <h2>MBTI</h2>
                </div>
                <div className="accountSetting_text">
                    <div id="accountSetting_mbti">
                        <div className="accountSetting_box">
                            <input 
                                type="text"
                                className="accountSetting_int"
                                name='mbti'
                                value={mbti}
                                onChange={e => onMbtiChange(e)}
                                onBlur={e => onMbtiFocusOut(e)}
                            />
                        </div>
                        <div className="accountSetting_mbtiCheck" ref={mbtiValidation}></div>
                    </div>
                </div>
                <div className='accountSetting_autoCompleteText'>
                    {mbtiRenderSuggestions()}
                </div>
                <div className="accountSetting_title">
                    <h2>학부/학과</h2>
                </div>
                <div className="accountSetting_text">
                    <div id="accountSetting_major">
                        <div className="accountSetting_box">
                            <input 
                                type="text" 
                                className="accountSetting_int"
                                name='major'
                                value={major}
                                onChange={e => onMajorChange(e)}
                                onBlur={e => onMajorFocusOut(e)}
                            />
                        </div>
                        <div className="accountSetting_majorCheck" ref={majorValidation}></div>
                    </div>
                </div>
                <div className='accountSetting_autoCompleteText'>
                    {majorRenderSuggestions()}
                </div>
                <div className="accountSetting_title">
                    <h2>학번</h2>
                </div>
                <div className="accountSetting_text">
                    <div id="accountSetting_studentnumber">
                        <div className="accountSetting_box">
                            <input 
                                type="text"
                                className="accountSetting_int" 
                                id="accountSetting_disable"
                                name='student_id'
                                value={student_id}
                                disabled 
                            />
                        </div>
                    </div>
                </div>
                <div className="accountSetting_btn">
                    {
                        changeBtn ?
                        <button className='accountSetting_active' type='submit' onClick={e => onSubmit(e)}>저장</button>
                        :
                        <button className='accountSetting_deactive' type='submit' disabled>저장</button>
                    }
                </div>
            </form>
            { 
                loading ? 
                <div class="popup_wrap">
                    <div class="popup_box">
                        <div class="popup_content">
                            <div class="popup_text">
                                <img src={loading04} style={{width: '130px', height: 'auto', marginBottom: '15px' }} />
                                <div>로딩중</div>
                            </div>
                        </div>
                    </div>
                </div> 
                : 
                null 
            }
            { 
                selection ? 
                <div className="popup_wrap">
                    <div className="popup_box">
                        <div className="popup_content">
                            <div className="popup_text">
                                <label className='popup_label' htmlFor="input-file" style={{margin: '0'}}>
                                    사진 선택
                                </label>
                                <input
                                    type='file'
                                    accept='image/*'
                                    name='image'
                                    id='input-file'
                                    onChange={e => onChangeImage(e)}
                                    style={{display:'none'}}
                                />
                                <span className='popup_image_button' onClick={normalImage}>기본 이미지</span>
                            </div>
                            <div className='popup_image_button2' onClick={() => setSelection(false)}>닫기</div>
                        </div>
                    </div>
                </div> 
                : 
                null 
            }
        </div>
    );
}

export default AccountPage;
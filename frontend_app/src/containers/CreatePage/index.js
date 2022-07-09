import React, { useEffect, useState } from 'react';
import './style.css';
import { useDispatch, useSelector } from 'react-redux';
import { create, checkAuthenticated, refreshToken, logout } from '../../actions';
import { Redirect ,useHistory } from 'react-router-dom';
import icon_close from '../../image/drawable-xxxhdpi/icon_close.png'

const CreatPage = (props) => {

    const history = useHistory();
    const dispatch = useDispatch();
    const auth =  useSelector(state => state.auth);
    // 게시물 생성되면 목록 화면으로 나가도록 작동
    const [postCreated, setPostCreated] = useState(false);
    // 게시물 등록 활성화
    const [submitBtn, setSubmitBtn] = useState(false);

    // 게시물 관련 값 변경
    const [postData, setPostData] = useState({
        title: '',
        date:'',
        place: '',
        content: '',
        category: '종류 선택'
    });

    const { title, date, place, content, category } = postData;

    useEffect(() => {
        document.documentElement.scrollTop = 0;
    }, [])

    const onChange = (e) => {
        setPostData({...postData, [e.target.name]: e.target.value});
    };

    const onSubmit = e => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('user', auth.user.id);
        formData.append('title', title);
        formData.append('name', auth.user.name);
        formData.append('major', auth.user.major);
        formData.append('student_id', auth.user.student_id);
        if (auth.user.mbti) {
            formData.append('mbti', auth.user.mbti);
        }
        if (auth.user.image) {
            formData.append('image', auth.user.image);
        }
        formData.append('date', date);
        formData.append('place', place);
        formData.append('content', content);
        formData.append('uid', auth.user.uid);
        formData.append('option', true);
        formData.append('category', category);

        const apiDispatch = () => {
            dispatch(create(formData))
            .then(() => {
                setPostCreated(true);
            })
            .catch((err) => {
                console.log(err);
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
    };

    const goBack = () => {
        history.goBack();
    };

    // 완료 버튼 활성화 기능
    if (!title||!date||!place||!content||category === '종류 선택') {
        if (submitBtn) {
            setSubmitBtn(false);
        }
    } else {
        if (!submitBtn) {
            setSubmitBtn(true);
        }
    }

    // 로그인 안 했을 시 로그인 페이지로
    if (!auth.isAuthenticated) {
        return <Redirect to = '/login' />
    }

    // 게시물 등록했을 시 목록 페이지로
    if (postCreated) {
        return <Redirect to = '/' />
    }

    return (
        <div className="upload">
            {/* header 헤더 */}
            <div className="upload_header">
                <div className="upload_header2">
                    <div className="upload_hleft">밥약 신청서</div>
                    <img src={icon_close} style={{verticalAlign: "middle", width: "13px", height: "14px", cursor: "pointer"}} onClick={goBack} />
                </div>
            </div>
            {/* content 밥약신청 폼 전체 틀 */}
            <div className='upload_content'>
                {/* content 밥약신청 폼 (제목/본문/일시/장소) */}
                <div className='upload_content_main'>
                    <form> 
                        <div>글쓰기</div>
                        <input 
                            type="text" 
                            placeholder="제목" 
                            name='title' 
                            value={title}
                            maxLength='20'
                            spellCheck={false}
                            onChange={e => onChange(e)}
                        />
                        <textarea
                            name='content'
                            value={content}
                            spellCheck={false}
                            onChange={e => onChange(e)}
                            cols="30" 
                            rows="10"
                            placeholder="본문 내용을 입력해주세요 &#13;&#10;밥약 외의 다른 목적의 글은 경고없이 삭제될 수 있습니다." 
                        />
                        <div className="upload_subtitle">밥약 종류</div>
                        <select
                            className='upload_select'
                            name='category'
                            value={category}
                            onChange={e => onChange(e)}
                        >
                            <option value="종류 선택">종류 선택</option>
                            <option value="밥사주세요">밥사주세요</option>
                            <option value="밥사줄게요">밥사줄게요</option>
                            <option value="같이먹어요">같이먹어요</option>
                        </select>
                        <div className="upload_subtitle">일시</div>
                        <input 
                            type="text"
                            name='date'
                            value={date}
                            spellCheck={false}
                            maxLength='20'
                            placeholder='예시) OO일 OO시'
                            onChange={e => onChange(e)}
                        />
                        <div className="upload_subtitle">장소</div>
                        <input 
                            type="text"
                            name='place'
                            value={place}
                            spellCheck={false}
                            maxLength='20'
                            placeholder='예시) 명륜 혹은 율전 쪽문'
                            onChange={e => onChange(e)}
                        />
                        {
                            submitBtn?
                            <button className="upload_btn_active" type='submit' onClick={e => onSubmit(e)}>완료</button>
                            :
                            <button className="upload_btn_deactive" type='submit' disabled>완료</button>
                        }
                    </form>
                </div>
            </div>
        </div>
    );
}

export default CreatPage;
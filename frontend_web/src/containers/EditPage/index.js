import React, { useEffect, useState } from 'react';
import './style.css';
import Layout from '../../components/Layout';
import { useDispatch, useSelector } from 'react-redux';
import { detail, update, checkAuthenticated, refreshToken, logoutPost, logout } from '../../actions';
import { Redirect, useHistory } from 'react-router-dom';

const EditPage = (props) => {

    const history = useHistory();
    const dispatch = useDispatch();
    const id = props.match.params.id;
    const auth = useSelector(state => state.auth);
    const post = useSelector(state => state.post.data);
    // 게시물 수정되면 목록 화면으로 나가도록 작동
    const [postUpdated, setPostUpdated] = useState(false);
    // 게시물 등록 활성화
    const [submitBtn, setSubmitBtn] = useState(false);

    // 게시물 관련 값 변경
    const [postData, setPostData] = useState({
        user: '',
        title: '',
        name: '',
        major: '',
        student_id: '',
        mbti: '',
        image: '',
        date:'',
        place:'',
        content: '',
        uid: '',
        option: '',
        category: ''
    });

    const { user, title, name, major, student_id, mbti, image, date, place, content, uid, option, category } = postData;

    useEffect(() => {
        document.documentElement.scrollTop = 0;
        dispatch(detail(id));
    }, [])

    useEffect(() => {
        if (post) {
            setPostData({
                user: post.user,
                title: post.title,
                name: post.name,
                major: post.major,
                student_id: post.student_id,
                mbti: post.mbti,
                image: auth.user.image,
                date: post.date,
                place: post.place,
                content: post.content,
                uid : post.uid,
                option: post.option,
                category: post.category
            });
        }
    }, [post])

    // componentWillUnmount
    useEffect(() => {
        return () => {
            // cleanup
            dispatch(logoutPost());
        }
    }, [])

    const onChange = (e) => {
        setPostData({...postData, [e.target.name]: e.target.value});
    };

    const onSubmit = e => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('user', user);
        formData.append('title', title);
        formData.append('name', name);
        formData.append('major', major);
        formData.append('student_id', student_id);
        if (image) {
            formData.append('image', image);
        } else {
            formData.append('image', '');
        }
        formData.append('date', date);
        formData.append('place', place);
        formData.append('content', content);
        formData.append('uid', uid);
        formData.append('option', option);
        formData.append('category', category);

        const apiDispatch = () => {
            dispatch(update(id, formData))
            .then(() => {
                setPostUpdated(true);
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

    // 수정 완료 버튼 활성화 기능
    if (!title||!date||!place||!content||category === '종류 선택'||!category) {
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

    // 게시물 수정했을 시 상세 페이지로 혹은 부적절한 경로
    if (postUpdated) {
        return <Redirect to = {{pathname: `/detail/${id}`}} />
    }

    // 뒤로 가기 버튼
    const goBack = () => {
        history.goBack();
    };
    
    return (
        <Layout>
            {/* 밥약 신청 페이지 전체 틀 (기본 margin) */}
            <div className="edit">
                {/* header 헤더 */}
                <div className="edit_header">
                    <div className="edit_header2">
                        <div className="edit_hleft">밥약 신청서</div>
                    </div>
                </div>
                {/* content 밥약신청 폼 전체 틀 */}
                <div className='edit_content'>
                    {/* content 밥약신청 폼 (제목/본문/일시/장소) */}
                    <div className='edit_content_main'>
                        <form onSubmit={e => onSubmit(e)}> 
                            <div>글쓰기</div>
                            <input 
                                type="text" 
                                placeholder="제목" 
                                name='title' 
                                value={title}
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
                                placeholder="본문 내용을 입력해주세요&#13;&#10;밥약 외의 다른 목적의 글은 경고없이 삭제될 수 있습니다." 
                            />
                            <div className="edit_subtitle">밥약 종류</div>
                            <select
                                className='edit_select'
                                name='category'
                                value={category}
                                onChange={e => onChange(e)}
                            >
                                <option value="종류 선택">종류 선택</option>
                                <option value="밥사주세요">밥사주세요</option>
                                <option value="밥사줄게요">밥사줄게요</option>
                                <option value="같이먹어요">같이먹어요</option>
                            </select>
                            <div className="edit_subtitle">일시</div>
                            <input 
                                type="text" 
                                name='date' 
                                value={date} 
                                spellCheck={false}
                                placeholder='예시) OO일 OO시'
                                onChange={e => onChange(e)}
                            />
                            <div className="edit_subtitle">장소</div>
                            <input 
                                type="text"
                                name='place' 
                                value={place} 
                                spellCheck={false}
                                placeholder='예시) 명륜 혹은 율전 쪽문'
                                onChange={e => onChange(e)}
                            />
                            {
                                submitBtn?
                                <button className="edit_btn_active" type='submit' onClick={e => onSubmit(e)}>완료</button>
                                :
                                <button className="edit_btn_deactive" type='submit' disabled>완료</button>
                            }
                        </form>
                    </div>
                </div>
            </div>
        </Layout>
    );
}

export default EditPage;
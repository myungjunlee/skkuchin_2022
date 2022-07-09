import React, { useEffect, useRef, useState } from 'react'
import Layout from '../../components/Layout';
import { login, load_user } from '../../actions';
import './style.css';
import { useDispatch, useSelector } from 'react-redux';
import { Redirect, Link } from 'react-router-dom';
import login_enheng from '../../image/drawable-xxxhdpi/login_enheng.png';

/**
* @author
* @function LoginPage
**/

const LoginPage = (props) => {

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const auth = useSelector(state => state.auth);

  // 로그인 검증
  const loginValidation = useRef(null);

  useEffect(() => {
    document.documentElement.scrollTop = 0;
  }, [])
  
  const userLogin = (e) => {
    e.preventDefault();

    if (!username) {
      loginValidation.current.textContent = '아이디를 입력해 주세요'
      return
    }

    if (!password) {
      loginValidation.current.innerHTML = '<span class="login_bold">비밀번호</span>를 입력해 주세요'
      return
    }

    dispatch(login(username, password))
    .then(() => {
      loginValidation.current.textContent = '';
      dispatch(load_user());
    })
    .catch((err) => {
      console.log(err);
      loginValidation.current.innerHTML = '<span class="login_bold">아이디</span> 또는 <span class="login_bold">비밀번호</span>가 일치하지 않습니다';
    })
  }

  if(auth.isAuthenticated){
    return <Redirect to={`/`} />
  }

  return(
    <Layout>
      <div className='login_container'>
        <div className="login_logo">
          <img src={login_enheng} width="153px" height="107px" />
        </div>
        <div className="login_greeting">
            <h1>환영합니다!</h1>
        </div>
        <form onSubmit={userLogin}>
          <div className="login_ID">
            <input 
              type='text'
              maxlength='20'
              placeholder='아이디'
              name='username'
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="login_text">
            <input 
              type='password'
              placeholder='비밀번호'
              name='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              maxlength='20'
            />
          </div>
          <div className='login_alert' ref={loginValidation}></div>
          <div className="login_btn">
              <button type='submit'>스꾸친 로그인</button>
          </div>
        </form>
        <div className="login_register_btn">
            <Link to="/register">
              <button id="register">회원 가입하기</button>
            </Link>
            <span style={{fontWeight: "100"}}>|</span>
            <Link to="/reset">
              <button id="reset">비밀번호 초기화</button>
            </Link>
        </div>
      </div>
    </Layout>
  )
}

export default LoginPage;
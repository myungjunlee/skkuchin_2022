import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { checkAuthenticated, refreshToken, load_user, logout } from './actions'

import HomePage from './containers/HomePage';
import SearchPage from './containers/SearchPage';
import LoginPage from './containers/LoginPage';
import RegisterPage from './containers/RegisterPage';
import GuidePage from './containers/GuidePage';
import DetailPage from './containers/DetailPage';
import CreatePage from './containers/CreatePage';
import EditPage from './containers/EditPage';
import ActivatePage from './containers/ActivatePage';
import MyPage from './containers/MyPage';
import MyListPage from './containers/MyListPage';
import AccountPage from './containers/AccountPage';
import ChatListPage from './containers/ChatListPage';
import ChatPage from './containers/ChatPage';
import PasswordResetPage from './containers/PasswordResetPage';
import ResetGuidePage from './containers/ResetGuidePage';
import PasswordInitPage from './containers/PasswordInitPage';
import ServiceAgreementPage from './containers/ServiceAgreementPage';
import PrivacyPage from './containers/PrivacyPage';
import DeleteUserPage from './containers/DeleteUserPage';
import PasswordChangePage from './containers/PasswordChangePage';
import ResendPage from './containers/ResendPage';
import ProfilePage from './containers/ProfilePage';
import DownloadPage from './containers/DownloadPage';
import RestaurantPage from './containers/RestaurantPage';
import DashboardPage from './containers/DashboardPage';

function App() {

  const auth = useSelector(state => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!auth.isAutenticated){
      dispatch(checkAuthenticated())
      .then(() => {
        dispatch(load_user());
      })
      .catch(() => {
        dispatch(refreshToken())
        .then(() => {
          dispatch(load_user());
        })
        .catch((err) => {
          console.log(err);
          dispatch(logout());
        })
      })
    }
  }, []);


  return (
    <div className="App">
      <Router>
        {/* only logged in user can access this home route */}
        <Route path="/" exact component={HomePage} />
        <Route path="/search" component={SearchPage} />
        <Route path="/login" component={LoginPage} />
        <Route path="/register" component={RegisterPage} />
        <Route path="/guide" component={GuidePage} />
        <Route exact path="/activate/:uid/:token" component={ActivatePage} />
        <Route path="/resend" component={ResendPage} />
        <Route path="/create" component={CreatePage} />
        <Route path="/edit/:id" component={EditPage} />
        <Route path="/detail/:id" component={DetailPage} />
        <Route path="/mypage" component={MyPage} />
        <Route path="/mypage_list" component={MyListPage} />
        <Route path="/account_edit" component={AccountPage} />
        <Route path="/chat_list" component={ChatListPage} />
        <Route path="/chat" component={ChatPage} />
        <Route path="/profile" component={ProfilePage} />
        <Route path="/change_password" component={PasswordChangePage} />
        <Route path="/user_delete" component={DeleteUserPage} />
        <Route path="/reset" component={PasswordResetPage} />
        <Route path="/reset_guide" component={ResetGuidePage} />
        <Route exact path="/password/reset/confirm/:uid/:token" component={PasswordInitPage} />
        <Route path="/service_agreement" component={ServiceAgreementPage} />
        <Route path="/privacy" component={PrivacyPage} />
        <Route path="/download" component={DownloadPage} />
        <Route path="/restaurant" component={RestaurantPage} />
        <Route path="/dashboard" component={DashboardPage} />
      </Router>
    </div>
  );
}

export default App;

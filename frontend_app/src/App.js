import React, { useEffect } from 'react';
import { HashRouter, Route } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { checkAuthenticated, load_user, refreshToken, logout } from './actions'

import HomePage from './containers/HomePage';
import SearchPage from './containers/SearchPage';
import LoginPage from './containers/LoginPage';
import RegisterPage from './containers/RegisterPage';
import GuidePage from './containers/GuidePage';
import DetailPage from './containers/DetailPage';
import CreatePage from './containers/CreatePage';
import EditPage from './containers/EditPage';
import MyPage from './containers/MyPage';
import MyListPage from './containers/MyListPage';
import AccountPage from './containers/AccountPage';
import ChatListPage from './containers/ChatListPage';
import ChatPage from './containers/ChatPage';
import PasswordResetPage from './containers/PasswordResetPage';
import ResetGuidePage from './containers/ResetGuidePage';
import ServiceAgreementPage from './containers/ServiceAgreementPage';
import PrivacyPage from './containers/PrivacyPage';
import DeleteUserPage from './containers/DeleteUserPage';
import PasswordChangePage from './containers/PasswordChangePage';
import AlarmPage from './containers/AlarmPage';
import RestaurantPage from './containers/RestaurantPage';
import NotiListPage from './containers/NotiListPage';
import NotiPage from './containers/NotiPage';

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

  // 푸쉬 알림 토큰 자동 등록, 갱신
  if (auth.user) {
    window.FirebasePlugin.fetchDocumentInFirestoreCollection(auth.user.uid, "users", function(document){
    if (document.token !== 'deny') {
        window.FirebasePlugin.onTokenRefresh(function(fcmToken) {
          const documentFragment = {
            'token': fcmToken
          };
            window.FirebasePlugin.updateDocumentInFirestoreCollection(auth.user.uid, documentFragment, "users");
        }, function(error) {
          console.error(error);
        });
      }
    }, function(error){
        console.error("Error fetching document: "+error);
    });
  }

  return (
    <div className="App">
      <HashRouter>
        <Route path="/" exact component={HomePage} />
        <Route path="/search" component={SearchPage} />
        <Route path="/login" component={LoginPage} />
        <Route path="/register" component={RegisterPage} />
        <Route path="/guide" component={GuidePage} />
        <Route path="/create" component={CreatePage} />
        <Route path="/edit/:id" component={EditPage} />
        <Route path="/detail/:id" component={DetailPage} />
        <Route path="/mypage" component={MyPage} />
        <Route path="/mypage_list" component={MyListPage} />
        <Route path="/account_edit" component={AccountPage} />
        <Route path="/alarm" component={AlarmPage} />
        <Route path="/chat_list" component={ChatListPage} />
        <Route path="/chat" component={ChatPage} />
        <Route path="/change_password" component={PasswordChangePage} />
        <Route path="/user_delete" component={DeleteUserPage} />
        <Route path="/reset" component={PasswordResetPage} />
        <Route path="/reset_guide" component={ResetGuidePage} />
        <Route path="/service_agreement" component={ServiceAgreementPage} />
        <Route path="/privacy" component={PrivacyPage} />
        <Route path="/restaurant" component={RestaurantPage} />
        <Route path="/noti/:id" component={NotiPage} />
        <Route path="/noti_list" component={NotiListPage} />
      </HashRouter>
    </div>
  );
}

export default App;

import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { Provider } from 'react-redux';
import store from './store';
import './index.css';

const startApp = () => {

  // 화면 세로 고정
  window.screen.orientation.lock('portrait');
  // 상태바 표시
  window.StatusBar.overlaysWebView(true);
  window.StatusBar.backgroundColorByName("white");
  window.StatusBar.styleDefault();
  window.StatusBar.show();

  // 푸쉬 알림 허가
  window.FirebasePlugin.grantPermission();

  // 구글 애널리틱스
  window.FirebasePlugin.isAnalyticsCollectionEnabled(function(enabled){
    if (!enabled) {
      window.FirebasePlugin.setAnalyticsCollectionEnabled(true);
    }
  }, function(error){
      console.error("Error getting Analytics data collection setting: "+error);
  });

  window.store = store;
  
  ReactDOM.render(
    <Provider store={store}>
      <React.StrictMode>
        <App />
      </React.StrictMode>
    </Provider>,
    document.getElementById('root')
  );
}

if (window.cordova) {
  document.addEventListener('deviceready', startApp, false);
} else {
  startApp();
}

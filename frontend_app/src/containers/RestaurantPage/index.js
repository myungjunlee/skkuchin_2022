import React, { useEffect, useState } from 'react';
import './style.css';
// import emptyHeart from '../../image/drawable-xxxhdpi/emptyHeart.png';
// import redHeart from '../../image/drawable-xxxhdpi/redHeart.png';
import arrow from '../../image/drawable-xxxhdpi/arrow.png';
import tabar_01 from '../../image/drawable-xxxhdpi/tabar_01.png';
import tabar_02_active from '../../image/drawable-xxxhdpi/tabar_02_active.png';
import tabar_03 from '../../image/drawable-xxxhdpi/tabar_03.png';
import tabar_04 from '../../image/drawable-xxxhdpi/tabar_04.png';
// import restaurantData from "./suwonList.json";
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

const RestaurantPage = () => {
  const auth = useSelector(state => state.auth);
  const [restaurantList, setRestaurantList] = useState([]);
  const [option, setOption] = useState('m');

  useEffect(() => {
    document.documentElement.scrollTop = 0;

    // if (restaurantData.suwonList.length > 0) {
    //   restaurantData.suwonList.map((restaurant) => {
    //     const document = {
    //       "id": restaurant.id,
    //       "name": restaurant.name,
    //       "explanation": restaurant.explanation,
    //       "address": restaurant.address,
    //       "heartCnt": 0,
    //       "img": `https://skkuchin-s3-storage.s3.ap-northeast-2.amazonaws.com/static/restaurants/${restaurant.img}`,
    //       "location": restaurant.location,
    //       "category": restaurant.category,
    //       "clickers": [],
    //       "option": 'y'
    //     }
    //     window.FirebasePlugin.setDocumentInFirestoreCollection(restaurant.id, document, "restaurants");
    //   })
    // }
  }, [])

  useEffect(() => {
    getLists(option);
  }, [option])

  const getLists = (option) => {

    const collection = "restaurants";
    const filters = [];
    const lists = [];

    window.FirebasePlugin.fetchFirestoreCollection(collection, filters, function(documents){
        for (const documentId in documents) {
          if (documents[documentId].option === option) {
            lists.push(documents[documentId]);
          }
        }
        setRestaurantList(lists);
    }, function(error){
        console.log(error);
    });

  }

  // const changeHeart = (id,e) => {
  //   e.preventDefault();

  //   db.doc(id)
  //   .get()
  //   .then((doc) => {
  //     const arr = doc.data().clickers;
  //     const cnt = doc.data().heartCnt;
  //     console.log(e.id)
  //     if (e.id === 'restaurant-empty') {

  //       arr.push(auth.user.uid);
  
  //       db.doc(id).update({
  //         clickers: arr,
  //         heartCnt: cnt+1
  //       });
  //     } else {

  //       const filtered = arr.filter((f) => f !== auth.user.uid);
  
  //       db.doc(id).update({
  //         clickers: filtered,
  //         heartCnt: cnt-1
  //       });
  //     }
  //     getLists();
  //   })
  // }
  
  return (
    <div className="restaurantList-wrapper">
      {/* 헤더 */}
      <div className="restaurantList_header">
        <div className="restaurantList_header2">
            <div className="restaurantList_hleft">맛집 게시판</div>
            <select 
              className="restaurant-filter" 
              name='option'
              value={option}
              onChange={e => setOption(e.target.value)}
              
            >
              <option value="m">명륜 맛집</option>
              <option value="y">율전 맛집</option>
            </select>
            <img src={arrow} style={{width: '15px'}}/>
        </div>
      </div>
      {restaurantList.length > 0 ?
        restaurantList.map((restaurant) => (
        <div className="restaurant-wrapper">
          {/* 식당 사진 */}
          <div className="restaurant-img-box">
            <img className="restaurant-img" src={restaurant.img}/>
          </div>

          {/* 식당 이름, 설명, 주소, 하트 */}
          <div className="restaurant-box">
            <div id={restaurant.id} className="restaurant-box-top">
              <h4>{restaurant.name}</h4>
              {/* {
                restaurant.clickers.includes(auth.user.uid) ?
                <img 
                  className="restaurant-heart" 
                  id="restaurant-red"
                  src={redHeart} 
                  onClick={e => changeHeart(restaurant.id, e)}
                />
                :
                <img 
                  className="restaurant-heart" 
                  id="restaurant-empty"
                  src={emptyHeart} 
                  onClick={e => changeHeart(restaurant.id, e)}
                />
              } */}
            </div>
            <div className="restaurant-explanation">{restaurant.explanation}</div>
            <div className="restaurant-address">{restaurant.address}</div>
            {/* <div className="restaurant-box-bottom">
              <img className="restaurant-redHeart" src={redHeart} />
              <div className="restaurant-heartCnt">{restaurant.heartCnt}</div>
            </div> */}
          </div>
        </div>
      ))
      :
      null
      }
      {/* 하단 네브바 bottom_navbar */}
      <nav className="bottom_navbar">
        <ul>
            <li><Link to="/"><img src={tabar_01} style={{height: '40px', width: 'auto'}} /></Link></li>
            <li><Link to="/restaurant"><img src={tabar_02_active} style={{height: '40px', width: 'auto'}} /></Link></li>
            <li><Link to="/chat_list"><img src={tabar_03} style={{height: '40px', width: 'auto'}} /></Link></li>
            <li><Link to="/mypage"><img src={tabar_04} style={{height: '40px', width: 'auto'}} /></Link></li>
        </ul>
      </nav>
    </div>
  );
}

export default RestaurantPage;
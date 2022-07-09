import React, { useEffect, useState } from 'react';
import { firestore } from 'firebase';
import './style.css';
// import emptyHeart from '../../image/drawable-xxxhdpi/emptyHeart.png';
// import redHeart from '../../image/drawable-xxxhdpi/redHeart.png';
import arrow from '../../image/drawable-xxxhdpi/arrow.png';
import Layout from '../../components/Layout';
// import restaurantData from "./restaurant.json";
import { useSelector } from 'react-redux';

const RestaurantPage = () => {
  const auth = useSelector(state => state.auth);
  const [restaurantList, setRestaurantList] = useState([]);
  const [option, setOption] = useState('m');

  const db = firestore().collection("restaurants");

  useEffect(() => {
    document.documentElement.scrollTop = 0;

    // if (restaurantData.restaurantList.length > 0) {
    //   restaurantData.restaurantList.map((restaurant) => {
    //     db.doc(restaurant.id).set({
    //       id: restaurant.id,
    //       name: restaurant.name,
    //       explanation: restaurant.explanation,
    //       address: restaurant.address,
    //       heartCnt: 0,
    //       img: `https://skkuchin-s3-storage.s3.ap-northeast-2.amazonaws.com/static/restaurants/${restaurant.img}`,
    //       location: restaurant.location,
    //       category: restaurant.category,
    //       clickers: [],
    //       option: 'm'
    //     })
    //   })
    // }
  }, [])

  useEffect(() => {
    getLists(option);
  }, [option])

  const getLists = (option) => {
    db
    .get()
    .then((querySnapshot) => {
      const lists = [];
      querySnapshot.forEach((doc) => {
        if (doc.data().option === option) {
          lists.push(doc.data());
        }
      })
      setRestaurantList(lists);

    }).catch((err) => {
        console.log(err);
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
    <Layout>
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
      </div>
    </Layout>
  );
}

export default RestaurantPage;
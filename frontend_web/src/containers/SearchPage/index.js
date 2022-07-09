import React, { useEffect, useState, useRef } from 'react';
import './style.css';
import Layout from '../../components/Layout';
import { useDispatch, useSelector } from 'react-redux';
import { read, logoutPost } from '../../actions';
import { Link, useHistory } from 'react-router-dom';
import icon_back_arrow from '../../image/drawable-xxxhdpi/icon_back_arrow.png';
import search_enheng from '../../image/drawable-xxxhdpi/search_enheng.png';
import noinfo_enheng from '../../image/drawable-xxxhdpi/noinfo_enheng.png';
import icon_search from '../../image/drawable-xxxhdpi/icon_search.png';
import profile01 from '../../image/drawable-xxxhdpi/profile01.png';
import icon_time02 from '../../image/drawable-xxxhdpi/icon_time02.png';
import icon_place01 from '../../image/drawable-xxxhdpi/icon_place01.png';
import tag_sazo from '../../image/drawable-xxxhdpi/tag_sazo.png';
import tag_sazul from '../../image/drawable-xxxhdpi/tag_sazul.png';
import tag_together from '../../image/drawable-xxxhdpi/tag_together.png';

const SearchPage = () => {

    const history = useHistory();
    const dispatch = useDispatch();
    const post = useSelector(state => state.post.data);

    const [searchItem, setSearchItem] = useState("");
    const [filterList, setFilterList] = useState([]);
    const [isChecked, setIsChecked] = useState(false);
    //const [optionAllList, setOptionAllList] = useState([]);
    const [previousList, setPreviousList] = useState([]);
    const [searchStart, setSearchStart] = useState(false);

    const searchElement = useRef(null);
    // const filterBox = useRef(null);

    useEffect(() => {
        document.documentElement.scrollTop = 0;
        // 이전 데이터 기억
        if (sessionStorage.getItem('searchItem')) {
            setFilterList(JSON.parse(sessionStorage.getItem('searchItem')));
            setSearchStart(true);
        }

        dispatch(read())
        .then(() => {
            // 이전 페이지 스크롤 위치 유지
            if (sessionStorage.getItem('searchItem')) {
                const page = sessionStorage.getItem('page');
                const scrollPosition = sessionStorage.getItem('scroll_position');
                if (page === 'searchpage' && document.documentElement.scrollTop !== scrollPosition) {
                    document.documentElement.scrollTop = scrollPosition;
                    sessionStorage.removeItem('page');
                    sessionStorage.removeItem('scroll_position');
                }
            }
        })
    }, [])

    // 검색창 자동 포커스
    useEffect(() => {
        if (searchElement.current && !sessionStorage.getItem('searchItem')) { // 할당한 DOM 요소가 불러지면 (마운트 되면)
            searchElement.current.focus(); // focus 할당!
        }
    }, [searchElement])

    // useEffect(() => {
    //     if (filterBox.current && sessionStorage.getItem('previousItem')) {
    //         filterBox.current.checked = true;
    //     }
    // }, [filterBox])

    // componentWillUnmount
    useEffect(() => {
        return () => {
            // cleanup
            dispatch(logoutPost());
        }
    }, [])

    const handleSearch = (e) => {
        setSearchItem(e.target.value);
    }

    // 검색엔진
    const handleSearchSubmit = (e) => {

        e.preventDefault();

        let totalList = post;
        let searchList = [];
        let restList = [];

        if (searchItem && searchList) {

            // title이 검색어를 포함하면 searchList에 추가.
            // 그렇지 않으면 restList에 추가.
            totalList.map((list) => {
                if (list.title.match(searchItem))
                    searchList.push(list);
                else
                    restList.push(list);
            });
            totalList = restList; //검색어를 포함하지 않았던 게시물 리스트를 totalList로 설정
            restList = [];

            // name이 검색어를 포함하면 searchList에 추가.
            totalList.map((list) => {
                if (list.name.match(searchItem))
                    searchList.push(list);
                else
                    restList.push(list);
            });
            totalList = restList;
            restList = [];

            // major가 검색어를 포함하면 searchList에 추가.
            totalList.map((list) => {
                if (list.major.match(searchItem))
                    searchList.push(list);
                else
                    restList.push(list);
            });
            totalList = restList;
            restList = [];

            // student_id가 검색어를 포함하면 searchList에 추가.
            totalList.map((list) => {
                if ((list.student_id.slice(2,4)+'학번').match(searchItem))
                    searchList.push(list);
                else
                    restList.push(list);
            });
            totalList = restList;
            restList = [];

            // mbti가 검색어를 포함하면 searchList에 추가.
            // 소문자로 mbti를 검색하면 검색 결과에서 제외되어서, 검색어를 대문자로 바꾸고 진행.
            let upperCaseMBTI = searchItem.toUpperCase();
            totalList.map((list) => {
                if (list.mbti.match(upperCaseMBTI))
                    searchList.push(list);
                else
                    restList.push(list);
            });
            totalList = restList;
            restList = [];

            // date가 검색어를 포함하면 searchList에 추가.
            totalList.map((list) => {
                if (list.date.match(searchItem))
                    searchList.push(list);
                else
                    restList.push(list);
            });
            totalList = restList;
            restList = [];

            // place가 검색어를 포함하면 searchList에 추가.
            totalList.map((list) => {
                if (list.place.match(searchItem))
                    searchList.push(list);
                else
                    restList.push(list);
            });
            totalList = restList;
            restList = [];
        }
        sessionStorage.setItem('searchItem', JSON.stringify(searchList));
        setFilterList(searchList);
        setPreviousList(filterList);
        setSearchStart(true);
        searchElement.current.blur();
    }

    const getDate = (date) => {
        const created_seconds = new Date(date)/1000;
        const now_seconds = new Date().getTime()/1000;
        const difference_time = now_seconds - created_seconds;
        let time;

        if (difference_time < 60) {
            time = `${Math.floor(difference_time)}초 전`;
        } else if (difference_time < 3600) {
            time = `${parseInt(difference_time/60)}분 전`;
        } else if (difference_time < 86400) {
            time = `${parseInt(difference_time/3600)}시간 전`
        } else if (difference_time < 2592000) {
            time = `${parseInt(difference_time/86400)}일 전`
        } else if (difference_time < 31104000) {
            time = `${parseInt(difference_time/2592000)}달 전`
        } else {
            time = `${parseInt(difference_time/31104000)}년 전`
        }

        return time;
    }

    const filterFinish = (e) => {
        //e.preventDefault();
        // checkbox 체크 해제하면
        if (isChecked) {
            setIsChecked(false);
            setFilterList(previousList);
            // sessionStorage.setItem('searchItem', JSON.stringify(previousList));
            // sessionStorage.removeItem('previousItem');
        }
        // checkbox 체크하면
        else {
            setIsChecked(true);
            let optionTrueList = filterList;
            setPreviousList(filterList); //option = true, option = false 모두 저장
            if (optionTrueList) { //option = true만 빼서 저장
                optionTrueList = optionTrueList.filter((list) => list.option);
            } 
            setFilterList(optionTrueList);
            // sessionStorage.setItem('searchItem', JSON.stringify(optionTrueList));
            // sessionStorage.setItem('previousItem', JSON.stringify(filterList));
        }
    }
    
    const goBack = () => {
        history.goBack();
    };

    // 이전 페이지 스크롤 위치 기억하기
    const postClick = () => {
        const scrollHeightPosition = document.documentElement.scrollTop
        sessionStorage.setItem('page', 'searchpage');
        sessionStorage.setItem('scroll_position', scrollHeightPosition);
    }
        
    let renderList = filterList.map((list) => {
        return (
                <Link
                    to={{
                        pathname: `/detail/${list.id}`
                    }}
                    onClick={postClick}
                    >
                    <ul key={list.id}>
                        {/* item 밥약 개별 게시글 */}
                        <div className="home_item">
                            {/* item 밥약 개별 게시글 상단 부분 (회색 직선 기준으로 윗부분) */}
                            <div id="home_top_part">
                                {
                                    list.image ?
                                    <div className='home_frame' style={{backgroundImage: `url(${list.image})`}} ></div>
                                    :
                                    <div className='home_frame' style={{backgroundImage: `url(${profile01})`}} ></div>
                                }
                                <div>
                                    <div id="home_info">
                                        <div id="hname">{list.name}</div>
                                        {
                                            list.category === '밥사주세요' ?
                                            <img id="hcategory" src={tag_sazo} />
                                            :
                                            list.category === '밥사줄게요' ?
                                            <img id="hcategory" src={tag_sazul} />
                                            :
                                            list.category === '같이먹어요' ?
                                            <img id="hcategory" src={tag_together} />
                                            :
                                            null
                                        }
                                    </div>
                                    <div id="hmajor">{list.major}</div> 
                                </div>
                                <div id="htime">{getDate(list.create_date)}</div>
                            </div>
                            {/* item 밥약 개별 게시글 하단 부분 (회색 직선 기준으로 아랫부분) home_bottom_part */}
                            <div className="home_bottom_part">
                                <span>{list.title}</span>
                                <div className="home_promise_info">
                                    {
                                        !list.option ?
                                        <div className='hclose'>마감</div>
                                        :
                                        null
                                    }
                                    <div className='home_promise_info2'><img src={icon_time02} style={{width: "10px", height: "10px", verticalAlign: "middle", paddingRight: "4px"}} />일시</div>
                                    <div className='home_promise_info2' id="hdate">{list.date}</div>
                                    <div className='home_promise_info2'><img src={icon_place01} style={{width: "8px", height: "11.5px", verticalAlign: "middle", paddingRight: "4px"}} />장소</div>
                                    <div className='home_promise_info2' id="hplace">{list.place}</div>
                                </div>
                            </div>
                        </div>
                    </ul>
                </Link>
            );
        });
    
    return (
        <Layout>
            {/* 게시물 관리 페이지 전체 틀 (기본 margin) */}
            <div className="search">
                {/* header 헤더 : 뒤로가기 아이콘, 검색창 */}
                <div className="search_header">
                    <div className="search_header2">
                        <img src={icon_back_arrow} style={{marginTop: "21.5px", width: "15px", height: "14px", paddingRight: "15px", cursor: "pointer"}} onClick={goBack} />
                        <div className="search_bar">
                            <form onSubmit={e => handleSearchSubmit(e)}>
                                <input
                                    type="text" 
                                    placeholder="글 제목, 학과, 학번"
                                    value={searchItem}
                                    spellCheck={false}
                                    onChange= {e => handleSearch(e)}
                                    ref={searchElement}
                                />
                                <button class="search_btn" type="submit"><img src={icon_search} style={{verticalAlign: "middle", width: "18.96px", height: "18.97px", marginRight: "20px"}} /></button>
                            </form>
                        </div>
                    </div>
                </div>
                {searchStart ? 
                    <div>
                    {
                        renderList.length > 0 ?
                        <div className="home_content">
                            {/* <div className='search_filter'>
                                <div className='search_filter2'>
                                    <input 
                                        type="checkbox"
                                        checked={isChecked}
                                        onChange = {e => filterFinish(e)}
                                        ref={filterBox}
                                    />
                                    <h3>마감된 약속 안보기</h3>
                                </div>
                            </div> */}
                            {renderList}
                        </div>
                        :
                        <div className="search_content">
                            {/* content 본문 : 검색 꾸실 아이콘, 검색 유도 문구 */}
                            <img src={noinfo_enheng} style={{width: "45%", height: "auto", padding: "35% 27.5% 18px"}} />
                            <div className="search_icon_txt">검색 결과가 없습니다</div>
                        </div>
                    }
                    </div>
                    :
                    <div className="search_content">
                        {/* content 본문 : 검색 꾸실 아이콘, 검색 유도 문구 */}
                        <img src={search_enheng} style={{width: "45%", height: "auto", padding: "35% 27.5% 18px"}} />
                        <div className="search_icon_txt">게시판의 글을 검색해보세요</div>
                    </div>
                }
            </div>
        </Layout>
    );
}

export default SearchPage;
import Pagination from './pagination.js';

import {
  $searchBtn,
  $search,
  $form,
  $input,
  $logo,
  $dropDown,
  $main,
  $sortContent,
  $categoryContent,
} from './utils/doms.js';

import getMovies from './utils/api.js';
import { showMoviesByObj } from './utils/template.js';
import { routerDispatcher, initRouter } from './utils/router.js';

let mix = null;
const API_KEY = '71c72e51587ffa55d1c377e3ed0e5b0c';

let state = {
  dbType: 'trend',
  searchTerm: null,
};

const setState = nextState => {
  state = nextState;
};

const db = {
  trend: [],
  topRated: [],
  upComing: [],
  nowPlaying: [],
};

const page = new Pagination({
  onPage,
});

async function getDataByCurrentDbType({ page }) {
  let movieData;
  switch (state.dbType) {
    case 'trend':
      movieData = await getMovies(
        `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&language=en-US&sort_by=popularity.desc&include_adult=true&include_video=false&page=${page}&with_watch_monetization_types=flatrate`
      );
      break;
    case 'topRated':
      movieData = await getMovies(
        `https://api.themoviedb.org/3/movie/top_rated?api_key=${API_KEY}&language=en-US&page=${page}`
      );

      break;
    case 'upComing':
      movieData = await getMovies(
        `https://api.themoviedb.org/3/movie/upcoming?api_key=${API_KEY}&language=en-US&page=${page}`
      );
      break;

    case 'nowPlaying':
      movieData = await getMovies(
        `https://api.themoviedb.org/3/movie/now_playing?api_key=${API_KEY}&language=en-US&page=${page}`
      );
      break;
    case 'searching':
      movieData = await getMovies(
        `https://api.themoviedb.org/3/search/movie?page=${page}&api_key=${API_KEY}&query="${state.searchTerm}`
      );
      break;

    default:
      break;
  }
  return movieData;
}

function setPagenation(totalPage) {
  if (totalPage > 20) {
    page.setState({ current: 1, total: 20 });
  } else {
    page.setState({ current: 1, total: totalPage });
  }
}

async function init({ dbType, searchTerm }) {
  if (dbType === 'searching') {
    if (!db[searchTerm]) {
      db[searchTerm] = [];
    }
    setState({ dbType, searchTerm });
    showMoviesByDb(state.searchTerm, 1);
  } else {
    setState({ ...state, dbType });
    showMoviesByDb(state.dbType, 1);
  }

  const movieData = await getDataByCurrentDbType({ page: 1 });
  const { total_pages } = movieData;

  setPagenation(total_pages);
}

function resetSortDropDownContent() {
  $sortContent.innerText = 'Sort by';
}

function resetCategoryDropDownContent() {
  $categoryContent.innerText = 'Category';
}

$form.addEventListener('submit', async function (e) {
  e.preventDefault();
  resetCategoryDropDownContent();
  const searchTerm = $input.value.trim();
  if (searchTerm.length > 0) {
    init({ dbType: 'searching', searchTerm });
    routerDispatcher({ dbType: 'searching', searchTerm, currentPage: 1 });
    if (mix) {
      mix.destroy();
    }
  }
  $input.value = '';
});

$logo.addEventListener('click', () => {
  init({ dbType: 'trend' });
  routerDispatcher({ dbType: 'trend', currentPage: 1 });
});

$searchBtn.addEventListener('click', e => {
  $search.classList.add('active');
});

$dropDown.addEventListener('click', async e => {
  const { nodeName, textContent, parentNode } = e.target;

  if (nodeName === 'LI') {
    mix = mixitup($main, {
      animation: {
        effects: 'fade rotateZ(-180deg)',
        duration: 700,
      },
      classNames: {
        // 버튼을 클릭했을때 버튼에 추가되는 클래스 이름
        // 필터버튼에는 'programs-filter-btn-active'
        // 정렬버튼에는 'programs-sort-btn-active' 요런식으로 클래스가 add됨
        // 만약, block property가 없으면 'mixitup' 이 default로 programs자리에 들어감
        block: 'programs',
        elementFilter: 'filter-btn',
        elementSort: 'sort-btn',
      },
      selectors: {
        target: '.mix-target',
      },
    });

    const $chosen = e.target.closest('.dropdown').querySelector('.chosen');

    if (parentNode.classList.contains('category')) {
      $chosen.innerText = textContent;
    } else {
      $chosen.innerText = 'By ' + textContent.trim();
    }

    switch (textContent.trim('')) {
      case 'Top rated':
        init({ dbType: 'topRated' });
        routerDispatcher({ dbType: 'topRated', currentPage: 1 });
        break;
      case 'Upcoming':
        init({ dbType: 'upComing' });
        routerDispatcher({ dbType: 'upComing', currentPage: 1 });
        break;
      case 'Now playing':
        init({ dbType: 'nowPlaying' });
        routerDispatcher({ dbType: 'nowPlaying', currentPage: 1 });
        break;
      case 'Vote':
        sortBy('vote');
        mix.sort('vote:desc');
        break;
      case 'Release date':
        sortBy('date');
        mix.sort('date:desc');
        break;
      default:
    }
    mix.destroy();
  }
});

function sortBy(type) {
  const { dbType, searchTerm } = state;
  if (dbType === 'searching') {
    if (type === 'vote') {
      db[searchTerm][page.state.current].sort(
        (a, b) => b.vote_average - a.vote_average
      );
    } else {
      db[searchTerm][page.state.current].sort(
        (a, b) => new Date(b.release_date) - new Date(a.release_date)
      );
    }
  } else {
    if (type === 'vote') {
      db[dbType][page.state.current].sort(
        (a, b) => b.vote_average - a.vote_average
      );
    } else {
      db[dbType][page.state.current].sort(
        (a, b) => new Date(b.release_date) - new Date(a.release_date)
      );
    }
  }
}

async function onPage(page) {
  if (mix) {
    mix.destroy();
  }

  const { dbType, searchTerm } = state;
  if (dbType === 'searching') {
    if (!db[searchTerm]) {
      db[searchTerm] = [];
    }
    showMoviesByDb(searchTerm, page);
    routerDispatcher({ dbType, searchTerm, currentPage: page });
  } else {
    showMoviesByDb(dbType, page);
    routerDispatcher({ dbType, currentPage: page });
  }
}

async function showMoviesByDb(dbKey, page) {
  resetSortDropDownContent();
  let movieData;
  if (db[dbKey][page]) {
    showMoviesByObj(db[dbKey][page]);
  } else {
    movieData = await getDataByCurrentDbType({ page });
    const { results } = movieData;
    showMoviesByObj(results);
    db[dbKey][page] = results;
  }
}

function onRoute({ dbKey, currentPage }) {
  if (db[dbKey].length) {
    // dbKey is not defined?? why??
    //
    const pageObj = db[dbKey][currentPage];
    console.log(pageObj);
    console.log(db);
    if (pageObj) {
      // showMoviesByObj(pageObj);
      // page.setState({ total: db[dbKey]., current: currentPage });
    }
    // console.log(dbKey, page);
  }
}

init({ dbType: 'trend' });

initRouter(onRoute);

/*
4.history to go back and forth
  - 로토님의 history, route 코드를 복습해서 구현해봐라.
bonus:component(if you want)



style
https://medium.muz.li/movie-cinema-ui-inspiration-9b76d4e6c05

Movie Application UI by Ricardo Salazar 처럼 디자인하기
release date는 genre밑에 위치하도록

드랍다운 아래참고.
https://codepen.io/codypearce/pen/PdBXpj?editors=0100
*/

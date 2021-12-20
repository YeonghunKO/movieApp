const API_KEY = '71c72e51587ffa55d1c377e3ed0e5b0c';
import Pagination from './pagination.js';

import {
  $searchBtn,
  $search,
  $form,
  $input,
  $logo,
  $dropDown,
} from './utils/doms.js';

import getMovies from './utils/api.js';
import showMovies from './utils/template.js';

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
    setState({ dbType, searchTerm });
  } else {
    setState({ ...state, dbType });
  }

  const movieData = await getDataByCurrentDbType({ page: 1 });
  const { results, total_pages } = movieData;
  showMovies(results);
  setPagenation(total_pages);
}

$form.addEventListener('submit', function (e) {
  e.preventDefault();
  const searchTerm = $input.value.trim();
  //   console.log(this.value);
  if (searchTerm.length > 0) {
    init({ dbType: 'searching', searchTerm });
  }
  $input.value = '';
});

$logo.addEventListener('click', () => {
  init({ dbType: 'trend' });
});

$searchBtn.addEventListener('click', e => {
  $search.classList.add('active');
});

$dropDown.addEventListener('click', e => {
  const { nodeName, classList, textContent, parentNode } = e.target;
  if (nodeName === 'LI') {
    classList.add('clicked');
    const $chosen = e.target.closest('.dropdown').querySelector('.chosen');
    if (parentNode.classList.contains('category')) {
      $chosen.innerText = textContent;
    } else {
      $chosen.innerText = 'By ' + textContent;
    }

    switch (textContent) {
      case 'Top rated':
        init({ dbType: 'topRated' });
        break;
      case 'Upcoming':
        init({ dbType: 'upComing' });
        break;
      case 'Now playing':
        init({ dbType: 'nowPlaying' });
        break;
      case 'Vote':
        break;
      case 'Release date':
        break;
      default:
        console.log('invalid textContent');
    }
    // console.log($chosen);
    //   if()
  }
});

async function onPage(page) {
  console.log('dbType:', state.dbType);
  if (state.dbType === 'searching') {
    if (!db[state.searchTerm]) {
      db[state.searchTerm] = [];
    }
    showMoviesByDb(state.searchTerm, page);
  } else {
    showMoviesByDb(state.dbType, page);
  }
}

async function showMoviesByDb(dbKey, page) {
  console.log('dbKey:', dbKey);
  console.log('page:', page);
  let movieData;
  if (db[dbKey][page]) {
    console.log('searching in db...');
    showMovies(db[dbKey][page]);
  } else {
    console.log('get new data');
    movieData = await getDataByCurrentDbType({ page });
    const { results } = movieData;
    showMovies(results);
    db[dbKey][page] = results;
  }
  console.log(db);
}

init({ dbType: 'trend' });

/*
4.history to go back and forth
7.top rated / upcoming / now playing 버튼을 페이지 상단에 만들기.(유튭 처럼)
6.sort by vote / release date

bonus:component(if you want)



style
https://medium.muz.li/movie-cinema-ui-inspiration-9b76d4e6c05

Movie Application UI by Ricardo Salazar 처럼 디자인하기
release date는 genre밑에 위치하도록

드랍다운 아래참고.
https://codepen.io/codypearce/pen/PdBXpj?editors=0100
*/

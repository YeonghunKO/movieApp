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
import showMoviesByObj from './utils/template.js';

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

$form.addEventListener('submit', function (e) {
  e.preventDefault();
  const searchTerm = $input.value.trim();
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
        sortBy('vote');
        break;
      case 'Release date':
        sortBy('date');
        break;
      default:
        console.log('invalid textContent');
    }
  }
});

function sortBy(type) {
  let sortedPageData;
  if (type === 'vote') {
    console.log(type);
    sortedPageData = db[state.searchTerm][page.state.current].sort(
      (a, b) => b.vote_average - a.vote_average
    );
  } else {
    sortedPageData = db[state.searchTerm][page.state.current].sort(
      (a, b) => new Date(b.release_date) - new Date(a.release_date)
    );
  }
  showMoviesByObj(sortedPageData);
}

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
    showMoviesByObj(db[dbKey][page]);
  } else {
    console.log('get new data');
    movieData = await getDataByCurrentDbType({ page });
    const { results } = movieData;
    showMoviesByObj(results);
    db[dbKey][page] = results;
  }
  console.log(db);
}

init({ dbType: 'trend' });

/*
4.history to go back and forth

bonus:component(if you want)



style
https://medium.muz.li/movie-cinema-ui-inspiration-9b76d4e6c05

Movie Application UI by Ricardo Salazar 처럼 디자인하기
release date는 genre밑에 위치하도록

드랍다운 아래참고.
https://codepen.io/codypearce/pen/PdBXpj?editors=0100
*/

const TREND_API_URL =
  'https://api.themoviedb.org/3/discover/movie?api_key=71c72e51587ffa55d1c377e3ed0e5b0c&language=en-US&sort_by=popularity.desc&include_adult=true&include_video=false&page=1&with_watch_monetization_types=flatrate';

const SEARCH_URL =
  'https://api.themoviedb.org/3/search/movie?page=1&api_key=71c72e51587ffa55d1c377e3ed0e5b0c&query="';

import Pagination from './pagination.js';

import { $searchBtn, $search, $form, $input, $logo } from './utils/doms.js';

import getMovies from './utils/api.js';
import showMovies from './utils/template.js';

let dbType = 'trend';

let searchTerm = null;

const db = {
  trend: [],
  topRated: [],
  upComing: [],
  nowPlaying: [],
};

const page = new Pagination({
  onPage,
});

async function searchMovies(term) {
  // showSkeleton();
  const movies = await getMovies(SEARCH_URL + term);
  const { results, total_pages } = movies;
  showMovies(results);
  setPagenation(total_pages);
  dbType = 'searching';
  searchTerm = term;
}

$form.addEventListener('submit', function (e) {
  e.preventDefault();
  const searchTerm = $input.value.trim();
  //   console.log(this.value);
  if (searchTerm.length > 0) {
    searchMovies(searchTerm);
  }
  $input.value = '';
});

$logo.addEventListener('click', () => {
  init();
});

$searchBtn.addEventListener('click', e => {
  $search.classList.add('active');
});

async function init() {
  const movieData = await getMovies(TREND_API_URL);
  const { results, total_pages } = movieData;
  showMovies(results);
  setPagenation(total_pages);
  dbType = 'trend';
}

function setPagenation(totalPage) {
  if (totalPage > 20) {
    page.setState({ current: 1, total: 20 });
  } else {
    page.setState({ current: 1, total: totalPage });
  }
}

async function onPage(page) {
  console.log('dbType:', dbType);
  switch (dbType) {
    case 'trend':
      showMoviesByDb(dbType, page);
      break;
    case 'topRated':
      break;
    case 'upComing':
      break;
    case 'nowPlaying':
      break;
    case 'searching':
      if (!db[searchTerm]) {
        db[searchTerm] = [];
      }
      showMoviesByDb(searchTerm, page);
      break;

    default:
      console.log('invalid currentStatus');
      break;
  }
  console.log(db);
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
    switch (dbType) {
      case 'trend':
        movieData = await getMovies(
          `https://api.themoviedb.org/3/discover/movie?api_key=71c72e51587ffa55d1c377e3ed0e5b0c&language=en-US&sort_by=popularity.desc&include_adult=true&include_video=false&page=${page}&with_watch_monetization_types=flatrate`
        );
        break;
      case 'topRated':
        break;

      case 'upComing':
        break;

      case 'nowPlaying':
        break;
      case 'searching':
        movieData = await getMovies(
          `https://api.themoviedb.org/3/search/movie?page=${page}&api_key=71c72e51587ffa55d1c377e3ed0e5b0c&query="${searchTerm}`
        );
        break;

      default:
        break;
    }
    const { results } = movieData;
    showMovies(results);
    db[dbKey][page] = results;
  }
}

init();

/*

db = {
  'love':[
    {page1},
    {page2}
  ],
  'hard':[
    {page1},
    {page2}
  ],
  'popular':[
    {page1},
    {page2}
  ]
}

*/

/*


4.history to go back and forth
7.top rated / upcoming / now playing 버튼을 페이지 상단에 만들기.(유튭 처럼)
6.sort by vote / release date

bonus:component(if you want)



style
https://medium.muz.li/movie-cinema-ui-inspiration-9b76d4e6c05

Movie Application UI by Ricardo Salazar 처럼 디자인하기
release date는 genre밑에 위치하도록
*/

const API_URL =
  'https://api.themoviedb.org/3/discover/movie?api_key=71c72e51587ffa55d1c377e3ed0e5b0c&language=en-US&sort_by=popularity.desc&include_adult=true&include_video=false&page=1&with_watch_monetization_types=flatrate';

const SEARCH_URL =
  'https://api.themoviedb.org/3/search/movie?page=2&api_key=71c72e51587ffa55d1c377e3ed0e5b0c&query="';

import Pagination from './pagination.js';

import { $searchBtn, $search, $form, $input, $logo } from './utils/doms.js';

import getMovies from './utils/api.js';
import showMovies from './utils/template.js';

const db = {
  trend: [],
  topRated: [],
  upComing: [],
  nowPlaying: [],
};

let pageState = {
  total: null,
  current: 1,
};

const setState = nextState => {
  pageState = nextState;
};

async function searchMovies(term) {
  // showSkeleton();
  const movies = await getMovies(SEARCH_URL + term);
  showMovies(movies);
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

const page = new Pagination({
  onPrev: () => {
    setState({ ...pageState, current: --pageState.current });
    console.log(pageState);
  },
  onNext: () => {
    setState({ ...pageState, current: ++pageState.current });
    console.log(pageState);
  },
  onEllipsis: e => {
    const { classList } = e.target.parentElement;
    if (classList.value.includes('forward')) {
      setState({ ...pageState, current: pageState.current + 2 });
    } else {
      setState({ ...pageState, current: pageState.current - 2 });
    }
    console.log(pageState);
  },
  onNumber: pageNumber => {
    setState({ ...pageState, current: pageNumber });
    console.log(pageState);
  },
});

async function init() {
  const movieData = await getMovies(API_URL);
  showMovies(movieData);

  const totalPage = movieData.total_pages;

  if (totalPage > 20) {
    setState({ ...pageState, total: 20 });
  } else {
    setState({ ...pageState, total: totalPage });
  }
  page.render(pageState.total, pageState.current);
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
1.pagination


4.history to go back and forth
7.top rated / upcoming / now playing 버튼을 페이지 상단에 만들기.(유튭 처럼)
6.sort by vote / release date
8.search term이 db에 있으면 꺼내 쓰기. 일일이 불러오지 말고

bonus:component(if you want)



style
https://medium.muz.li/movie-cinema-ui-inspiration-9b76d4e6c05

Movie Application UI by Ricardo Salazar 처럼 디자인하기
release date는 genre밑에 위치하도록
*/

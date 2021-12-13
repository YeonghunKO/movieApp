const API_URL =
  'https://api.themoviedb.org/3/discover/movie?api_key=71c72e51587ffa55d1c377e3ed0e5b0c&language=en-US&sort_by=popularity.desc&include_adult=true&include_video=false&page=1&with_watch_monetization_types=flatrate';

const IMG_PATH = 'https://image.tmdb.org/t/p/w1280';

const SEARCH_URL =
  'https://api.themoviedb.org/3/search/movie?page=2&api_key=71c72e51587ffa55d1c377e3ed0e5b0c&query="';

import Pagination from './pagination.js';
import { $btn, $search, $form, $input, $main, $logo } from './utils/doms.js';

const db = {};

const pageState = {
  total: null,
  current: null,
  isFirst: true,
  isLast: false,
};

const genreCodes = [
  { id: 28, name: 'Action' },
  { id: 12, name: 'Adventure' },
  { id: 16, name: 'Animation' },
  { id: 35, name: 'Comedy' },
  { id: 80, name: 'Crime' },
  { id: 99, name: 'Documentary' },
  { id: 18, name: 'Drama' },
  { id: 10751, name: 'Family' },
  { id: 14, name: 'Fantasy' },
  { id: 36, name: 'History' },
  { id: 27, name: 'Horror' },
  { id: 10402, name: 'Music' },
  { id: 9648, name: 'Mystery' },
  { id: 10749, name: 'Romance' },
  { id: 878, name: 'Science Fiction' },
  { id: 10770, name: 'TV Movie' },
  { id: 53, name: 'Thriller' },
  { id: 10752, name: 'War' },
  { id: 37, name: 'Western' },
];

async function getMovies(url) {
  try {
    const res = await fetch(url);
    // console.log(res);
    if (res.ok) {
      const data = await res.json();
      console.log(data);
      return data;
    } else {
      console.log('invalid url');
      return [];
    }
  } catch (error) {
    console.log(error);
    return [];
  }
}

function makeSkeleton(num) {
  $main.innerHTML = '';
  let vDOM = document.createDocumentFragment();
  for (let i = 0; i < num; i++) {
    const divEle = document.createElement('div');
    divEle.classList.add('movie');
    divEle.innerHTML = `
      <div class="poster animated-bg"></div>
        <div class="movie-info">
          <div class="title">
            <span class="animated-bg animated-bg-text"></span>
          </div>
          <div class="genre">
            <span class="animated-bg animated-bg-text"></span>
          </div>
          <div class="date">
            <span class="animated-bg animated-bg-text"></span>
          </div>
          <div class="score animated-bg">&nbsp;</div>
      </div>
      <div class='overview'></div>
    `;
    vDOM.appendChild(divEle);
  }
  $main.append(vDOM);
}

async function searchMovies(term) {
  // showSkeleton();
  const movies = await getMovies(SEARCH_URL + term);
  showMovies(movies);
}

// adult: false
// backdrop_path: "/lNyLSOKMMeUPr1RsL4KcRuIXwHt.jpg"
// genre_ids: (3) [878, 28, 12]
// id: 580489
// original_language: "en"
// original_title: "Venom: Let There Be Carnage"
// overview: "After finding a host body in investigative reporter Eddie Brock, the alien symbiote must face a new enemy, Carnage, the alter ego of serial killer Cletus Kasady."
// popularity: 7615.279
// poster_path: "/rjkmN1dniUHVYAtwuV3Tji7FsDO.jpg"
// release_date: "2021-09-30"
// title: "Venom: Let There Be Carnage"
// video: false
// vote_average: 7.2
// vote_count: 4236

function showMovies(movies) {
  const moviesObj = movies.results;
  makeSkeleton(moviesObj.length);
  setTimeout(() => {
    const $movies = document.querySelectorAll('.movie');
    moviesObj.forEach((movie, idx) => {
      const {
        poster_path,
        title,
        overview,
        vote_average,
        genre_ids,
        release_date,
      } = movie;

      const $poster = $movies[idx].querySelector('.poster');
      const $title = $movies[idx].querySelector('.title');
      const $genre = $movies[idx].querySelector('.genre');
      const $date = $movies[idx].querySelector('.date');
      const $score = $movies[idx].querySelector('.score');
      const $overview = $movies[idx].querySelector('.overview');

      $poster.innerHTML = `
      <img src="${
        poster_path ? IMG_PATH + poster_path : './src/assets/img/no_poster.png'
      }" alt="${title}" />
      `;

      $title.innerHTML = title;
      $genre.innerHTML = decodeGenre(genre_ids);
      $date.innerHTML = release_date;
      $score.innerHTML = `${vote_average} / 10`;
      $overview.innerHTML = `
      <h3>Overview</h3>
      ${overview}
      `;

      $score.classList.add(`${getClassByVote(vote_average)}`);

      $poster.classList.remove('animated-bg');
      $score.classList.remove('animated-bg');
    });
  }, 1000);

  // const animatedBgs = document.querySelectorAll('.animated-bg');
  // animatedBgs.forEach(bg => bg.classList.remove('animated-bg'));
  // console.log(movie2);
}

function decodeGenre(genreArr) {
  return genreArr
    .map(genre => {
      let genreName;
      for (let i = 0; i <= genreCodes.length; i++) {
        const genreCode = genreCodes[i];
        if (genre === genreCode.id) {
          genreName = genreCode.name;
          break;
        }
      }
      return genreName;
    })
    .join(' / ');
}

function getClassByVote(vote) {
  if (vote >= 8) {
    return 'green';
  } else if (vote >= 5) {
    return 'yellow';
  } else {
    return 'red';
  }
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

$btn.addEventListener('click', e => {
  $search.classList.add('active');
});

async function init() {
  const movieData = await getMovies(API_URL);
  showMovies(movieData);
}

new Pagination({
  initialState: pageState,
  onButton: () => {},
});

// init();

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
